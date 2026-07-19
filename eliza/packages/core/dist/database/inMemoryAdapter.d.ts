/**
 * In-memory `IDatabaseAdapter` implementation — the storage fallback the
 * runtime installs when no adapter is provided and `ALLOW_NO_DATABASE` is set,
 * and the backing store for unit/integration tests, benchmarks, and
 * ephemeral/serverless runs.
 *
 * Implements the full batch-first `IDatabaseAdapter` surface (memories,
 * entities/components, rooms/participants, relationships, tasks, cache,
 * pairing, connector accounts + OAuth flow state) over plain Maps and arrays;
 * the single-item CRUD conveniences live on `AgentRuntime` and delegate here.
 * Semantics are kept honest against plugin-sql — newest-first ordering (id as
 * tiebreaker), case-insensitive `textContains` (ILIKE), and metadata
 * containment all mirror the SQL adapters. Persistence is process-local and
 * lost on restart.
 */
import { DatabaseAdapter } from "../database.js";
import type { AccessContext, Agent, AppendConnectorAccountAuditEventParams, Component, ConnectorAccountAuditEventRecord, ConnectorAccountCredentialRefRecord, ConnectorAccountRecord, ConsumeOAuthFlowStateParams, CreateOAuthFlowStateParams, DeleteConnectorAccountParams, DeleteOAuthFlowStateParams, EntitiesForRoomsResult, Entity, GetConnectorAccountCredentialRefParams, GetConnectorAccountParams, GetOAuthFlowStateParams, IDatabaseAdapter, ListConnectorAccountCredentialRefsParams, ListConnectorAccountsParams, Log, LogBody, Memory, MemoryMetadata, MessageSearchHit, Metadata, OAuthFlowRecord, PairingAllowlistEntry, PairingAllowlistsResult, PairingChannel, PairingRequest, PairingRequestsResult, Participant, ParticipantsForRoomsResult, ParticipantUpdateFields, ParticipantUserState, PatchOp, Relationship, Room, SetConnectorAccountCredentialRefParams, Task, UpdateOAuthFlowStateParams, UpsertConnectorAccountParams, UUID, World } from "../types/index.js";
/**
 * In-memory database adapter.
 *
 * Intended for:
 * - Unit / integration tests (fast, no external dependencies)
 * - Benchmarks (measure agent logic without DB latency)
 * - Serverless / ephemeral runs (no persistence needed)
 *
 * Implements the full batch-first `IDatabaseAdapter` surface using plain
 * Maps and arrays. No single-item CRUD methods exist here -- those are
 * convenience wrappers on AgentRuntime that delegate to these batch methods.
 *
 * WHY Maps and not a single big array:
 * - `memoriesById` gives O(1) ID lookups (batch getMemoriesByIds)
 * - `memoriesByRoom` gives O(1) room-scoped queries (getMemories, countMemories)
 * - This mirrors how SQL adapters use indexed columns, keeping the
 *   in-memory adapter's performance characteristics honest.
 *
 * Persistence is process-local. Data is lost on restart.
 */
export declare class InMemoryDatabaseAdapter extends DatabaseAdapter<Record<string, never>> {
    db: Record<string, never>;
    private ready;
    private agents;
    private entities;
    private components;
    private componentIdsByEntity;
    private componentIdsByNaturalKey;
    private relationships;
    private rooms;
    private worlds;
    private tasks;
    private logs;
    private memoriesById;
    private memoriesByRoom;
    private cache;
    private participantsByRoom;
    private roomsByParticipant;
    private participantUserState;
    private pairingRequests;
    private pairingAllowlist;
    private connectorAccountsById;
    private connectorAccountIdsByKey;
    private connectorCredentialRefs;
    private connectorAuditEvents;
    private oauthFlowsByStateHash;
    private cloneComponent;
    private cloneRelationship;
    private attachComponents;
    private getStoredComponentsForEntity;
    private indexComponent;
    private removeComponentIndexes;
    initialize(_config?: Record<string, string | number | boolean | null>): Promise<void>;
    init(): Promise<void>;
    runPluginMigrations(): Promise<void>;
    runMigrations(): Promise<void>;
    isReady(): Promise<boolean>;
    close(): Promise<void>;
    getConnection(): Promise<Record<string, never>>;
    getAgentsByIds(agentIds: UUID[]): Promise<Agent[]>;
    createAgents(agents: Partial<Agent>[]): Promise<UUID[]>;
    upsertAgents(agents: Partial<Agent>[]): Promise<void>;
    updateAgents(updates: Array<{
        agentId: UUID;
        agent: Partial<Agent>;
    }>): Promise<boolean>;
    deleteAgents(agentIds: UUID[]): Promise<boolean>;
    countAgents(): Promise<number>;
    cleanupAgents(): Promise<void>;
    getAgents(): Promise<Partial<Agent>[]>;
    ensureEmbeddingDimension(_dimension: number): Promise<void>;
    clearEmbeddingsOutsideActiveDimension(): Promise<UUID[]>;
    transaction<T>(callback: (tx: IDatabaseAdapter<Record<string, never>>) => Promise<T>, _options?: {
        entityContext?: UUID;
    }): Promise<T>;
    queryEntities(_params: {
        componentType?: string;
        componentDataFilter?: Record<string, unknown>;
        agentId?: UUID;
        entityIds?: UUID[];
        worldId?: UUID;
        limit?: number;
        offset?: number;
        includeAllComponents?: boolean;
        entityContext?: UUID;
    }): Promise<Entity[]>;
    getEntitiesForRooms(roomIds: UUID[], _includeComponents?: boolean): Promise<EntitiesForRoomsResult>;
    createEntities(entities: Entity[]): Promise<UUID[]>;
    upsertEntities(entities: Entity[]): Promise<void>;
    searchEntitiesByName(params: {
        query: string;
        agentId: UUID;
        limit?: number;
    }): Promise<Entity[]>;
    getEntitiesByNames(params: {
        names: string[];
        agentId: UUID;
    }): Promise<Entity[]>;
    getComponentsByNaturalKeys(keys: Array<{
        entityId: UUID;
        type: string;
        worldId?: UUID;
        sourceEntityId?: UUID;
    }>): Promise<(Component | null)[]>;
    getComponentsForEntities(_entityIds: UUID[], _worldId?: UUID, _sourceEntityId?: UUID): Promise<Component[]>;
    getEntitiesByIds(entityIds: UUID[]): Promise<Entity[]>;
    updateEntities(entities: Entity[]): Promise<void>;
    deleteEntities(entityIds: UUID[]): Promise<void>;
    createComponents(components: Component[]): Promise<UUID[]>;
    getComponentsByIds(_componentIds: UUID[]): Promise<Component[]>;
    updateComponents(_components: Component[]): Promise<void>;
    deleteComponents(_componentIds: UUID[]): Promise<void>;
    upsertComponents(_components: Component[], _options?: {
        entityContext?: UUID;
    }): Promise<void>;
    patchComponents(_updates: Array<{
        componentId: UUID;
        ops: PatchOp[];
    }>, _options?: {
        entityContext?: UUID;
    }): Promise<void>;
    getMemories(params: {
        entityId?: UUID;
        agentId?: UUID;
        limit?: number;
        count?: number;
        offset?: number;
        unique?: boolean;
        tableName: string;
        start?: number;
        end?: number;
        roomId?: UUID;
        worldId?: UUID;
        metadata?: Record<string, unknown>;
        textContains?: string;
        orderBy?: "createdAt";
        orderDirection?: "asc" | "desc";
        includeEmbedding?: boolean;
        accessContext?: AccessContext;
    }): Promise<Memory[]>;
    getMemoriesByIds(ids: UUID[]): Promise<Memory[]>;
    getMemoriesByRoomIds(params: {
        tableName: string;
        roomIds: UUID[];
        limit?: number;
        offset?: number;
        textContains?: string;
        includeEmbedding?: boolean;
        accessContext?: AccessContext;
    }): Promise<Memory[]>;
    searchMessages(params: {
        roomIds: UUID[];
        query: string;
        tableName?: string;
        limit?: number;
        offset?: number;
        since?: number;
        until?: number;
        accessContext?: AccessContext;
    }): Promise<MessageSearchHit[]>;
    getCachedEmbeddings(): Promise<{
        embedding: number[];
        levenshtein_score: number;
    }[]>;
    getLogs(params: {
        entityId?: UUID;
        roomId?: UUID;
        type?: string;
        limit?: number;
        offset?: number;
    }): Promise<Log[]>;
    getLogsByIds(logIds: UUID[]): Promise<Log[]>;
    createLogs(params: Array<{
        body: LogBody;
        entityId: UUID;
        roomId: UUID;
        type: string;
    }>): Promise<void>;
    updateLogs(logs: Array<{
        id: UUID;
        updates: Partial<Log>;
    }>): Promise<void>;
    deleteLogs(logIds: UUID[]): Promise<void>;
    searchMemories(_params: {
        tableName: string;
        embedding: number[];
        match_threshold?: number;
        count?: number;
        limit?: number;
        unique?: boolean;
        query?: string;
        roomId?: UUID;
        worldId?: UUID;
        entityId?: UUID;
        accessContext?: AccessContext;
    }): Promise<Memory[]>;
    createMemories(memories: Array<{
        memory: Memory;
        tableName: string;
        unique?: boolean;
    }>): Promise<UUID[]>;
    updateMemories(memories: Array<Partial<Memory> & {
        id: UUID;
        metadata?: MemoryMetadata;
    }>): Promise<void>;
    upsertMemories(memories: Array<{
        memory: Memory;
        tableName: string;
    }>, _options?: {
        entityContext?: UUID;
    }): Promise<void>;
    deleteMemories(memoryIds: UUID[]): Promise<void>;
    deleteAllMemories(roomIds: UUID[], tableName: string): Promise<void>;
    countMemories(params: {
        roomIds?: UUID[];
        unique?: boolean;
        tableName?: string;
        entityId?: UUID;
        agentId?: UUID;
        metadata?: Record<string, unknown>;
    }): Promise<number>;
    getWorldsByIds(worldIds: UUID[]): Promise<World[]>;
    createWorlds(worlds: World[]): Promise<UUID[]>;
    upsertWorlds(worlds: World[]): Promise<void>;
    deleteWorlds(worldIds: UUID[]): Promise<void>;
    updateWorlds(worlds: World[]): Promise<void>;
    getAllWorlds(): Promise<World[]>;
    updateRooms(rooms: Room[]): Promise<void>;
    deleteRooms(roomIds: UUID[]): Promise<void>;
    getRoomsByIds(roomIds: UUID[]): Promise<Room[]>;
    createRooms(rooms: Room[]): Promise<UUID[]>;
    upsertRooms(rooms: Room[]): Promise<void>;
    getRoomsForParticipants(entityIds: UUID[]): Promise<UUID[]>;
    getRoomsByWorlds(worldIds: UUID[], limit?: number, offset?: number): Promise<Room[]>;
    getParticipantsForEntities(entityIds: UUID[]): Promise<Participant[]>;
    getParticipantsForRooms(roomIds: UUID[]): Promise<ParticipantsForRoomsResult>;
    createRoomParticipants(entityIds: UUID[], roomId: UUID): Promise<UUID[]>;
    deleteParticipants(participants: Array<{
        entityId: UUID;
        roomId: UUID;
    }>): Promise<boolean>;
    updateParticipants(participants: Array<{
        entityId: UUID;
        roomId: UUID;
        updates: ParticipantUpdateFields;
    }>): Promise<void>;
    areRoomParticipants(pairs: Array<{
        roomId: UUID;
        entityId: UUID;
    }>): Promise<boolean[]>;
    getParticipantUserStates(pairs: Array<{
        roomId: UUID;
        entityId: UUID;
    }>): Promise<ParticipantUserState[]>;
    updateParticipantUserStates(updates: Array<{
        roomId: UUID;
        entityId: UUID;
        state: ParticipantUserState;
    }>): Promise<void>;
    getRelationshipsByPairs(pairs: Array<{
        sourceEntityId: UUID;
        targetEntityId: UUID;
    }>): Promise<(Relationship | null)[]>;
    getRelationships(params: {
        entityIds?: UUID[];
        entityId?: UUID;
        tags?: string[];
        limit?: number;
        offset?: number;
    }): Promise<Relationship[]>;
    createRelationships(relationships: Array<{
        sourceEntityId: UUID;
        targetEntityId: UUID;
        tags?: string[];
        metadata?: Metadata;
    }>): Promise<UUID[]>;
    getRelationshipsByIds(relationshipIds: UUID[]): Promise<Relationship[]>;
    updateRelationships(relationships: Relationship[]): Promise<void>;
    deleteRelationships(relationshipIds: UUID[]): Promise<void>;
    getCaches<T>(keys: string[]): Promise<Map<string, T>>;
    setCaches<T>(entries: Array<{
        key: string;
        value: T;
    }>): Promise<boolean>;
    deleteCaches(keys: string[]): Promise<boolean>;
    getTasks(params: {
        roomId?: UUID;
        tags?: string[];
        entityId?: UUID;
        agentIds: UUID[];
        limit?: number;
        offset?: number;
    }): Promise<Task[]>;
    getTasksByName(name: string): Promise<Task[]>;
    createTasks(tasks: Task[]): Promise<UUID[]>;
    getTasksByIds(taskIds: UUID[]): Promise<Task[]>;
    updateTasks(updates: Array<{
        id: UUID;
        task: Partial<Task>;
    }>): Promise<void>;
    deleteTasks(taskIds: UUID[]): Promise<void>;
    getMemoriesByWorldId(params: {
        worldIds?: UUID[];
        limit?: number;
        tableName?: string;
    }): Promise<Memory[]>;
    deleteRoomsByWorldIds(worldIds: UUID[]): Promise<void>;
    getPairingRequests(queries: Array<{
        channel: PairingChannel;
        agentId: UUID;
    }>): Promise<PairingRequestsResult>;
    createPairingRequests(requests: PairingRequest[]): Promise<UUID[]>;
    updatePairingRequests(requests: PairingRequest[]): Promise<void>;
    deletePairingRequests(ids: UUID[]): Promise<void>;
    getPairingAllowlists(queries: Array<{
        channel: PairingChannel;
        agentId: UUID;
    }>): Promise<PairingAllowlistsResult>;
    createPairingAllowlistEntries(entries: PairingAllowlistEntry[]): Promise<UUID[]>;
    updatePairingAllowlistEntries(entries: PairingAllowlistEntry[]): Promise<void>;
    deletePairingAllowlistEntries(ids: UUID[]): Promise<void>;
    listConnectorAccounts(params?: ListConnectorAccountsParams): Promise<ConnectorAccountRecord[]>;
    getConnectorAccount(params: GetConnectorAccountParams): Promise<ConnectorAccountRecord | null>;
    upsertConnectorAccount(params: UpsertConnectorAccountParams): Promise<ConnectorAccountRecord>;
    deleteConnectorAccount(params: DeleteConnectorAccountParams): Promise<boolean>;
    setConnectorAccountCredentialRef(params: SetConnectorAccountCredentialRefParams): Promise<ConnectorAccountCredentialRefRecord>;
    getConnectorAccountCredentialRef(params: GetConnectorAccountCredentialRefParams): Promise<ConnectorAccountCredentialRefRecord | null>;
    listConnectorAccountCredentialRefs(params: ListConnectorAccountCredentialRefsParams): Promise<ConnectorAccountCredentialRefRecord[]>;
    appendConnectorAccountAuditEvent(params: AppendConnectorAccountAuditEventParams): Promise<ConnectorAccountAuditEventRecord>;
    createOAuthFlowState(params: CreateOAuthFlowStateParams): Promise<OAuthFlowRecord>;
    consumeOAuthFlowState(params: ConsumeOAuthFlowStateParams): Promise<OAuthFlowRecord | null>;
    private findOAuthFlowState;
    getOAuthFlowState(params: GetOAuthFlowStateParams): Promise<OAuthFlowRecord | null>;
    updateOAuthFlowState(params: UpdateOAuthFlowStateParams): Promise<OAuthFlowRecord | null>;
    deleteOAuthFlowState(params: DeleteOAuthFlowStateParams): Promise<boolean>;
}
//# sourceMappingURL=inMemoryAdapter.d.ts.map