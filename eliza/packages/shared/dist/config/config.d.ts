/**
 * Backward-compatibility shims for elizaOS cloud configuration: re-exports the
 * `ElizaConfig` type and provides the legacy "cloud.enabled" → `providers[]`
 * migration helpers. `migrateCloudEnabledToProviders` upgrades an old config
 * that set `cloud.enabled` into the modern representation (an "elizacloud"
 * entry in `providers`); `isCloudActiveFromProviders` reports whether that
 * entry is present.
 */
export type { ElizaConfig } from "./types.eliza.js";
export interface LegacyCloudConfig {
    cloud?: {
        enabled?: boolean;
    } | null;
    providers?: string[];
    [key: string]: unknown;
}
export declare function isCloudActiveFromProviders(providers: string[] | undefined | null): boolean;
export declare function migrateCloudEnabledToProviders(config: LegacyCloudConfig): LegacyCloudConfig;
//# sourceMappingURL=config.d.ts.map