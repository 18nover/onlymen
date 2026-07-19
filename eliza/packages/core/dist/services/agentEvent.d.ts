/**
 * AgentEventService
 *
 * A centralized service for managing agent event streams.
 * Provides event emission, subscription, and run context tracking
 * for agent lifecycle events, tool usage, assistant responses, errors, and heartbeats.
 *
 * This service consolidates event handling that was previously scattered
 * across Otto's agent-events.ts and heartbeat-events.ts.
 *
 * @example
 * ```typescript
 * const eventService = runtime.getService(ServiceType.AGENT_EVENT) as AgentEventService;
 *
 * // Subscribe to events
 * const unsubscribe = eventService.subscribe((event) => {
 *   console.log(`[${event.stream}] ${event.runId}:${event.seq}`, event.data);
 * });
 *
 * // Register run context
 * eventService.registerRunContext('run-123', {
 *   sessionKey: 'session-abc',
 *   verboseLevel: 'verbose',
 * });
 *
 * // Emit events
 * eventService.emit({
 *   runId: 'run-123',
 *   stream: 'lifecycle',
 *   data: { type: 'run_start', stepName: 'process_message' },
 * });
 *
 * // Emit heartbeat
 * eventService.emitHeartbeat({
 *   status: 'ok-token',
 *   to: 'user@example.com',
 *   preview: 'Hello, world!',
 * });
 *
 * // Cleanup
 * unsubscribe();
 * eventService.clearRunContext('run-123');
 * ```
 */
import type { ActionEventData, AgentEventInput, AgentEventListener, AgentRunContext, EvaluatorEventData, HeartbeatEventInput, HeartbeatEventListener, HeartbeatEventPayload, HeartbeatIndicatorType, HeartbeatStatus, MemoryEventData, MessageEventData, ProviderEventData } from "../types/agentEvent.js";
import type { IAgentRuntime } from "../types/index.js";
import type { UUID } from "../types/primitives.js";
import { Service } from "../types/service.js";
/**
 * Resolve heartbeat status to an indicator type for UI display
 */
export declare function resolveHeartbeatIndicator(status: HeartbeatStatus): HeartbeatIndicatorType | undefined;
/**
 * AgentEventService provides a interface for agent event streaming.
 * It manages event emission, subscription, and run context tracking.
 */
export declare class AgentEventService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    /** Per-run sequence counters for monotonic numbering */
    private seqByRun;
    /** Event listeners */
    private eventListeners;
    /** Heartbeat event listeners */
    private heartbeatListeners;
    /** Run context by run ID */
    private runContextById;
    /** Last heartbeat event (for UI status) */
    private lastHeartbeat;
    /**
     * Start the AgentEventService
     */
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Stop the AgentEventService
     */
    stop(): Promise<void>;
    /**
     * Register context for a run (session key, verbose level, etc.)
     */
    registerRunContext(runId: string, context: AgentRunContext): void;
    /**
     * Get run context by ID
     */
    getRunContext(runId: string): AgentRunContext | undefined;
    /**
     * Clear run context
     */
    clearRunContext(runId: string): void;
    /**
     * Clear all run contexts (useful for testing)
     */
    clearAllRunContexts(): void;
    /**
     * Emit an agent event
     */
    emit(event: AgentEventInput): void;
    /**
     * Subscribe to agent events
     * @returns Unsubscribe function
     */
    subscribe(listener: AgentEventListener): () => void;
    /**
     * Emit a heartbeat event
     */
    emitHeartbeat(event: HeartbeatEventInput): void;
    /**
     * Subscribe to heartbeat events
     * @returns Unsubscribe function
     */
    subscribeHeartbeat(listener: HeartbeatEventListener): () => void;
    /**
     * Get the last heartbeat event
     */
    getLastHeartbeat(): HeartbeatEventPayload | null;
    /**
     * Get current sequence number for a run
     */
    getCurrentSeq(runId: string): number;
    /**
     * Helper: Emit a lifecycle event
     */
    emitLifecycle(runId: string, data: {
        type: "run_start" | "run_end" | "step_start" | "step_end" | "context_loaded" | "action_start" | "action_end";
        stepName?: string;
        actionName?: string;
        duration?: number;
        success?: boolean;
        error?: string;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit a tool event
     */
    emitTool(runId: string, data: {
        type: "tool_call" | "tool_result" | "tool_error";
        toolName: string;
        input?: Record<string, unknown>;
        output?: Record<string, unknown>;
        duration?: number;
        error?: string;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit an assistant event
     */
    emitAssistant(runId: string, data: {
        type: "message" | "thought" | "plan" | "reflection";
        content: string;
        role?: "assistant" | "user" | "system";
        tokens?: number;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit an error event
     */
    emitError(runId: string, data: {
        type: "error" | "warning";
        code?: string;
        message: string;
        stack?: string;
        recoverable?: boolean;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit a message event (received, sent, queued, failed)
     */
    emitMessage(runId: string, data: MessageEventData, sessionKey?: string): void;
    /**
     * Convenience: Emit message received event
     */
    emitMessageReceived(runId: string, params: {
        messageId?: UUID;
        channel?: string;
        userId?: UUID;
        roomId?: UUID;
        content?: string;
        hasAttachments?: boolean;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit message sent event
     */
    emitMessageSent(runId: string, params: {
        messageId?: UUID;
        channel?: string;
        userId?: UUID;
        roomId?: UUID;
        content?: string;
        hasAttachments?: boolean;
        deliveredAt?: number;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit an action event (start, complete, error, skipped)
     */
    emitAction(runId: string, data: ActionEventData, sessionKey?: string): void;
    /**
     * Convenience: Emit action start event
     */
    emitActionStart(runId: string, params: {
        actionName: string;
        handler?: string;
        input?: Record<string, unknown>;
        memoryId?: UUID;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit action complete event
     */
    emitActionComplete(runId: string, params: {
        actionName: string;
        handler?: string;
        output?: Record<string, unknown>;
        duration?: number;
        success?: boolean;
        memoryId?: UUID;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit action error event
     */
    emitActionError(runId: string, params: {
        actionName: string;
        handler?: string;
        error: string;
        duration?: number;
        memoryId?: UUID;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit an evaluator event (start, complete, error, skipped)
     */
    emitEvaluator(runId: string, data: EvaluatorEventData, sessionKey?: string): void;
    /**
     * Convenience: Emit evaluator start event
     */
    emitEvaluatorStart(runId: string, params: {
        evaluatorName: string;
        messageId?: UUID;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit evaluator complete event
     */
    emitEvaluatorComplete(runId: string, params: {
        evaluatorName: string;
        validated?: boolean;
        result?: unknown;
        duration?: number;
        messageId?: UUID;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit a provider event (start, complete, error, cached)
     */
    emitProvider(runId: string, data: ProviderEventData, sessionKey?: string): void;
    /**
     * Convenience: Emit provider start event
     */
    emitProviderStart(runId: string, params: {
        providerName: string;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit provider complete event
     */
    emitProviderComplete(runId: string, params: {
        providerName: string;
        data?: unknown;
        duration?: number;
        fromCache?: boolean;
        tokens?: number;
    }, sessionKey?: string): void;
    /**
     * Helper: Emit a memory event (create, update, delete, search, retrieved)
     */
    emitMemory(runId: string, data: MemoryEventData, sessionKey?: string): void;
    /**
     * Convenience: Emit memory create event
     */
    emitMemoryCreate(runId: string, params: {
        memoryId: UUID;
        tableName?: string;
        roomId?: UUID;
        preview?: string;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit memory search event
     */
    emitMemorySearch(runId: string, params: {
        tableName?: string;
        roomId?: UUID;
        count?: number;
        duration?: number;
    }, sessionKey?: string): void;
    /**
     * Convenience: Emit memory retrieved event
     */
    emitMemoryRetrieved(runId: string, params: {
        memoryId?: UUID;
        tableName?: string;
        roomId?: UUID;
        count?: number;
        preview?: string;
    }, sessionKey?: string): void;
}
export default AgentEventService;
//# sourceMappingURL=agentEvent.d.ts.map