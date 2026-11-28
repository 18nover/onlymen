/**
 * 18+ AGE GATE (global middleware; runs before the private-mode gate).
 *
 * Off unless ONLYMEN_AGE_GATE=on (the Cloudflare Worker sets it in
 * wrangler.jsonc; Vercel leaves it unset, so production is unchanged).
 *
 * The active AgeVerifier (ONLYMEN_AGE_VERIFIER, src/lib/age-gate/verifiers.ts;
 * default "clickthrough" = DEV/TEST ONLY) decides who passes:
 *  - GET  /age?next=/path        → verifier.startVerification (page or redirect).
 *  - GET|POST /age/callback      → verifier.handleCallback (form POST, vendor
 *                                  redirect or vendor webhook). On pass: sets the
 *                                  signed 30-day om_age18 token and 303s to next.
 *  - Any other app page without a valid token → the verifier's start page in
 *    place (200, no-store). Non-GET requests and /api/* → 403.
 * The token holds only verifier name + expiry + HMAC. Nothing else is stored.
 *  - Exempt: legal pages, the gate itself, static assets and server-function
 *    calls (those are session/allowlist-gated on their own; see docs/AGE_GATE.md).
 *
 * Optional geoblock (ONLYMEN_AGE_GATE_GEOBLOCK=on, default OFF): visitors whose
 * Cloudflare geo is a U.S. state in src/lib/age-gate/av-states.ts get the
 * "not available in your region" page; signed-in owner/admin accounts bypass.
 */
import { platformEnv } from "../../src/lib/platform/runtime.ts";
import { normalizePath } from "../../src/lib/private/policy.ts";
import { AGE_CALLBACK_PATH, AGE_COOKIE, AGE_GATE_PATH, ageCookieHeader, decide, flagOn, readCookie, readGeo, REGION_BLOCKED_PATH, safeNext, type Geo } from "../../src/lib/age-gate/policy.ts";
import { renderRegionBlockedHtml } from "../../src/lib/age-gate/html.ts";
import { STRIPE_WEBHOOK_PATH, verifyStripeSignature } from "../../src/lib/age-gate/stripe-identity.ts";
import { signAgeToken, verifyAgeToken } from "../../src/lib/age-gate/token.ts";
import { activeVerifier, ageTokenKey, type AgeRequest, type AgeVerifier } from "../../src/lib/age-gate/verifiers.ts";

interface GateEvent {
  url: URL;
  req: { method: string; headers: Headers; text?: () => Promise<string> };
  /** Set by src/worker.ts from request.cf (Cloudflare only). */
  cf?: { country?: unknown; regionCode?: unknown } | null;
}

const NOINDEX = "noindex, nofollow, noarchive";

export function ageGateEnabled(): boolean {
  return flagOn(platformEnv("ONLYMEN_AGE_GATE"));
}

export function geoblockEnabled(): boolean {
  return flagOn(platformEnv("ONLYMEN_AGE_GATE_GEOBLOCK"));
}

function hasSessionCookie(headers: Headers): boolean {
  return /(^|;\s*)(__Secure-)?onlymen\.session_token=/.test(headers.get("cookie") ?? "");
}

/** Owner/admin bypass for the geoblock (resolved from the session server-side; fails closed). */
async function isStaff(headers: Headers): Promise<boolean> {
  if (!hasSessionCookie(headers)) return false;
  try {
    const [{ allowedSessionUserId }, inv, dbm] = await Promise.all([import("../../src/lib/private/allowlist.server.ts"), import("../../src/lib/invites/invites.server.ts"), import("../../src/lib/db")]);
    const uid = await allowedSessionUserId(headers);
    if (!uid) return false;
    return await inv.isAdminUser(await dbm.getSql(), uid);
  } catch {
    return false;
  }
}

const html = (body: string | null, status: number, extra: Record<string, string> = {}) =>
  new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "private, no-store", vary: "cookie", "x-robots-tag": NOINDEX, ...extra },
  });

export default async function ageGate(event: GateEvent, next: () => unknown | Promise<unknown>): Promise<unknown> {
  const ageOn = ageGateEnabled();
  const geoOn = geoblockEnabled();
  if (!ageOn && !geoOn) return next();

  const path = normalizePath(event.url.pathname);
  const method = (event.req.method ?? "GET").toUpperCase();
  const headers = event.req.headers;
  const geo: Geo = readGeo(headers, event.cf);
  const secure = event.url.protocol === "https:";

  // Stripe Identity webhook: signature-verified, exempt from the age/private gates. Stateless (the
  // callback re-fetches the session), so this only acknowledges verified events.
  if (path === STRIPE_WEBHOOK_PATH) return stripeWebhook(event, method);

  const verifier = activeVerifier();
  const key = ageTokenKey();
  const verified = Boolean(key) && verifyAgeToken(key!, readCookie(headers.get("cookie"), AGE_COOKIE), new Set([verifier.name])).ok;

  let decision = decide({ path, ageGate: ageOn, geoblock: geoOn, verified, geo });
  if (decision === "blocked" && (await isStaff(headers))) decision = decide({ path, ageGate: ageOn, geoblock: geoOn, verified, geo, isStaff: true });

  if (decision === "blocked") {
    if (method !== "GET" && method !== "HEAD") return new Response(JSON.stringify({ error: "Not available in your region." }), { status: 451, headers: { "content-type": "application/json", "cache-control": "no-store" } });
    return html(method === "HEAD" ? null : renderRegionBlockedHtml(), 451, { "x-onlymen-gate": "region" });
  }

  if (path === REGION_BLOCKED_PATH) return html(method === "HEAD" ? null : renderRegionBlockedHtml(), 200, { "x-onlymen-gate": "region" });

  const ageReq = (dest: string): AgeRequest => ({ url: event.url, method, headers, next: dest, body: event.req.text?.bind(event.req) });
  const vHeaders = { "x-onlymen-gate": "age", "x-onlymen-age-verifier": verifier.devOnly ? `${verifier.name} (dev/test only)` : verifier.name };

  if (path === AGE_CALLBACK_PATH) {
    if (!ageOn) return new Response(null, { status: 404 });
    const dest = safeNext(event.url.searchParams.get("next"));
    const result = await verifier.handleCallback(ageReq(dest));
    const withCookies = (res: Response, cookies?: string[]) => {
      for (const c of cookies ?? []) res.headers.append("set-cookie", c);
      return res;
    };
    if (!result.ok && result.redirect) return withCookies(new Response(null, { status: 303, headers: { location: result.redirect, "cache-control": "no-store", "x-robots-tag": NOINDEX, ...vHeaders } }), result.setCookies);
    if (!result.ok && result.html) return withCookies(html(method === "HEAD" ? null : result.html, result.status ?? 200, vHeaders), result.setCookies);
    if (!result.ok || !key) return html(method === "HEAD" ? null : "<!doctype html><title>Age check failed</title><p>Age check failed. <a href=\"/age\">Try again</a></p>", result.ok ? 503 : (result.status ?? 403), vHeaders);
    return withCookies(new Response(null, { status: 303, headers: { location: dest, "set-cookie": ageCookieHeader(signAgeToken(key, verifier.name), secure), "cache-control": "no-store", "x-robots-tag": NOINDEX, ...vHeaders } }), result.setCookies);
  }

  if (path === AGE_GATE_PATH) {
    const dest = safeNext(event.url.searchParams.get("next"));
    if (!ageOn || verified) return new Response(null, { status: 302, headers: { location: dest, "cache-control": "no-store" } });
    return start(verifier, ageReq(dest), method, vHeaders);
  }

  if (decision === "pass") return next();

  // No valid age token yet.
  if ((method !== "GET" && method !== "HEAD") || path.startsWith("/api/")) {
    return new Response(JSON.stringify({ error: "Confirm you are 18 or older first." }), { status: 403, headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": NOINDEX, ...vHeaders } });
  }
  return start(verifier, ageReq(safeNext(event.url.pathname + event.url.search)), method, vHeaders);
}

async function start(verifier: AgeVerifier, req: AgeRequest, method: string, extra: Record<string, string>): Promise<Response> {
  const s = await verifier.startVerification(req);
  if (s.kind === "redirect") return new Response(null, { status: 302, headers: { location: s.url, "cache-control": "no-store", ...extra } });
  return html(method === "HEAD" ? null : s.html, s.status ?? 200, extra);
}

/** POST /api/stripe/identity-webhook — verifies Stripe-Signature (HMAC-SHA256) and acknowledges identity.verification_session.* events. */
async function stripeWebhook(event: GateEvent, method: string): Promise<Response> {
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
  if (method !== "POST") return json(405, { error: "method" });
  const secret = platformEnv("STRIPE_IDENTITY_WEBHOOK_SECRET");
  if (!secret) return json(503, { error: "not_configured" });
  const raw = (await event.req.text?.()) ?? "";
  if (!(await verifyStripeSignature(raw, event.req.headers.get("stripe-signature"), secret))) return json(400, { error: "bad_signature" });
  let type = "";
  try {
    type = String(JSON.parse(raw).type ?? "");
  } catch {
    return json(400, { error: "bad_json" });
  }
  // verified → the return-URL callback re-fetches the session and grants access;
  // requires_input / canceled → the callback shows the retry option. Nothing is stored.
  return json(200, { received: true, handled: type.startsWith("identity.verification_session.") });
}
