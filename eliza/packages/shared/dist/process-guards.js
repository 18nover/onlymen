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
import { shouldIgnoreUnhandledRejection } from "./error-classification.js";
import { RESTART_EXIT_CODE } from "./restart.js";
function formatReason(reason) {
    if (reason instanceof Error) {
        return reason.stack ?? reason.message;
    }
    return String(reason);
}
let guardsInstalled = false;
/** Test-only: clear the idempotency latch so guards can be re-installed. */
export function resetProcessCrashGuardsForTest() {
    guardsInstalled = false;
}
/**
 * Install process-level `unhandledRejection` + `uncaughtException` guards.
 *
 * Idempotent across the whole process: the first call wins and subsequent calls
 * (from a deeper entry layer that imports the same `@elizaos/shared`) are no-ops.
 * Returns `true` when the guards were installed, `false` when skipped (already
 * installed, or no `process` object — e.g. a browser bundle).
 */
export function installProcessCrashGuards(options = {}) {
    if (guardsInstalled)
        return false;
    if (typeof process === "undefined" || typeof process.on !== "function") {
        return false;
    }
    guardsInstalled = true;
    const prefix = options.logPrefix ?? "[eliza]";
    const log = options.log ?? ((m) => console.error(`${prefix} ${m}`));
    const warn = options.warn ?? ((m) => console.warn(`${prefix} ${m}`));
    const isIgnorable = options.isIgnorable ?? shouldIgnoreUnhandledRejection;
    const policy = options.onUncaughtException ?? "restart";
    const exit = options.exit ?? ((code) => process.exit(code));
    process.on("unhandledRejection", (reason) => {
        if (isIgnorable(reason)) {
            warn("Background request failed without output (provider credits exhausted?) — continuing.");
            return;
        }
        // A rejected background promise must never take down a serving agent.
        log(`Unhandled promise rejection (non-fatal): ${formatReason(reason)}`);
    });
    process.on("uncaughtException", (error) => {
        log(`Uncaught exception: ${formatReason(error)}`);
        if (policy === "keep-alive") {
            log("Agent left running after uncaught exception (state may be degraded).");
            return;
        }
        if (policy === "restart") {
            log(`Requesting supervised restart (exit ${RESTART_EXIT_CODE}).`);
            exit(RESTART_EXIT_CODE);
            return;
        }
        exit(1);
    });
    return true;
}
//# sourceMappingURL=process-guards.js.map