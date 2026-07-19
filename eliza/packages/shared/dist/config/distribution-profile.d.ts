/**
 * Distribution profile — the storefront a build is targeting.
 *
 * `store` builds are submitted to the App Store / Play Store / Mac App Store /
 * MS Store and must respect their sandboxing rules. `unrestricted` is the
 * default for direct downloads and developer machines.
 *
 * Read by the capability broker so a single env flag can flip the runtime
 * into store-safe mode without touching the runtime execution mode (which
 * tracks where inference happens, not what privileges are allowed).
 */
export declare const DISTRIBUTION_PROFILES: readonly ["store", "unrestricted"];
export type DistributionProfile = (typeof DISTRIBUTION_PROFILES)[number];
export declare function isDistributionProfile(value: unknown): value is DistributionProfile;
export declare function resolveDistributionProfile(env?: NodeJS.ProcessEnv): DistributionProfile;
//# sourceMappingURL=distribution-profile.d.ts.map