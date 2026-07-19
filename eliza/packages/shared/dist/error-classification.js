/**
 * Error-formatting + classification utilities for global process handlers.
 *
 * Shared between the CLI (`run-main.ts`), the dev-server (`dev-server.ts`), the
 * agent serve path, and `installProcessCrashGuards` (`process-guards.ts`).
 * Intentionally dependency-free — only string/object inspection.
 */
export function formatUncaughtError(error) {
    if (error instanceof Error) {
        return error.stack ?? error.message;
    }
    return String(error);
}
function hasInsufficientCreditsSignal(input) {
    return /\b(insufficient(?:[_\s]+(?:credits?|quota))|insufficient_quota|out of credits|payment required|statuscode:\s*402)\b/i.test(input);
}
/**
 * Returns `true` when the rejection looks like an AI provider credit-exhaustion
 * error — these are noisy but not fatal, so callers should warn instead of crash.
 */
export function shouldIgnoreUnhandledRejection(reason) {
    const formatted = formatUncaughtError(reason);
    if (!/AI_NoOutputGeneratedError|No output generated|AI_APICallError|AI_RetryError/i.test(formatted)) {
        return false;
    }
    if (hasInsufficientCreditsSignal(formatted)) {
        return true;
    }
    const seen = new Set();
    let current = reason;
    while (current && typeof current === "object" && !seen.has(current)) {
        seen.add(current);
        const statusCode = current.statusCode;
        if (statusCode === 402)
            return true;
        const responseBody = current.responseBody;
        if (typeof responseBody === "string" &&
            hasInsufficientCreditsSignal(responseBody)) {
            return true;
        }
        const errors = current.errors;
        if (Array.isArray(errors)) {
            for (const inner of errors) {
                if (shouldIgnoreUnhandledRejection(inner))
                    return true;
            }
        }
        current = current.cause;
    }
    return false;
}
//# sourceMappingURL=error-classification.js.map