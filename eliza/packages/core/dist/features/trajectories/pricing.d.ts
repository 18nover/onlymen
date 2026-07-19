import type { TokenUsageForCost, TrajectoryRuntimeLogger } from "./pricing-types.js";
export type { TokenUsageForCost } from "./pricing-types.js";
/**
 * Stable identifier for the on-disk price table snapshot.
 *
 * Bump the date suffix every time any rate in `MODEL_PRICES_USD_PER_M_TOKENS`
 * changes. The recorder writes this id alongside the per-step `cost_usd`
 * so consumers can disambiguate cost numbers computed against different
 * snapshots.
 */
export declare const PRICE_TABLE_ID: "eliza-v1-2026-07-02";
export type PriceTableId = typeof PRICE_TABLE_ID;
/**
 * Provider name as recorded on the trajectory step. Drives the local-tier
 * default (Ollama / LM Studio / llama.cpp report cost 0 with no warning).
 */
export type ProviderName = "anthropic" | "openai" | "google" | "groq" | "cerebras" | "eliza-cloud" | "ollama" | "lm-studio" | "llama.cpp" | "local" | "unknown";
export interface ModelPriceUsdPerMTokens {
    /** Provider that publishes this rate card. */
    provider: ProviderName;
    /** USD per 1M input tokens (non-cached prompt). */
    input: number;
    /** USD per 1M output (completion) tokens. */
    output: number;
    /**
     * USD per 1M tokens served from cache. 0 means the provider does not
     * publish a separate cache-read rate — `computeCallCostUsd` falls back to
     * the regular input rate.
     */
    cacheRead: number;
    /**
     * USD per 1M tokens written into cache (Anthropic's surcharge on top of
     * the regular input cost). 0 means no surcharge — fallback to input rate.
     */
    cacheWrite: number;
}
/**
 * Per-model price table. Keys are the canonical family name; the lookup
 * helper performs a longest-prefix match so versioned ids
 * (e.g. `claude-haiku-4-5-20251001`) resolve to the family entry.
 *
 * Pricing comments cite the source page and the date the number was
 * captured from. Update both when bumping `PRICE_TABLE_ID`.
 */
export declare const MODEL_PRICES_USD_PER_M_TOKENS: Record<string, ModelPriceUsdPerMTokens>;
/**
 * Per-model maximum input context window, in tokens.
 *
 * Used by `buildModelInputBudget` when the caller does not pass an explicit
 * `contextWindowTokens` — letting the compaction planner size its budget to
 * the actual model ceiling instead of a one-size-fits-all default.
 *
 * Numbers reflect the smallest documented input-context limit per family,
 * captured from the provider's docs as of 2026-05-11. A few providers
 * advertise larger windows on specific tiers; using the conservative
 * number gives a safety margin and avoids per-tier lookup that we cannot
 * resolve at compaction-decision time.
 *
 * This table SHOULD line up with `MODEL_PRICES_USD_PER_M_TOKENS` keys, but
 * does not have to be a strict superset/subset: the price table sometimes
 * carries a model under a provider's naming convention (e.g. Groq's
 * `llama-3.3-70b-versatile`) while the same family appears in the window
 * table under a different vendor's name (Cerebras's `llama3.1-8b`). When
 * adding entries, prefer the canonical id the provider returns from
 * `GET /v1/models` rather than aliasing — the lookup helper's substring
 * fallback keeps the two tables interoperable for versioned ids without
 * forcing every alias to be enumerated.
 *
 * Local-tier entries are omitted on purpose: callers building a budget for
 * an Ollama / LM Studio / llama.cpp / local provider should pass an
 * explicit `contextWindowTokens` for the loaded GGUF, since the actual
 * window varies per-file.
 */
export declare const MODEL_CONTEXT_WINDOW_TOKENS: Record<string, number>;
/**
 * Result of a context-window lookup. Carries the matched table key so callers
 * can surface "matched as family X" diagnostics if needed — mirrors
 * `PriceLookupResult`.
 */
export interface ContextWindowLookupResult {
    matchedKey: string;
    contextWindowTokens: number;
}
/**
 * Look up the documented input-context window for a model name.
 *
 * Returns null when the model has no entry — callers should fall back to
 * `DEFAULT_CONTEXT_WINDOW_TOKENS` (see `runtime/model-input-budget`) or to
 * a provider-supplied number.
 *
 * Matching strategy (parallel to `lookupModelPrice`):
 *   1. exact key match
 *   2. longest-key **substring** match — every table key whose
 *      lowercased form appears anywhere in the lowercased model name is
 *      a candidate, and the longest such key wins. This handles
 *      versioned ids like `claude-haiku-4-5-20251001` (resolves to
 *      `claude-haiku-4-5`) and provider prefixes like `openai/gpt-5.5`
 *      (resolves to `gpt-5.5`) uniformly. The substring fallback is
 *      permissive by design: an adversarial / synthetic id such as
 *      `acme-gpt-oss-120b-finetune` would also match the `gpt-oss-120b`
 *      entry, which is the right answer when the finetune inherits its
 *      parent's context window — and a safe under-estimate otherwise.
 */
export declare function lookupModelContextWindow(modelName: string | undefined): ContextWindowLookupResult | null;
/**
 * Result of a price lookup. Carries the matched table key so callers can
 * surface "matched as family X" diagnostics if needed.
 */
export interface PriceLookupResult {
    matchedKey: string;
    price: ModelPriceUsdPerMTokens;
}
/**
 * Look up the price entry for a model name. Returns null when the model is
 * unknown.
 *
 * Falls back to the longest-prefix family-key match when an exact key is
 * missing — adapters often emit a versioned id
 * (e.g. `claude-haiku-4-5-20251001`) where the table only stores the
 * family key (`claude-haiku-4-5`).
 */
export declare function lookupModelPrice(modelName: string | undefined): PriceLookupResult | null;
/**
 * Compute the USD cost of a single LLM call.
 *
 * Returns 0 when:
 *  - `usage` is undefined or all-zero,
 *  - the model is unknown (cost computation is observability; it must
 *    never crash the runtime),
 *  - the provider is a known local tier (Ollama / LM Studio / llama.cpp /
 *    "local") — local cost is a real zero, not a missing price.
 *
 * When the model is unknown and the provider is *not* local, the optional
 * `logger.warn` is invoked once per call. Callers in hot paths can pass
 * `logger: undefined` to suppress noise.
 *
 * Cache-read tokens are billed at the cacheRead rate when set, otherwise
 * the regular input rate. Cache-creation tokens are billed at cacheWrite
 * (Anthropic's surcharge) on top of the regular input portion that paid
 * for them. Non-cached input is billed at the input rate.
 */
export declare function computeCallCostUsd(modelName: string | undefined, usage: TokenUsageForCost | undefined, options?: {
    provider?: string;
    /**
     * Provider-declared `local` capability (`ModelRegistrationMetadata.local`),
     * when the caller has it. Authoritative over the provider-name heuristic.
     */
    local?: boolean;
    logger?: TrajectoryRuntimeLogger;
}): number;
/**
 * Whether the provided provider tag is a known local-tier inference target.
 * Used by the recorder to suppress the missing-model warning when a user
 * runs entirely on local hardware.
 */
export declare function isLocalProvider(provider: string | undefined, localCapability?: boolean): boolean;
//# sourceMappingURL=pricing.d.ts.map