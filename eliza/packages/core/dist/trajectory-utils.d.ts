import { type ContextObjectTrajectoryExport, type Trajectory } from "./features/trajectories/types.js";
import type { TrajectoryProviderAttribution } from "./runtime/trajectory-provider-attribution.js";
import type { TrajectorySkillInvocationRecord } from "./services/trajectory-types.js";
import type { ContextEvent, ContextObject } from "./types/context-object.js";
import type { IAgentRuntime } from "./types/runtime.js";
export type TrajectoryFinalStatus = "completed" | "error" | "timeout" | "terminated";
export declare const TRAJECTORY_LLM_PURPOSES: readonly ["planner", "action", "provider", "evaluator", "background", "external_llm", "optimizer"];
export type TrajectoryLlmPurpose = (typeof TRAJECTORY_LLM_PURPOSES)[number];
export type TrajectoryLlmCallDetails = {
    model: string;
    modelVersion?: string;
    modelType?: string;
    provider?: string;
    systemPrompt: string;
    userPrompt: string;
    prompt?: string;
    messages?: unknown[];
    tools?: unknown;
    toolChoice?: unknown;
    output?: unknown;
    responseSchema?: unknown;
    providerOptions?: unknown;
    response: string;
    toolCalls?: unknown[];
    finishReason?: string;
    providerMetadata?: unknown;
    reasoning?: string;
    temperature: number;
    maxTokens: number;
    maxTokensOmitted?: boolean;
    /**
     * High-level model-call category. Prefer the canonical taxonomy in
     * {@link TRAJECTORY_LLM_PURPOSES}; custom strings remain accepted for
     * compatibility with older trajectory rows.
     */
    purpose: string;
    /**
     * Precise call-site label, e.g. `runtime.useModel`, `ai.generateText`,
     * or `openai.chat.completions.create`.
     */
    actionType: string;
    latencyMs: number;
    promptTokens?: number;
    completionTokens?: number;
    cacheReadInputTokens?: number;
    cacheCreationInputTokens?: number;
    providerOrder?: string[];
    providerAttributions?: TrajectoryProviderAttribution[];
};
export type TrajectoryProviderAccessParams = {
    stepId: string;
    providerName: string;
    data: Record<string, string | number | boolean | null>;
    sha256?: string;
    tokenCount?: number;
    position?: number;
    spanStart?: number;
    spanEnd?: number;
    purpose: string;
    query?: Record<string, string | number | boolean | null>;
    runId?: string;
    roomId?: string;
    messageId?: string;
    executionTraceId?: string;
};
export type TrajectoryProviderAccessLogger = {
    logProviderAccess: (params: TrajectoryProviderAccessParams) => void;
};
export type TrajectoryRuntimeLlmCallParams = {
    stepId: string;
    modelSlot?: string;
    runId?: string;
    roomId?: string;
    messageId?: string;
    executionTraceId?: string;
    providerOrder?: string[];
    providerAttributions?: TrajectoryProviderAttribution[];
} & TrajectoryLlmCallDetails;
export type TrajectoryRuntimeLlmCallLogger = {
    logLlmCall: (params: TrajectoryRuntimeLlmCallParams) => void;
};
/**
 * Caller-supplied portion of {@link TrajectoryLlmCallDetails} for
 * {@link recordLlmCall}. The helper measures `latencyMs` itself and
 * derives `response` from the function's return value.
 */
export type RecordLlmCallDetails = Omit<TrajectoryLlmCallDetails, "latencyMs" | "response"> & {
    /** Optional override for the recorded response string. */
    response?: string;
};
/**
 * Trajectory-shaped input for context-object export: either a slice of the
 * canonical {@link Trajectory} type or a loosely-typed detail/DB row
 * (`Record` metadata/metrics) used by trajectory services.
 */
export type ContextObjectTrajectoryExportTrajectoryInput = Partial<Pick<Trajectory, "trajectoryId" | "agentId" | "metadata" | "metrics">> | {
    trajectoryId?: string;
    agentId?: string;
    source?: string;
    status?: string;
    startTime?: number;
    endTime?: number;
    durationMs?: number;
    metadata?: Record<string, unknown>;
    metrics?: Record<string, unknown>;
};
export type ContextObjectTrajectoryExportInput = {
    trajectory?: ContextObjectTrajectoryExportTrajectoryInput | null;
    contextObject?: ContextObject | null;
    events?: readonly ContextEvent[];
    trajectoryId?: string;
    agentId?: string;
    contextObjectId?: string;
    createdAt?: number;
    source?: string;
    metadata?: Record<string, unknown>;
    metrics?: Record<string, unknown>;
};
export declare function extractContextObjectFromTrajectory(trajectory: unknown): ContextObject | null;
export declare function extractContextEventsFromTrajectory(trajectory: unknown): ContextEvent[] | null;
export declare function buildContextObjectTrajectoryExport(input: ContextObjectTrajectoryExportInput): ContextObjectTrajectoryExport;
export declare function serializeContextObjectTrajectoryExport(input: ContextObjectTrajectoryExportInput, space?: number): string;
type TrajectoryStartOptions = {
    source?: string;
    metadata?: Record<string, unknown>;
};
type TrajectoryStepState = {
    timestamp: number;
    agentBalance: number;
    agentPoints: number;
    agentPnL: number;
    openPositions: number;
};
type TrajectoryStepKindLike = "llm" | "action";
export type TrajectoryAnnotateParams = {
    stepId: string;
    kind?: TrajectoryStepKindLike;
    script?: string;
    childSteps?: string[];
    appendChildSteps?: string[];
    usedSkills?: string[];
    /**
     * Per-skill invocation records to append to the step. Closes M13
     * (W1-T5). Each record carries the (skillSlug, args, result,
     * durationMs, parentStepId) shape produced by `captureSkillInvocationIO`.
     * Implementations must append (not replace) so multiple skill invocations
     * inside the same step accumulate.
     */
    appendSkillInvocations?: TrajectorySkillInvocationRecord[];
};
type TrajectoryLoggerLike = {
    isEnabled?: () => boolean;
    startTrajectory?: (agentId: string, options?: TrajectoryStartOptions) => Promise<string> | string;
    startStep?: (trajectoryId: string, state: TrajectoryStepState) => string;
    endTrajectory?: (stepIdOrTrajectoryId: string, status?: TrajectoryFinalStatus, finalMetrics?: Record<string, unknown>) => Promise<void> | void;
    flushWriteQueue?: (trajectoryId: string) => Promise<void> | void;
    logLlmCall?: (params: {
        stepId: string;
    } & TrajectoryLlmCallDetails) => void;
    /**
     * Optional. When implemented (DatabaseTrajectoryLogger does), lets a caller
     * extend an existing step row with the new schema fields (kind, script,
     * childSteps, usedSkills) without depending directly on @elizaos/agent.
     */
    annotateStep?: (params: TrajectoryAnnotateParams) => Promise<void> | void;
};
type StandaloneTrajectoryOptions = {
    source: string;
    metadata?: Record<string, unknown>;
    successStatus?: TrajectoryFinalStatus;
    errorStatus?: Exclude<TrajectoryFinalStatus, "completed">;
};
type TrajectoryLlmGuardContext = {
    model?: string;
    modelType?: string;
    purpose?: string;
    actionType?: string;
};
export declare function isTrajectoryStrictModeEnabled(): boolean;
export declare function normalizeTrajectoryLlmPurpose(value: string | null | undefined, fallback?: TrajectoryLlmPurpose): TrajectoryLlmPurpose;
/**
 * Return true for model slots that are expected to produce generative LLM
 * output. Embeddings, tokenizers, and speech/transcription/media models are
 * intentionally excluded from strict trajectory enforcement.
 */
export declare function isLlmGenerationModelType(modelType: unknown): boolean;
/**
 * Strict-mode assertion for any generative LLM call. In normal mode this
 * returns immediately. With `ELIZA_TRAJECTORY_STRICT=1`, it throws unless a
 * trajectory step is active.
 */
export declare function assertActiveTrajectoryForLlmCall(context?: TrajectoryLlmGuardContext): string | null;
/**
 * Strict-mode assertion for low-level raw SDK/fetch shims. Use this in tests
 * or thin adapters that cannot directly call {@link recordLlmCall}; canonical
 * raw generation call sites should still wrap the SDK call in
 * {@link recordLlmCall}.
 */
export declare function assertRecordedLlmCall(context?: TrajectoryLlmGuardContext): void;
export declare function resolveTrajectoryLogger(runtime: IAgentRuntime): TrajectoryLoggerLike | null;
export declare function withStandaloneTrajectory<T>(runtime: IAgentRuntime | null | undefined, options: StandaloneTrajectoryOptions, callback: () => Promise<T> | T): Promise<T>;
/**
 * Annotate a trajectory step via whichever trajectory logger service is
 * registered on the runtime. Returns true when an annotate-capable service
 * was found and called; false when no compatible service exists or it is
 * disabled. Errors from the underlying service are propagated.
 */
export declare function annotateActiveTrajectoryStep(runtime: IAgentRuntime | null | undefined, params: TrajectoryAnnotateParams): Promise<boolean>;
export declare function logActiveTrajectoryLlmCall(runtime: IAgentRuntime | null | undefined, details: TrajectoryLlmCallDetails): boolean;
/**
 * Canonical wrapper for raw SDK/fetch generative LLM calls.
 *
 * Time `fn`, capture its result, and emit a trajectory llm-call entry against
 * the currently active trajectory step. The caller supplies the static portion
 * of {@link TrajectoryLlmCallDetails} (model, prompts, purpose, actionType,
 * token limits, etc.); `latencyMs` is measured here and `response` is derived
 * from `fn`'s return value (stringified when not already a string) unless
 * `details.response` is provided explicitly.
 *
 * Use the canonical purpose taxonomy where possible: `planner`, `action`,
 * `provider`, `evaluator`, `background`, `external_llm`, or `optimizer`.
 * `actionType` should identify the concrete call site, such as
 * `ai.generateText` or `openai.chat.completions.create`.
 *
 * If no trajectory step is active or no trajectory logger is registered,
 * `fn` still runs and its result is returned in normal mode. With
 * `ELIZA_TRAJECTORY_STRICT=1`, this throws before calling `fn` unless a
 * trajectory step is active.
 */
export declare function recordLlmCall<T>(runtime: IAgentRuntime | null | undefined, details: RecordLlmCallDetails, fn: () => Promise<T> | T): Promise<T>;
/**
 * Wrap an action handler invocation in a child trajectory step linked to the
 * currently-active parent step. All `useModel` / `useModel` -ish calls inside
 * `fn` will be recorded against the new child step rather than the parent.
 *
 * Transparent: when no trajectory is active, `fn` runs unchanged and no
 * step is created.
 */
export declare function withActionStep<T>(runtime: IAgentRuntime | null | undefined, actionName: string, fn: () => Promise<T> | T): Promise<T>;
/**
 * Same as {@link withActionStep} but for provider rendering.
 */
export declare function withProviderStep<T>(runtime: IAgentRuntime | null | undefined, providerName: string, fn: () => Promise<T> | T): Promise<T>;
/**
 * Same as {@link withActionStep} but for evaluator turns. Closes M14:
 * every evaluator invocation emits a child trajectory step whose model
 * call(s) attach to it. The child step's `kind` is set to `"evaluator"`
 * downstream by the agent persistence layer when the LLM call carries
 * `purpose === "evaluation"` (see `appendLlmCall`).
 */
export declare function withEvaluatorStep<T>(runtime: IAgentRuntime | null | undefined, evaluatorName: string, fn: () => Promise<T> | T): Promise<T>;
export type SpawnTrajectoryHandle = {
    /** The currently-active step id at spawn time, if any. */
    parentStepId: string | undefined;
    /**
     * Annotate the parent step with a freshly-known child step id (e.g. one
     * the spawned coding agent reports back over the bridge). No-op when no
     * parent step was active at spawn time.
     */
    linkChild: (childStepId: string) => Promise<boolean>;
};
/**
 * Helper for spawn paths (orchestrator / app-control / workbench coding agents)
 * that produces a parent-stepId-aware handle. The fn is run inside the current
 * trajectory context so any inline LLM calls during the spawn dispatch are
 * still parent-attributed; the returned handle lets the caller link
 * later-discovered child step ids back onto the parent.
 */
export declare function spawnWithTrajectoryLink<T>(runtime: IAgentRuntime | null | undefined, _options: {
    source?: string;
    metadata?: Record<string, unknown>;
} | undefined, fn: (handle: SpawnTrajectoryHandle) => Promise<T> | T): Promise<T>;
/**
 * Single source-of-truth registry for trajectory "source" tags whose
 * trajectories must be excluded from training / optimization datasets.
 *
 * Bench-eval harnesses, optimizer self-judge calls, etc. register themselves
 * once at module load:
 *
 *   registerTrajectorySource("plugin-action-bench", {excludeFromTraining: true});
 *
 * Then any pipeline that reads trajectories before training (the privacy
 * filter / nightly export / on-demand orchestrator) checks
 * `isExcludedFromTraining(row.source)` and drops the row.
 */
type TrajectorySourceMeta = {
    excludeFromTraining: boolean;
};
export declare function registerTrajectorySource(name: string, opts: TrajectorySourceMeta): void;
export declare function isExcludedFromTraining(sourceName: string | null | undefined): boolean;
/**
 * Test-only: wipe the source registry. Not exported via the package barrel.
 * @internal
 */
export declare function __resetTrajectorySourceRegistryForTests(): void;
export {};
//# sourceMappingURL=trajectory-utils.d.ts.map