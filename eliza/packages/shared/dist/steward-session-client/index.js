/**
 * Shared Steward session client.
 *
 * Single source of truth for:
 *  - the storage / cookie / endpoint key names used across os-homepage
 *    (`elizaos.ai`), cloud-frontend (`elizacloud.ai`), and the cloud-api
 *    `/api/auth/steward-session` route handler;
 *  - the request / response / error shapes the route exchanges with the
 *    browser;
 *  - the small set of helpers each consumer needs (sync, clear, read).
 *
 * Browser-only helpers return cleanly under SSR (`typeof window === "undefined"`).
 */
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
/** localStorage key for the Steward access token (JWT). */
export const STEWARD_TOKEN_KEY = "steward_session_token";
/**
 * localStorage key for the Steward refresh token.
 *
 * Refresh tokens are persisted only as the HttpOnly `steward-refresh-token`
 * cookie (set by `/api/auth/steward-session` and
 * `/api/auth/steward-nonce-exchange`). This key is retained solely so
 * `clearStoredStewardToken()` can drain the stale localStorage value left in
 * tabs opened before the cookie-only rollout. Do NOT read or write it.
 */
export const STEWARD_REFRESH_TOKEN_KEY = "steward_refresh_token";
/** Non-HttpOnly cookie set to "1" while the server-side session is live. */
export const STEWARD_AUTHED_COOKIE = "steward-authed";
/** Steward multi-tenant identifier for Eliza Cloud. */
export const STEWARD_TENANT_ID = "elizacloud";
/** Same-origin endpoint that exchanges the JWT for HttpOnly cookies. */
export const STEWARD_SESSION_ENDPOINT = "/api/auth/steward-session";
/**
 * Same-origin endpoint that swaps a one-time OAuth `code` (the nonce-exchange
 * flow's `?code=` query param) for HttpOnly cookies. The endpoint calls
 * Steward's `POST /auth/oauth/exchange` server-side so the access and refresh
 * tokens never touch the browser URL.
 */
export const STEWARD_NONCE_EXCHANGE_ENDPOINT = "/api/auth/steward-nonce-exchange";
/**
 * Same-origin endpoint that rotates the Steward access + refresh tokens
 * using the HttpOnly `steward-refresh-token` cookie. The browser POSTs
 * with `credentials: "include"`; the cookie travels automatically. Trusted
 * Cloud browser origins receive the short-lived access token so the SPA can
 * refresh its localStorage mirror while route auth remains synchronous.
 */
export const STEWARD_REFRESH_ENDPOINT = "/api/auth/steward-refresh";
export class StewardSessionError extends Error {
    status;
    code;
    constructor(message, status, code) {
        super(message);
        this.name = "StewardSessionError";
        this.status = status;
        this.code = code;
    }
}
// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------
export function readStoredStewardToken() {
    if (typeof window === "undefined")
        return null;
    try {
        return window.localStorage.getItem(STEWARD_TOKEN_KEY);
    }
    catch {
        return null;
    }
}
export function writeStoredStewardToken(token) {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.setItem(STEWARD_TOKEN_KEY, token);
    }
    catch {
        // localStorage may be disabled (private mode, quota, sandboxed iframe);
        // callers that need durability should detect this themselves.
    }
}
export function clearStoredStewardToken() {
    if (typeof window === "undefined")
        return;
    try {
        window.localStorage.removeItem(STEWARD_TOKEN_KEY);
        window.localStorage.removeItem(STEWARD_REFRESH_TOKEN_KEY);
    }
    catch {
        // ignore
    }
}
/**
 * Returns true when the non-HttpOnly `steward-authed=1` marker cookie is
 * present. The JWT cookie itself is HttpOnly, so JS uses this hint to know
 * "there is a server session" without ever touching the token.
 */
export function stewardAuthedCookieName(environment) {
    const env = environment?.trim();
    if (!env || env === "production")
        return STEWARD_AUTHED_COOKIE;
    return `${STEWARD_AUTHED_COOKIE}-${env}`;
}
function inferStewardCookieEnvironment() {
    if (typeof window === "undefined")
        return null;
    const hostname = window.location.hostname.toLowerCase();
    if (hostname === "staging.elizacloud.ai" ||
        hostname === "app-staging.elizacloud.ai" ||
        hostname === "api-staging.elizacloud.ai") {
        return "staging";
    }
    if (hostname === "dev.elizacloud.ai" ||
        hostname === "app-dev.elizacloud.ai" ||
        hostname === "api-dev.elizacloud.ai") {
        return "dev";
    }
    return null;
}
export function hasStewardAuthedCookie(environment) {
    if (typeof document === "undefined")
        return false;
    const cookieName = stewardAuthedCookieName(environment ?? inferStewardCookieEnvironment());
    return document.cookie
        .split(";")
        .some((part) => part.trim().startsWith(`${cookieName}=1`));
}
// ---------------------------------------------------------------------------
// Network helpers
// ---------------------------------------------------------------------------
async function readErrorBody(response) {
    try {
        return (await response.json());
    }
    catch {
        return null;
    }
}
/**
 * POSTs the Steward JWT (+ optional refresh token) to the session endpoint
 * so the server can set HttpOnly cookies. Throws `StewardSessionError` on
 * non-2xx; caller decides whether to wipe localStorage based on `error.code`.
 */
export async function syncStewardSession(token, refreshToken, opts = {}) {
    const endpoint = opts.endpoint ?? STEWARD_SESSION_ENDPOINT;
    const f = opts.fetchImpl ?? fetch;
    // Refresh tokens now live exclusively in the HttpOnly
    // `steward-refresh-token` cookie. We forward whatever the caller passes
    // (e.g. the value still arriving in a legacy URL fragment during the
    // rollout window) so the server can set the cookie on first login, but we
    // do NOT read it back from localStorage — that path is being removed.
    const body = {
        token,
        ...(refreshToken ? { refreshToken } : {}),
    };
    const response = await f(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const errBody = await readErrorBody(response);
        throw new StewardSessionError(errBody?.error || "Could not establish an Eliza Cloud session.", response.status, errBody?.code ?? null);
    }
    return (await response.json());
}
/**
 * POSTs the one-time OAuth code to the cloud-api nonce-exchange endpoint.
 * The route calls Steward `POST /auth/oauth/exchange` server-side, sets the
 * HttpOnly steward-token + steward-refresh-token cookies, and returns the
 * Eliza Cloud user id. Some cross-origin checkout callers may also receive a
 * browser bearer token. Throws `StewardSessionError` on non-2xx.
 */
export async function exchangeStewardCode(code, opts = {}) {
    const endpoint = opts.endpoint ?? STEWARD_NONCE_EXCHANGE_ENDPOINT;
    const f = opts.fetchImpl ?? fetch;
    const body = {
        code,
        ...(opts.redirectUri ? { redirectUri: opts.redirectUri } : {}),
        ...(opts.tenantId ? { tenantId: opts.tenantId } : {}),
        ...(opts.codeVerifier ? { codeVerifier: opts.codeVerifier } : {}),
    };
    const response = await f(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const errBody = await readErrorBody(response);
        throw new StewardSessionError(errBody?.error || "Could not complete Eliza Cloud sign-in.", response.status, errBody?.code ?? null);
    }
    return (await response.json());
}
/**
 * Best-effort DELETE of every configured session endpoint. Failures are
 * swallowed — the caller has already wiped localStorage and there's nothing
 * useful to do about a cookie that won't clear.
 */
export { buildStewardOAuthAuthorizeUrl, consumeStewardPkceVerifier, createStewardPkceChallenge, createStewardPkcePair, generateStewardPkceVerifier, storeStewardPkceVerifier, } from "./steward-oauth-pkce.js";
export function clearStewardSession(opts = {}) {
    const endpoints = opts.endpoints ?? [STEWARD_SESSION_ENDPOINT];
    const f = opts.fetchImpl ?? (typeof fetch !== "undefined" ? fetch : null);
    if (!f)
        return;
    for (const url of endpoints) {
        f(url, { method: "DELETE", credentials: "include" }).catch(() => {
            // ignore — see jsdoc
        });
    }
}
//# sourceMappingURL=index.js.map