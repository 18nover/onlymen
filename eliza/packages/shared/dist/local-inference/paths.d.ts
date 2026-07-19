/**
 * Path resolution for the local-inference service.
 *
 * All Eliza-owned files live under `<state-dir>/local-inference/` to match
 * the convention established by `plugin-installer.ts` and the rest of
 * app-core. We never write to paths outside of this root.
 *
 * `<state-dir>` follows the canonical `ELIZA_STATE_DIR` > XDG state
 * precedence;
 * on AOSP, `ELIZA_STATE_DIR` is set by `ElizaAgentService.java` to
 * `/data/data/<pkg>/files/.eliza` so models land at
 * `<that>/local-inference/models/` and not under a stray homedir-derived
 * path.
 */
export declare function localInferenceRoot(): string;
/** Directory for models Eliza downloaded itself. Safe to delete. */
export declare function elizaModelsDir(): string;
/** JSON file tracking installed-model metadata (downloaded + discovered). */
export declare function registryPath(): string;
/** Partial-download staging directory; files here are resume candidates. */
export declare function downloadsStagingDir(): string;
/** True when `target` is inside Eliza's local-inference root. */
export declare function isWithinElizaRoot(target: string): boolean;
//# sourceMappingURL=paths.d.ts.map