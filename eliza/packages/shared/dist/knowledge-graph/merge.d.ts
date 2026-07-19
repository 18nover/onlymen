/**
 * Identity-merge engine for the knowledge graph (canonical, runtime-level).
 *
 * Pure functions: given a set of Entity records and a new identity
 * observation, decide which existing entities (if any) are the same and
 * how to fold the new identity in. Preserves provenance — every collapsed
 * identity keeps its evidence trail, no observation is silently discarded.
 *
 * The DB-backed `EntityStore` (in `@elizaos/plugin-personal-assistant`) calls
 * into this from both `observeIdentity` (auto-merge on (platform, handle)
 * match) and explicit `merge(target, sources)`.
 */
import type { Entity, EntityIdentity } from "./entity-types.js";
/**
 * Threshold at which `observeIdentity` will auto-merge a new observation
 * into an existing entity without surfacing an approval task. Below this,
 * the observation is recorded but the merge becomes a proposal that the
 * scheduled-task layer surfaces for user confirmation.
 */
export declare const AUTO_MERGE_CONFIDENCE_THRESHOLD = 0.85;
/** Confidence at which a new identity claim outright overrides an existing
 * lower-confidence claim with the same (platform, handle). */
export declare const OVERRIDE_CONFIDENCE_DELTA = 0.15;
export interface IdentityMatchInput {
    platform: string;
    handle: string;
    confidence: number;
    /** Operator-confirmed (true) overrides auto-observed (false) on ties. */
    verified?: boolean;
}
/**
 * Find the entities whose identities collide on `(platform, handle)`.
 * Multiple matches indicate a conflict (the same handle is claimed by
 * different entities) — the caller surfaces this for approval.
 */
export declare function findIdentityMatches(entities: Entity[], match: IdentityMatchInput): Entity[];
/**
 * Decide the outcome of an `observeIdentity` call:
 *  - "create": no match; create a new entity with this identity.
 *  - "merge": exactly one match; fold the new identity in.
 *  - "conflict": multiple matches OR the match is below the auto-merge
 *    threshold; surface for user approval.
 */
export type IdentityObserveOutcome = {
    kind: "create";
} | {
    kind: "merge";
    targetEntityId: string;
} | {
    kind: "conflict";
    candidateEntityIds: string[];
    reason: string;
};
export declare function decideIdentityOutcome(args: {
    candidates: Entity[];
    newConfidence: number;
}): IdentityObserveOutcome;
/**
 * Fold a new identity into an existing entity's identities array. If the
 * (platform, handle) already exists, evidence is concatenated (deduped) and
 * the higher-confidence claim wins. Otherwise, the new identity is
 * appended.
 */
export declare function foldIdentity(existing: EntityIdentity[], next: EntityIdentity): EntityIdentity[];
/**
 * Explicit merge: take a target entity and fold N source entities into it,
 * preserving every identity, attribute, and tag. Returns the merged entity
 * (caller persists it and removes the sources). Provenance is preserved
 * verbatim — no identity is dropped, only deduplicated by (platform, handle).
 */
export declare function mergeEntities(args: {
    target: Entity;
    sources: Entity[];
    now: string;
}): Entity;
//# sourceMappingURL=merge.d.ts.map