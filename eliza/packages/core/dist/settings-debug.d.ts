/**
 * Opt-in verbose logging for settings load / change / save flows.
 * Enable with ELIZA_SETTINGS_DEBUG=1 (and Vite: same env at build time, or VITE_ELIZA_SETTINGS_DEBUG=1).
 */
/**
 * True when settings debug is enabled (Node: process.env; browser: import.meta.env from Vite define).
 */
export declare function isElizaSettingsDebugEnabled(options?: {
    /** Node / Bun process.env */
    env?: Record<string, string | undefined> | null;
    /** Vite `import.meta.env` (pass only in browser bundles). */
    importMetaEnv?: Record<string, unknown> | null;
}): boolean;
/**
 * Deep-clone-ish snapshot safe to log (secrets masked). Not for security boundaries — debug only.
 */
export declare function sanitizeForSettingsDebug(value: unknown, depth?: number, seen?: WeakSet<object>): unknown;
/** Compact cloud slice for logs (no raw secrets). */
export declare function settingsDebugCloudSummary(cloud: Record<string, unknown> | null | undefined): Record<string, unknown>;
//# sourceMappingURL=settings-debug.d.ts.map