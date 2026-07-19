import type { Plugin } from "../types/plugin.js";
export declare const CORE_SECURITY_HOOKS_PLUGIN_NAME = "core-security-hooks";
/**
 * Core message-path security defenses, registered through the plugin lifecycle
 * so `registerPlugin` owns their bookkeeping and disposal instead of a bespoke
 * lazy import inside `AgentRuntime.initialize`. The two hooks are always-on:
 *
 *  - `core:incoming-message-security` (GHSA-gh63-5vpj-39qp) — external-content
 *    wrapping + sensitive-text scrubbing on the incoming user message.
 *  - `core:should-respond-injection-risk` (#9949) — deterministic RiskFactors
 *    stamping during the parallel-with-should-respond phase.
 *
 * Both `registerCore*Hook` functions call `runtime.registerPipelineHook` from
 * within the plugin `init`.
 */
export declare function createCoreSecurityHooksPlugin(): Plugin;
//# sourceMappingURL=core-security-hooks.d.ts.map