/**
 * Sealed in-process secret store for cloud credentials.
 *
 * Cloud API keys are scrubbed from process.env after login and stored
 * here so they are not visible in environment dumps, child processes,
 * or /proc/self/environ.
 *
 * This module has NO external dependencies so it can be imported by
 * any module without pulling in host-layer packages.
 */
/**
 * Read a cloud secret without exposing it in process.env.
 * Falls back to process.env for backwards compatibility with code that
 * sets the key before this module loads (e.g. docker entrypoints).
 */
export declare function getCloudSecret(key: "ELIZAOS_CLOUD_API_KEY" | "ELIZAOS_CLOUD_ENABLED"): string | undefined;
/** Scrub cloud secrets from process.env and capture into the sealed store. */
export declare function scrubCloudSecretsFromEnv(): void;
/** Clear any sealed cloud secrets after an explicit disconnect. */
export declare function clearCloudSecrets(): void;
/** Reset the sealed secret store. Test-only. */
export declare function _resetCloudSecretsForTesting(): void;
//# sourceMappingURL=cloud-secrets.d.ts.map