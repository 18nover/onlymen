import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
/**
 * Service responsible for generating embeddings asynchronously
 * This service listens for EMBEDDING_GENERATION_REQUESTED events
 * and processes them in a queue to avoid blocking the main runtime
 */
export declare class EmbeddingGenerationService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    private batchQueue;
    private isDisabled;
    private static readonly EMBEDDING_DRAIN_TASK;
    static start(runtime: IAgentRuntime): Promise<Service>;
    initialize(): Promise<void>;
    private handleEmbeddingRequest;
    private generateEmbedding;
    /**
     * Persist a generated vector to its memory and emit the completion event.
     * Shared by the per-item ({@link generateEmbedding}) and batched
     * ({@link generateEmbeddingsBatch}) paths so write-back is identical.
     */
    private persistEmbedding;
    /**
     * Batched drain path: embed every queued text in ONE TEXT_EMBEDDING_BATCH
     * round-trip, then write each vector back to its own memory id.
     *
     * Returns a {@link BatchItemOutcome} per item so the queue applies its normal
     * retry / `onExhausted` accounting. Items with no text or an already-present
     * vector are skipped (counted as success — nothing to do). If the single
     * batch model call throws, this throws too, which makes `BatchQueue.drain`
     * fall the WHOLE slice back to the per-item {@link generateEmbedding} path —
     * preserving the per-item fallback and per-id write-back guarantees.
     */
    private generateEmbeddingsBatch;
    stop(): Promise<void>;
    getQueueSize(): number;
    getQueueStats(): {
        high: number;
        normal: number;
        low: number;
        total: number;
    };
    clearQueue(): void;
}
export default EmbeddingGenerationService;
//# sourceMappingURL=embedding.d.ts.map