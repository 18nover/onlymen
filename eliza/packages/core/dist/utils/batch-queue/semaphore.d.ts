/**
 * Async semaphore: limits how many in-flight `process` calls run at once (true throttle for I/O).
 *
 * **Contract:** every `acquire()` must be paired with `release()` in a `finally` (or equivalent)
 * so permits return even when the guarded work throws. {@link BatchProcessor} does this; ad-hoc
 * callers must do the same.
 *
 * **Why shared with PromptDispatcher:** One implementation avoids drift; `prompt-batcher/shared`
 * re-exports this module so existing `import { Semaphore } from "./shared.js"` keeps working.
 */
export declare class Semaphore {
    private permits;
    private waiters;
    constructor(count: number);
    acquire(): Promise<void>;
    release(): void;
}
//# sourceMappingURL=semaphore.d.ts.map