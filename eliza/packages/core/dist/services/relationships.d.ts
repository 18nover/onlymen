import type { Entity } from "../types/environment.js";
import type { JsonValue, UUID } from "../types/primitives.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
import { type GraphResolvers, type RelationshipsGraphQuery, type RelationshipsGraphSnapshot, type RelationshipsPersonDetail } from "./relationships-graph-builder.js";
export interface ContactCategory {
    id: string;
    name: string;
    description?: string;
    color?: string;
}
export interface ContactPreferences {
    preferredCommunicationChannel?: string;
    timezone?: string;
    language?: string;
    contactFrequency?: "daily" | "weekly" | "monthly" | "quarterly";
    doNotDisturb?: boolean;
    notes?: string;
    /** Index signature for metadata compatibility */
    [key: string]: string | boolean | undefined;
}
export interface ContactHandle {
    id: UUID;
    platform: string;
    identifier: string;
    displayLabel?: string;
    isPrimary?: boolean;
    addedAt: string;
}
export type InteractionDirection = "inbound" | "outbound";
export interface ContactInteraction {
    id: UUID;
    platform: string;
    direction: InteractionDirection;
    summary?: string;
    externalRef?: string;
    occurredAt: string;
}
export interface RelationshipGoal {
    goalText: string;
    targetCadenceDays?: number;
    setAt: string;
}
export type RelationshipStatus = "active" | "dormant" | "archived" | "blocked" | "unknown";
export interface ContactInfo {
    entityId: UUID;
    categories: string[];
    tags: string[];
    preferences: ContactPreferences;
    customFields: Record<string, JsonValue>;
    privacyLevel: "public" | "private" | "restricted";
    lastModified: string;
    handles: ContactHandle[];
    interactions: ContactInteraction[];
    followupThresholdDays?: number;
    lastInteractionAt?: string;
    relationshipGoal?: RelationshipGoal;
    relationshipStatus: RelationshipStatus;
}
interface RecordInteractionInput {
    contactId: UUID;
    platform: string;
    direction: InteractionDirection;
    summary?: string;
    externalRef?: string;
    occurredAt?: string;
}
interface ListOverdueOptions {
    asOfMs?: number;
    defaultThresholdDays?: number;
}
export interface OverdueFollowup {
    contact: ContactInfo;
    daysSinceInteraction: number;
    thresholdDays: number;
}
export interface RelationshipProgress {
    contactId: UUID;
    goal: RelationshipGoal | null;
    lastInteractionAt: string | null;
    cadenceHealth: "on-track" | "due" | "overdue" | "never-contacted" | "no-goal";
    daysSinceInteraction: number | null;
    targetCadenceDays: number | null;
}
export interface PlatformContactSeed {
    platform: string;
    identifier: string;
    displayName?: string;
    displayLabel?: string;
    categories?: string[];
    tags?: string[];
    notes?: string;
}
export interface PlatformImportResult {
    imported: ContactInfo[];
    linkedToExisting: ContactInfo[];
    skipped: Array<{
        seed: PlatformContactSeed;
        reason: string;
    }>;
}
export interface RelationshipAnalytics {
    strength: number;
    interactionCount: number;
    sharedConversationWindows?: number;
    lastInteractionAt?: string;
    averageResponseTime?: number;
    sentimentScore?: number;
    topicsDiscussed: string[];
}
/**
 * Strengthened identity record persisted in `entity_identities`. The legacy
 * `metadata.platformIdentities` array on the entity row is still kept in sync
 * for backwards compatibility with existing UI code paths, but this typed
 * record is the source of truth going forward.
 */
export interface EntityIdentityRecord {
    id: UUID;
    entityId: UUID;
    platform: string;
    handle: string;
    verified: boolean;
    confidence: number;
    source?: string;
    firstSeen: string;
    lastSeen: string;
    evidenceMessageIds: UUID[];
}
/**
 * Lightweight payload accepted by `upsertIdentity`. Mirrors the
 * `PlatformIdentity` shape emitted by the relationship-extraction evaluator.
 */
export interface PlatformIdentityInput {
    platform: string;
    handle: string;
    verified?: boolean;
    confidence: number;
    source?: string;
}
export type MergeCandidateStatus = "pending" | "accepted" | "rejected";
export interface MergeCandidateEvidence {
    platform?: string;
    handle?: string;
    identityIds?: UUID[];
    notes?: string;
    [extra: string]: JsonValue | UUID[] | undefined;
}
export interface MergeCandidateRecord {
    id: UUID;
    entityA: UUID;
    entityB: UUID;
    confidence: number;
    evidence: MergeCandidateEvidence;
    status: MergeCandidateStatus;
    proposedAt: string;
    resolvedAt?: string;
}
export interface FollowUpSchedule {
    entityId: UUID;
    scheduledAt: string;
    reason: string;
    priority: "high" | "medium" | "low";
    completed: boolean;
    taskId?: UUID;
}
export declare enum EntityLifecycleEvent {
    CREATED = "entity:created",
    UPDATED = "entity:updated",
    MERGED = "entity:merged",
    RESOLVED = "entity:resolved"
}
export interface EntityEventData {
    entity: Entity;
    previousEntity?: Entity;
    mergedEntities?: Entity[];
    source?: string;
    confidence?: number;
}
/**
 * Calculate relationship strength based on interaction patterns
 */
export declare function calculateRelationshipStrength({ interactionCount, lastInteractionAt, messageQuality, relationshipType, sharedConversationWindows, }: {
    interactionCount: number;
    lastInteractionAt?: string;
    messageQuality?: number;
    relationshipType?: string;
    sharedConversationWindows?: number;
}): number;
type RelationshipMessageLike = {
    entityId?: UUID;
    roomId?: UUID;
    createdAt?: number | string | null;
};
export declare function countSharedConversationWindows(messages: RelationshipMessageLike[], leftEntityId: UUID, rightEntityId: UUID, windowMs?: number): number;
export declare class RelationshipsService extends Service {
    static serviceType: "relationships";
    capabilityDescription: string;
    private contactInfoCache;
    private analyticsCache;
    private categoriesCache;
    private static readonly CONTACT_CACHE_LIMIT;
    private static readonly ANALYTICS_CACHE_LIMIT;
    private graphResolvers;
    private graphServiceInstance;
    private setCacheWithLimit;
    private getRelationshipsWorldId;
    private getRelationshipsRoomId;
    private isRelationshipsContactComponent;
    private getStoredContactComponent;
    private cacheContactInfoFromEntities;
    initialize(runtime: IAgentRuntime): Promise<void>;
    stop(): Promise<void>;
    static start(runtime: IAgentRuntime): Promise<Service>;
    private loadContactInfoFromComponents;
    addContact(entityId: UUID, categories?: string[], preferences?: ContactPreferences, customFields?: Record<string, JsonValue>): Promise<ContactInfo>;
    updateContact(entityId: UUID, updates: Partial<ContactInfo>): Promise<ContactInfo | null>;
    getContact(entityId: UUID): Promise<ContactInfo | null>;
    removeContact(entityId: UUID): Promise<boolean>;
    searchContacts(criteria: {
        categories?: string[];
        tags?: string[];
        searchTerm?: string;
        privacyLevel?: string;
    }): Promise<ContactInfo[]>;
    analyzeRelationship(sourceEntityId: UUID, targetEntityId: UUID): Promise<RelationshipAnalytics | null>;
    getRelationshipInsights(entityId: UUID): Promise<{
        strongestRelationships: Array<{
            entity: Entity;
            analytics: RelationshipAnalytics;
        }>;
        needsAttention: Array<{
            entity: Entity;
            daysSinceContact: number;
        }>;
        recentInteractions: Array<{
            entity: Entity;
            lastInteraction: string;
        }>;
    }>;
    getCategories(): Promise<ContactCategory[]>;
    addCategory(category: ContactCategory): Promise<void>;
    setContactPrivacy(entityId: UUID, privacyLevel: "public" | "private" | "restricted"): Promise<boolean>;
    canAccessContact(requestingEntityId: UUID, targetEntityId: UUID): Promise<boolean>;
    /** Persist a ContactInfo back to its component + cache. */
    private persistContactInfo;
    /**
     * Add a platform handle to a contact. Enforces uniqueness on
     * (platform, identifier) pairs across the contact.
     */
    addHandle(contactId: UUID, handle: {
        platform: string;
        identifier: string;
        displayLabel?: string;
        isPrimary?: boolean;
    }): Promise<ContactHandle>;
    removeHandle(contactId: UUID, handleId: UUID): Promise<boolean>;
    /**
     * Record an interaction with a contact. Trims interaction history to
     * MAX_INTERACTION_HISTORY entries (most recent kept). Updates
     * lastInteractionAt so followup thresholds stay accurate.
     */
    recordInteraction(input: RecordInteractionInput): Promise<ContactInteraction>;
    /**
     * Find a contact by one of its platform handles. Match is case-insensitive
     * on identifier; platform is normalized to lowercase.
     */
    findByHandle(platform: string, identifier: string): Promise<ContactInfo | null>;
    /**
     * Merge two contacts. Handles, interactions, tags, and categories from the
     * secondary are folded into the primary. The secondary contact is removed.
     */
    mergeContacts(primaryId: UUID, secondaryId: UUID): Promise<ContactInfo>;
    setRelationshipGoal(contactId: UUID, goal: {
        goalText: string;
        targetCadenceDays?: number;
    }): Promise<RelationshipGoal>;
    getRelationshipProgress(contactId: UUID): Promise<RelationshipProgress | null>;
    /**
     * List all contacts whose followup threshold has lapsed. A contact is
     * considered overdue when:
     *   - followupThresholdDays is set (or defaultThresholdDays is provided), AND
     *   - (now - lastInteractionAt) > thresholdDays, OR lastInteractionAt is null.
     */
    listOverdueFollowups(options?: ListOverdueOptions): Promise<OverdueFollowup[]>;
    /**
     * Import contacts from an external platform. For each seed:
     *   - if an existing contact has a matching (platform, identifier) handle,
     *     link any new metadata and return it as linkedToExisting;
     *   - otherwise create a new entity + contact.
     */
    importContactsFromPlatform(platform: string, contacts: PlatformContactSeed[]): Promise<PlatformImportResult>;
    private getRuntimeDb;
    private execSql;
    /**
     * Insert or strengthen an `entity_identities` row. Re-observations of the
     * same (entity, platform, handle) triple bump confidence to the max,
     * append (deduped) evidence message ids, and update last_seen.
     *
     * When the same (platform, handle) pair has already been observed for a
     * different entity AND this observation is high-confidence with
     * sufficient evidence, an auto-merge candidate is proposed and accepted.
     */
    upsertIdentity(entityId: UUID, identity: PlatformIdentityInput, evidenceMessageIds?: UUID[]): Promise<void>;
    getEntityIdentities(entityId: UUID): Promise<EntityIdentityRecord[]>;
    private findEntitiesByIdentity;
    proposeMerge(entityA: UUID, entityB: UUID, evidence: MergeCandidateEvidence): Promise<UUID>;
    getCandidateMerges(): Promise<MergeCandidateRecord[]>;
    acceptMerge(candidateId: UUID): Promise<void>;
    rejectMerge(candidateId: UUID): Promise<void>;
    /**
     * Return every entity that belongs to the same identity cluster as
     * `primaryEntityId`. An identity cluster is the connected component
     * formed by:
     *   - confirmed identity-link relationships (tag `identity_link`,
     *     metadata.status === "confirmed"), and
     *   - shared entity_identities rows (same (platform, handle) on two
     *     different entities).
     *
     * The returned array always includes `primaryEntityId` itself.
     * Semantics match the runtime-level clusterer in
     * `@elizaos/agent/src/services/relationships-graph.ts` (buildClusters),
     * including contact-platform suppression (email/phone/website handles
     * are *not* treated as cluster-forming — they're enrichment, not
     * identity evidence).
     */
    getMemberEntityIds(primaryEntityId: UUID): Promise<UUID[]>;
    /**
     * Resolve an entity to its cluster's primary entity.
     *
     * The primary is the member with a contact_info component if one
     * exists; otherwise the lexicographically-smallest UUID. This matches
     * the runtime-level clusterer's tiebreaker semantics when no scoring
     * data (EntityContext) is available at the service layer.
     *
     * If the entity is not part of a multi-member cluster, returns the
     * entity id itself.
     */
    resolvePrimaryEntityId(entityId: UUID): Promise<UUID>;
    /**
     * Build a UnionFind keyed by UUID containing every entity reachable
     * from `seedEntityId` via confirmed identity-link relationships or
     * shared entity_identities rows.
     *
     * We expand iteratively so we don't have to materialise the full
     * graph: at each step, we query relationships/identities for the
     * newly-discovered frontier and union in any new neighbours.
     */
    private buildIdentityUnionFind;
    private getIdentityRowsForEntities;
    private findEntitiesSharingHandleKey;
    /**
     * Inject runtime resolvers used while building graph snapshots. Owner
     * resolution and configured-owner-name lookup live outside core (they
     * depend on agent-level config), so the agent package wires them in.
     */
    setGraphResolvers(resolvers: GraphResolvers): void;
    private getGraphServiceInstance;
    getGraphSnapshot(query?: RelationshipsGraphQuery): Promise<RelationshipsGraphSnapshot>;
    getPersonDetail(primaryEntityId: UUID): Promise<RelationshipsPersonDetail | null>;
}
export {};
//# sourceMappingURL=relationships.d.ts.map