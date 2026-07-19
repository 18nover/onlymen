/**
 * Eliza state-dir resolution.
 *
 * Canonical precedence (highest first):
 *   1. `ELIZA_STATE_DIR`
 *   2. `$XDG_STATE_HOME/${ELIZA_NAMESPACE ?? "eliza"}`
 *   3. `<homedir>/.local/state/${ELIZA_NAMESPACE ?? "eliza"}`
 *
 * Every caller that touches persisted user state (skills, training,
 * optimized prompts, counters, credentials) must go through
 * `resolveStateDir()` so the precedence is enforced in one place.
 *
 * Uses `os.homedir()` rather than `process.env.HOME` so resolution works
 * on Windows where `HOME` is not normally set, and so that under macOS
 * App Sandbox / Windows AppContainer / Flatpak the OS-redirected home
 * already lands paths in the per-app sandboxed data directory.
 */
/** Expand a leading `~` segment and resolve to an absolute path. */
export declare function resolveUserPath(input: string): string;
/**
 * Resolve the active namespace used to derive the default state directory
 * (`$XDG_STATE_HOME/${namespace}`). Defaults to `"eliza"`.
 */
export declare function getElizaNamespace(env?: NodeJS.ProcessEnv): string;
/**
 * Resolve the per-user state directory, honoring the documented precedence:
 * `ELIZA_STATE_DIR` > `$XDG_STATE_HOME/<namespace>` > `~/.local/state/<namespace>`.
 */
export declare function resolveStateDir(env?: NodeJS.ProcessEnv, getHome?: () => string): string;
/**
 * Resolve the OAuth credentials directory. Honors `ELIZA_OAUTH_DIR`;
 * otherwise falls back to `<state-dir>/credentials`.
 */
export declare function resolveOAuthDir(env?: NodeJS.ProcessEnv, stateDirPath?: string): string;
/**
 * Recursively copy `fromPath` into `toPath`. Idempotent — re-runs are safe.
 * No-op when the source does not exist. Used by the user-initiated
 * "import from direct build" flow to migrate state into a sandboxed
 * store-build state directory.
 */
export declare function migrateStateDir(fromPath: string, toPath: string): Promise<{
    migrated: boolean;
}>;
//# sourceMappingURL=state-dir.d.ts.map