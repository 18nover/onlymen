/**
 * Permission model helpers for remote plugins: normalize/flatten grants,
 * merge and diff permission sets, and parse legacy permission shapes into the
 * current host/Bun grant representation defined in types.ts.
 */
import { BUN_PERMISSIONS, HOST_PERMISSIONS, REMOTE_PLUGIN_ISOLATIONS, } from "./types.js";
export function isHostPermission(value) {
    return HOST_PERMISSIONS.includes(value);
}
export function isBunPermission(value) {
    return BUN_PERMISSIONS.includes(value);
}
export function isRemotePluginIsolation(value) {
    return REMOTE_PLUGIN_ISOLATIONS.includes(value);
}
export function normalizeRemotePluginPermissions(input) {
    const host = {};
    const bun = {};
    let isolation = "shared-worker";
    if (Array.isArray(input)) {
        for (const permission of input) {
            if (permission === "bun:fs") {
                bun.read = true;
                bun.write = true;
            }
            else if (permission === "bun:env") {
                bun.env = true;
            }
            else if (permission === "bun:child_process") {
                bun.run = true;
            }
            else if (permission === "bun:ffi") {
                bun.ffi = true;
            }
            else if (permission === "bun:addons") {
                bun.addons = true;
            }
            else if (isHostPermission(permission)) {
                host[permission] = true;
            }
        }
        return { host, bun, isolation };
    }
    if (input?.host) {
        Object.assign(host, input.host);
    }
    if (input?.bun) {
        Object.assign(bun, input.bun);
    }
    if (input?.isolation) {
        isolation = input.isolation;
    }
    return { host, bun, isolation };
}
export function flattenRemotePluginPermissions(input) {
    const permissions = normalizeRemotePluginPermissions(input);
    const tags = [];
    for (const key of HOST_PERMISSIONS) {
        if (permissions.host?.[key] === true) {
            tags.push(`host:${key}`);
        }
    }
    for (const key of BUN_PERMISSIONS) {
        if (permissions.bun?.[key] === true) {
            tags.push(`bun:${key}`);
        }
    }
    tags.push(`isolation:${permissions.isolation ?? "shared-worker"}`);
    return tags;
}
export function mergeRemotePluginPermissions(defaults, overrides) {
    const base = normalizeRemotePluginPermissions(defaults);
    const extra = normalizeRemotePluginPermissions(overrides);
    const overrideIsolation = !Array.isArray(overrides) && overrides?.isolation
        ? overrides.isolation
        : undefined;
    return {
        host: {
            ...base.host,
            ...extra.host,
        },
        bun: {
            ...base.bun,
            ...extra.bun,
        },
        isolation: overrideIsolation ?? base.isolation ?? "shared-worker",
    };
}
export function hasHostPermission(input, permission) {
    return normalizeRemotePluginPermissions(input).host?.[permission] === true;
}
export function hasBunPermission(input, permission) {
    return normalizeRemotePluginPermissions(input).bun?.[permission] === true;
}
export function toBunWorkerPermissions(permissions) {
    const normalized = normalizeRemotePluginPermissions(permissions);
    return Object.fromEntries(BUN_PERMISSIONS.map((permission) => [
        permission,
        normalized.bun?.[permission] === true,
    ]));
}
export function parseRemotePluginPermissionTag(tag) {
    const parts = tag.split(":");
    if (parts.length !== 2)
        return null;
    const [scope, value] = parts;
    if (scope === "host" && value && isHostPermission(value)) {
        return `host:${value}`;
    }
    if (scope === "bun" && value && isBunPermission(value)) {
        return `bun:${value}`;
    }
    if (scope === "isolation" && value && isRemotePluginIsolation(value)) {
        return `isolation:${value}`;
    }
    return null;
}
export function isRemotePluginPermissionTag(tag) {
    return parseRemotePluginPermissionTag(tag) !== null;
}
//# sourceMappingURL=permissions.js.map