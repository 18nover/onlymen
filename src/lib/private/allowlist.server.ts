/**
 * Server-side allowlist checks (private mode). Every member/data path calls
 * `allowedSessionUserId` instead of trusting a bare session.
 */
import { readAllowlist, allowlistEmpty, isAllowedIdentity, signUpAllowedFor } from "./policy.ts";
import { platformEnv } from "../platform/runtime.ts";
import { invitesEnabled } from "../invites/invites.server.ts";

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
  if (a.ids.has(userId)) return true;
  // Invite mode (ONLYMEN_INVITES=on): accounts that joined with a code, and
  // admin/owner accounts, are in as well as the env allowlist.
  const invites = invitesEnabled();
  if (!invites && (allowlistEmpty(a) || (a.usernames.size === 0 && a.ownerEmails.size === 0))) return false;
  try {
    const { getSql } = await import("../db");
    const db = await getSql();
    const rows = invites
      ? await db<{ email: string | null; username: string | null; role: string | null; invited: boolean }>`select u.email, a.username, a.role,
          exists (select 1 from invite_redemptions r where r.user_id = u.id) as invited
          from "user" u left join om_account a on a.user_id = u.id where u.id = ${userId}`
      : await db<{ email: string | null; username: string | null; role: string | null; invited: boolean }>`select u.email, a.username, null as role, false as invited from "user" u left join om_account a on a.user_id = u.id where u.id = ${userId}`;
    const r = rows[0];
    if (!r) return false;
    if (invites && (r.invited || r.role === "admin" || r.role === "owner")) return true;
    return isAllowedIdentity(a, { id: userId, username: r.username, email: r.email });
  } catch (e) {
    console.error("[private] allowlist lookup failed:", (e as Error)?.message);
    return false;
  }
}

export function isSignUpAllowed(email: string | null | undefined): boolean {
  return privateModeOff() || signUpAllowedFor(allowlist(), email);
}

/** Is the sign-up page open to signed-out visitors (owner bootstrap or invite codes)? */
export function signUpPageOpen(): boolean {
  return Boolean(platformEnv("ONLYMEN_OWNER_SIGNUP_EMAIL")) || invitesEnabled();
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
