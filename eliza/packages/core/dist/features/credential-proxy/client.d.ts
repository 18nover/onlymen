/**
 * Credential-proxy client (issue #11536, phase E3).
 *
 * An HMAC-signed `fetch` wrapper that mirrors `@stwd/proxy-client` semantics:
 * the caller issues a request against a REAL target URL (e.g.
 * `https://api.github.com/repos/o/r`); the client validates that target
 * against a narrow per-host allowlist (explicit host + method + path prefix),
 * signs the canonical request with the shared HMAC key, and forwards it to the
 * configured proxy with an agent-scoped bearer handle and a target header. The
 * proxy injects the real credential outbound (header-only) and returns the
 * response. The raw credential never exists on the caller side.
 *
 * SSRF posture:
 *   - The TARGET host is constrained by the route allowlist (exact host match)
 *     — the primary guard against being tricked into an unintended target.
 *   - The transport to the PROXY goes through `fetchWithSsrfGuard` so redirects
 *     and DNS-rebind are handled, with the proxy hostname explicitly allowed
 *     (the proxy is trusted operator config and is commonly a private/localhost
 *     sidecar, so the default public-only policy would wrongly block it).
 *
 * @module features/credential-proxy/client
 */
/** Canonical signing-scheme version. Bump only with a coordinated proxy change. */
export declare const CREDENTIAL_PROXY_SIGNATURE_VERSION = "v1";
export declare const CREDENTIAL_PROXY_HEADER_TARGET = "x-eliza-proxy-target";
export declare const CREDENTIAL_PROXY_HEADER_TIMESTAMP = "x-eliza-proxy-timestamp";
export declare const CREDENTIAL_PROXY_HEADER_SIGNATURE = "x-eliza-proxy-signature";
/** A single allowlisted route: an exact host + the methods + path prefix the proxy may broker. */
export interface CredentialProxyRoute {
    /** Exact hostname (lower-cased), no port. */
    host: string;
    /** Allowed HTTP methods (upper-cased). */
    methods: readonly string[];
    /** Path (not including query) must start with this prefix. */
    pathPrefix: string;
}
export interface CredentialProxyClientConfig {
    /** Proxy base URL the signed request is forwarded to. */
    url: string;
    /** Agent-scoped bearer handle (never the raw credential). */
    token: string;
    /** Optional HMAC key. When set, requests are signed; the proxy verifies. */
    signingKey?: string;
    /** Per-host allowlist. A request whose target is not covered is rejected. */
    routes: readonly CredentialProxyRoute[];
    /** Injected in tests; defaults to the SSRF-guarded transport. */
    fetchImpl?: typeof fetch;
    /** Clock hook for deterministic tests. */
    now?: () => number;
}
/** Thrown when a target URL is not covered by the route allowlist. */
export declare class CredentialProxyRouteError extends Error {
    constructor(method: string, url: string);
}
/** Build the exact canonical string that is HMAC'd. Kept dependency-free so the
 * self-contained git credential helper can reproduce it byte-for-byte. */
export declare function buildCredentialProxyCanonicalString(params: {
    method: string;
    targetHost: string;
    pathAndSearch: string;
    timestamp: string;
    bodyHash: string;
}): string;
/** Plain (un-keyed) SHA-256 hex of the request body, used in the canonical string. */
export declare function credentialProxyBodyHash(body: Uint8Array): string;
/** Sign a canonical string with the HMAC key, returning `v1=<hex>`. */
export declare function signCredentialProxyRequest(signingKey: string, canonical: string): string;
/**
 * Assert a target request is covered by the allowlist. Returns the matched
 * route or throws `CredentialProxyRouteError`. Exported for direct
 * unit-testing of the allowlist independent of the transport.
 */
export declare function assertRouteAllowed(routes: readonly CredentialProxyRoute[], method: string, target: URL): CredentialProxyRoute;
/**
 * Create a `fetch`-shaped function that routes a request against a real target
 * URL through the credential proxy. The returned function throws
 * `CredentialProxyRouteError` for off-allowlist targets before any network
 * call, and never carries the raw credential.
 */
export declare function createCredentialProxyFetch(config: CredentialProxyClientConfig): (target: string | URL, init?: RequestInit) => Promise<Response>;
//# sourceMappingURL=client.d.ts.map