/**
 * 18+ age gate policy (pure, no I/O — shared by the server middleware
 * server/middleware/age-gate.ts, the root route's client guard and the tests).
 *
 * VISITOR age verification only. It stores nothing about the visitor except a
 * signed pass token in a cookie (verifier name + expiry + HMAC; see
 * token.server.ts) — no PII, no DOB, no ID images, no DB rows. Creator ID /
 * 2257 records (src/lib/verification) are a separate system.
 *
 * ONLYMEN_AGE_GATE=on          → every app page needs a valid signed age token.
 * ONLYMEN_AGE_VERIFIER=<name>  → which AgeVerifier issues it (verifiers.ts).
 *                                Default "clickthrough" = DEV/TEST ONLY; it is
 *                                NOT age verification under KRS 436.001(1).
 * ONLYMEN_AGE_GATE_GEOBLOCK=on → visitors geolocated to a state in
 *                                av-states.ts get "not available in your region"
 *                                (owner/admin accounts bypass). Default OFF.
 * Both unset (Vercel production today) → nothing changes.
 */
import { isStaticAsset, normalizePath } from "../private/policy.ts";
import { AV_LAW_STATE_CODES } from "./av-states.ts";

export const AGE_COOKIE = "om_age18";
export const AGE_TOKEN_VERSION = "v1";
export const AGE_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days
export const AGE_GATE_PATH = "/age";
export const REGION_BLOCKED_PATH = "/region-blocked";
export const EXIT_URL = "https://www.google.com/";

export const flagOn = (v: string | undefined | null) => String(v ?? "").trim().toLowerCase() === "on";

/** Crawl-safe pages anyone may open without confirming: legal pages, the gate itself, static assets. */
export const AGE_CALLBACK_PATH = "/age/callback";
export const AGE_EXEMPT_PAGES = new Set(["/terms", "/privacy", "/guidelines", "/2257", "/custodian", "/live-rules", "/robots.txt", AGE_GATE_PATH, AGE_CALLBACK_PATH, REGION_BLOCKED_PATH]);

export function isAgeExempt(path: string): boolean {
  const p = normalizePath(path);
  return AGE_EXEMPT_PAGES.has(p) || p.startsWith("/legal/") || isStaticAsset(p);
}

/**
 * Paths still reachable from a geoblocked region: the exempt pages plus log-in
 * and the server-function endpoint, so an owner/admin can sign in and bypass.
 */
export function isGeoExempt(path: string): boolean {
  const p = normalizePath(path);
  return isAgeExempt(p) || p === "/login" || p === "/logout" || p.startsWith("/_serverFn/");
}

export function readCookie(header: string | null | undefined, name: string): string | null {
  for (const part of String(header ?? "").split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

/** Token shape: v1.<verifier>.<expiry unix s>.<base64url HMAC-SHA256>. */
export const AGE_TOKEN_RE = /^v1\.([a-z0-9_-]{1,32})\.(\d{9,12})\.([A-Za-z0-9_-]{43})$/;

/**
 * Client-side hint only (the browser can't check the HMAC): does a well-formed,
 * unexpired token exist? The server always verifies the signature.
 */
export function hasAgeCookie(cookieHeader: string | null | undefined, nowSec = Math.floor(Date.now() / 1000)): boolean {
  const m = AGE_TOKEN_RE.exec(readCookie(cookieHeader, AGE_COOKIE) ?? "");
  return Boolean(m && Number(m[2]) > nowSec);
}

export function ageCookieHeader(token: string, secure = true, maxAge = AGE_COOKIE_MAX_AGE): string {
  return `${AGE_COOKIE}=${token}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/** Same-origin relative path only (no //host, no scheme, no backslashes); falls back to "/". */
export function safeNext(raw: string | null | undefined): string {
  const v = String(raw ?? "");
  if (!v.startsWith("/") || v.startsWith("//") || v.includes("\\") || [...v].some((ch) => ch.charCodeAt(0) < 0x20)) return "/";
  const p = v.split("?")[0];
  if (p === AGE_GATE_PATH || p === REGION_BLOCKED_PATH) return "/";
  return v.slice(0, 512);
}

export type Geo = { country: string | null; region: string | null };

/** Geo from Cloudflare (request.cf) first, then headers (CF-IPCountry / cf-region-code, or Vercel's). */
export function readGeo(headers: Headers, cf?: { country?: unknown; regionCode?: unknown } | null): Geo {
  const up = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().toUpperCase() : null);
  return {
    country: up(cf?.country) ?? up(headers.get("cf-ipcountry")) ?? up(headers.get("x-vercel-ip-country")),
    region: up(cf?.regionCode) ?? up(headers.get("cf-region-code")) ?? up(headers.get("x-vercel-ip-country-region")),
  };
}

/** Is this visitor in a U.S. state on the AV-law list? Unknown geo → not blocked (fails open; see docs/AGE_GATE.md). */
export function isBlockedRegion(geo: Geo, states: ReadonlySet<string> = AV_LAW_STATE_CODES): boolean {
  return geo.country === "US" && Boolean(geo.region) && states.has(String(geo.region));
}

export type AgeDecision = "pass" | "blocked" | "interstitial";

/**
 * Pure decision for one request. `verified` = the request carries a valid
 * signed age token from the active verifier (checked server-side by the
 * caller). `isStaff` is resolved lazily, only when the geoblock would apply.
 */
export function decide(opts: { path: string; ageGate: boolean; geoblock: boolean; verified: boolean; geo: Geo; isStaff?: boolean }): AgeDecision {
  const p = normalizePath(opts.path);
  if (opts.geoblock && isBlockedRegion(opts.geo) && !isGeoExempt(p) && !opts.isStaff) return "blocked";
  if (!opts.ageGate || isAgeExempt(p) || p.startsWith("/_serverFn/")) return "pass";
  return opts.verified ? "pass" : "interstitial";
}
