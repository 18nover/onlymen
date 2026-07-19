/**
 * TaskService: the runtime singleton that polls `queue`-tagged tasks and runs
 * their registered worker when due. Owns the tick loop — a local `setInterval`,
 * a shared task-scheduler daemon, or serverless `runDueTasks()` — plus
 * repeat-task cadence, failure backoff and auto-pause, and overlap suppression
 * for blocking runs. Registered by the basic-capabilities plugin and reached
 * via `runtime.getService(ServiceType.TASK)`.
 */
import type { UUID } from "../types/primitives.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
import type { Task, TaskRunStatus } from "../types/task.js";
/**
 * Each tick validates due `queue` tasks against their worker's `shouldRun`,
 * then runs `worker.execute`. Repeat tasks reschedule on their interval (with
 * failure backoff); one-shot tasks are deleted after running.
 */
export declare class TaskService extends Service {
    private timer;
    private activeTick;
    private readonly TICK_INTERVAL;
    /** Tracks task IDs currently being executed to prevent overlapping runs. WHY: blocking tasks must not run again until current run finishes. */
    private executingTasks;
    /** Tracks in-flight task promises so stop() can await a clean drain before runtime.close(). */
    private executingTaskPromises;
    /** When false, checkTasks skips the DB query. Set true by markDirty(); start true so first tick always queries. WHY: avoid redundant getTasks every second when nothing changed. */
    private tasksDirty;
    /** Set true in stop(). runTick returns immediately when true (daemon may call runTick after unregister). */
    private stopped;
    static serviceType: "task";
    capabilityDescription: string;
    /**
     * Start the TaskService with the given runtime.
     * @param {IAgentRuntime} runtime - The runtime for the TaskService.
     * @returns {Promise<Service>} A promise that resolves with the TaskService instance.
     */
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Asynchronously creates test tasks by registering task workers for repeating and one-time tasks,
     * validates the tasks, executes the tasks, and creates the tasks if they do not already exist.
     */
    createTestTasks(): Promise<void>;
    /**
     * Start the task poll timer. Call explicitly in daemon mode; not started automatically.
     * WHY public: initialize() does not start the task service or timer. Daemon entry points
     * that need scheduled tasks call getService("task") then startTimer(). Edge/ephemeral
     * runtimes typically do not call this.
     * Priority: (1) serverless -> no timer, host calls runDueTasks(); (2) daemon present -> register, no local timer; (3) else local setInterval.
     * WHY serverless first: no long-lived process; WHY daemon second: one shared getTasks(agentIds) per tick for all agents.
     */
    startTimer(): void;
    /**
     * Validates an array of Task objects.
     * Skips tasks without IDs or if no worker is found for the task.
     * Uses worker.shouldRun(runtime, task) when present; otherwise the task passes.
     * @param {Task[]} tasks - An array of Task objects to validate.
     * @returns {Promise<Task[]>} - A Promise that resolves with an array of validated Task objects.
     */
    private validateTasks;
    private invalidScheduleField;
    /**
     * Asynchronous method that checks tasks with "queue" tag, validates them, then executes via runTick.
     * Skips the DB query when tasksDirty is false. WHY: avoid redundant getTasks every second when nothing changed.
     * Only a truly EMPTY queue may disarm the tick: repeat tasks and not-yet-due one-shots become due purely by
     * time passing, with no create/update to call markDirty(), so any non-empty result re-arms tasksDirty.
     *
     * @returns {Promise<void>} Promise that resolves once all tasks are checked and executed
     */
    private checkTasks;
    /**
     * Validate and execute due tasks. Used by checkTasks (local timer) and by the task-scheduler daemon (batch tick).
     * Does NOT call getTasks — caller must pass the task list. WHY: daemon does one getTasks(agentIds) then dispatches to N runTicks.
     * No-op when service is already stopped (daemon may call after unregister).
     */
    runTick(tasks: Task[]): Promise<void>;
    /**
     * Executes a given task asynchronously.
     * Tracks execution state to prevent overlapping runs of the same task.
     * On success: resets failureCount, applies nextInterval if returned, writes updatedAt. Non-repeat tasks are deleted.
     * On failure: repeat tasks get backoff (using baseInterval so we don't compound), auto-pause after maxFailures; non-repeat tasks are deleted so they don't retry forever.
     * WHY delete non-repeat on failure: otherwise they stay in DB and run every tick with no backoff (infinite retry loop).
     * WHY backoff uses baseInterval: after N failures updateInterval is already large; using it again would be exponential-of-exponential.
     *
     * @param {Task} task - The task to be executed.
     */
    private executeTask;
    private executeTaskInternal;
    /** Marks the task list as dirty so the next checkTasks tick will re-query the DB. When the daemon is running, notifies it instead of setting local flag. */
    markDirty(): void;
    /**
     * Run due queue tasks once. For serverless: call from cron or on each request.
     * Does getTasks for this agent's queue tasks then runTick (validate + execute due).
     * WHY separate from timer: serverless has no long-lived process; host drives execution explicitly.
     */
    runDueTasks(): Promise<void>;
    /**
     * Executes a task by ID. Loads the task, then runs it via executeTask.
     * @param taskId - UUID of the task.
     */
    executeTaskById(taskId: UUID): Promise<void>;
    /**
     * Pauses a task. The scheduler will skip it until resumed.
     * Preserves existing metadata (updatedAt, updateInterval, etc.).
     */
    pauseTask(taskId: UUID): Promise<void>;
    /**
     * Resumes a task. If runImmediately is true, runs the task once after unpausing.
     * Unpauses before executing so a failed run does not leave the task paused.
     */
    resumeTask(taskId: UUID, runImmediately?: boolean): Promise<void>;
    /**
     * Returns run status for a task: task, paused, executing, nextRunAt (repeat only), lastError.
     */
    getTaskStatus(taskId: UUID): Promise<TaskRunStatus>;
    /**
     * Stops the TASK service in the given agent runtime.
     *
     * @param {IAgentRuntime} runtime - The agent runtime containing the service.
     * @returns {Promise<void>} - A promise that resolves once the service has been stopped.
     */
    static stop(runtime: IAgentRuntime): Promise<void>;
    /**
     * Stops the timer if it is currently running.
     */
    stop(): Promise<void>;
}
//# sourceMappingURL=task.d.ts.map