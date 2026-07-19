import type { PluginAutoEnableContext, PluginAutoEnableModule } from "@elizaos/core";
import type { ElizaConfig } from "./types.eliza.js";
export type { PluginAutoEnableContext, PluginAutoEnableModule };
/** Subset of package.json the manifest reader cares about. */
export interface PluginPackageManifestBlock {
    /**
     * Path (relative to the plugin's package root) to the autoEnable check module.
     * The module must implement {@link PluginAutoEnableModule}.
     */
    autoEnableModule?: string;
    /**
     * Static capability declarations. Apps can use these to filter candidates
     * (e.g. "I only need plugins that declare `wallet` capability"). Purely
     * informational — the engine doesn't act on them today.
     */
    capabilities?: string[];
    /**
     * Hard-coded force flag. When true, the plugin overrides
     * `config.plugins.entries[X].enabled === false`. Equivalent to a
     * `shouldForce` that always returns true; useful when force is unconditional.
     */
    force?: boolean;
}
export interface PluginPackageManifest {
    name: string;
    version?: string;
    elizaos?: {
        plugin?: PluginPackageManifestBlock;
    };
}
/**
 * Minimal candidate shape for the autoEnable manifest evaluator.
 *
 * This is intentionally narrower than `PluginCandidate` in @elizaos/core —
 * the manifest evaluator only needs the package name and root dir; the richer
 * `PluginCandidate` shape with `idHint`, `source`, `origin`, etc. is for the
 * full plugin discovery / loading pipeline.
 */
export interface PluginManifestCandidate {
    /** npm package name (e.g. "@elizaos/plugin-anthropic"). */
    packageName: string;
    /** Absolute path to the package root (the dir containing package.json). */
    packageRoot: string;
}
/** Verdict for a single candidate after evaluating its manifest. */
export interface PluginManifestVerdict {
    packageName: string;
    /** Short id derived from the package name, e.g. "anthropic" for "@elizaos/plugin-anthropic". */
    shortId: string;
    /** True when shouldEnable() returned truthy. */
    enabled: boolean;
    /** True when shouldForce() returned truthy or `manifest.force === true`. */
    force: boolean;
    /** Capabilities declared in package.json. */
    capabilities: string[];
    /** Human-readable reason for the verdict — used for `[eliza] Plugin auto-enable: ...` log lines. */
    reason: string | null;
    /** When non-null the manifest existed but the check module failed to load/run; the plugin is treated as not-enabled. */
    error: string | null;
}
/**
 * Derive the short id used for `plugins.allow` and `plugins.entries` lookups.
 * Mirrors the logic in plugin-auto-enable-engine.addToAllowlist.
 */
export declare function pluginShortId(packageName: string): string;
/**
 * Read `package.json` for a candidate and extract the elizaos.plugin block.
 * Returns null when no package.json exists or it doesn't declare an elizaos.plugin block.
 */
export declare function readPluginPackageManifest(packageRoot: string): Promise<PluginPackageManifest | null>;
/**
 * Evaluate one candidate's manifest against the runtime context. Pure
 * verdict — caller decides how to apply it to the allow list / force overrides.
 */
export declare function evaluatePluginManifest(candidate: PluginManifestCandidate, ctx: PluginAutoEnableContext): Promise<PluginManifestVerdict | null>;
/**
 * Evaluate every candidate. Verdicts come back in the same order as the input.
 * Failures are reported in the verdict's `error` field — this function never
 * throws so a single bad manifest can't kill auto-enable for the rest.
 */
export declare function evaluatePluginManifests(candidates: PluginManifestCandidate[], ctx: PluginAutoEnableContext): Promise<PluginManifestVerdict[]>;
/**
 * Apply manifest verdicts to a config: push enabled plugins onto
 * `plugins.allow` (with the short id and full package name), set
 * `plugins.entries[shortId].enabled = true` for forced ones, and append
 * human-readable strings to `changes` for log surfacing.
 */
export declare function applyPluginManifestVerdicts(config: Partial<ElizaConfig>, verdicts: PluginManifestVerdict[], changes: string[]): void;
//# sourceMappingURL=plugin-manifest.d.ts.map