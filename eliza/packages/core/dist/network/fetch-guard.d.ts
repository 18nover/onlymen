/**
 * SSRF-guarded fetch utilities.
 *
 * Provides a fetch wrapper that validates URLs and pins DNS to prevent
 * SSRF attacks and DNS rebinding.
 */
import { type LookupFn, type PinnedLookup, type SsrfPolicy } from "./ssrf.js";
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export type GuardedFetchOptions = {
    url: string;
    fetchImpl?: FetchLike;
    pinnedFetchImpl?: PinnedLookupFetchLike;
    init?: RequestInit;
    maxRedirects?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
    policy?: SsrfPolicy;
    lookupFn?: LookupFn;
};
export type PinnedLookupFetchParams = {
    url: URL;
    init: RequestInit;
    lookup: PinnedLookup;
    addresses: string[];
};
export type PinnedLookupFetchLike = (params: PinnedLookupFetchParams) => Promise<Response>;
export type GuardedFetchResult = {
    response: Response;
    finalUrl: string;
    release: () => Promise<void>;
};
/**
 * Fetch with SSRF protection.
 *
 * - Validates URL protocol (http/https only)
 * - With a `lookupFn`: resolves and pins DNS to also defend against rebinding
 * - Without a `lookupFn`: synchronous literal-host checks (blocks private/
 *   loopback/link-local IPs and internal hostnames) — usable from
 *   environment-agnostic core, but no rebinding protection
 * - Follows redirects manually, re-validating every hop
 * - Supports timeout and abort signals
 */
export declare function fetchWithSsrfGuard(params: GuardedFetchOptions): Promise<GuardedFetchResult>;
export {};
//# sourceMappingURL=fetch-guard.d.ts.map