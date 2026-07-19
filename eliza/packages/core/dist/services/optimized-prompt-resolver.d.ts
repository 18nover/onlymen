/**
 * Helper that resolves the system prompt for one of the five core decision
 * tasks. Each runtime call site already constructs a baseline prompt; this
 * resolver consults `OptimizedPromptService` first and falls back to the
 * baseline when no artifact has been loaded.
 *
 * Two public entry points:
 *
 *   - `resolveOptimizedPrompt(service, task, baseline)` — pure function;
 *     test-friendly. The caller passes the service it already resolved.
 *   - `resolveOptimizedPromptForRuntime(runtime, task, baseline)` — runtime
 *     helper that looks up the service via `runtime.getService`. Each call
 *     site for one of the five tasks goes through this single entry point,
 *     keyed only on the task name + baseline. There is no per-task code
 *     branching anywhere in the runtime — the service holds the
 *     task→artifact map and the operator's `OPTIMIZED_PROMPT_DISABLE`
 *     allowlist gates substitution uniformly.
 */
import { type OptimizedPromptContextConfig, type OptimizedPromptService, type OptimizedPromptTask } from "./optimized-prompt.js";
/**
 * Minimal shape of `IAgentRuntime` we need to look up the
 * `OptimizedPromptService` registration. Defined here so this module does not
 * pull a runtime-types dependency just to read one service. Mirrors the same
 * shape used by `planner-loop.ts:resolveOptimizedPlannerTemplate`.
 */
export interface OptimizedPromptRuntimeLike {
    getService?: (name: string) => unknown;
}
/**
 * Look up the optimized system prompt for `task`. Returns the baseline
 * unchanged when no service is registered or when the service has no
 * artifact for the task.
 *
 * When the artifact carries `fewShotExamples`, they are inlined into the
 * system prompt under a `Demonstrations:` block. The structure mirrors
 * `plugins/plugin-training/src/optimizers/bootstrap-fewshot.ts#renderDemonstrations`
 * so an artifact written by either backend renders identically at the call
 * site.
 */
export declare function resolveOptimizedPrompt(service: OptimizedPromptService | null | undefined, task: OptimizedPromptTask, baseline: string): string;
export declare function resolveOptimizedContextConfig(service: OptimizedPromptService | null | undefined, task: OptimizedPromptTask): OptimizedPromptContextConfig | null;
export declare function resolveOptimizedContextConfigForRuntime(runtime: OptimizedPromptRuntimeLike, task: OptimizedPromptTask): OptimizedPromptContextConfig | null;
/**
 * Apply a learned provider selection/order genome to the provider names the
 * runtime already deemed eligible. This is deliberately pure: runtime hook
 * registration can call it without giving artifacts authority to invent
 * providers that are not registered for the current turn.
 */
export declare function applyOptimizedProviderSelection(current: readonly string[], contextConfig: OptimizedPromptContextConfig | null | undefined): string[];
/**
 * Runtime-aware entry point. Each call site that builds a prompt for one of
 * the five core tasks calls this helper, passing only the runtime, the task
 * name, and the baseline string. The helper:
 *
 *   1. Looks up `OptimizedPromptService` from the runtime (returns baseline
 *      if the service is not registered — important during early-boot or in
 *      stripped-down test runtimes).
 *   2. Asks the service for the resolved prompt for that task. The service
 *      honours `OPTIMIZED_PROMPT_DISABLE`, so a disabled task returns null
 *      from `getPrompt` and we fall back to the baseline here.
 *   3. Inlines few-shot demonstrations into the artifact prompt when present.
 *
 * No call site needs to know which task names exist or how the service is
 * registered; they pass a `task: OptimizedPromptTask` literal and the strong
 * type catches typos at compile time.
 */
export declare function resolveOptimizedPromptForRuntime(runtime: OptimizedPromptRuntimeLike, task: OptimizedPromptTask, baseline: string): string;
//# sourceMappingURL=optimized-prompt-resolver.d.ts.map