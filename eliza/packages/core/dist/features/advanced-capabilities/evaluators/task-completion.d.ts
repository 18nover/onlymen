/**
 * Shared task-completion contract for the reflection `success` evaluator: the
 * `TaskCompletionAssessment` shape, its cache-key builder, and the provider-facing
 * status formatter. reflection-items.ts writes an assessment here and caches it by
 * message id; downstream providers render it via `formatTaskCompletionStatus`.
 */
import type { UUID } from "../../../types/index.js";
export interface TaskCompletionAssessment {
    assessed: boolean;
    completed: boolean;
    reason: string;
    source: "reflection";
    evaluatedAt: number;
    messageId?: UUID;
}
export declare function getTaskCompletionCacheKey(messageId: UUID): string;
export declare function formatTaskCompletionStatus(assessment: TaskCompletionAssessment | null | undefined): string;
//# sourceMappingURL=task-completion.d.ts.map