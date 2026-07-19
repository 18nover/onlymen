/**
 * Parser for the `ELIZA_ALLOWED_HOSTS` env var into structured host patterns
 * (bare host or URL, with optional subdomain wildcards). Feeds the network
 * allow-list used to gate outbound/SSRF-sensitive requests.
 */
export type AllowedHostPattern = {
    readonly host: string;
    readonly includeSubdomains: boolean;
};
export declare function parseAllowedHostEnv(value: string | undefined): AllowedHostPattern[];
export declare function toViteAllowedHosts(entries: readonly AllowedHostPattern[]): string[];
export declare function toCapacitorAllowNavigation(entries: readonly AllowedHostPattern[]): string[];
//# sourceMappingURL=allowed-hosts.d.ts.map