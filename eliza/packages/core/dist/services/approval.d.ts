/**
 * ApprovalService
 *
 * A robust abstraction for task-based approvals in Eliza.
 * Provides a interface for requesting approvals, handling choices,
 * and managing approval workflows.
 *
 * Patterns supported:
 * - Simple confirm/deny (e.g., "Post this tweet?")
 * - Multi-option choices (e.g., "Select deployment target")
 * - Timed approvals with expiration
 * - Approval chains (e.g., "Approve step 1, then step 2")
 */
import { type IAgentRuntime, type PendingUserAction, type Task, type UUID } from "../types/index.js";
import { Service } from "../types/service.js";
/**
 * Options for a single approval choice
 */
export interface ApprovalOption {
    /** Unique identifier for the option */
    name: string;
    /** Human-readable description */
    description?: string;
    /** If true, this option is the default when approval times out */
    isDefault?: boolean;
    /** If true, this option cancels/aborts the task */
    isCancel?: boolean;
}
/**
 * Parameters for creating an approval request
 */
export interface ApprovalRequest {
    /** Unique name for this approval type (used for task worker registration) */
    name: string;
    /** Human-readable description of what's being approved */
    description: string;
    /** Room where the approval request is made */
    roomId: UUID;
    /** Optional entity ID associated with the request */
    entityId?: UUID;
    /** Available options for the approval */
    options: ApprovalOption[];
    /** Additional tags for the task */
    tags?: string[];
    /** Timeout in milliseconds (default: no timeout) */
    timeoutMs?: number;
    /** Default option if timeout occurs (must match an option name) */
    timeoutDefault?: string;
    /** Arbitrary metadata to attach to the task */
    metadata?: Record<string, unknown>;
    /** Callback when an option is selected */
    onSelect?: (option: string, task: Task, runtime: IAgentRuntime) => Promise<void>;
    /** Callback when approval times out */
    onTimeout?: (task: Task, runtime: IAgentRuntime) => Promise<void>;
    /** Roles allowed to make this approval (default: OWNER, ADMIN) */
    allowedRoles?: string[];
}
/**
 * Result of an approval request
 */
export interface ApprovalResult {
    /** The option that was selected */
    selectedOption: string;
    /** Whether the approval was successful (not cancelled/timed out) */
    success: boolean;
    /** Whether the approval timed out */
    timedOut: boolean;
    /** Whether the approval was cancelled */
    cancelled: boolean;
    /** The task ID */
    taskId: UUID;
    /** Entity that made the selection (if known) */
    resolvedBy?: UUID;
    /** Timestamp when resolved */
    resolvedAt: number;
}
/**
 * Standard approval options for common patterns
 */
export declare const STANDARD_OPTIONS: {
    readonly CONFIRM: ApprovalOption[];
    readonly APPROVE_DENY: ApprovalOption[];
    readonly YES_NO: ApprovalOption[];
    readonly ALLOW_ONCE_ALWAYS_DENY: ApprovalOption[];
};
/**
 * ApprovalService provides a interface for task-based approvals.
 */
export declare class ApprovalService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    private pendingApprovals;
    private registeredWorkers;
    /**
     * Start the ApprovalService
     */
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Stop the ApprovalService
     */
    stop(): Promise<void>;
    /**
     * Create an approval request and wait for a decision.
     *
     * @param request - The approval request parameters
     * @returns Promise that resolves with the approval result
     *
     * @example
     * ```typescript
     * const result = await approvalService.requestApproval({
     *   name: 'EXEC_APPROVAL',
     *   description: 'Execute command: rm -rf /tmp/cache',
     *   roomId: message.roomId,
     *   options: STANDARD_OPTIONS.ALLOW_ONCE_ALWAYS_DENY,
     *   timeoutMs: 120000,
     *   timeoutDefault: 'deny',
     *   onSelect: async (option, task, runtime) => {
     *     if (option === 'allow-always') {
     *       await addToAllowlist(command);
     *     }
     *   },
     * });
     *
     * if (result.success && result.selectedOption !== 'deny') {
     *   await executeCommand();
     * }
     * ```
     */
    requestApproval(request: ApprovalRequest): Promise<ApprovalResult>;
    /**
     * Request approval without waiting (fire and forget with callbacks).
     * Useful when you don't need to block on the approval result.
     */
    requestApprovalAsync(request: ApprovalRequest): Promise<UUID>;
    /**
     * Cancel a pending approval
     */
    cancelApproval(taskId: UUID): Promise<void>;
    /**
     * Get all pending approvals for a room
     */
    getPendingApprovals(roomId: UUID): Promise<Task[]>;
    /**
     * Get every pending approval across all rooms for this agent. Powers the
     * canonical "needs your response" surface (#9449), which aggregates the
     * agent's blocked-on-user decisions rather than scoping to one room.
     */
    getAllPendingApprovals(): Promise<Task[]>;
    /**
     * List every in-flight approval as a canonical {@link PendingUserAction} — the
     * shared "the agent is waiting on you" shape that a needs-attention UI, a
     * provider, and the home-attention ranker all read (see #9449, Pillar C).
     *
     * Unlike {@link getPendingApprovals} (room-scoped raw `Task`s with no caller),
     * this is agent-wide and pre-normalized, so callers don't reshape per surface.
     */
    listPendingUserActions(): PendingUserAction[];
    /**
     * Handle timeout for a pending approval
     */
    private handleTimeout;
    /**
     * Handle selection from CHOOSE_OPTION action
     * Called by the task worker when an option is selected
     */
    handleSelection(taskId: UUID, selectedOption: string, resolvedBy?: UUID): Promise<void>;
    /**
     * Ensure task worker is registered for this approval type
     */
    private ensureWorkerRegistered;
}
/**
 * Helper function to create a simple confirm/deny approval
 */
export declare function requestConfirmation(runtime: IAgentRuntime, params: {
    description: string;
    roomId: UUID;
    entityId?: UUID;
    timeoutMs?: number;
    onConfirm?: (task: Task, runtime: IAgentRuntime) => Promise<void>;
    onCancel?: (task: Task, runtime: IAgentRuntime) => Promise<void>;
}): Promise<boolean>;
export default ApprovalService;
//# sourceMappingURL=approval.d.ts.map