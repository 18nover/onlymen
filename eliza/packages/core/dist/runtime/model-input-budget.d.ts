import type { ChatMessage, PromptSegment, ToolDefinition } from "../types/model.js";
export declare const DEFAULT_CONTEXT_WINDOW_TOKENS = 128000;
export declare const DEFAULT_COMPACTION_RESERVE_TOKENS = 10000;
/**
 * When the context window is resolved from `lookupModelContextWindow` (i.e.
 * we know the exact ceiling for this model), use this fraction of the window
 * as the compaction reserve floor.
 *
 * 0.20 is chosen so the estimator + provider tokenization variance + the
 * planner's small re-render growth between the budget-check and the actual
 * send all fit under the ceiling. Empirically: char/3.5 underestimates by
 * roughly 25–30% on tool-heavy planner prompts; a 20% reserve absorbs that
 * without compacting healthy traffic prematurely.
 *
 * The reserve is `max(DEFAULT_COMPACTION_RESERVE_TOKENS, window * 0.20)` so
 * tiny windows (≤ 50k) still get the 10k floor and large windows (≥ 200k)
 * scale up proportionally.
 *
 * **Important:** the scaled reserve only applies when (a) the model name was
 * passed AND resolved through `lookupModelContextWindow` AND (b) the caller
 * did not supply an explicit `reserveTokens`. Callers that pre-compute a
 * window-and-reserve pair keep their exact behavior — no regression for
 * existing call sites that don't pass `modelName`.
 */
export declare const MODEL_WINDOW_RESERVE_FRACTION = 0.2;
export interface ModelInputBudget {
    estimatedInputTokens: number;
    contextWindowTokens: number;
    reserveTokens: number;
    compactionThresholdTokens: number;
    shouldCompact: boolean;
    /**
     * The matched model-family key from the context-window lookup, or null
     * when the window came from the caller's explicit argument or the
     * `DEFAULT_CONTEXT_WINDOW_TOKENS` fallback. Surfaced for observability
     * (e.g. trajectory recorder, compaction logs).
     */
    resolvedModelKey: string | null;
}
export declare function estimateModelInputTokens(args: {
    messages?: readonly ChatMessage[];
    promptSegments?: readonly PromptSegment[];
    tools?: readonly ToolDefinition[];
}): number;
export declare function buildModelInputBudget(args: {
    messages?: readonly ChatMessage[];
    promptSegments?: readonly PromptSegment[];
    tools?: readonly ToolDefinition[];
    /**
     * Explicit fallback ceiling. Used when `modelName` is unset or misses the
     * lookup table, and otherwise superseded by the per-model lookup because
     * the lookup reflects the concrete provider-side hard limit.
     *
     * Pass this without `modelName` when you need to force a custom tier that
     * is not representable in the lookup table.
     */
    contextWindowTokens?: number;
    /**
     * Explicit reserve. When set, wins over the per-model 20%-of-window
     * derivation and the `DEFAULT_COMPACTION_RESERVE_TOKENS` fallback.
     */
    reserveTokens?: number;
    /**
     * Optional model id. When set and `contextWindowTokens` is unset, the
     * window is resolved through `lookupModelContextWindow` (longest-prefix
     * family match). When the lookup hits and `reserveTokens` is unset, the
     * reserve is scaled to `MODEL_WINDOW_RESERVE_FRACTION` of the window.
     *
     * Pass-through callers that don't know the active model name should
     * omit this — the existing default behavior is preserved exactly.
     */
    modelName?: string;
}): ModelInputBudget;
export declare function withModelInputBudgetProviderOptions<T extends Record<string, unknown>>(providerOptions: T, budget: ModelInputBudget): T;
//# sourceMappingURL=model-input-budget.d.ts.map