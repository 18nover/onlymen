/**
 * In-memory override layer merged over the base `ElizaConfig` at read time.
 * Holds a process-scoped override tree that callers set/unset by dot-path (via
 * config-paths.js) to adjust config without mutating the persisted file.
 */
import { isPlainObject } from "../type-guards.js";
import { parseConfigPath, setConfigValueAtPath, unsetConfigValueAtPath, } from "./config-paths.js";
let overrides = {};
function mergeOverrides(base, override) {
    if (!isPlainObject(base) || !isPlainObject(override)) {
        return override;
    }
    const next = { ...base };
    for (const [key, value] of Object.entries(override)) {
        if (value === undefined) {
            continue;
        }
        next[key] = mergeOverrides(base[key], value);
    }
    return next;
}
export function getConfigOverrides() {
    return overrides;
}
export function resetConfigOverrides() {
    overrides = {};
}
export function setConfigOverride(pathRaw, value) {
    const parsed = parseConfigPath(pathRaw);
    if (!parsed.ok || !parsed.path) {
        return { ok: false, error: parsed.error ?? "Invalid path." };
    }
    setConfigValueAtPath(overrides, parsed.path, value);
    return { ok: true };
}
export function unsetConfigOverride(pathRaw) {
    const parsed = parseConfigPath(pathRaw);
    if (!parsed.ok || !parsed.path) {
        return {
            ok: false,
            removed: false,
            error: parsed.error ?? "Invalid path.",
        };
    }
    const removed = unsetConfigValueAtPath(overrides, parsed.path);
    return { ok: true, removed };
}
export function applyConfigOverrides(cfg) {
    if (!overrides || Object.keys(overrides).length === 0) {
        return cfg;
    }
    return mergeOverrides(cfg, overrides);
}
//# sourceMappingURL=runtime-overrides.js.map