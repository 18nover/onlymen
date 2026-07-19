/**
 * Manual Instrumentation Helpers
 *
 * Advanced manual control for trajectory logging.
 */
import type { TrajectoriesService } from "./TrajectoriesService.js";
import type { JsonValue } from "./types.js";
export interface TrajectoryMetadata {
    [key: string]: JsonValue;
}
export type FinalMetrics = Record<string, JsonValue> & {
    totalReward?: number;
    stepCount?: number;
    successRate?: number;
};
export interface ProviderAccessData {
    [key: string]: JsonValue;
}
export type WrappedFunctionArgs = JsonValue[];
export declare function startAutonomousTick(trajectoryLogger: TrajectoriesService, context: {
    agentId: string;
    source?: string;
    scenarioId?: string;
    episodeId?: string;
    batchId?: string;
    metadata?: TrajectoryMetadata;
}): Promise<string>;
export declare function endAutonomousTick(trajectoryLogger: TrajectoriesService, trajectoryId: string, status?: "completed" | "terminated" | "error" | "timeout", finalMetrics?: FinalMetrics): Promise<void>;
export declare function loggedLLMCall(trajectoryLogger: TrajectoriesService, trajectoryId: string, options: {
    model: string;
    modelVersion?: string;
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    maxTokens?: number;
    purpose?: string;
    actionType?: string;
}, llmCallFn: () => Promise<{
    text: string;
    reasoning?: string;
    tokens?: {
        prompt?: number;
        completion?: number;
    };
    latencyMs?: number;
}>): Promise<string>;
export declare function logProviderAccess(trajectoryLogger: TrajectoriesService, trajectoryId: string, access: {
    providerName: string;
    data: ProviderAccessData;
    sha256?: string;
    tokenCount?: number;
    position?: number;
    spanStart?: number;
    spanEnd?: number;
    purpose: string;
    query?: ProviderAccessData;
}): void;
type AsyncFunction<TArgs extends JsonValue[], TResult extends JsonValue> = (...args: TArgs) => Promise<TResult>;
export declare function withTrajectoryLogging<TArgs extends JsonValue[], TResult extends JsonValue>(fn: AsyncFunction<TArgs, TResult>, trajectoryLogger: TrajectoriesService, trajectoryId: string, context?: {
    actionType?: string;
    purpose?: string;
}): AsyncFunction<TArgs, TResult>;
export {};
//# sourceMappingURL=integration.d.ts.map