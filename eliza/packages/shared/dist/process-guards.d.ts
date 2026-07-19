/**
 * Process-level crash guards for long-running Eliza agents.
 *
 * A serving agent — the desktop child process, a cloud container, the on-device
 * Bun runtime — must survive a background promise rejection. Node and Bun both
 * terminate the process on an *unhandled* rejection by default, so every
 * fire-and-forget task that rejects (a deferred plugin import, a connector poll,
 * an autonomy tick) is a self-inflicted outage. These guards make such
 * rejections loud-but-non-fatal, and turn a genuinely uncaught synchronous
 * exception into a *supervised restart* (or, on platforms without a supervisor,
 * a deliberate keep-alive) instead of an ambiguous death.
 *
 * Install ONLY on long-running entry paths (serve / start). One-shot CLI
 * commands and tests must keep the default behavior, where a rejection still
 * fails the command.
 *
 * @module process-guards
 */
/**
 * What to do when a truly uncaught synchronous exception escapes all handlers.
 *
 * - `"restart"` — exit with {@link RESTART_EXIT_CODE} so the surrounding
 *   supervisor (dev `api-supervisor`, desktop `AgentManager`, Docker/K8s restart
 *   policy) relaunches a clean process. The right default for any supervised
 *   agent.
 * - `"exit"` — exit with code 1. For environments where a non-restart abnormal
 *   exit is the desired signal.
 * - `"keep-alive"` — log loudly and keep running. Last resort for an in-process
 *   runtime that cannot be relaunched cheaply (the iOS WebView Bun host), where
 *   a degraded-but-alive agent beats killing the whole app.
 */
export type UncaughtExceptionPolicy = "restart" | "exit" | "keep-alive";
export interface ProcessCrashGuardOptions {
    /** Prefix for log lines, e.g. `"[eliza]"`. Defaults to `"[eliza]"`. */
    logPrefix?: string;
    /**
     * Classifies a rejection as benign-and-ignorable (warned, not surfaced as an
     * error). Defaults to {@link shouldIgnoreUnhandledRejection} (provider
     * credit-exhaustion noise).
     */
    isIgnorable?: (reason: unknown) => boolean;
    /** Policy for an uncaught synchronous exception. Defaults to `"restart"`. */
    onUncaughtException?: UncaughtExceptionPolicy;
    /** Error-level logger. Defaults to `console.error` with the prefix. */
    log?: (message: string) => void;
    /** Warn-level logger. Defaults to `console.warn` with the prefix. */
    warn?: (message: string) => void;
    /** Test seam for the process exit call. Defaults to `process.exit`. */
    exit?: (code: number) => void;
}
/** Test-only: clear the idempotency latch so guards can be re-installed. */
export declare function resetProcessCrashGuardsForTest(): void;
/**
 * Install process-level `unhandledRejection` + `uncaughtException` guards.
 *
 * Idempotent across the whole process: the first call wins and subsequent calls
 * (from a deeper entry layer that imports the same `@elizaos/shared`) are no-ops.
 * Returns `true` when the guards were installed, `false` when skipped (already
 * installed, or no `process` object — e.g. a browser bundle).
 */
export declare function installProcessCrashGuards(options?: ProcessCrashGuardOptions): boolean;
//# sourceMappingURL=process-guards.d.ts.map