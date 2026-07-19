/**
 * Relationship types for the knowledge graph (canonical, runtime-level).
 *
 * A Relationship is a typed edge between two Entities, carrying its own
 * metadata (cadence, role, sentiment) and state (last-interaction, count,
 * sentiment trend). Each edge has its own provenance trail.
 *
 * Canonical home: `@elizaos/shared`. The DB-backed `RelationshipStore` lives in
 * `@elizaos/plugin-personal-assistant`; the `LifeOpsGraphRelationship` wire
 * contract in `@elizaos/shared/contracts/personal-assistant` re-exports these
 * shapes.
 */
/**
 * Built-in relationship types. The registry accepts any string, but these
 * are the shapes the planner / followup-watcher / extraction know about
 * without registration.
 */
export declare const BUILT_IN_RELATIONSHIP_TYPES: readonly ["follows", "colleague_of", "friend_of", "family_of", "partner_of", "ex_partner_of", "co_parent_of", "manages", "managed_by", "lives_at", "works_at", "knows", "owns"];
export type BuiltInRelationshipType = (typeof BUILT_IN_RELATIONSHIP_TYPES)[number];
export type RelationshipSource = "user_chat" | "platform_observation" | "extraction" | "import" | "system";
export type RelationshipSentiment = "positive" | "neutral" | "negative";
export type RelationshipStatus = "active" | "retired";
/**
 * Per-edge interaction state. Distinct from `Entity.state` — this is the
 * cadence + last-interaction tied to a specific (from, to, type) triple.
 * The cadence override (`metadata.cadenceDays`) lives on the edge so that
 * "Pat as colleague" and "Pat as friend" can have separate follow-up
 * cadences against the same person.
 */
export interface RelationshipState {
    lastObservedAt?: string;
    lastInteractionAt?: string;
    interactionCount?: number;
    sentimentTrend?: RelationshipSentiment;
}
/**
 * The canonical Relationship shape. A typed edge from `fromEntityId` to
 * `toEntityId`; the user is `entityId === "self"` for ego-network edges.
 */
export interface Relationship {
    relationshipId: string;
    fromEntityId: string;
    toEntityId: string;
    type: string;
    /**
     * Per-type metadata. Examples:
     *   - `{ cadenceDays: 14 }` for `follows`
     *   - `{ role: "engineer" }` for `works_at`
     *   - `{ sinceDate: "2020-01-01" }` for `partner_of`
     */
    metadata?: Record<string, unknown>;
    state: RelationshipState;
    evidence: string[];
    /** 0..1 confidence in the edge. */
    confidence: number;
    source: RelationshipSource;
    /**
     * Soft-delete state. Retired edges remain queryable for audit but are
     * filtered out of `list()` by default and never strengthened by new
     * observations — new evidence on a retired edge is logged but does NOT
     * flip it back to active.
     */
    status: RelationshipStatus;
    retiredAt?: string;
    retiredReason?: string;
    createdAt: string;
    updatedAt: string;
}
/**
 * Filter for `RelationshipStore.list`. All fields optional, AND-combined.
 */
export interface RelationshipFilter {
    fromEntityId?: string;
    toEntityId?: string;
    type?: string | string[];
    metadataMatch?: Record<string, unknown>;
    /**
     * Returns edges where `metadata.cadenceDays` exists AND
     * `state.lastInteractionAt < (asOf - cadenceDays)`. Read by the
     * followup-starter watcher (W1-D).
     */
    cadenceOverdueAsOf?: string;
    /** Include retired edges. Default false. */
    includeRetired?: boolean;
    limit?: number;
}
/**
 * Open-string registry for relationship types. Built-ins always validate;
 * new types may register typed metadata schemas via {@link metadataKeys}.
 * The runtime does not branch on type — the registry is informational.
 */
export declare class RelationshipTypeRegistry {
    private readonly registered;
    constructor();
    register(type: string, metadata?: {
        label?: string;
        metadataKeys?: string[];
        symmetric?: boolean;
    }): void;
    has(type: string): boolean;
    isSymmetric(type: string): boolean;
    list(): string[];
}
export declare const defaultRelationshipTypeRegistry: RelationshipTypeRegistry;
//# sourceMappingURL=relationship-types.d.ts.map