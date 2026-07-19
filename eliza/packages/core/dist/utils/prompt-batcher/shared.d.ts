/**
 * Shared types and pure helpers for the prompt-batcher (batcher + dispatcher):
 * the deferred, cache-entry, call-meta, and settings shapes, plus identifier
 * sanitizing, retry-count clamping (0..2, floored), minimal-State construction,
 * character-context assembly, per-platform source-message id derivation for
 * dedup, schema field picking, section-drift comparison, and an incremental
 * rolling average. Re-exports the single Semaphore implementation for the
 * dispatcher.
 */
import type { Memory } from "../../types/memory.js";
import type { BatcherResult, PromptSection, ResolvedSection } from "../../types/prompt-batcher.js";
import type { IAgentRuntime } from "../../types/runtime.js";
import type { SchemaRow, State } from "../../types/state.js";
export type Deferred<T> = {
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
};
export type CacheEntry = {
    fields: Record<string, unknown>;
    expiresAt: number;
};
/** Tracks a section's promise. resolved guards so we never resolve and reject the same deferred. */
export type PendingResult = {
    deferred: Deferred<BatcherResult | null>;
    resolved: boolean;
};
export type DispatchCallMeta = {
    model: "small" | "large";
    sectionIds: string[];
    estimatedTokens: number;
    durationMs: number;
    success: boolean;
    retried: boolean;
    fallbackUsed: string[];
};
export type DispatchOutcome = {
    results: Map<string, Record<string, unknown>>;
    calls: DispatchCallMeta[];
};
export type CallPlan = {
    sections: ResolvedSection[];
    model: "small" | "large";
    totalEstimatedTokens: number;
    priority: "background" | "normal" | "immediate";
};
export type PromptDispatcherSettings = {
    packingDensity: number;
    maxTokensPerCall: number;
    maxParallelCalls: number;
    modelSeparation: number;
    maxSectionsPerCall: number;
};
export type PromptBatcherSettings = {
    batchSize: number;
    maxDrainIntervalMs: number;
    maxSectionsPerCall: number;
    packingDensity: number;
    maxTokensPerCall: number;
    maxParallelCalls: number;
    modelSeparation: number;
};
/**
 * Re-export so dispatcher keeps `import { Semaphore } from "./shared.js"`.
 * Single `Semaphore` implementation under `utils/batch-queue` (see `batch-queue.ts` header).
 */
export { Semaphore } from "../batch-queue/semaphore.js";
export declare function sanitizeIdentifier(value: string): string;
export declare function clampRetryCount(value: number | undefined): number;
export declare function createMinimalState(context: string): State;
export declare function buildCharacterContext(runtime: IAgentRuntime): string;
export declare function getSourceMessageId(message: Memory): string;
export declare function pickFields(fields: Record<string, unknown> | null | undefined, schema: SchemaRow[]): Record<string, unknown>;
export declare function hasMeaningfulSectionDrift(existing: PromptSection, incoming: PromptSection): boolean;
export declare function rollingAverage(current: number, count: number, nextValue: number): number;
//# sourceMappingURL=shared.d.ts.map