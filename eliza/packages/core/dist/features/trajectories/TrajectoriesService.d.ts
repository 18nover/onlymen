/**
 * Trajectory Logger Service
 *
 * A proper @elizaos/core Service that:
 * - Registers as "trajectories" so the runtime can find it
 * - Persists trajectories to the database
 * - Supports both runtime logging AND RL training data collection
 * - Provides API for UI viewing and export
 */
import type { TrajectoryExportOptions as CanonicalTrajectoryExportOptions, TrajectoryExportResult } from "../../services/trajectory-types.js";
/** Public alias for {@link CanonicalTrajectoryExportOptions} (canonical type lives in services). */
export type TrajectoryExportOptions = CanonicalTrajectoryExportOptions;
import type { TrajectoryRuntimeLlmCallParams } from "../../trajectory-utils.js";
import type { IAgentRuntime } from "../../types/index.js";
import { Service } from "../../types/service.js";
import type { ActionAttempt, EnvironmentState, JsonValue, LLMCall, ProviderAccess, RewardComponents, Trajectory } from "./types.js";
export interface TrajectoryListOptions {
    limit?: number;
    offset?: number;
    status?: "active" | "completed" | "error" | "timeout";
    source?: string;
    runId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    scenarioId?: string;
    /** Correlation join key (#13775): all trajectories in one root turn's trace. */
    traceId?: string;
    batchId?: string;
    isTrainingData?: boolean;
}
export interface TrajectoryListResult {
    trajectories: TrajectoryListItem[];
    total: number;
    offset: number;
    limit: number;
}
export interface TrajectoryListItem {
    id: string;
    agentId: string;
    source: string;
    roomId: string | null;
    entityId: string | null;
    metadata: Record<string, JsonValue | undefined>;
    status: "active" | "completed" | "error" | "timeout";
    startTime: number;
    endTime: number | null;
    durationMs: number | null;
    stepCount: number;
    llmCallCount: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalCacheReadInputTokens?: number;
    totalCacheCreationInputTokens?: number;
    totalReward: number;
    scenarioId: string | null;
    batchId: string | null;
    createdAt: string;
    updatedAt?: string;
}
export interface TrajectoryStats {
    totalTrajectories: number;
    totalSteps: number;
    totalLlmCalls: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalCacheReadInputTokens: number;
    totalCacheCreationInputTokens: number;
    averageDurationMs: number;
    averageReward: number;
    bySource: Record<string, number>;
    byStatus: Record<string, number>;
    byScenario: Record<string, number>;
}
export interface TrajectoryZipExportOptions {
    includePrompts?: boolean;
    trajectoryIds?: string[];
    source?: string;
    status?: "active" | "completed" | "error" | "timeout";
    runId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    scenarioId?: string;
    /** Correlation join key (#13775): all trajectories in one root turn's trace. */
    traceId?: string;
    batchId?: string;
}
export interface TrajectoryZipEntry {
    name: string;
    data: string;
}
export interface TrajectoryZipExportResult {
    filename: string;
    entries: TrajectoryZipEntry[];
}
type StartTrajectoryOptions = {
    agentId?: string;
    roomId?: string;
    entityId?: string;
    source?: string;
    scenarioId?: string;
    /** Correlation join key (#13775), read from the trajectory context. */
    traceId?: string;
    episodeId?: string;
    batchId?: string;
    groupIndex?: number;
    metadata?: Record<string, JsonValue>;
};
type CompleteStepRewardInfo = {
    reward?: number;
    components?: Partial<RewardComponents>;
};
export declare class TrajectoriesService extends Service {
    static serviceType: "trajectories";
    static readonly allowsMultiple = true;
    get serviceType(): "trajectories";
    capabilityDescription: string;
    /**
     * Resolve the *real* SQL-backed TrajectoriesService from the runtime.
     *
     * The Eliza core can register a lightweight fallback under the same
     * "trajectories" serviceType. getService() returns whichever
     * instance was started first. This helper scans all registered services
     * of that type and returns the one that
     * actually exposes the full trajectory lifecycle API (startTrajectory).
     */
    /**
     * Synchronous lookup — returns null if the real service hasn't started yet.
     */
    static resolveFromRuntime(runtime: IAgentRuntime): TrajectoriesService | null;
    /**
     * Async version that waits for the real SQL-backed service to finish
     * starting. The core fallback starts synchronously; the real plugin starts
     * asynchronously (DB init). This method polls briefly so callers don't have
     * to guess at timing.
     */
    static waitForService(runtime: IAgentRuntime, timeoutMs?: number): Promise<TrajectoriesService | null>;
    private enabled;
    private initialized;
    private activeStepIds;
    private stepToTrajectory;
    private writeQueues;
    private exposeBoundMethods;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    private getSqlHelper;
    private executeRawSql;
    initialize(): Promise<void>;
    private ensureStorageReady;
    private getTableColumnNames;
    private ensureTrajectoryColumnsExist;
    private ensureTablesExist;
    private normalizePurpose;
    private defaultEnvironmentState;
    private createPendingAction;
    private createStep;
    private computeTotals;
    /**
     * Flush any pending writes for a trajectory.
     * Call before endTrajectory to ensure fire-and-forget writes
     * (logLLMCall, completeStep) have persisted.
     */
    flushWriteQueue(trajectoryId: string): Promise<void>;
    private withTrajectoryWriteLock;
    private reportDetachedWriteFailure;
    private getTrajectoryById;
    private getStepIndex;
    private setStepIndex;
    private markAllStepsInactive;
    private resolveTrajectoryId;
    private getCurrentStepIdFromDb;
    private persistTrajectory;
    private ensureStepExists;
    /**
     * Called by the runtime when an LLM call is made.
     * This is the interface the runtime expects.
     */
    logLlmCall(params: TrajectoryRuntimeLlmCallParams): void;
    private _persistLlmCall;
    logLLMCall(stepId: string, details: {
        model: string;
        modelVersion?: string;
        systemPrompt: string;
        userPrompt: string;
        response: string;
        reasoning?: string;
        temperature: number;
        maxTokens: number;
        purpose: string;
        actionType?: string;
        latencyMs?: number;
        promptTokens?: number;
        completionTokens?: number;
    }): void;
    /**
     * Called by the runtime when a provider is accessed.
     * Supports both runtime shape and legacy split args.
     */
    logProviderAccess(params: {
        stepId: string;
        providerName: string;
        data: Record<string, unknown>;
        sha256?: string;
        tokenCount?: number;
        position?: number;
        spanStart?: number;
        spanEnd?: number;
        purpose: string;
        query?: Record<string, unknown>;
        runId?: string;
        roomId?: string;
        messageId?: string;
        executionTraceId?: string;
    }): void;
    logProviderAccess(stepId: string, params: {
        providerName: string;
        data: Record<string, unknown>;
        sha256?: string;
        tokenCount?: number;
        position?: number;
        spanStart?: number;
        spanEnd?: number;
        purpose: string;
        query?: Record<string, unknown>;
        runId?: string;
        roomId?: string;
        messageId?: string;
        executionTraceId?: string;
    }): void;
    private _persistProviderAccess;
    logProviderAccessByTrajectoryId(trajectoryId: string, access: {
        providerName: string;
        data: Record<string, unknown>;
        sha256?: string;
        tokenCount?: number;
        position?: number;
        spanStart?: number;
        spanEnd?: number;
        purpose: string;
        query?: Record<string, unknown>;
    }): void;
    /**
     * Start a new trajectory. Supports both call styles:
     *   1) startTrajectory(stepId, { agentId, ...legacyOptions })
     *   2) startTrajectory(agentId, { ...optionsWithoutAgentId })
     */
    startTrajectory(stepIdOrAgentId: string, options?: StartTrajectoryOptions): Promise<string>;
    /**
     * Start a new step within a trajectory.
     */
    startStep(trajectoryId: string, envState: EnvironmentState): string;
    /**
     * Complete a step with action results.
     * Supports:
     *   completeStep(trajectoryId, action, rewardInfo?)
     *   completeStep(trajectoryId, stepId, action, rewardInfo?)
     */
    completeStep(trajectoryId: string, action: Omit<ActionAttempt, "attemptId" | "timestamp">, rewardInfo?: CompleteStepRewardInfo): void;
    completeStep(trajectoryId: string, stepId: string, action: Omit<ActionAttempt, "attemptId" | "timestamp">, rewardInfo?: CompleteStepRewardInfo): void;
    /**
     * End a trajectory and persist final state.
     */
    endTrajectory(stepIdOrTrajectoryId: string, status?: "completed" | "error" | "timeout" | "terminated", finalMetrics?: Record<string, JsonValue>): Promise<void>;
    listTrajectories(options?: TrajectoryListOptions): Promise<TrajectoryListResult>;
    getTrajectoryDetail(trajectoryId: string): Promise<Trajectory | null>;
    getStats(): Promise<TrajectoryStats>;
    deleteTrajectories(trajectoryIds: string[]): Promise<number>;
    clearAllTrajectories(): Promise<number>;
    private sanitizeZipFolderName;
    private redactTrajectoryPrompts;
    private buildZipSummary;
    exportTrajectoriesZip(options?: TrajectoryZipExportOptions): Promise<TrajectoryZipExportResult>;
    exportTrajectories(options: CanonicalTrajectoryExportOptions): Promise<TrajectoryExportResult>;
    private rowToTrajectory;
    /**
     * Get active trajectory for a step (for compatibility with existing code)
     */
    getActiveTrajectory(trajectoryId: string): Trajectory | null;
    /**
     * Get current step ID for a trajectory
     */
    getCurrentStepId(trajectoryId: string): string | null;
    /**
     * Legacy compatibility: get in-memory provider access logs
     */
    getProviderAccessLogs(): readonly ProviderAccess[];
    /**
     * Legacy compatibility: get in-memory LLM call logs
     */
    getLlmCallLogs(): readonly LLMCall[];
}
export {};
//# sourceMappingURL=TrajectoriesService.d.ts.map