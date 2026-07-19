import type { IAgentRuntime, JsonValue, Memory, UUID } from "../types/index.js";
/** Aligns with `MergeCandidateEvidence` in `relationships.ts` (kept here to avoid a circular import). */
export type RelationshipsMergeProposalEvidence = {
    platform?: string;
    handle?: string;
    identityIds?: UUID[];
    notes?: string;
    [extra: string]: JsonValue | UUID[] | undefined;
};
export type RelationshipsGraphQuery = {
    search?: string | null;
    platform?: string | null;
    limit?: number;
    offset?: number;
    scope?: "all" | "relevant";
};
export type RelationshipsMergeCandidate = {
    id: UUID;
    entityA: UUID;
    entityB: UUID;
    confidence: number;
    evidence: Record<string, unknown>;
    status: "pending" | "accepted" | "rejected";
    proposedAt: string;
    resolvedAt?: string;
};
export type RelationshipsGraphSnapshot = {
    people: RelationshipsPersonSummary[];
    relationships: RelationshipsGraphEdge[];
    stats: RelationshipsGraphStats;
    candidateMerges: RelationshipsMergeCandidate[];
};
export type RelationshipsGraphStats = {
    totalPeople: number;
    totalRelationships: number;
    totalIdentities: number;
};
export type RelationshipsIdentityHandle = {
    entityId: UUID;
    platform: string;
    handle: string;
    status?: string | null;
    verified?: boolean | null;
};
export type RelationshipsIdentitySummary = {
    entityId: UUID;
    names: string[];
    platforms: string[];
    handles: RelationshipsIdentityHandle[];
};
export type RelationshipsProfile = {
    entityId: UUID;
    source: string;
    handle?: string | null;
    userId?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
    canonical?: boolean | null;
};
export type RelationshipsPersonSummary = {
    groupId: UUID;
    primaryEntityId: UUID;
    memberEntityIds: UUID[];
    displayName: string;
    aliases: string[];
    platforms: string[];
    identities: RelationshipsIdentitySummary[];
    emails: string[];
    phones: string[];
    websites: string[];
    preferredCommunicationChannel: string | null;
    categories: string[];
    tags: string[];
    factCount: number;
    relationshipCount: number;
    isOwner: boolean;
    profiles: RelationshipsProfile[];
    lastInteractionAt?: string;
};
export type RelationshipsGraphEdge = {
    id: string;
    sourcePersonId: UUID;
    targetPersonId: UUID;
    sourcePersonName: string;
    targetPersonName: string;
    relationshipTypes: string[];
    sentiment: string;
    strength: number;
    interactionCount: number;
    lastInteractionAt?: string;
    rawRelationshipIds: string[];
};
export type RelationshipsPersonFact = {
    id: string;
    sourceType: "claim" | "contact" | "memory";
    text: string;
    field?: string;
    value?: string;
    scope?: string;
    confidence?: number;
    updatedAt?: string;
    /** ISO8601 timestamp from the FactRefinementEvaluator metadata. */
    lastReinforced?: string;
    /** Message IDs that contributed evidence for this fact. */
    evidenceMessageIds?: string[];
    provenance?: RelationshipsFactProvenance;
    extractedInformation?: RelationshipsFactExtractedInformation;
};
export type RelationshipsFactProvenance = {
    source?: string;
    evaluatorName?: string;
    sourceTrajectoryId?: UUID;
    lastReinforced?: string;
    evidenceMessageIds: string[];
};
export type RelationshipsFactExtractedInformation = {
    scope?: string;
    raw?: Record<string, unknown>;
};
export type RelationshipsConversationMessage = {
    id: string;
    entityId?: UUID;
    speaker: string;
    text: string;
    createdAt?: number;
};
export type RelationshipsConversationSnippet = {
    roomId: UUID;
    roomName: string;
    lastActivityAt?: string;
    messages: RelationshipsConversationMessage[];
};
export type RelationshipsIdentityEdge = {
    id: string;
    sourceEntityId: UUID;
    targetEntityId: UUID;
    confidence: number;
    status: string;
};
export type RelationshipsRelevantMemory = {
    id: string;
    sourceType: "message";
    entityId?: UUID;
    roomId?: UUID;
    roomName: string | null;
    speaker: string;
    text: string;
    createdAt?: string;
    source?: string | null;
};
export type RelationshipsUserPersonalityPreference = {
    id: string;
    entityId: UUID;
    text: string;
    category?: string;
    originalRequest?: string;
    source?: string | null;
    createdAt?: string;
};
export type RelationshipsPersonDetail = RelationshipsPersonSummary & {
    facts: RelationshipsPersonFact[];
    recentConversations: RelationshipsConversationSnippet[];
    relevantMemories: RelationshipsRelevantMemory[];
    relationships: RelationshipsGraphEdge[];
    identityEdges: RelationshipsIdentityEdge[];
    userPersonalityPreferences: RelationshipsUserPersonalityPreference[];
};
export type RelationshipsGraphService = {
    getGraphSnapshot: (query?: RelationshipsGraphQuery) => Promise<RelationshipsGraphSnapshot>;
    getPersonDetail: (primaryEntityId: UUID) => Promise<RelationshipsPersonDetail | null>;
    getCandidateMerges: () => Promise<RelationshipsMergeCandidate[]>;
    acceptMerge: (candidateId: UUID) => Promise<void>;
    rejectMerge: (candidateId: UUID) => Promise<void>;
    proposeMerge: (entityA: UUID, entityB: UUID, evidence: RelationshipsMergeProposalEvidence) => Promise<UUID>;
};
type RelationshipsContactLike = {
    entityId: UUID;
    categories?: string[];
    tags?: string[];
    preferences?: {
        preferredCommunicationChannel?: string;
    };
    customFields?: Record<string, unknown>;
    lastModified?: string;
};
export type RelationshipsServiceLike = {
    getContact?: (entityId: UUID) => Promise<RelationshipsContactLike | null | undefined>;
    searchContacts?: (criteria: {
        categories?: string[];
        tags?: string[];
        searchTerm?: string;
        privacyLevel?: string;
    }) => Promise<RelationshipsContactLike[]>;
    getCandidateMerges?: () => Promise<unknown[]>;
    acceptMerge?: (candidateId: UUID) => Promise<void>;
    rejectMerge?: (candidateId: UUID) => Promise<void>;
    proposeMerge?: (entityA: UUID, entityB: UUID, evidence: RelationshipsMergeProposalEvidence) => Promise<UUID>;
};
export interface GraphResolvers {
    resolveOwnerEntityId: (runtime: IAgentRuntime) => Promise<UUID | string | null>;
    fetchConfiguredOwnerName: () => Promise<string | null>;
}
export declare function createNativeRelationshipsGraphService(runtime: IAgentRuntime, relationshipsService: RelationshipsServiceLike, resolvers?: GraphResolvers): RelationshipsGraphService;
export type ClusterMemoriesQuery = {
    tableName: string;
    roomId?: UUID;
    worldId?: UUID;
    count?: number;
    limit?: number;
    offset?: number;
    unique?: boolean;
    start?: number;
    end?: number;
    metadata?: Record<string, unknown>;
    orderBy?: "createdAt";
    orderDirection?: "asc" | "desc";
};
export type ClusterSearchQuery = {
    tableName: string;
    embedding: number[];
    match_threshold?: number;
    limit?: number;
    unique?: boolean;
    query?: string;
    roomId?: UUID;
    worldId?: UUID;
};
/**
 * Return memories authored by any member of the identity cluster rooted at
 * `primaryEntityId`. If the RelationshipsService cannot be resolved (no
 * cluster lookup available) we fall through to the single-entity query so
 * callers still get results — the caller is responsible for surfacing the
 * degradation via its own `degraded` flag.
 */
export declare function getMemoriesForCluster(runtime: IAgentRuntime, primaryEntityId: UUID, params: ClusterMemoriesQuery): Promise<Memory[]>;
/**
 * Semantic-search variant of {@link getMemoriesForCluster}. Runs one
 * `searchMemories` per cluster member with the same embedding/query
 * parameters and deduplicates the union on memory id.
 */
export declare function searchMemoriesForCluster(runtime: IAgentRuntime, primaryEntityId: UUID, params: ClusterSearchQuery): Promise<Memory[]>;
export {};
//# sourceMappingURL=relationships-graph-builder.d.ts.map