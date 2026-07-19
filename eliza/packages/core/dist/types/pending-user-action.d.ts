/**
 * Pending user-action types — the canonical "the agent is waiting on you" shape.
 *
 * elizaOS grew several overlapping abstractions for "needs a human response":
 * task-based approvals (`ApprovalService`), the LifeOps approval queue, pending
 * planner prompts, and in-chat credential requests. Each surfaced through a
 * different path with no shared contract, so there was no single inbox a client
 * could render. `PendingUserAction` is that shared contract: every source maps
 * its own shape onto this one interface, and consumers (a needs-attention UI,
 * the home-attention ranker, a provider) read only this. See #9449 (Pillar C).
 *
 * Leaf producers map FROM their own state TO this type; they never reshape it.
 */
import type { JsonValue, UUID } from "./primitives.js";
/**
 * Which underlying abstraction produced the pending action. Drives nothing on
 * its own (consumers render from the structural fields) but lets a UI group and
 * a router dispatch back to the right handler.
 */
export type PendingUserActionKind = "approval" | "task_approval" | "prompt" | "pending_prompt" | "credential" | "credential_request" | "clarifying_question" | "blocked_task" | "choice";
/** A single selectable option for an approval/choice action. */
export interface PendingUserActionOption {
    /** Stable identifier the handler matches on (e.g. "approve", "cancel"). */
    id: string;
    /** Human-facing label for the option. */
    label: string;
    /** Picked automatically if the action times out. */
    isDefault?: boolean;
    /** Cancels/aborts the underlying task when chosen. */
    isCancel?: boolean;
}
/** Where a client should route the user's response. */
export type PendingUserActionResolutionTarget = "resolve_request" | "approval_service" | "pending_prompt" | "credential_bridge" | "sensitive_request" | "open_route" | "chat_reply";
/** Handler metadata for round-tripping a selected response safely. */
export interface PendingUserActionResolution {
    target: PendingUserActionResolutionTarget;
    /** Source-local id when it differs from `PendingUserAction.id`. */
    requestId?: string;
    /** App route / bridge route for open-route or credential flows. */
    href?: string;
    /** Action name or command for chat/action handlers, e.g. RESOLVE_REQUEST. */
    action?: string;
}
/**
 * A single thing the agent is waiting on the user for. Required fields are
 * required — a missing `title` is a bug, not a default.
 */
export interface PendingUserAction {
    /** Stable id (the task id / request id / prompt task id). */
    id: string;
    /** Producing abstraction. */
    kind: PendingUserActionKind;
    /** Free-form producer label, e.g. "approval-service", "pending-prompts". */
    source: string;
    /** Short human-facing summary of what is being asked. Required. */
    title: string;
    /** Longer detail, when the producer has one. */
    description?: string;
    /** Room/conversation the request belongs to, when scoped. */
    roomId?: UUID;
    /** Options to choose from (approval/choice kinds). Omitted for free replies. */
    options?: PendingUserActionOption[];
    /**
     * What kind of reply the action expects (e.g. "text", "date", "confirmation",
     * "selection"). Drives client rendering/validation; sourced from the planner's
     * `expectedReplyKind` for prompts.
     */
    expectedReplyKind?: string;
    /**
     * Attention weight aligned with the home ranker's `HOME_SIGNAL_WEIGHTS`
     * (approval=9, escalation=10) so unanswered items can float up. Omit to let
     * the consumer default by `kind`.
     */
    weight?: number;
    /** How the response should be routed back to the producer. */
    resolution?: PendingUserActionResolution;
    /** Structured source metadata for renderers/routers; never put secrets here. */
    data?: Record<string, JsonValue>;
    /** Unix ms when the request was created. */
    createdAt: number;
    /** Unix ms after which it self-expires; `null`/absent means it never does. */
    expiresAt?: number | null;
}
/** Canonical attention weights by kind, aligned with `HOME_SIGNAL_WEIGHTS`. */
export declare const PENDING_USER_ACTION_WEIGHT: Readonly<Record<PendingUserActionKind, number>>;
/** Backwards-readable alias for code that asks "does this require a reply?". */
export type RequiresUserResponse = PendingUserAction;
//# sourceMappingURL=pending-user-action.d.ts.map