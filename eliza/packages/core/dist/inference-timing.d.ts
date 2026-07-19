/**
 * Per-turn inference latency tracing.
 *
 * A turn-scoped span/mark recorder that answers one question: "where did the
 * wall-clock time of this response go?" It is the text/cloud sibling of the
 * voice loop's `EndToEndLatencyTracer` (plugin-local-inference) — same intent,
 * different shape: voice has a fixed ordered checkpoint set; a text turn has an
 * open-ended set of named spans (composeState, the model round-trip, the HTTP
 * fetch, the concurrency-limiter wait, evaluators) that every layer of the
 * stack contributes to without threading a recorder reference.
 *
 * Threading model (mirrors `streaming-context.ts`): the message handler opens a
 * timer with {@link runWithInferenceTiming} for the turn; any code running
 * inside that async scope — `AgentRuntime.useModel`, `composeState`, the
 * elizaOS Cloud HTTP handler, the evaluator service — calls the context-free
 * helpers ({@link timeInferenceSpan}, {@link recordInferenceSpan},
 * {@link markInference}). When no timer is active the helpers are zero-cost
 * no-ops, so instrumentation is safe to leave on every code path.
 *
 * A missing measurement is recorded as missing, never synthesized (AGENTS.md
 * §3 / §8): derived metrics whose endpoint mark was never recorded stay `null`.
 *
 * Logger only, `[InferenceTiming]` prefix (AGENTS.md §9).
 */
export type InferenceTimingMeta = Record<string, string | number | boolean>;
export interface InferenceSpan {
    /** Stage name, e.g. `composeState`, `model:RESPONSE_HANDLER`,
     *  `cloud.http:/chat/completions`, `cloud.semaphore-wait`, `evaluators`. */
    name: string;
    /** Wall-clock ms since the turn's `t0` when the span opened. */
    startMs: number;
    /** Wall-clock ms since `t0` when the span closed. */
    endMs: number;
    /** `endMs - startMs`. */
    durationMs: number;
    meta?: InferenceTimingMeta;
}
export interface InferenceMark {
    name: string;
    /** Wall-clock ms since the turn's `t0`. */
    tMs: number;
}
/** Canonical point-in-time marks the summary derives headline metrics from. */
export declare const INFERENCE_MARKS: {
    /** First streamed token/char delivered to the caller (streaming only). */
    readonly firstToken: "first-token";
    /** The user-visible reply was handed to the delivery callback. */
    readonly replyDelivered: "reply-delivered";
};
export interface InferenceTurnSummary {
    turnId: string;
    label: string;
    roomId: string | null;
    modelProvider: string | null;
    t0EpochMs: number;
    closedAtEpochMs: number | null;
    /** `t0` → turn close. Null while the turn is still open. */
    totalMs: number | null;
    /** `t0` → `first-token` mark; null when nothing streamed. */
    timeToFirstTokenMs: number | null;
    /** `t0` → `reply-delivered` mark; null when no reply was delivered. */
    timeToReplyMs: number | null;
    spans: InferenceSpan[];
    marks: InferenceMark[];
    /**
     * Per-span-name roll-up: total ms and count within this turn. Durations can
     * sum past wall-clock time because sibling spans (e.g. parallel providers)
     * overlap — this is a contribution view, not a timeline partition.
     */
    byName: Record<string, {
        totalMs: number;
        count: number;
    }>;
    anomalies: string[];
}
export declare class InferenceTurnTimer {
    readonly turnId: string;
    readonly label: string;
    readonly roomId: string | null;
    readonly t0EpochMs: number;
    modelProvider: string | null;
    private readonly spans;
    private readonly marks;
    private readonly anomalies;
    private readonly maxSpans;
    private closedAtEpochMs;
    constructor(args: {
        turnId: string;
        label: string;
        roomId?: string | null;
        t0EpochMs?: number;
        maxSpans?: number;
    });
    private rel;
    /** Open a span; returns a function that closes it. Safe to call the closer
     *  more than once (subsequent calls are ignored). */
    openSpan(name: string, meta?: InferenceTimingMeta): () => void;
    /** Record a span whose duration was already measured by the caller. */
    recordSpan(name: string, durationMs: number, meta?: InferenceTimingMeta): void;
    private recordSpanAbsolute;
    /** Record a once-per-turn point mark. A duplicate keeps the first. */
    mark(name: string, atEpochMs?: number): void;
    /** Attribute the turn to a model provider (first writer wins). */
    setModelProvider(provider: string | null | undefined): void;
    close(): InferenceTurnSummary;
    summary(): InferenceTurnSummary;
}
/** Run `fn` with `timer` as the active turn timer for all nested async work. */
export declare function runWithInferenceTiming<T>(timer: InferenceTurnTimer | undefined, fn: () => T): T;
/** The active turn timer, or undefined when no turn is being timed. */
export declare function getInferenceTimer(): InferenceTurnTimer | undefined;
/** Time `fn` as a span on the active timer (no-op-times when none active). */
export declare function timeInferenceSpan<T>(name: string, fn: () => Promise<T>, meta?: InferenceTimingMeta): Promise<T>;
/** Record a pre-measured span on the active timer (no-op when none active). */
export declare function recordInferenceSpan(name: string, durationMs: number, meta?: InferenceTimingMeta): void;
/** Record a point mark on the active timer (no-op when none active). */
export declare function markInference(name: string, atEpochMs?: number): void;
/** Attribute the active turn to a model provider (no-op when none active). */
export declare function setInferenceModelProvider(provider: string | null | undefined): void;
export interface InferenceHistogramSummary {
    count: number;
    p50: number | null;
    p90: number | null;
    p99: number | null;
    min: number | null;
    max: number | null;
    mean: number | null;
}
declare class InferenceTimingRegistry {
    private readonly ring;
    private readonly spanHistograms;
    private readonly ttft;
    private readonly ttreply;
    private readonly total;
    record(summary: InferenceTurnSummary): void;
    recentTurns(limit: number): InferenceTurnSummary[];
    spanSummaries(): Record<string, InferenceHistogramSummary>;
    derivedSummaries(): Record<string, InferenceHistogramSummary>;
    reset(): void;
}
export declare const inferenceTimingRegistry: InferenceTimingRegistry;
export interface InferenceTimingDevPayload {
    generatedAtEpochMs: number;
    turns: InferenceTurnSummary[];
    spanHistograms: Record<string, InferenceHistogramSummary>;
    derivedHistograms: Record<string, InferenceHistogramSummary>;
}
/** JSON body for a dev endpoint (e.g. `GET /api/dev/inference-timing`). */
export declare function buildInferenceTimingDevPayload(limit?: number): InferenceTimingDevPayload;
/** A compact `name=ms` breakdown sorted by descending contribution. */
export declare function formatInferenceTimingSummary(s: InferenceTurnSummary): string;
/**
 * Close the timer, fold it into the process registry, and emit the breakdown.
 * Call once at the end of a turn. No-op-safe for an undefined timer.
 */
export declare function emitInferenceTiming(timer: InferenceTurnTimer | undefined): InferenceTurnSummary | null;
/** Allocate a process-unique turn id for a new inference timer. */
export declare function nextInferenceTurnId(): string;
export {};
//# sourceMappingURL=inference-timing.d.ts.map