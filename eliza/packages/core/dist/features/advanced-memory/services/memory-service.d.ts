/**
 * Runs the advanced-memory capability's `memory` service: short-term
 * conversation summarization plus extraction and retrieval of long-term
 * persistent facts. Registered by createAdvancedMemoryPlugin and consumed by
 * the capability's providers (long-term-memory, context-summary) and evaluators
 * (summary, long-term-memory).
 *
 * Persistence is delegated to a MemoryStorageProvider discovered at runtime via
 * getService("memoryStorage") — supplied by a database plugin. When none is
 * registered the service degrades gracefully: reads return empty, writes throw a
 * descriptive error, and storage-backed features stay disabled. Thresholds and
 * cadences come from runtime.getSetting (MEMORY_* keys) at initialize().
 *
 * Long-term reads are identity-cluster aware — they fan out across related
 * entity IDs and dedupe by memory id so a cluster of N members yields distinct
 * results rather than N copies. Vector search uses a native provider override
 * when available and otherwise falls back to an in-process cosine scan (or to
 * recent memories when vector search is disabled). The per-room session and
 * per-(entity,room) extraction-checkpoint maps are capped FIFO to bound memory
 * over long-lived processes. Also exports formatLongTermMemories, a pure helper
 * that renders memories as a category-grouped markdown block.
 */
import { type IAgentRuntime, Service, type ServiceTypeName, type UUID } from "../../../types/index.js";
import type { LongTermMemory, LongTermMemoryCategory, MemoryConfig, SessionSummary } from "../types.js";
export declare class MemoryService extends Service {
    static serviceType: ServiceTypeName;
    private sessionMessageCounts;
    private memoryConfig;
    private lastExtractionCheckpoints;
    private static readonly MAX_SESSION_ENTRIES;
    /** Resolved at initialize(). null means no storage backend is available. */
    private storage;
    capabilityDescription: string;
    constructor(runtime?: IAgentRuntime);
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    private capSessionMap;
    initialize(runtime: IAgentRuntime): Promise<void>;
    private getStorage;
    private requireStorage;
    private countRoomMemories;
    getConfig(): MemoryConfig;
    updateConfig(updates: Partial<MemoryConfig>): void;
    incrementMessageCount(roomId: UUID): number;
    resetMessageCount(roomId: UUID): void;
    shouldSummarize(roomId: UUID): Promise<boolean>;
    private getExtractionKey;
    getLastExtractionCheckpoint(entityId: UUID, roomId: UUID): Promise<number>;
    setLastExtractionCheckpoint(entityId: UUID, roomId: UUID, messageCount: number): Promise<void>;
    shouldRunExtraction(entityId: UUID, roomId: UUID, currentMessageCount: number): Promise<boolean>;
    storeLongTermMemory(memory: Omit<LongTermMemory, "id" | "createdAt" | "updatedAt" | "accessCount">): Promise<LongTermMemory>;
    getLongTermMemories(entityId: UUID, category?: LongTermMemoryCategory, limit?: number): Promise<LongTermMemory[]>;
    updateLongTermMemory(id: UUID, entityId: UUID, updates: Partial<Omit<LongTermMemory, "id" | "agentId" | "entityId" | "createdAt">>): Promise<void>;
    deleteLongTermMemory(id: UUID, entityId: UUID): Promise<void>;
    getCurrentSessionSummary(roomId: UUID): Promise<SessionSummary | null>;
    storeSessionSummary(summary: Omit<SessionSummary, "id" | "createdAt" | "updatedAt">): Promise<SessionSummary>;
    updateSessionSummary(id: UUID, roomId: UUID, updates: Partial<Omit<SessionSummary, "id" | "agentId" | "roomId" | "createdAt" | "updatedAt">>): Promise<void>;
    getSessionSummaries(roomId: UUID, limit?: number): Promise<SessionSummary[]>;
    searchLongTermMemories(entityId: UUID, queryEmbedding: number[], limit?: number, matchThreshold?: number): Promise<LongTermMemory[]>;
    getFormattedLongTermMemories(entityId: UUID): Promise<string>;
}
/**
 * Render long-term memories as a category-grouped markdown string. Pure helper
 * so callers that already have the memories (e.g. the long-term provider) can
 * format them without a second storage round-trip.
 */
export declare function formatLongTermMemories(memories: LongTermMemory[]): string;
//# sourceMappingURL=memory-service.d.ts.map