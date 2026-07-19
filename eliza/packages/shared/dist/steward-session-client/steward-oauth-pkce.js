/**
 * Steward OAuth PKCE helpers (RFC 7636).
 *
 * Steward's `/auth/oauth/:provider/authorize` requires a S256 `code_challenge`
 * when `response_type=code`. Mint a verifier/challenge pair, send the challenge
 * at /authorize, stash the verifier in browser storage, and replay it at
 * /exchange via {@link exchangeStewardCode}.
 */
const STEWARD_PKCE_VERIFIER_STORAGE_KEY = "steward.oauth.pkce.verifier";
const STEWARD_PKCE_VERIFIER_TTL_MS = 10 * 60 * 1000;
const PKCE_VERIFIER_BYTES = 48;
function base64UrlEncode(bytes) {
    let binary = "";
    for (const byte of bytes)
        binary += String.fromCharCode(byte);
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
export function generateStewardPkceVerifier() {
    const bytes = new Uint8Array(PKCE_VERIFIER_BYTES);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes);
}
export async function createStewardPkceChallenge(verifier) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return base64UrlEncode(new Uint8Array(digest));
}
export async function createStewardPkcePair() {
    const verifier = generateStewardPkceVerifier();
    const challenge = await createStewardPkceChallenge(verifier);
    return { verifier, challenge };
}
export function storeStewardPkceVerifier(verifier) {
    if (typeof window === "undefined")
        return false;
    const stored = JSON.stringify({
        verifier,
        expiresAt: Date.now() + STEWARD_PKCE_VERIFIER_TTL_MS,
    });
    let storedAnywhere = false;
    try {
        window.sessionStorage.setItem(STEWARD_PKCE_VERIFIER_STORAGE_KEY, stored);
        storedAnywhere = true;
    }
    catch {
        // private mode / disabled storage
    }
    try {
        window.localStorage.setItem(STEWARD_PKCE_VERIFIER_STORAGE_KEY, stored);
        storedAnywhere = true;
    }
    catch {
        // same as above
    }
    return storedAnywhere;
}
export function consumeStewardPkceVerifier() {
    if (typeof window === "undefined")
        return null;
    const sessionVerifier = consumeStoredPkceVerifier(window.sessionStorage);
    const localVerifier = consumeStoredPkceVerifier(window.localStorage);
    return sessionVerifier ?? localVerifier;
}
function consumeStoredPkceVerifier(storage) {
    try {
        const verifier = storage.getItem(STEWARD_PKCE_VERIFIER_STORAGE_KEY);
        storage.removeItem(STEWARD_PKCE_VERIFIER_STORAGE_KEY);
        return parseStoredPkceVerifier(verifier);
    }
    catch {
        // error-policy:J4 web storage unavailable -> no verifier
        return null;
    }
}
function parseStoredPkceVerifier(value) {
    if (!value)
        return null;
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed.verifier === "string" &&
            typeof parsed.expiresAt === "number" &&
            parsed.expiresAt >= Date.now()) {
            return parsed.verifier;
        }
        return null;
    }
    catch {
        return value;
    }
}
export function buildStewardOAuthAuthorizeUrl(provider, redirectUri, options) {
    const params = new URLSearchParams({
        redirect_uri: redirectUri,
        tenant_id: options.stewardTenantId ?? "elizacloud",
        response_type: "code",
    });
    if (options.codeChallenge) {
        params.set("code_challenge", options.codeChallenge);
        params.set("code_challenge_method", "S256");
    }
    const stewardApiUrl = options.stewardApiUrl.replace(/\/+$/, "");
    return `${stewardApiUrl}/auth/oauth/${provider}/authorize?${params.toString()}`;
}
//# sourceMappingURL=steward-oauth-pkce.js.map