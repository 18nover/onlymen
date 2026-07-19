/**
 * Encapsulates **repeat task** lifecycle for drain workloads: find-or-create a row with
 * `tags: ["queue", "repeat"]`, merge scheduling metadata, optionally register a task worker.
 *
 * **Why `skipRegisterWorker`:** `BATCHER_DRAIN` is executed by a **single** worker registered in
 * `TaskService` that dispatches by `metadata.affinityKey`. Per-affinity `TaskDrain` instances only
 * create/update/delete tasks; registering another worker with the same name would overwrite the
 * global handler.
 *
 * **Why `maxFailures: -1`:** `JSON.stringify(Infinity)` is `null`; `-1` round-trips through JSON
 * and is interpreted by TaskService as “do not auto-pause this drain” (see CHANGELOG).
 */
import type { UUID } from "../../types/primitives.js";
import type { IAgentRuntime } from "../../types/runtime.js";
export interface TaskDrainOptions {
    taskName: string;
    /** Initial interval for repeat task metadata. */
    intervalMs: number;
    /** Optional DB task description (e.g. affinity label). */
    description?: string;
    /** Extra metadata merged into the repeat task (e.g. `{ affinityKey: "default" }`). */
    taskMetadata?: Record<string, unknown>;
    /**
     * When true, does not call `runtime.registerTaskWorker` — use when a global worker
     * already handles this task name (e.g. `BATCHER_DRAIN` in TaskService).
     */
    skipRegisterWorker?: boolean;
    /** Required unless `skipRegisterWorker` is true. Invoked when the repeat task fires. */
    onDrain?: (runtime: IAgentRuntime) => Promise<void>;
}
export declare class TaskDrain {
    private readonly taskName;
    private readonly taskMetadata;
    private readonly skipRegisterWorker;
    private readonly onDrain?;
    private intervalMs;
    private taskId;
    private workerRegistered;
    private disposed;
    private readonly description;
    constructor(options: TaskDrainOptions, initialIntervalMs?: number);
    get id(): UUID | null;
    /**
     * Register worker (unless skipped) and ensure the repeat task exists for this agent.
     */
    start(runtime: IAgentRuntime): Promise<void>;
    /** Match agent + every key in `taskMetadata` (e.g. affinityKey for batcher drains). */
    private matchesTask;
    private ensureTask;
    /**
     * Update repeat interval in DB when scheduling changes (e.g. batcher ideal tick).
     */
    updateInterval(runtime: IAgentRuntime, newIntervalMs: number): Promise<void>;
    getIntervalMs(): number;
    dispose(runtime: IAgentRuntime): Promise<void>;
}
//# sourceMappingURL=task-drain.d.ts.map