import { type AccessContext, type IAgentRuntime, type Memory, type Metadata, Service, type UUID } from "../../types/index.js";
import type { AddDocumentOptions, DocumentsConfig, DocumentVisibilityScope, StoredDocument } from "./types.js";
/**
 * Controls how document search combines vector and keyword scores.
 *
 * - "hybrid"  — (default) vector cosine + BM25, weighted 0.6/0.4.
 *               Falls back to "keyword" automatically when no TEXT_EMBEDDING
 *               model is registered (e.g. the cerebras runner).
 * - "vector"  — Pure vector / cosine-similarity search.
 * - "keyword" — Pure BM25 keyword search; does not require an embedding model.
 */
export type SearchMode = "hybrid" | "vector" | "keyword";
export declare class DocumentService extends Service {
    static readonly serviceType = "documents";
    config: Metadata;
    capabilityDescription: string;
    private documentProcessingSemaphore;
    constructor(runtime?: IAgentRuntime, _config?: Partial<DocumentsConfig>);
    private loadInitialDocuments;
    static start(runtime: IAgentRuntime): Promise<DocumentService>;
    static stop(runtime: IAgentRuntime): Promise<void>;
    stop(): Promise<void>;
    private isDocumentMemory;
    private isDocumentFragmentMemory;
    private getSenderDocumentRole;
    canAccessDocument(memory: Memory, message?: Memory): Promise<boolean>;
    private filterVisibleMemories;
    getDocumentById(documentId: UUID, message?: Memory): Promise<Memory | null>;
    listDocuments(message?: Memory, options?: {
        limit?: number;
        offset?: number;
        query?: string;
        scope?: DocumentVisibilityScope;
        scopedToEntityId?: UUID;
        addedBy?: UUID;
        timeRangeStart?: number;
        timeRangeEnd?: number;
        tags?: string[];
    }): Promise<Memory[]>;
    deleteDocument(documentId: UUID, message?: Memory): Promise<void>;
    private backfillDocumentScopes;
    private buildScopedMetadata;
    private migratePreDocumentsPartition;
    addDocument(options: AddDocumentOptions): Promise<{
        clientDocumentId: string;
        storedDocumentMemoryId: UUID;
        fragmentCount: number;
    }>;
    private processDocument;
    private getDocumentFragmentCount;
    checkExistingDocument(documentId: UUID): Promise<boolean>;
    searchDocuments(message: Memory, scope?: {
        roomId?: UUID;
        worldId?: UUID;
        entityId?: UUID;
    }, searchMode?: SearchMode, accessContext?: AccessContext, options?: {
        turnMessageId?: UUID;
    }): Promise<StoredDocument[]>;
    /** Pure vector (cosine-similarity) search. */
    private _vectorSearch;
    /**
     * Pure BM25 keyword search over all stored fragments.
     * Does not require an embedding model.
     */
    private _keywordSearch;
    /**
     * Hybrid search: vector top-K re-ranked with BM25, combined as
     *   score = 0.6 * normalised_vector + 0.4 * normalised_bm25
     */
    private _hybridSearch;
    enrichConversationMemoryWithRAG(memoryId: UUID, ragMetadata: {
        retrievedFragments: Array<{
            fragmentId: UUID;
            documentTitle: string;
            similarityScore?: number;
            contentPreview: string;
        }>;
        queryText: string;
        totalFragments: number;
        retrievalTimestamp: number;
    }): Promise<void>;
    private pendingRAGEnrichment;
    setPendingRAGMetadata(ragMetadata: {
        retrievedFragments: Array<{
            fragmentId: UUID;
            documentTitle: string;
            similarityScore?: number;
            contentPreview: string;
        }>;
        queryText: string;
        totalFragments: number;
        retrievalTimestamp: number;
    }): void;
    enrichRecentMemoriesWithPendingRAG(): Promise<void>;
    private waitForCharacterDocumentEmbeddingModel;
    processCharacterDocuments(items: string[], options?: {
        embeddingWaitTimeoutMs?: number;
        embeddingWaitIntervalMs?: number;
    }): Promise<void>;
    updateDocument(options: {
        documentId: UUID;
        content: string;
        message?: Memory;
    }): Promise<{
        documentId: UUID;
        fragmentCount: number;
    }>;
    _internalAddDocument(item: StoredDocument, options?: {
        targetTokens: number;
        overlap: number;
        modelContextSize: number;
    }, scope?: {
        roomId: string;
        entityId: string;
        worldId: string;
    }): Promise<void>;
    private processDocumentFragment;
    /**
     * Embed + persist a batch of document fragments.
     *
     * When a {@link ModelType.TEXT_EMBEDDING_BATCH} model is registered (e.g. the
     * cloud plugin), every fragment is embedded in ONE round-trip instead of N
     * serial single-text embeds, the returned vectors are written back IN ORDER
     * (`fragments[i].embedding = vectors[i]`), then each fragment is persisted.
     *
     * The embedded text is exactly `fragment.content.text` — the same value
     * {@link IAgentRuntime.addEmbeddingToMemory} embeds (see runtime.ts:
     * `useModel(TEXT_EMBEDDING, { text: memory.content.text })`) — so batched and
     * serial fragments receive byte-for-byte identical embedding input.
     *
     * Any batch failure (no batch model registered, the model call throwing, a
     * returned vector count that does not match the fragment count, or an empty
     * vector for any fragment) falls back to the existing serial per-fragment path
     * so no fragment is left unembedded — and none is persisted with an empty
     * embedding.
     *
     * @param fragments fragments to embed + persist, processed in array order.
     * @param options.continueOnError when true, a single fragment's persist
     *   failure is logged and skipped (matching the per-fragment try/catch at the
     *   `_internalAddDocument` call site); when false the error propagates
     *   (matching the `updateDocument` call site).
     */
    private processDocumentFragmentsBatched;
    /**
     * Serial per-fragment embed + persist path. The fallback used when no
     * TEXT_EMBEDDING_BATCH model is registered or the batch call fails.
     */
    private processDocumentFragmentsSerial;
    private splitAndCreateFragments;
    getMemories(params: {
        tableName: string;
        roomId?: UUID;
        count?: number;
        offset?: number;
        end?: number;
    }): Promise<Memory[]>;
    countMemories(params: {
        tableName: string;
        roomId?: UUID;
        unique?: boolean;
    }): Promise<number>;
    deleteMemory(memoryId: UUID): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map