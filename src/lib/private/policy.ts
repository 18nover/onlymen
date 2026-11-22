/**
 * Private mode policy (pure, no I/O — shared by the Nitro gate, the server
 * functions and the client-side guard, and unit-tested).
 *
 * OnlyMen is closed: public sign-up is off and only allowlisted accounts may
 * sign in. Everyone else sees the "Private — coming soon" page. The only
 * public paths are the log-in page, the legal pages (linked from 18nover.gay's
 * footer) and static assets.
 */

/** Exact document paths anyone may open. */
export const PUBLIC_PAGES = new Set(["/login", "/logout", "/terms", "/privacy", "/guidelines", "/2257", "/robots.txt"]);

/** Static assets and framework internals (served by the CDN in production). */
export function isStaticAsset(path: string): boolean {
  if (path.startsWith("/assets/") || path.startsWith("/models/") || path.startsWith("/__grok/") || path.startsWith("/_build/")) return true;
  if (/^\/(favicon[^/]*|apple-touch-icon[^/]*|icon-\d+\.png|og\.jpg|site\.webmanifest)$/.test(path)) return true;
  // Any other file-looking path (e.g. hashed chunks) — never an app route.
  return /\.(js|mjs|css|map|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|txt|webmanifest|json)$/i.test(path);
}

/** TanStack Start server-function endpoint prefix. Each function enforces the allowlist itself. */
export const SERVER_FN_PREFIX = "/_serverFn/";

export function normalizePath(path: string): string {
  const p = path.replace(/\/{2,}/g, "/");
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
}

export function isPublicPath(path: string): boolean {
  const p = normalizePath(path);
  return PUBLIC_PAGES.has(p) || isStaticAsset(p);
}

/** Parse a comma/space/newline separated env list. Empty or unset → empty set (deny everyone). */
export function parseList(raw: string | undefined | null, lower = false): Set<string> {
  const out = new Set<string>();
  for (const part of String(raw ?? "").split(/[\s,]+/)) {
    const v = part.trim().replace(/^@/, "");
    if (v) out.add(lower ? v.toLowerCase() : v);
  }
  return out;
}

export type Allowlist = { ids: Set<string>; usernames: Set<string>; ownerEmails: Set<string> };

export function readAllowlist(env: Record<string, string | undefined>): Allowlist {
  return {
    ids: parseList(env.ONLYMEN_ALLOWED_USER_IDS),
    usernames: parseList(env.ONLYMEN_ALLOWED_USERNAMES, true),
    ownerEmails: parseList(env.ONLYMEN_OWNER_SIGNUP_EMAIL, true),
  };
}

export function allowlistEmpty(a: Allowlist): boolean {
  return a.ids.size === 0 && a.usernames.size === 0 && a.ownerEmails.size === 0;
}

/** Decide from an account's identifiers. Unknown/empty allowlist → false. */
export function isAllowedIdentity(a: Allowlist, who: { id?: string | null; username?: string | null; email?: string | null }): boolean {
  if (who.id && a.ids.has(who.id)) return true;
  if (who.username && a.usernames.has(who.username.toLowerCase())) return true;
  if (who.email && a.ownerEmails.has(who.email.toLowerCase())) return true;
  return false;
}

/** Sign-up is closed unless a one-time owner email is configured, and then only for that email. */
export function signUpAllowedFor(a: Allowlist, email: string | null | undefined): boolean {
  return Boolean(email) && a.ownerEmails.has(String(email).trim().toLowerCase());
}
