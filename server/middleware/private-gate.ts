/**
 * PRIVATE MODE gate (Nitro global middleware, runs before TanStack Start).
 *
 * Logged-out visitors on every host (onlymen.gay, onlymen.live, *.vercel.app,
 * www) get the standalone "Private — coming soon" page for every app route.
 * Only the log-in page, the legal pages, static assets, server functions and
 * the photo route pass through — server functions and /api/photo enforce the
 * allowlist themselves (and /api/owner-seed is inert without its env token), and requests carrying a session cookie are checked
 * again server-side by the root route's private guard (src/routes/__root.tsx),
 * so a forged cookie only gets the same coming-soon page.
 */
import { isPublicPath, normalizePath, SERVER_FN_PREFIX } from "../../src/lib/private/policy";
import { renderGateHtml } from "../../src/lib/private/gate-html";
import { platformEnv } from "../../src/lib/platform/runtime.ts";

interface GateEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

const NOINDEX = "noindex, nofollow, noarchive";

function hasSessionCookie(headers: Headers): boolean {
  return /(^|;\s*)(__Secure-)?onlymen\.session_token=/.test(headers.get("cookie") ?? "");
}

function privateModeOff(): boolean {
  return process.env.NODE_ENV !== "production" && platformEnv("ONLYMEN_PRIVATE_MODE") === "off";
}

function ownerSignupOpen(): boolean {
  return Boolean(platformEnv("ONLYMEN_OWNER_SIGNUP_EMAIL"));
}

/** Pass through, tagging the app's own response noindex. */
async function pass(next: () => unknown | Promise<unknown>): Promise<unknown> {
  const res = await next();
  if (!(res instanceof Response)) return res;
  const headers = new Headers(res.headers);
  headers.set("x-robots-tag", NOINDEX);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

export default async function privateGate(event: GateEvent, next: () => unknown | Promise<unknown>): Promise<unknown> {
  if (privateModeOff()) return next();
  const path = normalizePath(event.url.pathname);
  if (isPublicPath(path) || path.startsWith(SERVER_FN_PREFIX) || path.startsWith("/api/photo/") || path === "/api/owner-seed") return pass(next);
  if (ownerSignupOpen() && path === "/join") return pass(next);
  if (hasSessionCookie(event.req.headers)) return pass(next);

  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response(JSON.stringify({ error: "OnlyMen is private." }), {
      status: 403,
      headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": NOINDEX },
    });
  }
  return new Response(method === "HEAD" ? null : renderGateHtml(), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-robots-tag": NOINDEX,
      "x-onlymen-gate": "private",
    },
  });
}
