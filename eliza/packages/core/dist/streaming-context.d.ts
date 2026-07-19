/**
 * Streaming context management for automatic streaming in useModel calls.
 *
 * Follows the OpenTelemetry ContextManager pattern:
 * - Interface for context management
 * - Platform-specific implementations (Node.js AsyncLocalStorage, Browser Stack)
 * - Auto-detected at runtime - no separate entry points needed
 *
 * @see https://opentelemetry.io/docs/languages/js/context/
 */
import type { StreamChunkCallback } from "./types/components.js";
import type { StreamingContextEventPayload, StreamingEvaluationPayload, StreamingEventHooks, StreamingToolCallPayload, StreamingToolResultPayload } from "./types/streaming.js";
/**
 * Streaming context containing callbacks for streaming lifecycle.
 */
export interface StreamingContext extends StreamingEventHooks {
    /** Called for each chunk of streamed content */
    onStreamChunk: StreamChunkCallback;
    /** Called when a useModel streaming call completes (allows reset between calls) */
    onStreamEnd?: () => void;
    messageId?: string;
    /** Optional abort signal to cancel streaming */
    abortSignal?: AbortSignal;
}
export interface StreamingHookPayloads {
    onToolCall: StreamingToolCallPayload;
    onToolResult: StreamingToolResultPayload;
    onEvaluation: StreamingEvaluationPayload;
    onContextEvent: StreamingContextEventPayload;
}
/**
 * Safely emit an optional streaming event hook.
 * Missing hooks are no-ops, and hook failures are isolated from runtime flow.
 */
export declare function emitStreamingHook<K extends keyof StreamingHookPayloads>(context: StreamingContext | undefined, hook: K, payload: StreamingHookPayloads[K]): Promise<void>;
/**
 * Interface for streaming context managers.
 * Different implementations exist for Node.js (AsyncLocalStorage) and Browser (Stack).
 */
export interface IStreamingContextManager {
    /**
     * Run a function with a streaming context.
     * The context will be available to all nested async calls via `active()`.
     */
    run<T>(context: StreamingContext | undefined, fn: () => T): T;
    /**
     * Get the currently active streaming context.
     * Returns undefined if no context is active.
     */
    active(): StreamingContext | undefined;
}
/**
 * Set the global streaming context manager.
 * Can be used to override the auto-detected manager.
 *
 * @param manager - The context manager to use globally
 */
export declare function setStreamingContextManager(manager: IStreamingContextManager): void;
/**
 * Get the global streaming context manager.
 * Auto-detects and creates the appropriate manager on first access.
 */
export declare function getStreamingContextManager(): IStreamingContextManager;
/**
 * Run a function with a streaming context.
 * All useModel calls within this function will automatically use streaming.
 *
 * @example
 * ```typescript
 * await runWithStreamingContext(
 *   { onStreamChunk: async (chunk) => sendSSE(chunk), messageId },
 *   async () => {
 *     // All useModel calls here will stream automatically
 *     await runtime.processMessage(message);
 *   }
 * );
 * ```
 *
 * @param context - The streaming context with onStreamChunk callback
 * @param fn - The function to run with streaming context
 * @returns The result of the function
 */
export declare function runWithStreamingContext<T>(context: StreamingContext | undefined, fn: () => T): T;
/**
 * Run `fn` with the ambient visible-token stream detached.
 *
 * Any `useModel` call inside still inherits the active streaming context's
 * abort signal and structured tool/evaluation hooks, but its raw tokens no
 * longer reach the turn's visible reply channel — `onStreamChunk` becomes a
 * no-op. This is the seam that keeps an action handler's *internal* model
 * calls off the user-visible reply (#16230): only the top-level response
 * generation streams raw tokens, while an action delivers its own output
 * through the HandlerCallback. The visible stream would otherwise surface an
 * action's intermediate model output — e.g. the conversation compactor's
 * rendered-ledger JSON masquerading as the `/compact` reply. An action that
 * genuinely wants to stream can still opt in with an explicit `onStreamChunk`
 * in its `useModel` params, which `useModel` honors independently of the
 * ambient context. The planner and evaluator model calls apply the same
 * override inline.
 *
 * A straight pass-through (no added scope) when no streaming context is active.
 */
export declare function runWithSuppressedModelStream<T>(fn: () => T): T;
/**
 * Get the currently active streaming context.
 * Called by useModel to check if automatic streaming should be enabled.
 *
 * @returns The current streaming context or undefined
 */
export declare function getStreamingContext(): StreamingContext | undefined;
/**
 * While `> 0`, the runtime is inside `useModel`'s delivery of one `textStream` chunk to
 * `paramsChunk` / `ctxChunk` (after `model_stream_chunk` with `source: "use_model"`).
 * `DefaultMessageService` skips its own `model_stream_chunk` (`source: "message_service"`) in
 * this window so the same raw token is not processed twice. Non-Node environments return `0`.
 */
export declare function getModelStreamChunkDeliveryDepth(): number;
/** Wrap `paramsChunk` / `ctxChunk` invocations from `useModel`'s stream loop. */
export declare function runInsideModelStreamChunkDelivery<T>(fn: () => T | Promise<T>): T | Promise<T>;
//# sourceMappingURL=streaming-context.d.ts.map