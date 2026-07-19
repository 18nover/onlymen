/**
 * Streaming utilities for filtering and extracting streamable content.
 *
 * This module provides implementations of {@link IStreamExtractor}:
 * - PassthroughExtractor - Simple passthrough (no filtering)
 * - StructuredFieldStreamExtractor - Extract top-level structured fields safely
 *
 * For the interface definition, see types/streaming.ts.
 * Implementations can use these or create their own extractors.
 */
import type { StreamChunkCallback } from "../types/components.js";
import type { IStreamExtractor, StructuredFieldEventCallbacks } from "../types/streaming.js";
/** Error codes for streaming operations */
export type StreamErrorCode = "CHUNK_TOO_LARGE" | "BUFFER_OVERFLOW" | "PARSE_ERROR" | "TIMEOUT" | "ABORTED";
/**
 * Standardized error class for streaming operations.
 * Provides structured error codes for easier handling.
 */
export declare class StreamError extends Error {
    readonly code: StreamErrorCode;
    readonly details?: Record<string, unknown>;
    constructor(code: StreamErrorCode, message: string, details?: Record<string, unknown>);
    /** Check if an error is a StreamError */
    static isStreamError(error: unknown): error is StreamError;
}
/**
 * Streams all content as-is without any filtering.
 * Use when LLM output is already in the desired format (e.g., plain text responses).
 */
export declare class PassthroughExtractor implements IStreamExtractor {
    get done(): boolean;
    push(chunk: string): string;
    reset(): void;
}
/**
 * Passthrough extractor that can be marked complete externally.
 *
 * WHY: When using StructuredFieldStreamExtractor inside dynamicPromptExecFromState,
 * extraction/completion is handled internally. But the outer streaming context
 * still needs to know when streaming is complete for retry/fallback logic.
 *
 * This extractor passes through all content and provides a markComplete() method
 * that the caller can invoke when the underlying operation completes successfully.
 *
 * @example
 * ```ts
 * const extractor = new MarkableExtractor();
 * const ctx = createStreamingContext(extractor, callback);
 *
 * const result = await dynamicPromptExecFromState({ ... });
 * if (result) {
 *   extractor.markComplete(); // Signal success
 * }
 *
 * if (ctx.isComplete()) {
 *   // Now returns true after markComplete()
 * }
 * ```
 */
export declare class MarkableExtractor implements IStreamExtractor {
    private _done;
    get done(): boolean;
    push(chunk: string): string;
    flush(): string;
    reset(): void;
    /**
     * Mark the extractor as complete.
     * WHY: Called by the outer code when the underlying operation completes
     * successfully. This allows isComplete() to return true for retry/fallback logic.
     */
    markComplete(): void;
}
import type { ResponseSkeleton } from "../types/model.js";
import type { SchemaRow, StreamEvent } from "../types/state.js";
import type { IStreamingRetryState } from "../types/streaming.js";
/**
 * Extractor state machine for validation-aware streaming.
 */
export type ExtractorState = "streaming" | "validating" | "retrying" | "complete" | "failed";
/**
 * Per-field state tracking for progressive validation.
 */
export type FieldState = "pending" | "partial" | "complete" | "invalid";
/**
 * Configuration for StructuredFieldStreamExtractor.
 */
export interface StructuredFieldStreamExtractorConfig extends StructuredFieldEventCallbacks {
    /** Validation level (0-3). Level 2+ buffers until flush. */
    level: 0 | 1 | 2 | 3;
    /** Schema rows with field definitions */
    schema: SchemaRow[];
    /** Which top-level structured fields to stream to the consumer */
    streamFields: string[];
    /**
     * Callback for streaming chunks.
     * WHY accumulated: consumers (voice detection, client-side merge) need the
     * full field text to avoid re-deriving it from deltas.
     */
    onChunk: (chunk: string, field?: string, accumulated?: string) => void;
    /** Rich event callback for sophisticated consumers */
    onEvent?: (event: StreamEvent) => void;
    /** Abort signal for cancellation */
    abortSignal?: AbortSignal;
}
/**
 * Diagnosis result for error analysis.
 */
export interface ValidationDiagnosis {
    /** Fields that were never started */
    missingFields: string[];
    /** Fields with wrong validation codes */
    invalidFields: string[];
    /** Fields that started but didn't complete */
    incompleteFields: string[];
}
/**
 * Extracts configured top-level scalar fields from line-oriented text without streaming
 * surrounding control fields such as thought/actions/providers.
 *
 * This intentionally avoids decoding partial structured documents. It processes
 * complete lines, tracks top-level field boundaries, and only emits values for
 * fields explicitly listed in `streamFields`.
 */
export declare class StructuredFieldStreamExtractor implements IStreamExtractor {
    private readonly config;
    private lineBuffer;
    private currentField;
    private fieldContents;
    private emittedContent;
    private validatedFields;
    private fieldStates;
    private state;
    private readonly streamFieldSet;
    /**
     * The top-level field whose value bytes are currently arriving — tracked for
     * ALL fields (not just streamed ones) so per-field start/done events have a
     * correct decoded value. `currentField` (above) is the narrower "currently
     * streamed to onChunk" pointer.
     */
    private currentTrackedField;
    /** Fields for which `onFieldStart` has already fired (dedupe). */
    private startedFields;
    /** Fields for which `onFieldDone` has already fired (dedupe). */
    private doneFields;
    constructor(config: StructuredFieldStreamExtractorConfig);
    get done(): boolean;
    push(chunk: string): string;
    flush(): string;
    reset(): void;
    signalRetry(retryCount: number): {
        validatedFields: string[];
    };
    signalError(message: string): void;
    getValidatedFields(): Map<string, string>;
    diagnose(): ValidationDiagnosis;
    getState(): ExtractorState;
    private processAvailableLines;
    private processLine;
    private completeCurrentField;
    private emitFieldStart;
    private closeCurrentTrackedField;
    private appendFieldContent;
    private parseInlineValue;
    private normalizeContinuationLine;
    private baseStructuredFieldName;
    private emitFieldContent;
    private emitEvent;
}
/**
 * Extracts selected free-string fields from a streamed JSON response skeleton.
 *
 * Stage-1 response-handler output is a compact JSON envelope, not the line-based
 * `field: value` format handled by `StructuredFieldStreamExtractor`. This
 * extractor follows the producer's `ResponseSkeleton` spans and emits only
 * configured user-visible string fields such as `replyText`, so voice/TTS can
 * start without exposing the control envelope.
 */
export declare class ResponseSkeletonStreamExtractor implements IStreamExtractor {
    private readonly config;
    private buffer;
    private spanIndex;
    private activeStringField;
    private pendingEscape;
    private fieldContents;
    private emittedContent;
    private reasoningFilters;
    private state;
    private formatDecided;
    private passthrough;
    private passthroughEmitted;
    private readonly streamFieldSet;
    private readonly maxKeyPatternLength;
    constructor(config: {
        skeleton: ResponseSkeleton;
        streamFields: string[];
        onChunk: (chunk: string, field?: string, accumulated?: string) => void;
        onEvent?: (event: StreamEvent) => void;
        abortSignal?: AbortSignal;
        unordered?: boolean;
    });
    get done(): boolean;
    push(chunk: string): string;
    flush(): string;
    reset(): void;
    /**
     * On the first non-whitespace token, decide whether the stream is the
     * structured envelope this extractor parses (JSON/array/XML — opens with
     * `{`, `[`, or `<`) or plain prose. A local model that was not grammar-
     * constrained (e.g. the FFI backend, which cannot apply GBNF) may emit the
     * reply as raw prose with no envelope; the structured drain would then match
     * no spans and emit nothing, collapsing the whole reply into a single
     * trailing chunk. Detecting prose lets us stream it straight through as the
     * reply. Envelope-shaped output is unaffected, so the control fields
     * (thought/actions) are never leaked.
     */
    private decideFormat;
    /** Stream buffered prose straight through as reply text (passthrough mode). */
    private drainPassthrough;
    signalRetry(retryCount: number): {
        validatedFields: string[];
    };
    signalError(message: string): void;
    getValidatedFields(): Map<string, string>;
    diagnose(): ValidationDiagnosis;
    private drain;
    private drainUnordered;
    private findNextStreamFieldStart;
    private consumeLiteral;
    private consumeOpeningQuote;
    private processActiveString;
    private appendAndEmit;
    private appendVisibleAndEmit;
    private filterReasoningTags;
    private flushReasoningFilter;
    private emitEvent;
}
import type { StreamingContext } from "../streaming-context.js";
/**
 * Creates a streaming retry state from an extractor.
 */
export declare function createStreamingRetryState(extractor: IStreamExtractor): IStreamingRetryState & {
    appendText: (text: string) => void;
};
/**
 * Creates a complete streaming context with retry state management.
 */
export declare function createStreamingContext(extractor: IStreamExtractor, onStreamChunk: StreamChunkCallback, messageId?: string): StreamingContext & IStreamingRetryState;
//# sourceMappingURL=streaming.d.ts.map