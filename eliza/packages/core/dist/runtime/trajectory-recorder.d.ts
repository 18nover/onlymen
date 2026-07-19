/**
 * Trajectory recorder — JSON-file backend for the v5 native-tool-calling
 * trajectory observability subsystem.
 *
 * Spec: PLAN.md §18.1 (`RecordedStage` / `RecordedTrajectory` schemas) and
 * §18.2 (`TrajectoryRecorder` interface).
 *
 * Output shape is read by `packages/scripts/trajectory.ts` and `packages/scripts/run-eliza-cerebras.ts`.
 *
 * Persistence model:
 * - One JSON file per trajectory at
 *   `${ELIZA_TRAJECTORY_DIR ?? `${resolveStateDir()}/trajectories`}/<agentId>/<trajectoryId>.json`.
 * - Atomic writes: write to `<id>.json.tmp`, rename to `<id>.json`.
 * - Append-only stages: `recordStage` rewrites the whole file (small files,
 *   sub-100 KB typical).
 * - Failures must NOT crash the runtime — every I/O operation is wrapped in
 *   try/catch and routed through `runtime.logger.warn`.
 *
 * On/off is decided by the shared gate resolver (trajectory-gate.ts), so this
 * recorder and the DB logger agree: prod is opt-in (SOC2 O-5), test is off.
 */
import type { EvaluationResult } from "../types/components.js";
import type { ChatMessage, ToolChoice } from "../types/model.js";
import type { TrajectoryProviderAttribution } from "./trajectory-provider-attribution.js";
export type RecordedStageKind = "messageHandler" | "planner" | "tool" | "toolSearch" | "evaluation" | "subPlanner" | "compaction" | "factsAndRelationships";
export interface RecordedUsage {
    promptTokens: number;
    completionTokens: number;
    cacheReadInputTokens?: number;
    cacheCreationInputTokens?: number;
    totalTokens: number;
}
export interface RecordedToolCall {
    id?: string;
    name?: string;
    args?: Record<string, unknown>;
}
export interface RecordedModelCall {
    modelType: string;
    modelName?: string;
    provider: string;
    prompt?: string;
    messages?: ChatMessage[] | unknown[];
    tools?: unknown;
    toolChoice?: ToolChoice | unknown;
    providerOptions?: unknown;
    response: string;
    toolCalls?: RecordedToolCall[];
    usage?: RecordedUsage;
    finishReason?: string;
    /**
     * USD cost of this LLM call computed from the price table identified by
     * `priceTableId`. Local-inference providers (Ollama / LM Studio /
     * llama.cpp) record a real `0` — not "missing". The recorder emits a
     * warning log when a hosted-provider model has no price entry; the
     * field defaults to `0` in that case so cost roll-ups stay numeric.
     */
    costUsd?: number;
    /**
     * Snapshot identifier of the price table used to compute `costUsd`.
     * Closes M40 / W1-X1. Bumped whenever any rate in the canonical
     * pricing table at `features/trajectories/pricing.ts` changes.
     */
    priceTableId?: string;
    /** Provider order selected for the composeState call that fed this model input. */
    providerOrder?: string[];
    /**
     * Hash-first provider contributions. No provider text is duplicated: when
     * `spanStart`/`spanEnd` are present they index into the flattened form of the
     * persisted `messages` (`flattenTrajectoryMessages(messages)`), derived once
     * at read time — consumers slice that to verify exact provenance rather than a
     * second stored copy of the prompt.
     */
    providerAttributions?: TrajectoryProviderAttribution[];
}
/**
 * Marker emitted when one of `input`, `output`, `error`, `args`, or
 * `result` exceeds the configured byte cap. The original payload is
 * replaced with a string preview followed by an annotation; the metadata
 * block here surfaces the original size so reviewers and downstream
 * training pipelines can decide how to treat the truncation.
 *
 * `input` / `output` / `error` are used by tool (action) stages; `args`
 * and `result` are used by per-skill invocation records (W1-T5 / M13).
 */
export interface RecordedTruncationMarker {
    field: "input" | "output" | "error" | "args" | "result";
    originalBytes: number;
    capBytes: number;
}
export interface RecordedToolStage {
    name: string;
    args: Record<string, unknown>;
    result: unknown;
    success: boolean;
    durationMs: number;
    /**
     * The model-facing tool description the planner was shown for this action —
     * i.e. the exposed `ToolDefinition.description`, which is the action's
     * `routingHint` (its "use when / do NOT use when" guidance) prepended to the
     * compressed description. Captured so a trajectory reviewer or training
     * pipeline can see WHAT the action was for — and judge whether the planner
     * had enough to disambiguate it — directly from the execution record, without
     * cross-referencing the preceding planner stage's `model.tools`.
     */
    description?: string;
    error?: string;
    /**
     * Captured action-handler input (the resolved params passed into the
     * action). Encoded as JSON when possible. Capped at
     * `ELIZA_TRAJECTORY_FIELD_CAP_BYTES` (default 64KB); oversize values
     * are truncated and a marker is added to `truncated[]`.
     */
    input?: string;
    /**
     * Captured action-handler output (the full result the action returned,
     * not just the planner-shaped summary). Same encoding and cap as
     * `input`.
     */
    output?: string;
    /**
     * Captured action-handler error text. Same cap as `input`/`output`.
     * Mirrors `error` for free-text reads; structured `error` above is kept
     * for backwards compatibility with existing readers.
     */
    errorText?: string;
    /**
     * Per-field truncation markers. Present only when at least one of
     * `input`, `output`, or `errorText` was truncated by the byte cap.
     */
    truncated?: RecordedTruncationMarker[];
}
/**
 * Per-stage retrieval entry captured when measurement mode is on. One
 * entry per (action, stage) pair, recorded BEFORE reciprocal-rank-fusion
 * so the funnel analyzer can see what each individual stage produced.
 */
export interface RecordedRetrievalStageEntry {
    actionName: string;
    score: number;
    rank: number;
}
/**
 * Per-stage retrieval scores captured under `ELIZA_RETRIEVAL_MEASUREMENT=1`.
 * Default `undefined` — no perf cost in production unless the env var is
 * explicitly enabled.
 */
export interface RecordedRetrievalPerStageScores {
    exact: RecordedRetrievalStageEntry[];
    regex: RecordedRetrievalStageEntry[];
    keyword: RecordedRetrievalStageEntry[];
    bm25: RecordedRetrievalStageEntry[];
    embedding: RecordedRetrievalStageEntry[];
    contextMatch: RecordedRetrievalStageEntry[];
}
/**
 * Snapshot of the tool-search / action-retrieval phase. Logged once per
 * planner turn before the LLM call so reviewers can see which actions
 * were considered, the retrieval scores, and which tier each landed in.
 */
export interface RecordedToolSearchStage {
    query: {
        text: string;
        tokens?: string[];
        candidateActions?: string[];
        parentActionHints?: string[];
    };
    results: Array<{
        name: string;
        score: number;
        rank: number;
        rrfScore?: number;
        matchedBy?: string[];
        stageScores?: Record<string, number>;
    }>;
    tier: {
        tierA: string[];
        tierB: string[];
        omitted: number;
    };
    durationMs: number;
    fallback?: string;
    /**
     * Per-stage retrieval funnel. Populated only when the retrieval call
     * ran with measurement mode on (`ELIZA_RETRIEVAL_MEASUREMENT=1`).
     */
    perStageScores?: RecordedRetrievalPerStageScores;
    /**
     * Top-K fused (RRF) results. Mirrors `results` but exposes the raw
     * `rrfScore` field directly so downstream analyzers don't need to
     * unify the two shapes. Populated only under measurement mode.
     */
    fusedTopK?: Array<{
        actionName: string;
        rrfScore: number;
        rank: number;
    }>;
    /**
     * Actions the planner ultimately invoked this turn. Recorded by the
     * caller after the planner loop resolves — the retrieval call itself
     * does not know which results were selected.
     */
    selectedActions?: string[];
    /**
     * Ground-truth actions for this scenario, when available. Sourced from
     * the scenario manifest by the benchmark harness; never inferred from
     * the trajectory.
     */
    correctActions?: string[];
}
export interface RecordedEvaluationStage extends EvaluationResult {
    [key: string]: unknown;
}
/**
 * Snapshot of the facts/relationships extraction stage. Logged whenever
 * Stage 1 emits a non-empty `extract` and the dedup/persist pass runs in
 * parallel with the planner. Lets reviewers see (a) what the model thought
 * was worth keeping vs. dropping, and (b) what actually persisted.
 */
export interface RecordedFactsAndRelationshipsStage {
    candidates: {
        facts: string[];
        relationships: Array<{
            subject: string;
            predicate: string;
            object: string;
        }>;
    };
    kept: {
        facts: string[];
        relationships: Array<{
            subject: string;
            predicate: string;
            object: string;
        }>;
    };
    written: {
        facts: number;
        relationships: number;
    };
    thought: string;
}
export interface RecordedCacheStage {
    segmentHashes: string[];
    prefixHash: string;
    diffFromPriorStage?: {
        added: number;
        unchanged: number;
        removed: number;
    };
}
export interface RecordedStage {
    stageId: string;
    kind: RecordedStageKind;
    iteration?: number;
    retryIdx?: number;
    parentStageId?: string;
    startedAt: number;
    endedAt: number;
    latencyMs: number;
    model?: RecordedModelCall;
    tool?: RecordedToolStage;
    toolSearch?: RecordedToolSearchStage;
    evaluation?: RecordedEvaluationStage;
    cache?: RecordedCacheStage;
    factsAndRelationships?: RecordedFactsAndRelationshipsStage;
}
export interface RecordedTrajectoryMetrics {
    totalLatencyMs: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalCacheReadTokens: number;
    totalCacheCreationTokens: number;
    totalCostUsd: number;
    plannerIterations: number;
    toolCallsExecuted: number;
    toolCallFailures: number;
    toolSearchCount: number;
    evaluatorFailures: number;
    finalDecision?: "FINISH" | "CONTINUE" | "max_iterations" | "error";
}
export interface RecordedTrajectory {
    trajectoryId: string;
    agentId: string;
    roomId?: string;
    runId?: string;
    scenarioId?: string;
    traceId?: string;
    taskId?: string;
    sessionId?: string;
    parentStepId?: string;
    rootMessage: {
        id: string;
        text: string;
        sender?: string;
    };
    startedAt: number;
    endedAt?: number;
    status: "running" | "finished" | "errored";
    stages: RecordedStage[];
    metrics: RecordedTrajectoryMetrics;
}
export interface StartTrajectoryInput {
    agentId: string;
    roomId?: string;
    rootMessage: {
        id: string;
        text: string;
        sender?: string;
    };
    runId?: string;
    scenarioId?: string;
    traceId?: string;
    taskId?: string;
    sessionId?: string;
    parentStepId?: string;
}
export interface ListTrajectoriesOptions {
    agentId?: string;
    since?: number;
    limit?: number;
}
export interface TrajectoryRecorder {
    startTrajectory(input: StartTrajectoryInput): string;
    recordStage(trajectoryId: string, stage: RecordedStage): Promise<void>;
    endTrajectory(trajectoryId: string, status: "finished" | "errored"): Promise<void>;
    load(trajectoryId: string): Promise<RecordedTrajectory | null>;
    list(opts?: ListTrajectoriesOptions): Promise<RecordedTrajectory[]>;
}
interface RecorderLogger {
    warn?: (context: unknown, message?: string) => void;
    debug?: (context: unknown, message?: string) => void;
    error?: (context: unknown, message?: string) => void;
}
/**
 * Resolve the on-disk trajectory directory. Precedence per PLAN.md §18.1:
 *   ELIZA_TRAJECTORY_DIR
 *   ELIZA_STATE_DIR/trajectories
 *   XDG state-dir/trajectories
 */
export declare function resolveTrajectoryDir(): string;
/**
 * Whether the file recorder is enabled. Delegates to the single gate resolver
 * (trajectory-gate.ts) so the file recorder and the DB logger can no longer
 * disagree (#13775). Prod is now opt-in and test is off — the prior
 * always-on-unless-`=0` default is retired in favor of the SOC2 O-5 policy.
 */
export declare function isTrajectoryRecordingEnabled(): boolean;
/**
 * Review mode writes a human-readable markdown sibling for every JSON
 * trajectory. It is opt-in so default runtime writes stay unchanged.
 */
export declare function isTrajectoryMarkdownReviewEnabled(): boolean;
/**
 * Resolve the per-field byte cap for `input` / `output` / `errorText`. The
 * recorder uses this for action-step capture (M12). Override with
 * `ELIZA_TRAJECTORY_FIELD_CAP_BYTES`; values below 1KB or non-integer are
 * rejected as invalid and the default is used.
 */
export declare function resolveTrajectoryFieldCapBytes(): number;
/**
 * Encode an arbitrary value to a JSON string for trajectory persistence.
 * Strings pass through unchanged; everything else is sanitized (handles
 * Error, Date, bigint, circular refs) and serialized.
 */
export declare function encodeTrajectoryFieldValue(value: unknown): string;
/**
 * Truncate `value` to at most `capBytes` UTF-8 bytes. Returns the original
 * string and `null` marker when no truncation is needed, or the truncated
 * preview plus a structured marker when the cap was exceeded.
 *
 * The marker is the caller's responsibility to attach to the stage (see
 * `captureToolStageIO`).
 */
export declare function applyTrajectoryFieldCap(field: RecordedTruncationMarker["field"], value: string, capBytes: number): {
    value: string;
    marker: RecordedTruncationMarker | null;
};
export interface ToolStageIOInput {
    input?: unknown;
    output?: unknown;
    error?: unknown;
    capBytes?: number;
}
export interface ToolStageIOCapture {
    input?: string;
    output?: string;
    errorText?: string;
    truncated?: RecordedTruncationMarker[];
}
/**
 * Encode + cap action input/output/error for a tool stage. The result is
 * suitable for assignment into a `RecordedToolStage`. Fields that are
 * `undefined` after encoding are omitted so the on-disk schema stays
 * minimal for steps that have nothing to capture.
 */
export declare function captureToolStageIO(args: ToolStageIOInput): ToolStageIOCapture;
export interface SkillInvocationIOInput {
    args?: unknown;
    result?: unknown;
    capBytes?: number;
}
export type SkillInvocationTruncationMarker = Omit<RecordedTruncationMarker, "field"> & {
    field: "args" | "result";
};
export interface SkillInvocationIOCapture {
    args?: string;
    result?: string;
    truncated?: SkillInvocationTruncationMarker[];
}
/**
 * Encode + cap skill invocation args/result for a per-skill trajectory
 * record. Fields that are `undefined` after encoding are omitted so the
 * persisted shape stays minimal. Caps default to
 * `ELIZA_TRAJECTORY_FIELD_CAP_BYTES` (64KB).
 */
export declare function captureSkillInvocationIO(input: SkillInvocationIOInput): SkillInvocationIOCapture;
/**
 * Annotate a stage with `costUsd` and `priceTableId` if the model has
 * known pricing and the stage didn't already set it. The `model.modelName`
 * is the lookup key; `model.provider` is used to suppress the
 * missing-model warning for local-tier inference (Ollama, LM Studio,
 * llama.cpp).
 *
 * Recorder hooks call `computeCallCostUsd` themselves when they have the
 * data; this function is the fallback for callers that hand off raw
 * stages. Passing a logger lets the canonical pricing module emit a
 * structured warning when a hosted-provider model has no price entry.
 */
export declare function annotateStageCost(stage: RecordedStage, logger?: RecorderLogger): void;
export interface CreateJsonFileRecorderOptions {
    rootDir?: string;
    logger?: RecorderLogger;
    enabled?: boolean;
}
/**
 * Construct a JSON-file backed `TrajectoryRecorder`. The default rootDir is
 * resolved from `ELIZA_TRAJECTORY_DIR` → `ELIZA_STATE_DIR/trajectories` →
 * `resolveStateDir()/trajectories`.
 *
 * Pass `enabled: false` to short-circuit every method (test fixtures, opt-out
 * at construction time).
 */
export declare function createJsonFileTrajectoryRecorder(opts?: CreateJsonFileRecorderOptions): TrajectoryRecorder;
/** Bound on optional pre-end work before the terminal status is written anyway. */
export declare const DEFAULT_FINALIZE_TIMEOUT_MS = 60000;
export interface FinalizeTrajectoryRecordingOptions {
    recorder: TrajectoryRecorder;
    trajectoryId: string;
    status: "finished" | "errored";
    /**
     * Optional best-effort work to run before the terminal write (e.g. recording
     * a late background stage). Failures and timeouts are logged, never fatal.
     */
    beforeEnd?: () => Promise<void>;
    beforeEndTimeoutMs?: number;
    logger?: RecorderLogger;
}
/**
 * Lifecycle guard: every started trajectory must reach a terminal status.
 *
 * Runs `beforeEnd` bounded by `beforeEndTimeoutMs`, then writes the terminal
 * status no matter what — a hung or throwing `beforeEnd` (historically the
 * background FACTS_AND_RELATIONSHIPS model call) must never leave the
 * trajectory stuck in `running`.
 */
export declare function finalizeTrajectoryRecording(opts: FinalizeTrajectoryRecordingOptions): Promise<void>;
/**
 * Get a disabled recorder. Useful when wiring a runtime path that may or may
 * not have a recorder attached.
 */
export declare function getNoopTrajectoryRecorder(): TrajectoryRecorder;
export {};
//# sourceMappingURL=trajectory-recorder.d.ts.map