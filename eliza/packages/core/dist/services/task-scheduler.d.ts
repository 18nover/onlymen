/**
 * Per-daemon task scheduler: one timer, one getTasks(agentIds) per tick, dispatch to registered runtimes.
 *
 * WHY: With N runtimes, N local timers would do N getTasks() every second. This module batches: one
 * getTasks(agentIds) for all dirty agents, then group by task.agentId and call runTick(tasks) per runtime.
 * Opt-in: host calls startTaskScheduler(adapter); TaskService registers when daemon is present.
 */
import type { IDatabaseAdapter } from "../types/database.js";
import type { UUID } from "../types/primitives.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { Task } from "../types/task.js";
/** Minimal type so we don't import TaskService. WHY: avoids circular dependency (task.ts imports this module). */
interface TaskServiceLike {
    runTick(tasks: Task[]): Promise<void>;
}
/** WHY: host provides the adapter so the scheduler can call getTasks without going through a specific runtime. */
export declare function startTaskScheduler(adapterInstance: IDatabaseAdapter): void;
export declare function stopTaskScheduler(): void;
/** Called by TaskService.startTimer() when getTaskSchedulerAdapter() != null. WHY: runtime opts into shared tick instead of local timer. */
export declare function registerTaskSchedulerRuntime(runtime: IAgentRuntime, taskService: TaskServiceLike): void;
/** Called by TaskService.stop(). WHY: daemon must not call runTick after runtime has stopped. */
export declare function unregisterTaskSchedulerRuntime(agentId: UUID): void;
/** Called by TaskService.markDirty() when daemon is present. WHY: next tick will include this agent in the batched getTasks. */
export declare function markTaskSchedulerDirty(agentId: UUID): void;
/** TaskService uses this to decide: register with daemon vs start local timer. */
export declare function getTaskSchedulerAdapter(): IDatabaseAdapter | null;
export {};
//# sourceMappingURL=task-scheduler.d.ts.map