/**
 * Interactive-over-background scheduling for single-lane local inference
 * (elizaOS/eliza#11914).
 *
 * On-device text generation runs one decode at a time: the Android bionic GPU
 * host serializes every request on its resident-model lock, and the in-process
 * AOSP FFI path shares one fused context. Before this gate, requests reached
 * that lane in arrival order — a long autonomous background job (an ~11k-char
 * prompt at phone prefill speed holds the lock for many minutes) starved
 * interactive chat turns indefinitely, and a background job whose next firing
 * arrived while the previous one still held the lane piled abandoned work onto
 * the host-side queue.
 *
 * The gate is the TS-side owner of that lane:
 *
 *   - **Two lanes, interactive first.** Requests acquire the gate before
 *     touching the native lane. When the lane frees, waiting interactive
 *     requests always dispatch before waiting background requests; within a
 *     lane order is FIFO.
 *   - **Background never queues in front of interactive.** A background
 *     acquisition only starts when the lane is idle AND no interactive request
 *     is waiting.
 *   - **Bounded background wait.** A background acquisition that cannot start
 *     within its wait budget fails with {@link InferenceBackgroundWaitTimeoutError}
 *     BEFORE any native/host work is enqueued. The scheduled-task layer's
 *     existing failure handling (backoff + blocking re-fire suppression in
 *     `TaskService`) then coalesces the job instead of stacking host-side work
 *     — the same structural rule the LifeOps scheduler follows.
 *   - **No preemption.** An in-flight decode is never cancelled; interactive
 *     priority means jumping the queue, not yanking the lock.
 *
 * Consumers: the AOSP fused text handler (`plugin-aosp-local-inference`), the
 * bionic-host loader branch (`plugin-local-inference`), and the mobile
 * device-bridge text handlers (`plugin-capacitor-bridge`). All three run in the
 * same agent process and share the {@link getInferencePriorityGate} singleton.
 *
 * The device-class background budget (#11760 probe seam) lives here too:
 * {@link resolveBackgroundInferenceBudget} caps a background job's `maxTokens`
 * and prompt size by RAM class so a background summarization cannot hold the
 * lane for multi-minute stretches on a constrained phone.
 */
import type { LocalInferencePriority } from "../types/model.js";
/**
 * Device RAM class for on-device inference policy. Canonical probe
 * (env `ELIZA_INFERENCE_RAM_CLASS` exported by `ElizaAgentService`, with a
 * `/proc/meminfo` fallback) lives in
 * `plugins/plugin-aosp-local-inference/src/inference-memory-policy.ts`
 * (elizaOS/eliza#11760); this type is shared so policy helpers here and the
 * plugin-side probe agree.
 */
export type InferenceRamClass = "constrained" | "standard";
/**
 * Read the #11760 RAM-class env contract (`ELIZA_INFERENCE_RAM_CLASS`,
 * exported into the agent process by `ElizaAgentService` on Android). Returns
 * null when unset/invalid — callers with a richer probe (the AOSP plugin's
 * `classifyInferenceRamClass`, which adds the `/proc/meminfo` fallback) layer
 * it on top; callers without one should treat null as "standard".
 */
export declare function inferenceRamClassFromEnv(env?: NodeJS.ProcessEnv): InferenceRamClass | null;
/**
 * Per-class budget for background-priority generation on the single local
 * lane. Sized from the Pixel 6a (`constrained`) measurements in #11734/#11912:
 * marginal prefill ≈ 5.1 tok/s and decode ≤ 7.9 tok/s, so the constrained caps
 * bound a background job's lock hold to a few minutes worst-case instead of
 * the tens of minutes an uncapped 11k-char / 8192-token job costs.
 */
export interface BackgroundInferenceBudget {
    /** Cap on `maxTokens` for a background generation. */
    maxTokens: number;
    /** Cap on prompt length in characters (middle-truncated, ends preserved). */
    maxPromptChars: number;
    /** Bounded gate wait before the background request fails without running. */
    lockWaitMs: number;
}
/** Resolve the background generation budget for a device RAM class. */
export declare function resolveBackgroundInferenceBudget(ramClass: InferenceRamClass): BackgroundInferenceBudget;
/**
 * Clamp a background job's prompt to `maxPromptChars` by removing the MIDDLE,
 * preserving the head (system/template opening) and the tail (the most recent
 * context plus the template's generation suffix — e.g. Gemma's
 * `<start_of_turn>model`), so the prompt envelope stays well-formed.
 */
export declare function clampBackgroundPrompt(prompt: string, maxPromptChars: number): string;
/**
 * Apply the background budget to a generate request. Interactive requests are
 * NEVER clamped — this is for background-priority jobs only. Returns the
 * clamped fields plus a human-readable list of what changed (for the log line
 * at the call site).
 */
export declare function applyBackgroundInferenceBudget(args: {
    prompt: string;
    maxTokens: number | undefined;
}, budget: BackgroundInferenceBudget): {
    prompt: string;
    maxTokens: number;
    clamped: string[];
};
/**
 * Thrown when a background acquisition cannot start within its wait budget.
 * The request never reached the native lane; the scheduled-task layer's
 * failure/backoff path handles the re-fire.
 */
export declare class InferenceBackgroundWaitTimeoutError extends Error {
    readonly code = "INFERENCE_BACKGROUND_WAIT_TIMEOUT";
    constructor(waitedMs: number, holder: string | null);
}
export interface InferencePriorityGateOptions {
    now?: () => number;
    logger?: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
    };
}
export interface InferencePriorityGateSnapshot {
    held: boolean;
    holderPriority: LocalInferencePriority | null;
    holderLabel: string | null;
    holderHeldMs: number;
    interactiveWaiting: number;
    backgroundWaiting: number;
}
export interface RunExclusiveOptions {
    priority: LocalInferencePriority;
    /**
     * Bounded wait for background requests, ms. Ignored for interactive
     * requests (their own transport timeout governs the total).
     */
    waitMs?: number;
    /** Abort while WAITING dequeues the request; in-flight work is not cancelled here. */
    signal?: AbortSignal;
    /** Short label for lock telemetry (e.g. "TEXT_LARGE", "bionic-generate"). */
    label?: string;
}
/**
 * Two-lane priority lock for the single local inference lane. See module doc.
 */
export declare class InferencePriorityGate {
    private readonly now;
    private readonly logger;
    private holder;
    private readonly interactiveQueue;
    private readonly backgroundQueue;
    constructor(opts?: InferencePriorityGateOptions);
    snapshot(): InferencePriorityGateSnapshot;
    /**
     * Run `fn` while holding the lane. Interactive requests wait indefinitely
     * (FIFO among themselves, always ahead of background); background requests
     * start only when the lane is idle with no interactive waiter, and fail
     * with {@link InferenceBackgroundWaitTimeoutError} after `waitMs`.
     */
    runExclusive<T>(opts: RunExclusiveOptions, fn: () => Promise<T>): Promise<T>;
    private acquire;
    private removeWaiter;
    private release;
}
export declare function getInferencePriorityGate(): InferencePriorityGate;
/** Test hook — replace or clear (null) the process-wide gate. */
export declare function setInferencePriorityGate(gate: InferencePriorityGate | null): void;
//# sourceMappingURL=inference-priority-gate.d.ts.map