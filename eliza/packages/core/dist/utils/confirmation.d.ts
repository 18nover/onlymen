/**
 * Unified confirmation helper for destructive actions.
 *
 * Destructive actions (delete X, clear Y, uninstall Z, send public post,
 * sign transaction, etc.) should not fire on the first invocation.
 * Instead they should:
 *   1. Stash a pending-confirmation record in the runtime cache.
 *   2. Emit a callback message describing the operation and asking the
 *      user to confirm.
 *   3. On the next turn, if the user message reads as "yes", proceed;
 *      otherwise cancel.
 *
 * This module centralizes that pattern so every destructive action
 * follows the same UX, the same TTL behavior, and the same cancel
 * semantics.
 *
 * Usage:
 *   const decision = await requireConfirmation({
 *     runtime,
 *     message,
 *     actionName: "DELETE_LINEAR_ISSUE",
 *     pendingKey: `delete:${issueId}`,
 *     prompt: `Permanently delete issue ${humanId}? This cannot be undone.`,
 *     callback,
 *   });
 *   if (decision.status === "pending") {
 *     return { success: true, data: { awaitingUserInput: true } };
 *   }
 *   if (decision.status === "cancelled") {
 *     return { success: true, text: "Cancelled." };
 *   }
 *   // status === "confirmed" — proceed with the destructive op
 */
import type { HandlerCallback } from "../types/components.js";
import type { Memory } from "../types/memory.js";
import type { IAgentRuntime } from "../types/runtime.js";
export type ConfirmationStatus = "pending" | "confirmed" | "cancelled";
export interface RequireConfirmationArgs {
    runtime: IAgentRuntime;
    message: Memory;
    /** Action name doing the destructive op. Used in the cache key + emitted prompt. */
    actionName: string;
    /**
     * Stable key identifying the specific pending operation, e.g.
     * `delete:${issueId}`. Combined with the user id and action name to
     * form the cache key. Two simultaneous pending confirmations with
     * the same pendingKey for the same user are not supported.
     */
    pendingKey: string;
    /** Human-readable prompt the user sees. */
    prompt: string;
    /** Optional callback for emitting the prompt; if omitted, the
     * caller is expected to deliver `prompt` via its own mechanism. */
    callback?: HandlerCallback;
    /** TTL for the pending record. Default 5 minutes. */
    ttlMs?: number;
    /** Custom yes detector. */
    confirmRegex?: RegExp;
    /** Optional structured metadata to stash on the pending record (passed back on confirm). */
    metadata?: Record<string, unknown>;
}
export interface ConfirmationDecision {
    status: ConfirmationStatus;
    /** When status is "confirmed" or "cancelled", this is the metadata
     * that was stashed when the confirmation was first requested. */
    metadata?: Record<string, unknown>;
}
/**
 * Two-phase destructive-action helper.
 *
 * Returns:
 *   - `{ status: "pending" }` on the FIRST invocation (no record in cache yet).
 *     The helper has stashed the record and (if `callback` is provided) emitted
 *     the prompt. Caller should return early without performing the op.
 *
 *   - `{ status: "confirmed", metadata }` on the SECOND invocation when the user
 *     replied with a yes-shaped message. The pending record has been cleared.
 *     Caller should perform the destructive op.
 *
 *   - `{ status: "cancelled", metadata }` on the SECOND invocation when the user
 *     replied with a no-shaped message OR anything not matching yes. The pending
 *     record has been cleared. Caller should not perform the op.
 *
 * Expired pending records (older than ttlMs) are treated as fresh first calls.
 */
export declare function requireConfirmation(args: RequireConfirmationArgs): Promise<ConfirmationDecision>;
/**
 * Clear a pending confirmation without resolving it. Useful for callers
 * that want to abandon a prior pending op (e.g. when a different action
 * supersedes the one awaiting confirmation).
 */
export declare function clearPendingConfirmation(args: {
    runtime: IAgentRuntime;
    userId: string;
    actionName: string;
    pendingKey: string;
}): Promise<void>;
export type DestructiveConfirmationGateResult = {
    readonly status: "confirmed";
    readonly metadata?: Record<string, unknown>;
} | {
    readonly status: "pending";
} | {
    readonly status: "cancelled";
    readonly metadata?: Record<string, unknown>;
};
/**
 * Thin wrapper around {@link requireConfirmation} for destructive action handlers.
 * Never consult LLM `confirmed` params — only user yes/no on a follow-up turn.
 */
export declare function gateDestructiveConfirmation(args: RequireConfirmationArgs): Promise<DestructiveConfirmationGateResult>;
/** LLM `confirmed: true` must not authorize destructive ops (GHSA-rqm7 class). */
export declare function llmConfirmedFlagIsAuthoritative(_value: unknown): boolean;
//# sourceMappingURL=confirmation.d.ts.map