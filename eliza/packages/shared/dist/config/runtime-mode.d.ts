/**
 * `RuntimeModeConfig` and the execution-mode enum (`cloud`, `local-safe`,
 * `local-yolo`) with resolver helpers. Determines whether a runtime routes work
 * to Eliza Cloud or runs locally, and how permissive local execution is.
 */
import type { DeploymentTargetConfig } from "../contracts/service-routing.js";
export declare const RUNTIME_EXECUTION_MODES: readonly ["cloud", "local-safe", "local-yolo"];
export type RuntimeExecutionMode = (typeof RUNTIME_EXECUTION_MODES)[number];
export interface RuntimeModeConfig {
    executionMode?: RuntimeExecutionMode;
}
export interface RuntimeExecutionModeConfigSource {
    runtime?: RuntimeModeConfig | Record<string, unknown> | null;
    deploymentTarget?: DeploymentTargetConfig | null;
}
export interface RuntimeExecutionModeDefinition {
    mode: RuntimeExecutionMode;
    local: boolean;
    cloud: boolean;
    safe: boolean;
    yolo: boolean;
}
export declare const RUNTIME_EXECUTION_MODE_DEFINITIONS: Record<RuntimeExecutionMode, RuntimeExecutionModeDefinition>;
export declare function normalizeRuntimeExecutionMode(value: unknown): RuntimeExecutionMode | null;
export declare function isCloudRuntimeMode(value: unknown): boolean;
export declare function isLocalRuntimeMode(value: unknown): boolean;
export declare function isSafeLocalMode(value: unknown): boolean;
export declare function isYoloLocalMode(value: unknown): boolean;
export declare function runtimeExecutionModeForDeploymentTarget(deploymentTarget: DeploymentTargetConfig | null | undefined): RuntimeExecutionMode;
export declare function readRuntimeExecutionModeConfig(config: RuntimeExecutionModeConfigSource | null | undefined): RuntimeExecutionMode;
/**
 * Structural shape for the runtime/setting source consumed by the env-driven
 * resolvers below. Kept structural so this module does not have to import
 * `IAgentRuntime` from `@elizaos/core` (which would create a layering wart —
 * runtime/agent types depend on this module, not the other way around).
 */
export interface RuntimeExecutionModeSource {
    getSetting?: (key: string) => unknown;
}
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
export declare function resolveRuntimeExecutionMode(source?: RuntimeExecutionModeSource | null): RuntimeExecutionMode;
/** Local-only narrowing of {@link RuntimeExecutionMode} for callers that only
 * distinguish local-safe vs local-yolo. Cloud collapses to `local-yolo` here
 * because legacy callers used this helper to pick a host-side execution path
 * and only flipped to safe-mode when the sandbox was required. */
export type LocalExecutionMode = "local-safe" | "local-yolo";
export declare function resolveLocalExecutionMode(source?: RuntimeExecutionModeSource | null): LocalExecutionMode;
export declare function shouldUseSandboxExecution(source?: RuntimeExecutionModeSource | null): boolean;
export declare function isCloudExecutionMode(source?: RuntimeExecutionModeSource | null): boolean;
//# sourceMappingURL=runtime-mode.d.ts.map