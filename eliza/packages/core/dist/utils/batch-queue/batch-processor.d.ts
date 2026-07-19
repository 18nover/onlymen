/**
 * Stateless execution of a **batch** of work items: each item runs through `process` with a
 * {@link Semaphore} cap, exponential backoff between attempts, and optional `onExhausted`.
 *
 * **Why not push failed items back onto a queue:** Inline retries keep item lifecycle simple and
 * avoid losing work between ticks; releasing the semaphore between attempts lets other items run.
 *
 * Reuses `resolveRetryConfig` / `computeBackoff` from `utils/retry.ts` so delay policy matches
 * the rest of the runtime.
 */
import { type RetryConfig } from "../retry.js";
export interface BatchItemOutcome<T> {
    item: T;
    success: boolean;
    error?: Error;
    retryCount: number;
}
export interface BatchProcessorOptions<T> {
    /** Max concurrent `process` calls across the batch. */
    maxParallel: number;
    /**
     * After a failed attempt, re-try up to this many times (embedding-style).
     * Total attempts = maxRetriesAfterFailure + 1. Default 3 → 4 total tries.
     *
     * **Interaction with per-item `_batchMaxAttempts`:** If the item is an object with numeric
     * `_batchMaxAttempts`, that value is used as total attempts (unless `maxAttemptsCap` applies).
     */
    maxRetriesAfterFailure?: number;
    retryPolicy?: RetryConfig;
    /**
     * Upper bound on attempts per item after resolving per-item `maxRetries` and global retry config.
     * Use for shutdown-style paths where items may carry large `maxRetries` but only one try is wanted.
     */
    maxAttemptsCap?: number;
    process: (item: T) => Promise<void>;
    onExhausted?: (item: T, error: Error) => void | Promise<void>;
    shouldRetry?: (item: T, error: Error, attempt: number) => boolean;
}
export declare class BatchProcessor<T> {
    private readonly maxParallel;
    private readonly defaultMaxAttempts;
    private readonly maxAttemptsCap?;
    private readonly policy;
    private readonly process;
    private readonly onExhausted?;
    private readonly shouldRetry;
    private readonly semaphore;
    constructor(options: BatchProcessorOptions<T>);
    processBatch(items: T[]): Promise<BatchItemOutcome<T>[]>;
    private processOne;
}
//# sourceMappingURL=batch-processor.d.ts.map