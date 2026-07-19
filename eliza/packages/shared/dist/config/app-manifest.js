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
import { promises as fs } from "node:fs";
import path from "node:path";
function assertPackageJsonObject(value, appRoot) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`invalid package.json object at ${appRoot}`);
    }
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
export async function readAppManifest(appRoot) {
    let raw;
    try {
        raw = await fs.readFile(path.join(appRoot, "package.json"), "utf8");
    }
    catch (err) {
        if (err.code === "ENOENT")
            return null;
        throw err;
    }
    const parsed = JSON.parse(raw);
    assertPackageJsonObject(parsed, appRoot);
    return parsed.elizaos?.app ?? null;
}
/**
 * Restrict a candidate list to the ones declared in the app manifest.
 * When `manifest.candidates` is undefined or empty, returns the input
 * unchanged (no app-level restriction).
 *
 * Match is by package name OR short id — apps can list either form.
 */
export function filterCandidatesByAppManifest(candidates, manifest) {
    if (!manifest?.candidates || manifest.candidates.length === 0) {
        return candidates;
    }
    const allow = new Set(manifest.candidates);
    return candidates.filter((c) => {
        if (allow.has(c.packageName))
            return true;
        const shortId = c.packageName.includes("/plugin-")
            ? c.packageName.slice(c.packageName.lastIndexOf("/plugin-") + "/plugin-".length)
            : c.packageName;
        return allow.has(shortId);
    });
}
/**
 * Pre-populate `config.plugins.entries` from the app manifest defaults.
 * User-set entries (already present in `config.plugins.entries`) win — the
 * defaults only fill in keys the user hasn't explicitly set.
 *
 * Mutates `config` in place. Returns the list of entries that were defaulted
 * (for log surfacing).
 */
export function applyAppManifestDefaults(config, manifest) {
    if (!manifest?.defaults)
        return [];
    config.plugins = config.plugins ?? {};
    config.plugins.entries = config.plugins.entries ?? {};
    const entries = config.plugins.entries;
    const applied = [];
    for (const [id, defaultsForPlugin] of Object.entries(manifest.defaults)) {
        if (entries[id] !== undefined)
            continue; // user wins
        entries[id] = { ...defaultsForPlugin };
        applied.push(id);
    }
    return applied;
}
//# sourceMappingURL=app-manifest.js.map