/**
 * Consent-request builder and permission-diff utility over a `plugin.json`
 * manifest. Turns a manifest's declared permission tags into the consent
 * request the host prompts on, and computes what changes between two manifests
 * on upgrade.
 */
import { flattenRemotePluginPermissions, normalizeRemotePluginPermissions, } from "./permissions.js";
import { BUN_PERMISSIONS, HOST_PERMISSIONS, } from "./types.js";
function enabledHostPermissions(permissions) {
    return HOST_PERMISSIONS.filter((permission) => permissions.host?.[permission] === true);
}
function enabledBunPermissions(permissions) {
    return BUN_PERMISSIONS.filter((permission) => permissions.bun?.[permission] === true);
}
export function diffRemotePluginPermissions(requested, previous) {
    const normalized = normalizeRemotePluginPermissions(requested);
    const requestedPermissions = flattenRemotePluginPermissions(normalized);
    const previousPermissions = new Set(flattenRemotePluginPermissions(previous));
    const changedPermissions = requestedPermissions.filter((permission) => !previousPermissions.has(permission));
    return {
        requestedPermissions,
        changedPermissions,
        hostPermissions: enabledHostPermissions(normalized),
        bunPermissions: enabledBunPermissions(normalized),
        isolation: normalized.isolation ?? "shared-worker",
    };
}
export function getRemotePluginManifestPermissionTags(manifest) {
    return flattenRemotePluginPermissions(manifest.permissions);
}
export function buildRemotePluginPermissionConsentRequest(input) {
    const diff = diffRemotePluginPermissions(input.manifest.permissions, input.previousGrant);
    return {
        requestId: input.requestId,
        remotePluginId: input.manifest.id,
        remotePluginName: input.manifest.name,
        version: input.manifest.version,
        sourceKind: input.source.kind,
        sourceLabel: input.sourceLabel,
        message: input.message,
        confirmLabel: input.confirmLabel,
        requestedPermissions: diff.requestedPermissions,
        changedPermissions: diff.changedPermissions,
        hostPermissions: diff.hostPermissions,
        bunPermissions: diff.bunPermissions,
        isolation: diff.isolation,
    };
}
//# sourceMappingURL=manifest.js.map