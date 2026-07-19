var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
/**
 * Plugin manifest evaluation engine — decides which plugins auto-enable by
 * reading each plugin's own manifest instead of a centralized map.
 *
 * Each plugin declares its auto-enable conditions in its package.json under
 * `elizaos.plugin`, optionally pointing at a small JS module that implements
 * the actual `shouldEnable(ctx)` check:
 *
 *   {
 *     "elizaos": {
 *       "plugin": {
 *         "autoEnableModule": "./dist/auto-enable.js",
 *         "force": false,
 *         "capabilities": ["text-large", "tool-use"]
 *       }
 *     }
 *   }
 *
 * The check module exports:
 *
 *   export function shouldEnable(ctx: PluginAutoEnableContext): boolean | Promise<boolean>;
 *   export function shouldForce?(ctx: PluginAutoEnableContext): boolean;  // optional override
 *
 * The engine walks candidate plugin packages, reads each package.json for the
 * elizaos.plugin block, dynamic-imports the autoEnableModule, evaluates
 * shouldEnable + shouldForce against the runtime context, and returns a verdict
 * per plugin (never throwing — failures surface in the verdict's `error`).
 *
 * This replaces the centralized maps in plugin-auto-enable-engine.ts. Both
 * engines coexist during the migration: the new one runs first, the old one
 * fills gaps for plugins that haven't migrated yet. When all plugins ship a
 * manifest, the central maps and the old engine can be deleted.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
function assertPackageJsonObject(value, packageRoot) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`invalid package.json object at ${packageRoot}`);
    }
}
/**
 * Derive the short id used for `plugins.allow` and `plugins.entries` lookups.
 * Mirrors the logic in plugin-auto-enable-engine.addToAllowlist.
 */
export function pluginShortId(packageName) {
    return packageName.includes("/plugin-")
        ? packageName.slice(packageName.lastIndexOf("/plugin-") + "/plugin-".length)
        : packageName;
}
/**
 * Read `package.json` for a candidate and extract the elizaos.plugin block.
 * Returns null when no package.json exists or it doesn't declare an elizaos.plugin block.
 */
export async function readPluginPackageManifest(packageRoot) {
    let raw;
    try {
        raw = await fs.readFile(path.join(packageRoot, "package.json"), "utf8");
    }
    catch (err) {
        if (err.code === "ENOENT")
            return null;
        throw err;
    }
    const parsed = JSON.parse(raw);
    assertPackageJsonObject(parsed, packageRoot);
    if (!parsed.elizaos?.plugin)
        return null;
    return parsed;
}
const CHECK_MODULE_CACHE = new Map();
/**
 * Dynamic-import the check module declared by a manifest. Cached per absolute
 * module path so re-evaluation across multiple boots in the same process
 * (e.g. test suites) doesn't re-import.
 */
async function loadCheckModule(packageRoot, modulePath) {
    const absolute = path.resolve(packageRoot, modulePath);
    const cached = CHECK_MODULE_CACHE.get(absolute);
    if (cached === "missing")
        return null;
    if (cached)
        return cached;
    try {
        await fs.access(absolute);
    }
    catch {
        CHECK_MODULE_CACHE.set(absolute, "missing");
        return null;
    }
    const url = pathToFileURL(absolute).href;
    // Dynamic file:// import — Vite's static analyzer flags this on the client
    // bundle even though the engine only runs server-side at boot. Suppress.
    const mod = (await import(__rewriteRelativeImportExtension(
    /* @vite-ignore */ url)));
    // Accept both named and default exports — `export function shouldEnable`
    // and `export default { shouldEnable }` both work.
    const resolved = typeof mod.shouldEnable === "function"
        ? { shouldEnable: mod.shouldEnable, shouldForce: mod.shouldForce }
        : typeof mod.default?.shouldEnable === "function"
            ? {
                shouldEnable: mod.default.shouldEnable,
                shouldForce: mod.default.shouldForce,
            }
            : null;
    if (!resolved) {
        CHECK_MODULE_CACHE.set(absolute, "missing");
        return null;
    }
    CHECK_MODULE_CACHE.set(absolute, resolved);
    return resolved;
}
/**
 * Evaluate one candidate's manifest against the runtime context. Pure
 * verdict — caller decides how to apply it to the allow list / force overrides.
 */
export async function evaluatePluginManifest(candidate, ctx) {
    const manifest = await readPluginPackageManifest(candidate.packageRoot);
    if (!manifest)
        return null;
    const block = manifest.elizaos?.plugin ?? {};
    const shortId = pluginShortId(candidate.packageName);
    const capabilities = Array.isArray(block.capabilities)
        ? block.capabilities.filter((c) => typeof c === "string")
        : [];
    if (!block.autoEnableModule) {
        // Manifest exists but no check module — treat as not-auto-enabled (the
        // plugin can still be enabled via explicit user config). Still surface
        // declared capabilities.
        return {
            packageName: candidate.packageName,
            shortId,
            enabled: false,
            force: block.force === true,
            capabilities,
            reason: null,
            error: null,
        };
    }
    let module;
    try {
        module = await loadCheckModule(candidate.packageRoot, block.autoEnableModule);
    }
    catch (err) {
        return {
            packageName: candidate.packageName,
            shortId,
            enabled: false,
            force: block.force === true,
            capabilities,
            reason: null,
            error: `failed to import autoEnableModule "${block.autoEnableModule}": ${err instanceof Error ? err.message : String(err)}`,
        };
    }
    if (!module) {
        return {
            packageName: candidate.packageName,
            shortId,
            enabled: false,
            force: block.force === true,
            capabilities,
            reason: null,
            error: `autoEnableModule "${block.autoEnableModule}" did not export a shouldEnable function`,
        };
    }
    let enabled;
    try {
        enabled = Boolean(await module.shouldEnable(ctx));
    }
    catch (err) {
        return {
            packageName: candidate.packageName,
            shortId,
            enabled: false,
            force: block.force === true,
            capabilities,
            reason: null,
            error: `shouldEnable threw: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
    let force = block.force === true;
    if (module.shouldForce) {
        try {
            force = force || Boolean(module.shouldForce(ctx));
        }
        catch {
            // Treat predicate failure as "no force" — don't escalate.
            force = block.force === true;
        }
    }
    return {
        packageName: candidate.packageName,
        shortId,
        enabled,
        force,
        capabilities,
        reason: enabled || force
            ? `manifest: ${candidate.packageName}/${block.autoEnableModule}`
            : null,
        error: null,
    };
}
/**
 * Evaluate every candidate. Verdicts come back in the same order as the input.
 * Failures are reported in the verdict's `error` field — this function never
 * throws so a single bad manifest can't kill auto-enable for the rest.
 */
export async function evaluatePluginManifests(candidates, ctx) {
    return Promise.all(candidates.map(async (candidate) => {
        try {
            return await evaluatePluginManifest(candidate, ctx);
        }
        catch (err) {
            return {
                packageName: candidate.packageName,
                shortId: pluginShortId(candidate.packageName),
                enabled: false,
                force: false,
                capabilities: [],
                reason: null,
                error: `manifest read failed: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    })).then((entries) => entries.filter((v) => v !== null));
}
/**
 * Apply manifest verdicts to a config: push enabled plugins onto
 * `plugins.allow` (with the short id and full package name), set
 * `plugins.entries[shortId].enabled = true` for forced ones, and append
 * human-readable strings to `changes` for log surfacing.
 */
export function applyPluginManifestVerdicts(config, verdicts, changes) {
    config.plugins = config.plugins ?? {};
    const pluginsConfig = config.plugins;
    pluginsConfig.allow = pluginsConfig.allow ?? [];
    pluginsConfig.entries = pluginsConfig.entries ?? {};
    for (const verdict of verdicts) {
        if (verdict.error) {
            changes.push(`Plugin auto-enable error for ${verdict.packageName}: ${verdict.error}`);
            continue;
        }
        if (!verdict.enabled && !verdict.force)
            continue;
        const explicitlyDisabled = pluginsConfig.entries[verdict.shortId]?.enabled === false;
        if (explicitlyDisabled && !verdict.force) {
            // User explicitly disabled — respect that unless force is set.
            continue;
        }
        if (verdict.force && explicitlyDisabled) {
            pluginsConfig.entries[verdict.shortId] = {
                ...pluginsConfig.entries[verdict.shortId],
                enabled: true,
            };
        }
        let added = false;
        if (!pluginsConfig.allow.includes(verdict.shortId)) {
            pluginsConfig.allow.push(verdict.shortId);
            added = true;
        }
        if (verdict.packageName !== verdict.shortId &&
            !pluginsConfig.allow.includes(verdict.packageName)) {
            pluginsConfig.allow.push(verdict.packageName);
            added = true;
        }
        if (added && verdict.reason) {
            changes.push(`Auto-enabled plugin: ${verdict.packageName} (${verdict.reason})`);
        }
    }
}
//# sourceMappingURL=plugin-manifest.js.map