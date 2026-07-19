/**
 * Tier-aware action catalog assembly for the planner. Partitions
 * retrieval-ranked catalog parents into protocol (tier 0), first-class (tier A),
 * umbrella-only (tier B), and omitted (tier C) bands, narrows tier A to the
 * Stage-1 candidate actions, caps parents and per-parent children, and emits the
 * exposed action surface plus a stable hash for cache and trajectory keying.
 */
import { type ActionCatalog } from "./action-catalog.js";
import { type ActionRetrievalResult } from "./action-retrieval.js";
export declare const TIER0_PROTOCOL_ACTIONS: readonly ["IGNORE", "REPLY", "STOP", "CONTINUE"];
export type Tier0ProtocolAction = (typeof TIER0_PROTOCOL_ACTIONS)[number];
export type ActionTier = "tier0" | "tierA" | "tierB" | "tierC";
export type TieredParentAction = {
    name: string;
    normalizedName: string;
    score: number;
    childNames: string[];
    childNormalizedNames: string[];
    result: ActionRetrievalResult;
};
export type TierActionResultsInput = {
    catalog: ActionCatalog;
    results: ActionRetrievalResult[];
    tierAThreshold?: number;
    tierBThreshold?: number;
    maxTierAParents?: number;
    maxTierBParents?: number;
    protocolActions?: readonly Tier0ProtocolAction[];
    /**
     * When provided, tier-A is narrowed to parents matching at least one
     * candidate name (by parent normalized name OR any child normalized name,
     * so TASKS_SPAWN_AGENT maps back to TASKS). Non-matching tier-A and tier-B
     * parents go to tier-C (omitted entirely — not tier-B, which would still
     * expose umbrella parent names to the planner). No-op when no tier-A
     * parent matches, to prevent accidental surface collapse.
     *
     * Applied before the maxTierAParents cap so a candidate parent ranked
     * outside the cap isn't silently displaced before the narrow runs.
     */
    narrowToCandidateActions?: readonly string[];
    /**
     * Cap on sub-actions exposed as first-class planner tools per tier-A
     * parent (parents themselves are capped by `maxTierAParents`). Children
     * are ranked against the turn's Stage-1 signals: candidate-named children
     * always survive (explicit routing decision), remaining slots go to the
     * best `queryTokens` overlap with each child's catalog search text.
     * Narrowed-out children remain reachable through the parent umbrella
     * tool, whose handler routes any subaction.
     */
    maxTierAChildrenPerParent?: number;
    /**
     * Turn query tokens (`ActionRetrievalResponse.query.tokens` — message
     * text plus Stage-1 candidate names) used to rank children within a
     * tier-A parent when `maxTierAChildrenPerParent` applies. Without tokens
     * the ranking degrades to candidate matches first, then catalog child
     * order — still deterministic, just intent-blind.
     */
    queryTokens?: readonly string[];
};
export type TieredActionSurface = {
    protocolActions: Tier0ProtocolAction[];
    tierAParents: TieredParentAction[];
    tierBParents: TieredParentAction[];
    tierCParents: TieredParentAction[];
    exposedParentNames: string[];
    exposedActionNames: string[];
    omittedParentNames: string[];
    sortedTierAParentNames: string[];
    sortedTierBParentNames: string[];
    actionSurfaceHash: string;
};
export declare function tierActionResults(input: TierActionResultsInput): TieredActionSurface;
export declare function stableActionSurfaceHash(input: {
    protocolActions?: readonly string[];
    tierAParentNames?: readonly string[];
    tierBParentNames?: readonly string[];
    tierAChildNames?: readonly string[];
}): string;
//# sourceMappingURL=action-tiering.d.ts.map