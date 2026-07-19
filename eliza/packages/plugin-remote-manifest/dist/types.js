/**
 * Single source of truth for the remote-plugin protocol: the host + Bun sandbox
 * permission constant tuples, the `plugin.json` manifest interfaces, install-source
 * and consent-request shapes, and the worker↔host wire envelope types. Consumed
 * across the desktop runtime (agent bridge, host shims, worker runtime, sub-agent).
 * Permission tuples are `as const` because the union types are derived from them.
 */
export const HOST_PERMISSIONS = [
    "windows",
    "tray",
    "notifications",
    "storage",
    "manage-remote-plugins",
];
export const BUN_PERMISSIONS = [
    "read",
    "write",
    "env",
    "run",
    "ffi",
    "addons",
    "worker",
];
export const REMOTE_PLUGIN_ISOLATIONS = [
    "shared-worker",
    "isolated-process",
];
//# sourceMappingURL=types.js.map