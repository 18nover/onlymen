/**
 * SSRF (Server-Side Request Forgery) protection utilities.
 *
 * Provides DNS pinning and IP address validation to prevent SSRF attacks
 * when fetching external resources.
 */
export type LookupAddress = {
    address: string;
    family: number;
};
export type LookupCallback = (err: Error | null, address: string | LookupAddress[], family?: number) => void;
export type LookupFn = (hostname: string, options: {
    all: true;
}) => Promise<LookupAddress[]>;
export type LookupOptions = number | {
    all?: boolean;
    family?: number;
};
export type PinnedLookup = {
    (hostname: string, callback: LookupCallback): void;
    (hostname: string, options: LookupOptions, callback: LookupCallback): void;
};
export declare class SsrfBlockedError extends Error {
    constructor(message: string);
}
export type SsrfPolicy = {
    allowPrivateNetwork?: boolean;
    allowedHostnames?: string[];
};
/**
 * Check if an IP address is private/internal.
 */
export declare function isPrivateIpAddress(address: string): boolean;
/**
 * Check if a hostname should be blocked (localhost, internal domains).
 */
export declare function isBlockedHostname(hostname: string): boolean;
/**
 * Create a DNS lookup function that pins to specific resolved addresses.
 */
export declare function createPinnedLookup(params: {
    hostname: string;
    addresses: string[];
    fallback?: PinnedLookup;
}): PinnedLookup;
export type PinnedHostname = {
    hostname: string;
    addresses: string[];
    lookup: PinnedLookup;
};
/**
 * Resolve a hostname with SSRF policy enforcement.
 */
export declare function resolvePinnedHostnameWithPolicy(hostname: string, params?: {
    lookupFn?: LookupFn;
    policy?: SsrfPolicy;
}): Promise<PinnedHostname>;
/**
 * Resolve a hostname and pin DNS to prevent TOCTOU attacks.
 */
export declare function resolvePinnedHostname(hostname: string, lookupFn?: LookupFn): Promise<PinnedHostname>;
/**
 * Assert that a hostname resolves to a public IP address.
 */
export declare function assertPublicHostname(hostname: string, lookupFn?: LookupFn): Promise<void>;
//# sourceMappingURL=ssrf.d.ts.map