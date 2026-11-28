/**
 * Stripe Identity helpers for the `stripe` AgeVerifier (age check only — no
 * payments). Plain fetch + WebCrypto: no Stripe SDK, no new dependency.
 *
 * Privacy: we keep NOTHING about the visitor. The pass is the signed age cookie.
 * The DOB is read once in memory to compute "18+" and dropped; after a pass the
 * session is redacted at Stripe (best effort) so Stripe deletes the ID images.
 */
const API = "https://api.stripe.com/v1";
const enc = new TextEncoder();

export const STRIPE_WEBHOOK_PATH = "/api/stripe/identity-webhook";
export const STRIPE_SESSION_COOKIE = "om_age_vs";

export type IdentitySession = {
  id: string;
  status: "requires_input" | "processing" | "verified" | "canceled";
  url?: string | null;
  created?: number;
  verified_outputs?: { dob?: { day?: number | null; month?: number | null; year?: number | null } | null } | null;
};

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function hmacHex(key: string, msg: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/** Verify a Stripe-Signature header (t=…,v1=…) over the raw body. */
export async function verifyStripeSignature(rawBody: string, header: string | null, secret: string, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000)): Promise<boolean> {
  if (!header || !secret) return false;
  let t = "";
  const sigs: string[] = [];
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t") t = v;
    else if (k === "v1") sigs.push(v);
  }
  const ts = Number(t);
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > toleranceSec || !sigs.length) return false;
  const expected = await hmacHex(secret, `${t}.${rawBody}`);
  return sigs.some((s) => safeEqual(s, expected));
}

/** True when the DOB (UTC calendar) is at least `minAge` years before `now`. Missing/invalid DOB → false. */
export function isAdult(dob: { day?: number | null; month?: number | null; year?: number | null } | null | undefined, now = new Date(), minAge = 18): boolean {
  const y = Number(dob?.year), m = Number(dob?.month), d = Number(dob?.day);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d) || y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const nowY = now.getUTCFullYear(), nowM = now.getUTCMonth() + 1, nowD = now.getUTCDate();
  let age = nowY - y;
  if (nowM < m || (nowM === m && nowD < d)) age--;
  return age >= minAge && age < 130;
}

function form(params: Record<string, string>): URLSearchParams {
  return new URLSearchParams(params);
}

async function stripe<T>(secretKey: string, path: string, init: { method?: string; body?: URLSearchParams } = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init.method ?? "GET",
    headers: { authorization: `Bearer ${secretKey}`, ...(init.body ? { "content-type": "application/x-www-form-urlencoded" } : {}) },
    body: init.body,
  });
  if (!res.ok) throw new Error(`stripe ${res.status}`); // never include the body/headers (could echo details)
  return (await res.json()) as T;
}

/** Document check with a matching selfie and live capture; hosted page at `url`. */
export function createIdentitySession(secretKey: string, returnUrl: string): Promise<IdentitySession> {
  const body = form({
    type: "document",
    return_url: returnUrl,
    "options[document][require_matching_selfie]": "true",
    "options[document][require_live_capture]": "true",
    "options[document][allowed_types][0]": "driving_license",
    "options[document][allowed_types][1]": "passport",
    "options[document][allowed_types][2]": "id_card",
    "metadata[purpose]": "age_gate_18plus",
  });
  return stripe<IdentitySession>(secretKey, "/identity/verification_sessions", { method: "POST", body });
}

export function getIdentitySession(secretKey: string, id: string): Promise<IdentitySession> {
  return stripe<IdentitySession>(secretKey, `/identity/verification_sessions/${encodeURIComponent(id)}?expand[]=verified_outputs&expand[]=verified_outputs.dob`);
}

/** Ask Stripe to delete the collected ID data (best effort). */
export async function redactIdentitySession(secretKey: string, id: string): Promise<void> {
  try {
    await stripe(secretKey, `/identity/verification_sessions/${encodeURIComponent(id)}/redact`, { method: "POST", body: new URLSearchParams() });
  } catch {
    /* best effort */
  }
}
