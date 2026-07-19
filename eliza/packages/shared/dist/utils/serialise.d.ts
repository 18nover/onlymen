/**
 * Creates a serialised (sequential) promise queue.
 *
 * Each call to the returned function chains the provided async `fn` after
 * the previous one completes, ensuring only one operation runs at a time.
 *
 * Usage:
 *   const run = createSerialise();
 *   await run(async () => { ... });
 */
export declare function createSerialise(): <T>(fn: () => Promise<T>) => Promise<T>;
//# sourceMappingURL=serialise.d.ts.map