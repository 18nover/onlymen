/**
 * Shared test utility functions.
 *
 * Consolidates helpers that were duplicated across many test files:
 * - saveEnv / envSnapshot — environment variable snapshotting
 * - withTimeout — promise timeout wrapper
 * - sleep — simple delay
 * - createDeferred — externally-resolvable promise
 */
/**
 * Save current values of environment variables and return a restore function.
 * Use in beforeEach/afterEach to prevent env leaks between tests.
 */
export declare function saveEnv(...keys: string[]): {
    restore: () => void;
};
/**
 * Snapshot environment variables with set/clear/restore operations.
 * Alternative to saveEnv with more control.
 */
export declare function envSnapshot(keys: string[]): {
    save: () => void;
    set: (key: string, value: string) => void;
    clear: () => void;
    restore: () => void;
};
/**
 * Wrap a promise with a timeout. Rejects with an error if the promise
 * doesn't resolve within the given time.
 */
export declare function withTimeout<T>(promise: Promise<T>, ms: number, label?: string): Promise<T>;
/**
 * Simple delay utility.
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Create a promise with externally-accessible resolve/reject functions.
 */
export declare function createDeferred<T>(): {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
};
//# sourceMappingURL=shared-test-utils.d.ts.map