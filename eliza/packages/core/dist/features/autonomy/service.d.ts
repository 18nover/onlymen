/**
 * Autonomy Service for elizaOS
 *
 * Provides autonomous operation for agents using the prompt batcher (Option A).
 * One register only: the batcher. When enableAutonomy is true, a recurring
 * section is registered; the batcher's background tick and minCycleMs drive
 * when the autonomy section drains. No Task DB or worker.
 */
import { type IAgentRuntime, type UUID } from "../../types/index.js";
import { Service } from "../../types/service.js";
import type { AutonomyStatus } from "./types.js";
/**
 * Service type constant for autonomy
 */
export declare const AUTONOMY_SERVICE_TYPE: "AUTONOMY";
/**
 * Task name for autonomy thinking
 */
export declare const AUTONOMY_TASK_NAME: "AUTONOMY_THINK";
/**
 * Tags used for autonomy tasks
 */
export declare const AUTONOMY_TASK_TAGS: readonly ["repeat", "autonomy", "internal"];
/**
 * AutonomyService - Manages autonomous agent operation.
 *
 * Uses the prompt batcher only (Option A): one register, no Task.
 * When enableAutonomy is true, a recurring section is registered;
 * the batcher's background tick and minCycleMs drive when it drains.
 */
export declare class AutonomyService extends Service {
    static serviceType: "AUTONOMY";
    static serviceName: string;
    protected isRunning: boolean;
    protected intervalMs: number;
    protected autonomousRoomId: UUID;
    protected autonomousWorldId: UUID;
    private isThinking;
    protected autonomyEntityId: UUID;
    private autonomyCompactionStats;
    private getAutonomyMode;
    private getTargetRoomId;
    private shouldIncludeAllRoomsForAutonomy;
    private getTargetRoomContextText;
    private buildCompactedAutonomyThoughtSection;
    private isAutonomousResponseMemory;
    private readMetadata;
    private readMemoryText;
    private getCompactedAutonomyThoughts;
    private compactAutonomyThoughtsDeterministically;
    constructor();
    /**
     * Start the autonomy service
     */
    static start(runtime: IAgentRuntime): Promise<AutonomyService>;
    /**
     * Initialize the service. Option A: autonomy is driven only by the prompt batcher; no Task.
     * WHY: We only register the batcher section when enableAutonomy is true; no task worker or createTask.
     */
    private initialize;
    /**
     * Ensure autonomous world and room exist
     */
    private ensureAutonomyEntity;
    private ensureAutonomousContext;
    private buildEntityNameLookup;
    private readEntityName;
    /**
     * Perform one iteration of autonomous thinking using the full Eliza agent pipeline.
     * This processes the message through:
     * - All registered providers (context gathering)
     * - The LLM generation pipeline (response creation)
     * - Action processing (executing decided actions)
     * - Evaluators (post-response analysis)
     */
    performAutonomousThink(): Promise<void>;
    /**
     * Create a continuous autonomous operation prompt
     */
    private createContinuousPrompt;
    private createTaskPrompt;
    private fillAutonomyTemplate;
    /**
     * Build the autonomy context string for the prompt batcher (Reason phase).
     * Used by the batcher section's contextBuilder; does not assume messages exist.
     * WHY: Recurring autonomy drains with an empty message buffer; context must come
     * from runtime (room context, last thought from memories) and the same templates
     * as the old performAutonomousThink path so model behavior stays consistent.
     */
    buildAutonomyContextForBatcher(): Promise<string>;
    /**
     * Register the autonomy section with the prompt batcher (recurring, contextBuilder-driven).
     * Idempotent by section id "autonomy". Called when autonomy is enabled.
     * WHY: One register only (Option A). Batcher owns "when" via minCycleMs and background
     * tick; we supply "what" (contextBuilder, preamble, schema). Same schema as message
     * pipeline so the execution facade consumes batcher output without a separate contract.
     */
    private registerAutonomyBatcherSection;
    /**
     * Check if autonomy is currently running
     */
    isLoopRunning(): boolean;
    /**
     * Get current loop interval in milliseconds
     */
    getLoopInterval(): number;
    /**
     * Set loop interval (recreates the task with new interval)
     */
    setLoopInterval(ms: number): Promise<void>;
    /**
     * Get the autonomous room ID
     */
    getAutonomousRoomId(): UUID;
    /**
     * Enable autonomy — registers the section with the prompt batcher (Option A; no Task).
     * WHY: No Task creation; one register only. Batcher background tick + minCycleMs drive when the section drains.
     */
    enableAutonomy(): Promise<void>;
    /**
     * Disable autonomy — removes the section from the prompt batcher.
     * WHY: removeSection("autonomy") stops future drains; no Task to delete.
     */
    disableAutonomy(): Promise<void>;
    /**
     * Trigger an autonomous thinking cycle immediately.
     * Useful for testing or manual intervention without waiting for the interval.
     * @returns true if thinking was triggered, false if already thinking or an error occurred
     */
    triggerThinkNow(): Promise<boolean>;
    /**
     * Get current autonomy status
     */
    getStatus(): AutonomyStatus;
    getAutonomyCompactionStats(): Readonly<typeof this.autonomyCompactionStats>;
    /**
     * Stop the service
     */
    stop(): Promise<void>;
    get capabilityDescription(): string;
}
//# sourceMappingURL=service.d.ts.map