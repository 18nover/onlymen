/**
 * Environment variable normalization helpers.
 *
 * Consolidates the `normalizeSecret` / `normalizeEnvValue` pattern that was
 * independently implemented in cloud connection, steward bridge, and wallet
 * trade helpers.
 */
/**
 * Normalize an env value: trim whitespace, return `undefined` for empty/missing.
 * Accepts `unknown` so callers don't need to narrow first (useful for config objects).
 */
export declare function normalizeEnvValue(value: unknown): string | undefined;
/**
 * Same as `normalizeEnvValue` but returns `null` instead of `undefined`.
 * Convenient when building option objects where `null` means "absent".
 */
export declare function normalizeEnvValueOrNull(value: unknown): string | null;
/**
 * Returns `true` if a boolean-ish env var is falsy (`"0"`, `"false"`, `"off"`, `"no"`).
 * Missing or empty values return `false` (i.e. the feature is enabled by default).
 */
export declare function isEnvDisabled(value: string | undefined): boolean;
export declare const DEFAULT_APP_ROUTE_PLUGIN_MODULES: string[];
export interface SyncElizaEnvAliasOptions {
    brandedPrefix?: string;
    cloudManagedAgentsApiSegment?: string;
    appRoutePluginModules?: readonly string[];
}
/**
 * Read an env value resolving brand<->eliza aliases from the immutable
 * BootConfig, WITHOUT mutating `process.env` (arch-audit #12251).
 *
 * Thin wrapper over core's {@link resolveAliasedEnvValue} that pins the alias
 * table to `getBootConfig().envAliases` and normalizes the result via
 * {@link normalizeEnvValue} (trim + empty -> undefined), so read sites get the
 * same trimmed-or-undefined contract as a normalized `process.env.<key>` read.
 * This is the sole brand<->eliza env-resolution path — the old sync mutation
 * was removed in #13423.
 */
export declare function readAliasedEnv(key: string): string | undefined;
/**
 * Build/launch-time env normalization for a white-label app bundle, run from
 * `apps/app/vite.config.ts` BEFORE any BootConfig alias table exists (config
 * eval and the dev orchestrator seed ports off `process.env`, and the port
 * resolvers in `runtime-env.ts` only alias-resolve once a BootConfig is set).
 *
 * It copies a brand `<PREFIX>_*` value into its `ELIZA_*` partner only when the
 * partner is unset, then seeds two `ELIZA_*` defaults. Unlike the deleted
 * runtime alias-sync mutation (#13423), this runs exactly once at build/launch
 * on the host process — the agent runtime resolves brand aliases through the
 * BootConfig reader ({@link readAliasedEnv}) and never mutates `process.env`.
 */
export declare function syncElizaEnvAliases(options?: SyncElizaEnvAliasOptions): void;
//# sourceMappingURL=env.d.ts.map