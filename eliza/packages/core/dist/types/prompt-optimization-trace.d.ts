/**
 * Dynamic-prompt-execution (DPE) optimization payloads: additive `ScoreSignal`s,
 * an aggregated `ScoreCardData` snapshot, and one `ExecutionTrace` row per attempt.
 * Plain JSON-friendly structs (no ORM coupling) so traces can be appended to logs
 * or analytics; `traceVersion` lets offline consumers pin parsers.
 */
import type { UUID } from "./primitives.js";
/**
 * DPE (dynamic prompt execution) **optimization payloads**: additive `ScoreSignal`s, an
 * aggregated `ScoreCardData` snapshot, and one `ExecutionTrace` row per attempt.
 *
 * **Why JSON-friendly structs:** traces are appended to logs, object stores, or analytics
 * pipelines; plain objects avoid ORM coupling. **Why `traceVersion`:** forward-compatible
 * evolution without breaking offline consumers that pin parsers.
 */
export type SlotKey = string;
export type PromptKey = string;
export interface ScoreSignal {
    source: string;
    kind: string;
    value: number;
    weight?: number;
    reason?: string;
    metadata?: Record<string, unknown>;
    /** If set, `enrichTrace` applies only to the trace with this `ExecutionTrace.id`. */
    traceId?: string;
}
export interface ScoreCardData {
    signals: ScoreSignal[];
    compositeScore: number;
}
export interface ExecutionTrace {
    id: string;
    traceVersion: number;
    type: "trace";
    promptKey: PromptKey;
    modelSlot: SlotKey;
    modelId: string;
    runId?: UUID;
    roomId?: string;
    messageId?: string;
    templateHash: string;
    schemaFingerprint: string;
    artifactVersion?: number;
    variant: "baseline" | "optimized" | string;
    parseSuccess: boolean;
    schemaValid: boolean;
    validationCodesMatched: boolean;
    retriesUsed: number;
    tokenEstimate: number;
    latencyMs: number;
    response?: Record<string, unknown>;
    scoreCard: ScoreCardData;
    createdAt: number;
    enrichedAt?: number;
    seq?: number;
}
export declare const DEFAULT_SIGNAL_WEIGHTS: Record<string, number>;
//# sourceMappingURL=prompt-optimization-trace.d.ts.map