/**
 * RoomHandlerQueue — one handler at a time per room.
 *
 * Without this, two messages arriving for the same room within ~10ms each
 * spawn their own handler invocation, leading to:
 *   - Concurrent Stage-1 calls for the same conversation
 *   - Racing thread mutations
 *   - Reply ordering that contradicts the user's perception
 *
 * This is the deterministic replacement for time-based debouncing. Per the
 * Wave 0 contract, we explicitly do NOT debounce; instead we serialize.
 *
 * Behavior:
 *   - First message arrives → handler starts immediately.
 *   - Second message arrives while first handler runs → queued behind it.
 *   - When the first handler finishes, the next queued message starts.
 *   - Queue per `roomId`. Different rooms run in parallel.
 *
 * The queue does NOT coalesce messages. If three messages queue, the handler
 * runs three times. Coalescing (handling "i need to" + "send" + "an email"
 * as one intent) is a planner-level decision — the planner has all queued
 * messages in its conversation history and can decide to merge them, ask
 * for more info, or process independently.
 *
 * Crash safety: this queue is in-memory. A crash drops the queue. Connectors
 * are expected to re-deliver unacknowledged messages on reconnect.
 */
export declare class RoomHandlerQueue {
    private rooms;
    private listeners;
    /**
     * Run `fn` serialized against any other call for the same `roomId`. If a
     * prior handler for `roomId` is still running, `fn` waits in line until
     * the prior handler resolves (or rejects — failures don't block the queue).
     */
    runWith<T>(roomId: string, fn: () => Promise<T>): Promise<T>;
    pendingFor(roomId: string): number;
    /** Wait for all queued + active work for a room to finish. */
    quiesce(roomId: string): Promise<void>;
    /** Wait for all queued + active work for every room to finish. */
    quiesceAll(): Promise<void>;
    onEvent(listener: (event: RoomQueueEvent) => void): () => void;
    private getQueue;
    private emit;
}
export type RoomQueueEvent = {
    type: "enqueued";
    roomId: string;
    queueDepth: number;
} | {
    type: "completed";
    roomId: string;
} | {
    type: "errored";
    roomId: string;
    error: string;
};
//# sourceMappingURL=room-handler-queue.d.ts.map