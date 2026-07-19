/**
 * Network-policy helpers for normalizing host-like values and blocking private/link-local IPs.
 */
export declare function normalizeHostLike(value: string): string;
export declare function decodeIpv6MappedHex(mapped: string): string | null;
export declare function normalizeIpForPolicy(ip: string): string;
export declare function isBlockedPrivateOrLinkLocalIp(ip: string): boolean;
export declare function isLoopbackHost(host: string): boolean;
//# sourceMappingURL=network-policy.d.ts.map