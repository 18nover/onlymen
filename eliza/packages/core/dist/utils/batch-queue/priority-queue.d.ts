/**
 * In-memory priority queue: **high** items dequeue before **normal**, before **low**.
 *
 * **Why unbounded by default:** Queue entries are cheap; workloads like embedding generation are
 * bounded by API throughput, not array length. Use `maxSize` + `onPressure` only when you
 * explicitly want a cap (e.g. sampling / stale buffers) and can define drop or reject policy.
 *
 * **Why `onPressure` returns boolean:** The caller decides whether to evict, reject the new
 * item, or take other action — we do not silently drop work here.
 */
export type QueuePriority = "high" | "normal" | "low";
export type PriorityQueueStats = {
    high: number;
    normal: number;
    low: number;
    total: number;
};
export interface PriorityQueueOptions<T> {
    getPriority: (item: T) => QueuePriority;
    /** When set and length >= maxSize before enqueue, see {@link onPressure} / overflow behavior. */
    maxSize?: number;
    /**
     * Called when maxSize is reached before adding `item`. Return true after making room (e.g. dequeue)
     * so the new item can be inserted; return false to reject `item` (not enqueued).
     */
    onPressure?: (queue: PriorityQueue<T>, item: T) => boolean;
    /** When maxSize exceeded and no onPressure: still enqueue but notify (queue grows past maxSize). */
    onOverflowWarning?: (sizeAfter: number, maxSize: number) => void;
}
export declare class PriorityQueue<T> {
    private invalidPriorityWarned;
    private readonly highItems;
    private readonly normalItems;
    private readonly lowItems;
    private readonly getPriority;
    private readonly maxSize?;
    private readonly onPressure?;
    private readonly onOverflowWarning?;
    constructor(options: PriorityQueueOptions<T>);
    /**
     * Insert by priority. Returns false if rejected (onPressure returned false).
     */
    enqueue(item: T): boolean;
    private insertByPriority;
    /** Remove up to `n` items from the front (highest priority first). */
    dequeueBatch(n: number): T[];
    /** Remove and return all items matching `filter`. */
    drain(filter?: (item: T) => boolean): T[];
    get size(): number;
    clear(): void;
    stats(): PriorityQueueStats;
}
//# sourceMappingURL=priority-queue.d.ts.map