/**
 * Renders agent/PTY activity events and trajectory records into short,
 * human-readable plaintext summaries for surfaces that show an activity feed.
 * Pure formatting over loosely-typed event payloads — every field access is
 * guarded (`isRecord` / `readString` / `readFiniteNumber`), so malformed input
 * yields `null` rather than throwing; there is no runtime or IO dependency.
 *
 * `activityEventToPlaintext` dispatches on the event's `stream` for agent
 * events (assistant, lifecycle, action, tool, evaluator, provider, message,
 * memory, error, notification) and falls back to PTY task events.
 * `trajectoryToPlaintext` summarizes a trajectory summary/detail record with
 * its LLM calls, provider accesses, and events.
 */
import type { TrajectoryDetailRecord, TrajectoryLlmCallRecord, TrajectoryProviderAccessRecord, TrajectoryStepRecord, TrajectorySummaryRecord } from "./services/trajectory-types.js";
export interface ActivityPlaintextSummary {
    eventType: string;
    plaintext: string;
    stream?: string;
    source?: string;
    sessionId?: string;
}
export interface ActivityPlaintextOptions {
    maxLength?: number;
    includeUnknownAssistantText?: boolean;
}
export interface TrajectoryPlaintextOptions {
    maxItems?: number;
    maxFieldLength?: number;
}
export interface TrajectoryPlaintextEvent {
    id?: string;
    type?: string;
    stage?: string;
    status?: string;
    name?: string;
    actionName?: string;
    toolName?: string;
    evaluatorName?: string;
    providerName?: string;
    purpose?: string;
    decision?: string;
    thought?: string;
    error?: string;
    success?: boolean;
    hit?: boolean;
    key?: string;
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
}
export interface TrajectoryPlaintextInput {
    trajectory?: Partial<TrajectorySummaryRecord> | Partial<TrajectoryDetailRecord> | null;
    llmCalls?: readonly TrajectoryLlmCallRecord[];
    providerAccesses?: readonly TrajectoryProviderAccessRecord[];
    events?: readonly TrajectoryPlaintextEvent[];
    steps?: readonly TrajectoryStepRecord[];
}
export declare function activityEventToPlaintext(event: unknown, options?: ActivityPlaintextOptions): ActivityPlaintextSummary | null;
export declare function trajectoryEventToPlaintext(event: TrajectoryPlaintextEvent, options?: TrajectoryPlaintextOptions): string;
export declare function trajectoryToPlaintext(input: TrajectoryPlaintextInput | TrajectorySummaryRecord | TrajectoryDetailRecord | null | undefined, options?: TrajectoryPlaintextOptions): string;
//# sourceMappingURL=activity-plaintext.d.ts.map