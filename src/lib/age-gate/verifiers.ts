/**
 * Pluggable VISITOR age verification (ONLYMEN_AGE_VERIFIER selects one).
 *
 * Kentucky (KRS 436.001–.009, HB 278, in force 15 Jul 2024) and ~26 other
 * states require a "covered platform" (> 1/3 adult material) to verify age with
 * a government ID or a commercially reasonable transactional-data method, and
 * forbid keeping the visitor's identifying information once access is granted
 * (KRS 436.004: $1,000 per 24 h retained, plus a $10,000-per-instance private
 * action under KRS 436.002 for failing to verify). A click-through checkbox does NOT meet that bar.
 *
 * Contract for every verifier:
 *   startVerification(req) → what to show/where to send the visitor
 *   handleCallback(req)    → pass / fail after the visitor (or the vendor's
 *                            webhook/redirect) comes back to /age/callback
 * On pass the middleware sets ONLY a signed token (token.ts). A verifier must
 * never persist the visitor's identity, DOB or documents (the vendor holds and
 * deletes them under its own terms; we keep a yes/no).
 *
 * Adding a vendor = one new object below (or its own module) + env config
 * (ONLYMEN_AGE_VERIFIER=<name> and the vendor's secrets via `wrangler secret
 * put`). The live verifier is `stripe` (Stripe Identity); `clickthrough` is dev only.
 */
import { createHmac } from "node:crypto";
import { platformEnv } from "../platform/runtime.ts";
import { renderAgeGateHtml, renderStripeGateHtml, renderVerifierUnavailableHtml } from "./html.ts";
import { AGE_CALLBACK_PATH, readCookie } from "./policy.ts";
import { STRIPE_SESSION_COOKIE, createIdentitySession, getIdentitySession, hmacHex, isAdult, redactIdentitySession, safeEqual } from "./stripe-identity.ts";

export type AgeRequest = { url: URL; method: string; headers: Headers; next: string; body?: () => Promise<string> };
export type AgeStart = { kind: "html"; html: string; status?: number } | { kind: "redirect"; url: string };
export type AgeResult =
  | { ok: true; setCookies?: string[] }
  | { ok: false; reason: string; status?: number; redirect?: string; html?: string; setCookies?: string[] };

export interface AgeVerifier {
  /** Goes into the signed token; changing verifier invalidates old passes. */
  readonly name: string;
  /** True for click-through: never legal age verification. */
  readonly devOnly: boolean;
  readonly label: string;
  startVerification(req: AgeRequest): Promise<AgeStart>;
  handleCallback(req: AgeRequest): Promise<AgeResult>;
}

/**
 * DEV / TEST ONLY. "I am 18 or older" button. Self-declaration is not age
 * verification under KRS 436.001(1) or similar laws. Shown with a visible
 * "test mode" label on the interstitial and an HTML comment.
 */
export const clickthroughVerifier: AgeVerifier = {
  name: "clickthrough",
  devOnly: true,
  label: "Click-through (DEV/TEST ONLY — not legal age verification)",
  async startVerification(req) {
    return { kind: "html", html: renderAgeGateHtml(req.next, { testMode: true }) };
  },
  async handleCallback(req) {
    // The form POST to /age/callback is the confirmation itself (same-origin only).
    if (req.method !== "POST") return { ok: false, reason: "method", status: 405 };
    const origin = req.headers.get("origin");
    if (origin && origin !== req.url.origin) return { ok: false, reason: "origin", status: 403 };
    return { ok: true };
  },
};

const VS_COOKIE_TTL = 60 * 60; // 1 h to finish the Stripe flow
const vsCookie = (value: string, secure: boolean, maxAge = VS_COOKIE_TTL) => `${STRIPE_SESSION_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`;

/**
 * Stripe Identity (age check only — no payments). Flow: the gate shows a
 * "Verify with ID" button → POST /age/callback creates a VerificationSession
 * (document + matching selfie, live capture) and redirects to Stripe's hosted
 * page, binding the session to this browser with a short HttpOnly cookie →
 * Stripe returns to GET /age/callback → we re-fetch the session with the secret
 * key, compute 18+ from verified_outputs.dob in memory, redact the session at
 * Stripe, and the middleware sets the signed pass cookie. Nothing is stored.
 * Env: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY (unused by the hosted flow),
 * STRIPE_IDENTITY_WEBHOOK_SECRET (webhook at /api/stripe/identity-webhook).
 */
export const stripeIdentityVerifier: AgeVerifier = {
  name: "stripe",
  devOnly: false,
  label: "Stripe Identity (government ID + selfie)",
  async startVerification(req) {
    if (!platformEnv("STRIPE_SECRET_KEY")) return { kind: "html", html: renderVerifierUnavailableHtml(), status: 503 };
    const test = (platformEnv("STRIPE_SECRET_KEY") ?? "").startsWith("sk_test_");
    return { kind: "html", html: renderStripeGateHtml(req.next, { testMode: test }) };
  },
  async handleCallback(req) {
    const secret = platformEnv("STRIPE_SECRET_KEY");
    const key = ageTokenKey();
    if (!secret || !key) return { ok: false, reason: "not_configured", status: 503 };
    const secure = req.url.protocol === "https:";
    const retry = (note: string): AgeResult => ({ ok: false, reason: note, status: 200, html: renderStripeGateHtml(req.next, { note }), setCookies: [vsCookie("", secure, 0)] });

    // 1) Button press: create a session and send the visitor to Stripe.
    if (req.method === "POST") {
      const origin = req.headers.get("origin");
      if (origin && origin !== req.url.origin) return { ok: false, reason: "origin", status: 403 };
      try {
        const returnUrl = `${req.url.origin}${AGE_CALLBACK_PATH}?next=${encodeURIComponent(req.next)}`;
        const s = await createIdentitySession(secret, returnUrl);
        if (!s.url) throw new Error("no url");
        const sig = await hmacHex(key.toString("hex"), `vs:${s.id}`);
        return { ok: false, reason: "redirect", redirect: s.url, setCookies: [vsCookie(`${s.id}.${sig}`, secure)] };
      } catch {
        return { ok: false, reason: "stripe_error", status: 502, html: renderVerifierUnavailableHtml() };
      }
    }

    // 2) Return from Stripe: re-fetch the session and decide.
    if (req.method !== "GET") return { ok: false, reason: "method", status: 405 };
    const [id, sig] = (readCookie(req.headers.get("cookie"), STRIPE_SESSION_COOKIE) ?? "").split(".");
    if (!id || !sig || !id.startsWith("vs_") || !safeEqual(sig, await hmacHex(key.toString("hex"), `vs:${id}`))) return retry("We couldn't find your check. Please start again.");
    let s;
    try {
      s = await getIdentitySession(secret, id);
    } catch {
      return { ok: false, reason: "stripe_error", status: 502, html: renderVerifierUnavailableHtml() };
    }
    if (s.status === "processing") return { ok: false, reason: "processing", status: 200, html: renderStripeGateHtml(req.next, { processing: true }) };
    if (s.status !== "verified") return retry(s.status === "canceled" ? "That check was canceled. You can try again." : "We couldn't verify your ID. Please try again.");
    const adult = isAdult(s.verified_outputs?.dob);
    await redactIdentitySession(secret, id);
    if (!adult) return retry("We couldn't confirm you are 18 or older.");
    return { ok: true, setCookies: [vsCookie("", secure, 0)] };
  },
};

const REGISTRY: Record<string, AgeVerifier> = {
  [clickthroughVerifier.name]: clickthroughVerifier,
  [stripeIdentityVerifier.name]: stripeIdentityVerifier,
};

export function verifierByName(name: string | undefined | null): AgeVerifier {
  return REGISTRY[String(name ?? "").trim().toLowerCase()] ?? clickthroughVerifier;
}

export function activeVerifier(): AgeVerifier {
  return verifierByName(platformEnv("ONLYMEN_AGE_VERIFIER"));
}

/** HMAC key for age tokens, derived from the auth secret (never stored or logged). Null → fail closed. */
export function ageTokenKey(): Buffer | null {
  const base = platformEnv("BETTER_AUTH_SECRET") ?? (process.env.NODE_ENV !== "production" ? "onlymen-dev-age-gate" : undefined);
  if (!base) return null;
  return createHmac("sha256", base).update("onlymen-age-gate-v1").digest();
}
