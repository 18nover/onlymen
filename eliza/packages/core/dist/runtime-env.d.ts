/**
 * Resolves the HTTP API server's environment configuration from a
 * `RuntimeEnvRecord` (defaulting to `process.env`): bind host, auth token,
 * allowed origins/hosts, null-origin policy, and the desktop / single-process /
 * UI port precedence. The API host and boot helpers read through these resolvers
 * rather than touching `process.env` directly, so one set of precedence and
 * alias rules (e.g. `ELIZA_API_PORT` then `ELIZA_PORT`) applies everywhere.
 *
 * Also classifies a bind host as loopback vs wildcard — the signal for whether
 * an auth token must be present before binding to a public interface — and
 * detects mobile (`ELIZA_PLATFORM=android|ios`) embeddings where host
 * capabilities that shell out are unavailable.
 */
export declare const DEFAULT_SERVER_ONLY_PORT = 2138;
export declare const DEFAULT_DESKTOP_API_PORT = 31337;
export declare const DEFAULT_DESKTOP_UI_PORT = 2138;
export type RuntimeEnvRecord = Record<string, string | undefined>;
export interface ResolvedRuntimePorts {
    serverOnlyPort: number;
    desktopApiPort: number;
    desktopUiPort: number;
}
export interface ResolvedApiSecurityConfig {
    bindHost: string;
    token: string | null;
    disableAutoApiToken: boolean;
    allowedOrigins: string[];
    allowedHosts: string[];
    allowNullOrigin: boolean;
    isLoopbackBind: boolean;
    isWildcardBind: boolean;
}
export interface ElizaRuntimeEnv {
    apiBind: string;
    apiToken: string | undefined;
    allowedOrigins: string[];
    allowedHosts: string[];
    allowNullOrigin: boolean;
    disableAutoApiToken: boolean;
    desktopApiPort: number;
    singleProcessPort: number;
    uiPort: number;
}
export declare const ELIZA_RUNTIME_ENV_KEYS: {
    readonly apiBind: readonly ["ELIZA_API_BIND"];
    readonly apiToken: readonly ["ELIZA_API_TOKEN"];
    readonly allowedOrigins: readonly ["ELIZA_ALLOWED_ORIGINS", "CORS_ORIGINS"];
    readonly allowedHosts: readonly ["ELIZA_ALLOWED_HOSTS"];
    readonly allowNullOrigin: readonly ["ELIZA_ALLOW_NULL_ORIGIN"];
    readonly disableAutoApiToken: readonly ["ELIZA_DISABLE_AUTO_API_TOKEN"];
    readonly desktopApiPort: readonly ["ELIZA_API_PORT", "ELIZA_PORT"];
    readonly singleProcessPort: readonly ["ELIZA_PORT", "ELIZA_UI_PORT"];
    readonly desktopUiPort: readonly ["ELIZA_UI_PORT"];
};
/** First key in `keys` with a non-empty trimmed string value. */
export declare function firstWinningEnvString(env: RuntimeEnvRecord, keys: readonly string[]): {
    key: string;
    value: string;
} | null;
export interface PortPreferenceResolution {
    port: number;
    sourceLabel: string;
    changeLabel: string;
    winningKey: string | null;
}
/** Preferred desktop API port from env precedence (before loopback reallocation). */
export declare function resolveDesktopApiPortPreference(env?: RuntimeEnvRecord): PortPreferenceResolution;
/** Preferred dashboard UI port from ELIZA_UI_PORT (Vite dev), before reallocation. */
export declare function resolveDesktopUiPortPreference(env?: RuntimeEnvRecord): PortPreferenceResolution;
export declare function stripOptionalHostPort(value: string): string;
export declare function isLoopbackBindHost(host: string): boolean;
export declare function isWildcardBindHost(host: string): boolean;
export declare function resolveRuntimePorts(env?: RuntimeEnvRecord): ResolvedRuntimePorts;
export declare function resolveServerOnlyPort(env?: RuntimeEnvRecord): number;
export declare function resolveDesktopApiPort(env?: RuntimeEnvRecord): number;
export declare function resolveDesktopUiPort(env?: RuntimeEnvRecord): number;
export declare function resolveSingleProcessPort(env?: RuntimeEnvRecord): number;
export declare function resolveUiPort(env?: RuntimeEnvRecord): number;
export declare function resolveApiSecurityConfig(env?: RuntimeEnvRecord): ResolvedApiSecurityConfig;
export declare function resolveApiBindHost(env?: RuntimeEnvRecord): string;
export declare function resolveApiToken(env?: RuntimeEnvRecord): string | null;
export declare function resolveConfiguredApiToken(env?: RuntimeEnvRecord): string | undefined;
export declare function resolveAllowedOrigins(env?: RuntimeEnvRecord): string[];
export declare function resolveApiAllowedOrigins(env?: RuntimeEnvRecord): string[];
export declare function resolveAllowedHosts(env?: RuntimeEnvRecord): string[];
export declare function resolveApiAllowedHosts(env?: RuntimeEnvRecord): string[];
export declare function isNullOriginAllowed(env?: RuntimeEnvRecord): boolean;
export declare function resolveAllowNullOrigin(env?: RuntimeEnvRecord): boolean;
export declare function resolveDisableAutoApiToken(env?: RuntimeEnvRecord): boolean;
export declare function setApiToken(env: RuntimeEnvRecord | undefined, token: string): void;
export declare function syncResolvedApiPort(env: RuntimeEnvRecord | undefined, actualPort: number, opts?: {
    overwriteUiPort?: boolean;
}): void;
export declare function isMobilePlatform(env?: RuntimeEnvRecord): boolean;
export declare function isAndroidMobile(env?: RuntimeEnvRecord): boolean;
export declare function resolveElizaRuntimeEnv(env?: RuntimeEnvRecord): ElizaRuntimeEnv;
//# sourceMappingURL=runtime-env.d.ts.map