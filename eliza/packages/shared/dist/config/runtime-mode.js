import { normalizeDeploymentTargetConfig } from "../contracts/service-routing.js";
import { isIosMobile } from "../runtime-env.js";
import { isPlainObject } from "../type-guards.js";
export const RUNTIME_EXECUTION_MODES = [
    "cloud",
    "local-safe",
    "local-yolo",
];
export const RUNTIME_EXECUTION_MODE_DEFINITIONS = {
    cloud: {
        mode: "cloud",
        local: false,
        cloud: true,
        safe: true,
        yolo: false,
    },
    "local-safe": {
        mode: "local-safe",
        local: true,
        cloud: false,
        safe: true,
        yolo: false,
    },
    "local-yolo": {
        mode: "local-yolo",
        local: true,
        cloud: false,
        safe: false,
        yolo: true,
    },
};
export function normalizeRuntimeExecutionMode(value) {
    if (typeof value !== "string")
        return null;
    const normalized = value.trim().toLowerCase();
    return RUNTIME_EXECUTION_MODES.includes(normalized)
        ? normalized
        : null;
}
export function isCloudRuntimeMode(value) {
    return normalizeRuntimeExecutionMode(value) === "cloud";
}
export function isLocalRuntimeMode(value) {
    const mode = normalizeRuntimeExecutionMode(value);
    return mode === "local-safe" || mode === "local-yolo";
}
export function isSafeLocalMode(value) {
    return normalizeRuntimeExecutionMode(value) === "local-safe";
}
export function isYoloLocalMode(value) {
    return normalizeRuntimeExecutionMode(value) === "local-yolo";
}
export function runtimeExecutionModeForDeploymentTarget(deploymentTarget) {
    return deploymentTarget?.runtime === "cloud" ? "cloud" : "local-safe";
}
export function readRuntimeExecutionModeConfig(config) {
    const runtimeConfig = isPlainObject(config?.runtime)
        ? config.runtime
        : undefined;
    const explicitMode = normalizeRuntimeExecutionMode(runtimeConfig?.executionMode);
    if (explicitMode)
        return explicitMode;
    return runtimeExecutionModeForDeploymentTarget(normalizeDeploymentTargetConfig(config?.deploymentTarget));
}
const RUNTIME_EXECUTION_MODE_SETTING_KEYS = [
    "ELIZA_RUNTIME_MODE",
    "RUNTIME_MODE",
    "LOCAL_RUNTIME_MODE",
];
/**
 * Canonical resolver for the active runtime execution mode at the
 * agent/plugin boundary. Reads an explicit setting from the runtime first,
 * then falls back to the same env vars, defaulting to `local-yolo` when
 * nothing is set.
 *
 * This is the one source of truth for `cloud | local-safe | local-yolo`
 * routing; both the agent package and the shell/coding-tools plugins import
 * it from `@elizaos/shared` to avoid duplicating the resolution logic.
 */
export function resolveRuntimeExecutionMode(source) {
    const clampForPlatform = (mode) => isIosMobile() && mode === "local-yolo" ? "local-safe" : mode;
    for (const key of RUNTIME_EXECUTION_MODE_SETTING_KEYS) {
        const fromSetting = normalizeRuntimeExecutionMode(source?.getSetting?.(key));
        if (fromSetting)
            return clampForPlatform(fromSetting);
    }
    for (const key of RUNTIME_EXECUTION_MODE_SETTING_KEYS) {
        const fromEnv = normalizeRuntimeExecutionMode(process.env[key]);
        if (fromEnv)
            return clampForPlatform(fromEnv);
    }
    return clampForPlatform("local-yolo");
}
export function resolveLocalExecutionMode(source) {
    return resolveRuntimeExecutionMode(source) === "local-safe"
        ? "local-safe"
        : "local-yolo";
}
export function shouldUseSandboxExecution(source) {
    return resolveRuntimeExecutionMode(source) === "local-safe";
}
export function isCloudExecutionMode(source) {
    return resolveRuntimeExecutionMode(source) === "cloud";
}
//# sourceMappingURL=runtime-mode.js.map