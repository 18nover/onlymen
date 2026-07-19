/**
 * Builds the per-provider prompt-cache plan from a rendered prompt's stable-
 * prefix hash and segments: the OpenAI/Cerebras/OpenRouter cache keys, the
 * Anthropic cache breakpoints under its four-block cap, and the eliza-local
 * conversation-pinning options, for a single model generation.
 */
import type { PromptSegment } from "../types/model.js";
import type { JsonValue } from "../types/primitives.js";
export type CacheTTL = "short" | "long";
export interface CacheableSection {
    id: string;
    segmentIndex?: number;
    segmentHash?: string;
    cacheable?: boolean;
    stable?: boolean;
    ttl?: CacheTTL;
    priority?: number;
}
export interface ProviderCachePlanArgs {
    prefixHash: string;
    segmentHashes?: readonly string[];
    promptSegments?: readonly Pick<PromptSegment, "stable" | "ttl">[] | readonly {
        stable?: boolean;
        ttl?: CacheTTL;
    }[];
    sections?: readonly CacheableSection[];
    provider?: string;
    model?: string;
    hasTools?: boolean;
    /**
     * Stable id for the long-lived conversation this generation belongs to,
     * when one exists (chat handler: `roomId`; planner loop: trajectory
     * id). Local backends consume it as the strongest possible cache key
     * — a single conversation always lands on the same KV slot, no matter
     * how the prompt evolves turn-to-turn.
     *
     * Cloud providers ignore it: they already get prefix caching from the
     * stable-prefix hash, and don't expose a slot-pinning concept.
     */
    conversationId?: string;
}
export interface AnthropicCacheControl {
    type: "ephemeral";
    ttl?: "1h";
}
export interface AnthropicCacheBreakpoint {
    id?: string;
    segmentIndex: number;
    segmentHash?: string;
    ttl: CacheTTL;
    cacheControl: AnthropicCacheControl;
}
export interface ProviderCachePlan {
    promptCacheKey: string;
    providerOptions: Record<string, JsonValue | object | undefined>;
    anthropic: {
        cacheSystem: boolean;
        maxBreakpoints: number;
        breakpoints: AnthropicCacheBreakpoint[];
    };
    warnings: string[];
}
export declare function buildProviderCachePlan(args: ProviderCachePlanArgs): ProviderCachePlan;
export declare function buildPromptCacheKey(prefixHash: string): string;
//# sourceMappingURL=provider-cache-plan.d.ts.map