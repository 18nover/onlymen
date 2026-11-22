/**
 * Signed visitor age-pass token (HMAC-SHA256). The ONLY thing the age gate
 * stores: which verifier passed the visitor and when the pass expires.
 * No PII, no DOB, no document data, nothing in the database.
 *
 *   v1.<verifier>.<expiry unix seconds>.<base64url(HMAC(key, "v1.<verifier>.<expiry>"))>
 *
 * Pure apart from node:crypto, so it is unit-tested directly. The key is
 * passed in (server: derived from BETTER_AUTH_SECRET in verifiers.ts).
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { AGE_COOKIE_MAX_AGE, AGE_TOKEN_RE } from "./policy.ts";

const b64url = (b: Buffer) => b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function mac(key: string | Buffer, payload: string): string {
  return b64url(createHmac("sha256", key).update(payload, "utf8").digest());
}

export function signAgeToken(key: string | Buffer, verifier: string, nowSec = Math.floor(Date.now() / 1000), ttlSec = AGE_COOKIE_MAX_AGE): string {
  if (!/^[a-z0-9_-]{1,32}$/.test(verifier)) throw new Error("bad verifier name");
  const payload = `v1.${verifier}.${nowSec + ttlSec}`;
  return `${payload}.${mac(key, payload)}`;
}

export type TokenCheck = { ok: true; verifier: string; exp: number } | { ok: false; reason: "missing" | "malformed" | "signature" | "expired" | "verifier" };

/** Valid only if well-formed, correctly signed, unexpired, and issued by one of `acceptVerifiers`. */
export function verifyAgeToken(key: string | Buffer, token: string | null | undefined, acceptVerifiers: ReadonlySet<string>, nowSec = Math.floor(Date.now() / 1000)): TokenCheck {
  if (!token) return { ok: false, reason: "missing" };
  const m = AGE_TOKEN_RE.exec(token);
  if (!m) return { ok: false, reason: "malformed" };
  const [, verifier, expRaw, sig] = m;
  const want = Buffer.from(mac(key, `v1.${verifier}.${expRaw}`));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return { ok: false, reason: "signature" };
  const exp = Number(expRaw);
  if (exp <= nowSec) return { ok: false, reason: "expired" };
  if (!acceptVerifiers.has(verifier)) return { ok: false, reason: "verifier" };
  return { ok: true, verifier, exp };
}
