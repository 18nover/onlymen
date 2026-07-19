/**
 * Turn-scoped AbortController registry.
 *
 * Every inbound message handler invocation runs inside a turn controller.
 * The controller's signal threads through:
 *
 *   - The Stage-1 response-handler LLM call
 *   - Response-handler field evaluators
 *   - The planner loop and per-step LLM calls
 *   - Action handlers
 *   - Sub-process / fetch / sub-agent spawns
 *
 * When the user (or a sibling field-evaluator like threadOps' abort op) wants
 * to abort the turn, they call `registry.abortTurn(roomId, reason)`. This
 * fires the controller, which propagates through every consumer that respects
 * the signal.
 *
 * Synchronous vs background:
 *
 *   - Sync sub-tasks share the parent's signal directly.
 *   - Background sub-agents (Claude Code / Codex / Pi spawned via plugin-
 *     agent-orchestrator) get their own AbortController but register a
 *     parent-signal listener that aborts the child when the parent fires.
 *     This is set up at spawn time by the orchestrator, NOT here.
 *
 * Crash safety:
 *
 *   - Controllers live in memory. A process crash loses them — that's fine
 *     because there's no in-flight turn anymore.
 *   - The registry never holds stale controllers. `runWith` always unregisters
 *     on exit (success, error, or abort).
 */
export declare class TurnAbortedError extends Error {
    readonly code = "TURN_ABORTED";
    readonly reason: string;
    constructor(reason: string);
}
export declare class TurnControllerRegistry {
    private active;
    private listeners;
    /**
     * Run `fn` inside a turn-scoped AbortController. The signal is passed to
     * `fn` and registered under `roomId` for the duration. When `fn` exits
     * (normally, throwing, or aborted), the controller is removed from the
     * registry.
     *
     * Concurrent turns for the SAME `roomId` are allowed by this registry — it
     * just records the latest. Use `RoomHandlerQueue` to enforce one-at-a-time
     * per room.
     */
    runWith<T>(roomId: string, fn: (signal: AbortSignal) => Promise<T>): Promise<T>;
    /**
     * Abort the active turn for `roomId`. No-op if there's no active turn.
     * Returns true if a turn was aborted.
     */
    abortTurn(roomId: string, reason: string): boolean;
    /**
     * Abort every active turn. Used by lifecycle handlers (APP_PAUSE on
     * mobile, container shutdown) that need to release all in-flight
     * inference at once. Returns the room ids that were actually aborted —
     * already-aborted turns are skipped.
     */
    abortAllTurns(reason: string): string[];
    hasActiveTurn(roomId: string): boolean;
    /**
     * Snapshot of the currently-active turn room ids. Useful for diagnostic
     * endpoints that want to surface "what's running" without holding a
     * reference to the registry's internal map.
     */
    activeRoomIds(): string[];
    /**
     * Returns the AbortSignal for the active turn on `roomId`, or null. Used
     * by long-running tools that want to check abort status mid-execution.
     */
    signalFor(roomId: string): AbortSignal | null;
    /**
     * Subscribe to turn lifecycle events. Useful for telemetry and the
     * InterruptBench harness.
     */
    onEvent(listener: (event: TurnEvent) => void): () => void;
    private emit;
}
export type TurnEvent = {
    type: "started";
    roomId: string;
    startedAt: number;
} | {
    type: "completed";
    roomId: string;
    durationMs: number;
} | {
    type: "errored";
    roomId: string;
    error: string;
    durationMs: number;
} | {
    type: "aborted";
    roomId: string;
    reason: string;
} | {
    type: "aborted-cleanup";
    roomId: string;
    reason: string;
    durationMs: number;
};
/**
 * Minimum runtime surface needed to abort in-flight inference. We keep this
 * structural so non-`AgentRuntime` test doubles can satisfy the contract
 * without dragging in the full interface.
 */
export interface AbortableInflightRuntime {
    turnControllers: Pick<TurnControllerRegistry, "abortAllTurns" | "activeRoomIds">;
}
/**
 * Abort every in-flight inference turn on `runtime`. Used by lifecycle
 * handlers — Wave 3C's `APP_PAUSE_EVENT` listener calls this so the OS
 * pause budget doesn't kill the process while a slow phone-CPU decode is
 * still spinning.
 *
 * Returns the list of room ids that were aborted. Already-aborted or
 * idle turns are skipped, so an empty array means "nothing was running".
 *
 * `reason` is passed through to the `TurnAbortedError` raised inside each
 * in-flight `useModel` / handler path; pick a stable string (e.g. `"app-pause"`,
 * `"container-shutdown"`) so telemetry can group them.
 */
export declare function abortInflightInference(runtime: AbortableInflightRuntime, reason?: string): string[];
//# sourceMappingURL=turn-controller.d.ts.map