/**
 * Minimal stack-backed context manager for environments without AsyncLocalStorage.
 *
 * This only preserves context for synchronous nested calls. Node paths should
 * prefer AsyncLocalStorage when async propagation is required.
 */
export declare class StackContextManager<TContext> {
    private stack;
    run<T>(context: TContext, fn: () => T): T;
    active(): TContext | undefined;
}
//# sourceMappingURL=stack-context-manager.d.ts.map