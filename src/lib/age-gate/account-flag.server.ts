/**
 * Account-level 18+ pass (migration 0012: om_account.age_verified_at +
 * age_verified_session). Lets a verified member skip the paid Stripe ID check on
 * any device or in the installed app. Stores only a timestamp and the Stripe
 * session id. Every function fails safe: if the column isn't there yet or the DB
 * errors, it reports "not verified" and never throws.
 */
import { allowedSessionUserId } from "../private/allowlist.server.ts";
import { AGE_COOKIE, readCookie } from "./policy.ts";
import { verifyAgeToken } from "./token.ts";
import { activeVerifier, ageTokenKey } from "./verifiers.ts";

async function db() {
  const { getSql } = await import("../db");
  return getSql();
}

/** Signed-in user id for these headers, or null. */
export const sessionUser = (headers: Headers) => allowedSessionUserId(headers);

export async function isAccountAgeVerified(uid: string): Promise<boolean> {
  try {
    // Owner/admin accounts and accounts whose ID an admin already approved count as 18+ verified.
    const a = await (await db())<{ role: string | null; vs: string | null }>`select role, verification_status as vs from om_account where user_id = ${uid}`;
    if (a[0] && (a[0].role === "owner" || a[0].role === "admin" || a[0].vs === "approved")) return true;
  } catch { /* fall through */ }
  try {
    const r = await (await db())<{ at: string | null }>`select age_verified_at as at from om_account where user_id = ${uid}`;
    return Boolean(r[0]?.at);
  } catch {
    return false;
  }
}

/**
 * Record the pass on the account and, because Stripe Identity (document + matching selfie) is the one
 * verification path, approve the account's creator ID verification too (go live / explicit photos).
 * Stores only the flag, a timestamp and the Stripe session id. A rejection by an admin is never overridden.
 * Manual admin review stays as the fallback when Stripe doesn't pass. Safe to call repeatedly.
 */
export async function markAccountAgeVerified(uid: string, stripeSessionId: string | null): Promise<void> {
  const sql = await db().catch(() => null);
  if (!sql) return;
  try {
    await sql`update om_account set age_verified_at = now(), age_verified_session = ${stripeSessionId} where user_id = ${uid} and age_verified_at is null`;
  } catch {
    /* migration 0012 not applied yet: still approve below */
  }
  try {
    const ref = stripeSessionId ?? "stripe";
    await sql`update om_account set verification_status = 'approved', updated_at = now() where user_id = ${uid} and verification_status in ('not_started', 'pending_review')`;
    const open = await sql<{ id: string }>`update om_verification set status = 'approved', provider = 'stripe', provider_ref = ${ref}, reviewed_at = now(), updated_at = now()
      where user_id = ${uid} and status in ('not_started', 'pending') returning id`;
    for (const v of open) await sql`insert into om_verification_audit (actor_id, action, verification_id, note) values (null, 'approved', ${v.id}, 'Stripe Identity passed')`;
  } catch (e) {
    console.error("[age] could not approve creator verification:", (e as Error)?.message);
  }
}

/** Does this request carry a valid Stripe age pass (signed cookie)? */
export function requestHasStripePass(headers: Headers): boolean {
  const key = ageTokenKey();
  const v = activeVerifier();
  return Boolean(key) && v.name === "stripe" && verifyAgeToken(key!, readCookie(headers.get("cookie"), AGE_COOKIE), new Set([v.name])).ok;
}

/** Called when a signed-in member opens verification: an existing Stripe pass (cookie or account flag) approves them. */
export async function syncStripeApproval(uid: string, headers: Headers): Promise<void> {
  if (requestHasStripePass(headers) || (activeVerifier().name === "stripe" && (await isAccountAgeVerified(uid)))) await markAccountAgeVerified(uid, null);
}
