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
 * put`). No other code changes.
 */
import { createHmac } from "node:crypto";
import { platformEnv } from "../platform/runtime.ts";
import { renderAgeGateHtml, renderVerifierUnavailableHtml } from "./html.ts";

export type AgeRequest = { url: URL; method: string; headers: Headers; next: string; body?: () => Promise<string> };
export type AgeStart = { kind: "html"; html: string; status?: number } | { kind: "redirect"; url: string };
export type AgeResult = { ok: true } | { ok: false; reason: string; status?: number };

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

/**
 * STUB for a third-party age-verification vendor, chosen later. Candidates
 * (confirm prices with each vendor before choosing):
 *   - AgeChecker.net — data/ID check; $25/mo + $0.50 per accepted check
 *     (agechecker.net/pricing, read 2026-11-22; add-ons extra).
 *   - VerifyMy (verifymy.io) — email-based age estimation + ID; quote.
 *   - Yoti (yoti.com) — facial age estimation / Digital ID / doc scan; quote.
 *   - Incode — ID + selfie; enterprise quote.
 *   (also go.cam, AgeGO, Veriff age estimation)
 * Typical flow: startVerification creates a vendor session server-side
 * (secret API key) and redirects to the vendor; the vendor redirects back to
 * /age/callback?session=… and/or POSTs a signed webhook there. handleCallback
 * verifies the vendor signature / re-fetches the session result and returns
 * pass/fail. Never store the vendor's payload — only our signed pass token.
 */
export const vendorStubVerifier: AgeVerifier = {
  name: "vendor",
  devOnly: false,
  label: "Third-party vendor (NOT CONFIGURED — stub)",
  async startVerification() {
    // TODO(vendor): create a session with the chosen vendor and redirect:
    // return { kind: "redirect", url: session.url };
    return { kind: "html", html: renderVerifierUnavailableHtml(), status: 503 };
  },
  async handleCallback() {
    // TODO(vendor): verify the webhook signature (e.g. HMAC header with
    // ONLYMEN_AGE_VENDOR_WEBHOOK_SECRET) or re-fetch the session by id, then
    // return { ok: true } only for a confirmed 18+ result.
    return { ok: false, reason: "not_configured", status: 501 };
  },
};

const REGISTRY: Record<string, AgeVerifier> = {
  [clickthroughVerifier.name]: clickthroughVerifier,
  [vendorStubVerifier.name]: vendorStubVerifier,
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
