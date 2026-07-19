/**
 * AwarenessRegistry — core orchestration layer for the Self-Awareness System.
 *
 * Manages contributor registration, summary composition (Layer 1),
 * detail retrieval (Layer 2), caching, sanitization, and invalidation.
 *
 * @architecture All public methods are fault-tolerant: individual contributor
 * errors are captured and surfaced as `[{id}: unavailable]` markers — the
 * registry itself NEVER throws from composeSummary / getDetail.
 */
import type { IAgentRuntime } from "@elizaos/core";
import { type AwarenessContributor, type AwarenessInvalidationEvent } from "../contracts/awareness.js";
export declare class AwarenessRegistry {
    private readonly contributors;
    private readonly contributorIds;
    private readonly cache;
    register(contributor: AwarenessContributor): void;
    composeSummary(runtime: IAgentRuntime): Promise<string>;
    getDetail(runtime: IAgentRuntime, module: string, level: "brief" | "full"): Promise<string>;
    invalidate(event: AwarenessInvalidationEvent): void;
    private getCachedSummary;
    private applyGlobalBudget;
    private composeAllDetails;
}
//# sourceMappingURL=registry.d.ts.map