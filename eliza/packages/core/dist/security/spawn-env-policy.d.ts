/**
 * Block dangerous env keys from child process spawns (GHSA-54rx class).
 * Shared by shell, MCP, and other spawn paths.
 */
/**
 * Single source of truth for the spawn/MCP env denylist. Consumers that need
 * the raw data (e.g. the agent's MCP config validator) import these directly so
 * the lists cannot drift between the shell/spawn and MCP paths.
 */
export declare const BLOCKED_SPAWN_ENV_KEYS: ReadonlySet<string>;
export declare const BLOCKED_SPAWN_ENV_PREFIXES: readonly ["NPM_CONFIG_", "PNPM_", "YARN_", "BUN_CONFIG_", "UV_", "PIP_", "PIPX_", "PYX_", "DENO_", "DOCKER_", "PODMAN_", "BASH_FUNC_"];
export declare function isBlockedSpawnEnvKey(key: string): boolean;
export declare function sanitizeSpawnEnv(env: Record<string, string | undefined>): Record<string, string | undefined>;
//# sourceMappingURL=spawn-env-policy.d.ts.map