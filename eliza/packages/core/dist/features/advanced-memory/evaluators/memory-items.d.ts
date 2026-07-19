import type { Evaluator, Memory, RegisteredEvaluator } from "../../../types/index.js";
import type { MemoryService } from "../services/memory-service.js";
import { type MemoryExtraction } from "../types.js";
export interface SummaryOutput {
    text: string;
    topics: string[];
    keyPoints: string[];
}
export interface LongTermMemoryOutput {
    memories: MemoryExtraction[];
}
export interface SummaryPrepared {
    memoryService: MemoryService;
    summarizationMessages: Memory[];
    existingSummary: Awaited<ReturnType<MemoryService["getCurrentSessionSummary"]>>;
    lastOffset: number;
    totalDialogueCount: number;
    canSummarize: boolean;
}
export interface LongTermMemoryPrepared {
    memoryService: MemoryService;
    recentMessages: Memory[];
    existingMemories: string;
    currentMessageCount: number;
}
export declare const summaryEvaluator: Evaluator<SummaryOutput, SummaryPrepared>;
export declare const longTermMemoryEvaluator: Evaluator<LongTermMemoryOutput, LongTermMemoryPrepared>;
export declare const memoryItems: RegisteredEvaluator[];
//# sourceMappingURL=memory-items.d.ts.map