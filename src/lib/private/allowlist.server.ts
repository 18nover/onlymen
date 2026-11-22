/**
 * Server-side allowlist checks (private mode). Every member/data path calls
 * `allowedSessionUserId` instead of trusting a bare session.
 */
import { readAllowlist, allowlistEmpty, isAllowedIdentity, signUpAllowedFor } from "./policy.ts";
import { platformEnv } from "../platform/runtime.ts";

/** Local-dev escape hatch only; never honored in production builds. */
export function privateModeOff(): boolean {
  return process.env.NODE_ENV !== "production" && platformEnv("ONLYMEN_PRIVATE_MODE") === "off";
}

export function allowlist() {
  return readAllowlist({
    ONLYMEN_ALLOWED_USER_IDS: platformEnv("ONLYMEN_ALLOWED_USER_IDS"),
    ONLYMEN_ALLOWED_USERNAMES: platformEnv("ONLYMEN_ALLOWED_USERNAMES"),
    ONLYMEN_OWNER_SIGNUP_EMAIL: platformEnv("ONLYMEN_OWNER_SIGNUP_EMAIL"),
  });
}

/** Is this user id allowed into OnlyMen right now? Fails closed on any error. */
export async function isUserAllowed(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  if (privateModeOff()) return true;
  const a = allowlist();
  if (allowlistEmpty(a)) return false;
  if (a.ids.has(userId)) return true;
  if (a.usernames.size === 0 && a.ownerEmails.size === 0) return false;
  try {
    const { getSql } = await import("../db");
    const db = await getSql();
    const rows = await db<{ email: string | null; username: string | null }>`select u.email, a.username from "user" u left join om_account a on a.user_id = u.id where u.id = ${userId}`;
    const r = rows[0];
    if (!r) return false;
    return isAllowedIdentity(a, { id: userId, username: r.username, email: r.email });
  } catch (e) {
    console.error("[private] allowlist lookup failed:", (e as Error)?.message);
    return false;
  }
}

export function isSignUpAllowed(email: string | null | undefined): boolean {
  return privateModeOff() || signUpAllowedFor(allowlist(), email);
}

/** Resolve the session from request headers and return the user id only if allowlisted. */
export async function allowedSessionUserId(headers: Headers): Promise<string | null> {
  try {
    const { getAuth, serverAccountsEnabled } = await import("../account/auth.server");
    if (!serverAccountsEnabled) return null;
    const s = await getAuth().api.getSession({ headers });
    const uid = s?.user?.id ?? null;
    return (await isUserAllowed(uid)) ? uid : null;
  } catch {
    return null;
  }
}
