/**
 * OptimizedPromptService — runtime cache of native-optimizer artifacts.
 *
 * Native MIPRO/GEPA/bootstrap-fewshot optimizers (under
 * `plugins/plugin-training/src/optimizers/`) write a JSON artifact per task into
 * `<stateDir>/optimized-prompts/<task>/`. The runtime consults this service
 * before constructing the system prompt for one of the core decision
 * tasks and substitutes the optimized prompt (plus any few-shot
 * demonstrations) when an artifact is available.
 *
 * On-disk layout (per task):
 *   <stateDir>/optimized-prompts/<task>/
 *     v1.json, v2.json, ..., vN.json   — concrete artifact files (last 5 retained)
 *     current   -> vN.json              — symlink; the live prompt
 *     previous  -> vN-1.json            — symlink; the immediate predecessor
 *     previous2 -> vN-2.json            — symlink; one further back
 *
 * Service contract:
 *   - `getPrompt(task)` — synchronous accessor, returns the loaded prompt or
 *     null. Cheap to call; reads the in-memory cache. Does not refresh.
 *   - `setPrompt(task, artifact)` — atomically writes a new artifact as the
 *     next `vN.json`, repoints the `current` / `previous` / `previous2`
 *     symlinks, prunes to the last 5 versions, and refreshes the cache.
 *   - `rollback(task)` — flip `current` and `previous` symlinks, then
 *     refresh the cache. Used by `eliza training rollback-prompt <task>`.
 *   - `getMetadata(task)` — quick view of optimizer + score for diagnostics.
 *   - `refresh()` — re-scan the disk store. Called automatically by `start()`,
 *     also exposed for the `Settings → Auto-Training` panel.
 *
 * Loading rule: for each task, the `current` symlink wins. When `current`
 * is missing (e.g. a corrupted store) we fall back to scanning the directory
 * and selecting the most recent `generatedAt`.
 *
 * The on-disk format intentionally mirrors `OptimizedPromptArtifact` from
 * `plugins/plugin-training/src/optimizers/types.ts`. We re-declare the type here
 * (instead of importing) because `@elizaos/core` is upstream of
 * `@elizaos/plugin-training` and adding the dependency would invert the layering.
 */
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
export declare const OPTIMIZED_PROMPT_CURRENT_LINK = "current";
export declare const OPTIMIZED_PROMPT_PREVIOUS_LINK = "previous";
export declare const OPTIMIZED_PROMPT_PREVIOUS2_LINK = "previous2";
export declare const OPTIMIZED_PROMPT_RETAIN_VERSIONS = 5;
export declare const OPTIMIZED_PROMPT_SERVICE = "optimized_prompt";
export type OptimizedPromptTask = "should_respond" | "context_routing" | "action_planner" | "response" | "media_description" | "action_descriptions" | "autonomy" | "view_context" | "calendar_extract" | "schedule_plan" | "reminder_dispatch" | "inbox_triage" | "meeting_prep" | "morning_brief" | "health_checkin" | "screentime_recap" | "creative_draft";
export declare const OPTIMIZED_PROMPT_TASKS: readonly OptimizedPromptTask[];
/**
 * The LifeOps subset of {@link OPTIMIZED_PROMPT_TASKS}. Exposed so LifeOps
 * plugins and the training optimizer can iterate the per-capability tasks
 * without re-declaring the list — keeps `@elizaos/core` the single source of
 * truth for the LifeOps optimization taxonomy.
 */
export declare const LIFEOPS_OPTIMIZED_PROMPT_TASKS: readonly OptimizedPromptTask[];
export type OptimizerName = "instruction-search" | "prompt-evolution" | "gepa" | "bootstrap-fewshot" | "dspy-bootstrap-fewshot" | "dspy-copro" | "dspy-mipro";
/**
 * Mirror of `OptimizationExample` from `plugins/plugin-training/src/optimizers/types.ts`.
 * Kept narrow on purpose — the runtime only renders these into the prompt.
 */
export interface OptimizedPromptFewShotExample {
    id?: string;
    input: {
        system?: string;
        user: string;
    };
    expectedOutput: string;
    reward?: number;
    metadata?: Record<string, unknown>;
}
export interface OptimizedPromptLineageEntry {
    round: number;
    variant: number;
    score: number;
    notes?: string;
}
export interface OptimizedPromptFrontierEntry {
    prompt: string;
    score: number;
    promptTokenCount: number;
    origin: string;
    feedback?: string;
}
export interface OptimizedPromptContextConfig {
    providerSet?: readonly string[];
    providerOrder?: readonly string[];
    renderTemplates?: Readonly<Record<string, string>>;
    budgetVector?: Readonly<Record<string, number>>;
}
/**
 * Snapshot of the noise-gate promotion decision that accepted this artifact,
 * mirrored from `PromotionDecision` in
 * `plugins/plugin-training/src/core/promotion-gate.ts` plus the two provenance
 * fields the write site adds (`incumbentSource` / `gateSource`). Persisted for
 * diagnostics — every field is optional because older artifacts predate it.
 */
export interface PromotionDecisionSummary {
    promote?: boolean;
    incumbentMeanScore?: number;
    incumbentStdDev?: number;
    candidateScore?: number;
    delta?: number;
    promotionMargin?: number;
    noiseThreshold?: number;
    incumbentReseeds?: number;
    examplesPerPass?: number;
    reason?: string;
    incumbentScores?: number[];
    incumbentSource?: string;
    gateSource?: string;
}
export interface OptimizedPromptArtifact {
    task: OptimizedPromptTask;
    optimizer: OptimizerName;
    baseline: string;
    prompt: string;
    score: number;
    baselineScore: number;
    datasetId: string;
    datasetSize: number;
    generatedAt: string;
    fewShotExamples?: OptimizedPromptFewShotExample[];
    lineage: OptimizedPromptLineageEntry[];
    frontier?: OptimizedPromptFrontierEntry[];
    promotionDecision?: PromotionDecisionSummary;
    contextConfig?: OptimizedPromptContextConfig;
}
export interface OptimizedPromptResolved {
    prompt: string;
    fewShotExamples?: OptimizedPromptFewShotExample[];
    contextConfig?: OptimizedPromptContextConfig;
    optimizerSource: OptimizerName;
}
export interface OptimizedPromptMetadata {
    generatedAt: string;
    optimizer: OptimizerName;
    score: number;
    baselineScore: number;
    datasetSize: number;
}
/**
 * Audit-event tag emitted when an optimized-prompt artifact's HMAC fails
 * verification. Mirrors the contract surface
 * `AUDIT_ACTIONS.optimized_prompt.integrity_failed` from
 * `@elizaos/security`; the dispatcher is loaded by the runtime, which
 * means logging this tag from core is sufficient for the audit pipeline
 * to pick it up.
 */
export declare const OPTIMIZED_PROMPT_INTEGRITY_FAILED_AUDIT_ACTION = "optimized_prompt.integrity_failed";
/** Test/diagnostic helper: compute the MAC the service would write. */
export declare function _computeOptimizedPromptMacForTest(payload: string): string;
/**
 * Strict parser. We reject artifacts that are missing required fields so a
 * corrupt file cannot silently shadow the baseline prompt with garbage.
 */
export declare function parseOptimizedPromptArtifact(raw: unknown): OptimizedPromptArtifact | null;
/**
 * Parse the `OPTIMIZED_PROMPT_DISABLE` env var into a strongly-typed set of
 * disabled tasks. Unknown task names are dropped — an operator disabling a
 * misspelled task should not crash the runtime, and the misspelling must not
 * accidentally disable some other task — but each dropped token is logged so a
 * typo doesn't silently disable nothing.
 *
 * Format: comma-separated list of task names. Whitespace is trimmed; empty
 * tokens are ignored without a warning.
 * Example: `OPTIMIZED_PROMPT_DISABLE=should_respond,response`.
 */
export declare function parseDisabledTasksEnv(raw: string | undefined): ReadonlySet<OptimizedPromptTask>;
/**
 * Stateful service. Subclassing `Service` keeps it discoverable via
 * `runtime.getService(OPTIMIZED_PROMPT_SERVICE)` and lets us register through
 * the standard plugin lifecycle.
 */
export declare class OptimizedPromptService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    private storeRoot;
    private cache;
    private disabledTasks;
    static start(runtime: IAgentRuntime): Promise<OptimizedPromptService>;
    stop(): Promise<void>;
    /** Override the on-disk store root. Primarily for tests. */
    setStoreRoot(root: string): void;
    getStoreRoot(): string;
    /**
     * Test-only hook to refresh the disabled-tasks set after the env var has
     * changed. The default constructor snapshot is read once on instantiation,
     * which is the right behavior in production (env vars set at boot).
     */
    setDisabledTasksFromEnv(raw: string | undefined): void;
    /**
     * Returns true when the operator has emergency-disabled this task via
     * `OPTIMIZED_PROMPT_DISABLE`. The runtime should fall back to the baseline
     * prompt instead of substituting the artifact.
     */
    isTaskDisabled(task: OptimizedPromptTask): boolean;
    /**
     * Synchronous accessor. Returns the cached artifact for the task or null.
     * Hot path — called per-prompt in the runtime loop. Honours
     * `OPTIMIZED_PROMPT_DISABLE` — a disabled task returns null even when an
     * artifact is cached.
     */
    getPrompt(task: OptimizedPromptTask): OptimizedPromptResolved | null;
    getMetadata(task: OptimizedPromptTask): OptimizedPromptMetadata | null;
    /**
     * True iff the task has an optimized artifact loaded and is not disabled
     * by `OPTIMIZED_PROMPT_DISABLE`. Mirrors the gate used by `getPrompt`.
     */
    hasOptimized(task: OptimizedPromptTask): boolean;
    /**
     * Atomic write of a new artifact. Writes the new version as `v(N+1).json`,
     * repoints `current` / `previous` / `previous2` symlinks, prunes the
     * directory to the last `OPTIMIZED_PROMPT_RETAIN_VERSIONS` artifacts, and
     * refreshes the cache for the task.
     *
     * The same taxonomy is registered by both core basicServices and
     * plugin-training register-runtime, and trigger/CLI train also call this —
     * so two setPrompt calls for one task can overlap in-process. The version
     * claim is made cross-process-safe with O_EXCL; the symlink-repoint and
     * prune steps mutate shared `current`/`previous` links and the retention
     * window, so the whole write is serialized per task dir via an in-process
     * lock to keep those mutations consistent.
     */
    setPrompt(task: OptimizedPromptTask, artifact: OptimizedPromptArtifact): Promise<string>;
    private writeArtifact;
    /**
     * Flip the `current` and `previous` symlinks. After this call,
     * `getPrompt(task)` returns the artifact that was previously second-most
     * recent, and the artifact that was current becomes the new previous.
     * `previous2` is left untouched (next-back history pointer).
     *
     * Returns the absolute path of the artifact that is now `current`.
     * Throws when `previous` is not present (nothing to roll back to).
     */
    rollback(task: OptimizedPromptTask): Promise<string>;
    /** Re-scan the on-disk store. Safe to call repeatedly. */
    refresh(): Promise<void>;
    /**
     * Load the live cache entry for a single task by reading its on-disk store.
     * Returns null when the task has no usable artifact. Throws only on
     * unexpected filesystem errors (e.g. ELOOP/EACCES/EISDIR), which
     * {@link refresh} isolates per task.
     */
    private loadTaskEntry;
}
//# sourceMappingURL=optimized-prompt.d.ts.map