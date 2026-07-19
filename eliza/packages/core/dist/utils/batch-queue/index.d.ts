/**
 * Composed batch pipeline: {@link PriorityQueue} (what to run next) +
 * {@link BatchProcessor} (how to run a slice with concurrency + retries) +
 * {@link TaskDrain} (when the task system ticks). Use {@link BatchQueue} for services that need
 * all three; use layers alone when you only need ordering, or only batch execution, or only
 * repeat-task CRUD.
 *
 * **Rationale:** avoid parallel one-off queue + drain + retry implementations as features grow;
 * see the longer “why not just three lines?” note on the package re-export in `../batch-queue.ts`.
 */
import type { IAgentRuntime } from "../../types/runtime.js";
import type { RetryConfig } from "../retry.js";
import { type BatchItemOutcome } from "./batch-processor.js";
import { PriorityQueue, type PriorityQueueStats, type QueuePriority } from "./priority-queue.js";
export { type BatchItemOutcome, BatchProcessor } from "./batch-processor.js";
export { PriorityQueue, type PriorityQueueOptions, type PriorityQueueStats, type QueuePriority, } from "./priority-queue.js";
export { Semaphore } from "./semaphore.js";
export { TaskDrain, type TaskDrainOptions } from "./task-drain.js";
export interface DrainStats {
    batchSize: number;
    remaining: number;
    durationMs: number;
}
export interface BatchQueueOptions<T> {
    /** Task worker name and repeat task name (e.g. `EMBEDDING_DRAIN`). */
    name: string;
    batchSize: number;
    drainIntervalMs: number;
    getPriority: (item: T) => QueuePriority;
    process: (item: T) => Promise<void>;
    /**
     * Optional batched processor. When provided, a drain calls this ONCE with the
     * whole dequeued slice (so a provider that supports a batched request — e.g.
     * embeddings — sends one call instead of N). If it throws, the drain falls
     * back to the per-item {@link process} path, so all retry / `onExhausted`
     * semantics are preserved for failures. Existing per-item callers that don't
     * set this are completely unaffected.
     */
    processBatch?: (items: T[]) => Promise<BatchItemOutcome<T>[]>;
    maxParallel?: number;
    maxRetriesAfterFailure?: number;
    retryPolicy?: RetryConfig;
    maxSize?: number;
    onPressure?: (queue: PriorityQueue<T>, item: T) => boolean;
    onOverflowWarning?: (sizeAfter: number, maxSize: number) => void;
    onExhausted?: (item: T, error: Error) => void | Promise<void>;
    /** Called after a non-empty batch finishes `processBatch` (includes per-item success/failure). */
    onDrainBatchOutcomes?: (outcomes: BatchItemOutcome<T>[]) => void;
    onDrainComplete?: (stats: DrainStats) => void;
    shouldRetry?: (item: T, error: Error, attempt: number) => boolean;
    /**
     * When true, skips registering the task worker and only registers the repeat task — caller must
     * register `name` with TaskService (e.g. `BATCHER_DRAIN`). Default false.
     */
    skipRegisterWorker?: boolean;
    /** Merged into repeat task metadata (e.g. `{ affinityKey: "room:x" }`). */
    taskMetadata?: Record<string, unknown>;
    /** Optional repeat task description in the task store. */
    taskDescription?: string;
    drainHighPriorityOnStop?: boolean;
    /**
     * When true (default), high-priority flush on {@link BatchQueue.dispose} uses {@link BatchProcessor}
     * with `maxParallel: 1`, `maxAttemptsCap: 1`, and the same `process` / `onExhausted` / `shouldRetry`
     * as scheduled drains — bounded concurrency and a single attempt per item (no long retry tail on stop).
     * When false, uses a direct `process` loop (legacy best-effort; no semaphore).
     */
    disposeHighPriorityViaProcessor?: boolean;
}
/**
 * End-to-end queue for “enqueue work, drain on a schedule, process with backpressure.”
 *
 * **Why `isDraining`:** Repeat tasks can fire while a drain is still running; we skip re-entry so
 * two batches don’t process the same logical slice or overlap `process` side effects.
 *
 * **Why `dispose` flushes high priority optionally:** Matches embedding shutdown: best-effort
 * completion for urgent items before deleting the repeat task and clearing the queue.
 *
 * **Flush path:** By default the high-priority shutdown slice runs through a dedicated
 * {@link BatchProcessor} (serial, one attempt per item) so behavior stays aligned with bounded
 * concurrency; set `disposeHighPriorityViaProcessor: false` only if you need the old direct loop.
 */
export declare class BatchQueue<T> {
    private readonly priorityQueue;
    private readonly batchProcessor;
    private taskDrain;
    private isDraining;
    private disposed;
    private readonly batchSize;
    private readonly options;
    constructor(options: BatchQueueOptions<T>);
    enqueue(item: T): boolean;
    /**
     * Run one drain cycle (typically from the repeat task worker).
     */
    drain(): Promise<void>;
    /** Wire `TaskDrain` (worker + repeat task unless `skipRegisterWorker`). */
    start(runtime: IAgentRuntime): Promise<void>;
    updateDrainInterval(runtime: IAgentRuntime, ms: number): Promise<void>;
    dispose(runtime: IAgentRuntime, opts?: {
        flushHighPriority?: boolean;
    }): Promise<void>;
    get size(): number;
    stats(): PriorityQueueStats;
    clear(): void;
}
//# sourceMappingURL=index.d.ts.map