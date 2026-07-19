/**
 * App-level plugin manifest helpers. A host app declares which plugins it
 * considers candidates and how they default in its own package.json under an
 * `elizaos.app` block (AppManifestBlock below documents the exact shape).
 *
 * The plugin auto-enable engine consumes that block at boot:
 *   - `candidates` restricts the discovered plugin list to an allow-list; an
 *     app that doesn't list a plugin won't load it even if that plugin's own
 *     auto-enable would match.
 *   - `defaults` prepopulates `config.plugins.entries` with `{ enabled }` flags
 *     before the manifest evaluator runs, so a user's saved config still wins.
 *   - `capabilities` is informational — surfaced via the verdict so UIs can
 *     warn when a required capability isn't satisfied by any enabled plugin.
 *
 * An app that declares no `elizaos.app` block is unrestricted: every discovered
 * plugin is a candidate and no defaults are applied.
 */
import type { PluginManifestCandidate } from "./plugin-manifest.js";
/** Default to apply for a plugin entry. */
export interface PluginAppDefault {
    /** When false, the plugin is disabled by default unless the user enables it. */
    enabled?: boolean;
}
/** Capability requirement level declared by the app. */
export type AppCapabilityRequirement = "required" | "optional";
export interface AppManifestBlock {
    /**
     * If set, the plugin candidate list is restricted to this set. Plugins
     * outside this list are ignored even if they declare auto-enable in their
     * own package.json.
     *
     * Match by either npm package name (`@elizaos/plugin-X`) or the short id
     * (`X`). Both forms accepted.
     */
    candidates?: string[];
    /**
     * Per-plugin defaults. Keyed by short id OR full package name. Applied to
     * `config.plugins.entries` before the manifest evaluator runs — so the
     * user's saved config still wins, but plugin-specific app defaults take
     * effect on first boot.
     */
    defaults?: Record<string, PluginAppDefault>;
    /**
     * Capability declarations the app expects to be available. Currently
     * informational — surfaced by `readAppManifest` so UIs can warn when a
     * required capability isn't satisfied by any enabled plugin.
     */
    capabilities?: Record<string, AppCapabilityRequirement>;
}
export interface AppPackageManifest {
    name: string;
    version?: string;
    elizaos?: {
        app?: AppManifestBlock;
    };
}
/**
 * Read the host app's package.json and extract the `elizaos.app` block.
 * Returns null when no package.json is found at `appRoot` or when the file
 * has no `elizaos.app` block.
 *
 * Caller decides where the host app lives — typically `process.cwd()` or
 * `ELIZA_WORKSPACE_ROOT`. Walking up the tree to find an enclosing
 * `package.json` is *not* done here on purpose: the host app is an explicit
 * concept and we want exactly the package.json the user named, not whatever
 * happens to be one or two levels up.
 */
export declare function readAppManifest(appRoot: string): Promise<AppManifestBlock | null>;
/**
 * Restrict a candidate list to the ones declared in the app manifest.
 * When `manifest.candidates` is undefined or empty, returns the input
 * unchanged (no app-level restriction).
 *
 * Match is by package name OR short id — apps can list either form.
 */
export declare function filterCandidatesByAppManifest(candidates: PluginManifestCandidate[], manifest: AppManifestBlock | null): PluginManifestCandidate[];
/**
 * Pre-populate `config.plugins.entries` from the app manifest defaults.
 * User-set entries (already present in `config.plugins.entries`) win — the
 * defaults only fill in keys the user hasn't explicitly set.
 *
 * Mutates `config` in place. Returns the list of entries that were defaulted
 * (for log surfacing).
 */
export declare function applyAppManifestDefaults(config: {
    plugins?: {
        entries?: Record<string, {
            enabled?: boolean;
        }>;
    };
}, manifest: AppManifestBlock | null): string[];
//# sourceMappingURL=app-manifest.d.ts.map