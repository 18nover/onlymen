/**
 * Error-formatting + classification utilities for global process handlers.
 *
 * Shared between the CLI (`run-main.ts`), the dev-server (`dev-server.ts`), the
 * agent serve path, and `installProcessCrashGuards` (`process-guards.ts`).
 * Intentionally dependency-free — only string/object inspection.
 */
export declare function formatUncaughtError(error: unknown): string;
/**
 * Returns `true` when the rejection looks like an AI provider credit-exhaustion
 * error — these are noisy but not fatal, so callers should warn instead of crash.
 */
export declare function shouldIgnoreUnhandledRejection(reason: unknown): boolean;
//# sourceMappingURL=error-classification.d.ts.map