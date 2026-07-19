/**
 * Batches many independent structured prompt "sections" into a small number of
 * pooled LLM calls, keyed by affinity group, to cut per-turn model traffic.
 * Owns the section registry, per-message buffers, the in-memory + persisted
 * result cache, and one repeating drain task per affinity; consumers register
 * sections through askOnce / askNow / onDrain / think and await the resolved
 * fields (or receive them via onResult). The runtime constructs one
 * PromptBatcher singleton and feeds it messages via tick().
 */
import type { Memory } from "../../types/memory.js";
import { type BatcherResult, type BatcherStats, type ContextResolver, type DrainMeta, type PreCallbackHandler, type PromptSection } from "../../types/prompt-batcher.js";
import type { IAgentRuntime } from "../../types/runtime.js";
import type { SchemaRow } from "../../types/state.js";
import type { PromptDispatcher } from "./dispatcher.js";
import { type PromptBatcherSettings } from "./shared.js";
export declare class PromptBatcher {
    private readonly runtime;
    private readonly dispatcher;
    private readonly settings;
    private readonly sections;
    private readonly pendingResults;
    private readonly contextResolvers;
    private readonly preCallbackHandlers;
    private readonly messageBuffers;
    private readonly processedMessageIds;
    private readonly processedMessageOrder;
    private readonly affinityLocks;
    private readonly lastRunAt;
    private readonly inMemoryCache;
    private readonly stats;
    private enabled;
    private disposed;
    private readonly affinityDrains;
    constructor(runtime: IAgentRuntime, dispatcher: PromptDispatcher, settings: PromptBatcherSettings);
    /**
     * Register a section and return a promise that resolves when the section is first
     * delivered (or null if the section ID already existed). Resolves with BatcherResult
     * so callers get { fields, meta }. WHY: Thenable API lets consumers await or .then()
     * instead of relying only on onResult callbacks; meta carries drain context (fallbackUsed, etc.).
     */
    addSection(section: PromptSection): Promise<BatcherResult | null>;
    removeSection(id: string): void;
    registerContextResolver(slug: string, resolver: ContextResolver): void;
    registerPreCallbackHandler(handler: PreCallbackHandler): void;
    getPreCallbackHandlers(actionName: string): PreCallbackHandler[];
    /**
     * Buffer a message for batching and optionally trigger drains for message-relevant affinities (default, room:X, audit:X).
     * No-arg tick() returns immediately. WHY: no background timer; only message cadence or task-driven drains run. Autonomy is not drained here (task-driven only).
     */
    tick(message?: Memory): void;
    private _shouldDrainAffinity;
    drain(): Promise<void>;
    dispose(): void;
    invalidateCache(sectionId: string): void;
    invalidateAllCaches(): void;
    getStats(): BatcherStats;
    askOnce(id: string, opts: {
        preamble: string;
        schema: SchemaRow[];
        fallback?: Record<string, unknown>;
        providers?: string[];
        model?: "small" | "large";
        cacheTtlMs?: number;
        staleWhileRevalidate?: boolean;
        forceRegenerate?: boolean;
        shouldRun?: (runtime: IAgentRuntime) => Promise<boolean> | boolean;
        validate?: (fields: Record<string, unknown>) => Record<string, unknown> | null;
        maxRetries?: number;
        execOptions?: {
            temperature?: number;
            maxTokens?: number;
            stopSequences?: string[];
        };
    }): Promise<Record<string, unknown>>;
    /**
     * Register a per-drain section and return a promise of the first result. Resolves with
     * { fields, meta } or null (duplicate ID). onResult is optional; when provided, it is
     * still invoked so fire-and-forget or recurring use (e.g. think()) is unchanged.
     * WHY: Linear await + if (result) { ... } is easier than a large onResult callback;
     * generic T lets callers get typed result.fields without casting.
     */
    onDrain<T = Record<string, unknown>>(id: string, opts: {
        preamble: string;
        schema: SchemaRow[];
        onResult?: (fields: Record<string, unknown>, meta: DrainMeta) => void | Promise<void>;
        fallback?: Record<string, unknown>;
        providers?: string[];
        model?: "small" | "large";
        room?: string;
        shouldRun?: (runtime: IAgentRuntime) => Promise<boolean> | boolean;
        validate?: (fields: Record<string, unknown>) => Record<string, unknown> | null;
        maxRetries?: number;
        execOptions?: {
            temperature?: number;
            maxTokens?: number;
            stopSequences?: string[];
        };
    }): Promise<BatcherResult<T> | null>;
    think(id: string, opts: {
        contextBuilder: (runtime: IAgentRuntime, messages: Memory[]) => Promise<string> | string;
        preamble: string;
        schema: SchemaRow[];
        onResult: (fields: Record<string, unknown>, meta: DrainMeta) => void | Promise<void>;
        fallback?: Record<string, unknown>;
        minCycleMs?: number;
        model?: "small" | "large";
        shouldRun?: (runtime: IAgentRuntime) => Promise<boolean> | boolean;
        validate?: (fields: Record<string, unknown>) => Record<string, unknown> | null;
        maxRetries?: number;
        execOptions?: {
            temperature?: number;
            maxTokens?: number;
            stopSequences?: string[];
        };
    }): void;
    askNow(id: string, opts: {
        preamble: string;
        schema: SchemaRow[];
        fallback: Record<string, unknown>;
        providers?: string[];
        model?: "small" | "large";
        room?: string;
        validate?: (fields: Record<string, unknown>) => Record<string, unknown> | null;
        maxRetries?: number;
        execOptions?: {
            temperature?: number;
            maxTokens?: number;
            stopSequences?: string[];
        };
    }): Promise<Record<string, unknown>>;
    private _pushMessage;
    private _getActiveAffinityKeys;
    /**
     * Returns the ideal tick interval for an affinity group: min of recurring sections' minCycleMs,
     * capped by maxDrainIntervalMs. If no recurring sections, returns maxDrainIntervalMs.
     */
    getIdealTickInterval(affinityKey: string): number;
    /** Returns the number of sections with the given affinity key. */
    getSectionCountForAffinity(affinityKey: string): number;
    /**
     * One repeat task per affinity — shared {@link TaskDrain} with `skipRegisterWorker`:
     * TaskService already registers `BATCHER_DRAIN`; we only ensure the DB row + interval updates.
     * Same subsystem as embedding drains (`utils/batch-queue.ts` rationale).
     */
    private _ensureAffinityDrain;
    private _syncAffinityTask;
    private _removeAffinityTask;
    drainAffinityGroup(affinityKey: string): Promise<void>;
    private _drainAffinityGroupUnlocked;
    private _runDrainPass;
    private _recurringSectionDue;
    private _markRecurringSectionAttempt;
    private _metaForSection;
    private _resolveContext;
    private _getMessagesForAffinity;
    /**
     * Deliver a section result: optionally run onResult, then resolve or reject the
     * section's promise. Resolve with { fields, meta } so the thenable API gets a
     * single object. WHY: Consistent result shape; callers can .catch() when we reject.
     * Guard pending.resolved so we never resolve and reject the same promise (e.g. if
     * onResult throws we reject and return; if we later delivered again we would skip resolve).
     */
    private _deliverSectionResult;
    private _fallbackForSection;
    private _normalizeFallback;
    private _checkCache;
    private _writeCache;
    private _runValidate;
    private _retrySection;
    private _emitDrainLog;
    private _cacheKey;
    private _validateProviders;
}
//# sourceMappingURL=batcher.d.ts.map