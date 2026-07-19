/**
 * NotificationService
 *
 * The single runtime seam for producing user-facing notifications. Any code
 * with a runtime handle — an action, a scheduled-task dispatcher, a workflow
 * completion hook, an orchestrator event — calls `notify(...)`. The service:
 *
 *   1. stamps a canonical `AgentNotification`,
 *   2. persists it to a durable inbox (DB-backed runtime cache; survives
 *      restart), collapsing by `groupKey`,
 *   3. fans it out live on the agent event bus as `stream: "notification"`,
 *      which the server already forwards over WebSocket to every client.
 *
 * Clients (in-app center, toast, desktop OS, mobile native) render FROM the
 * one shape. The inbox is the source of truth for history + unread state; live
 * fan-out is best-effort (a headless runtime with no event bus still records
 * notifications and serves them over the HTTP inbox API).
 */
import { type AgentNotification, type NotificationInput, type NotificationQuery } from "../types/notification.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
export type NotificationServiceAvailability = "disabled" | "pending" | "registering" | "failed" | "registered";
export interface NotificationServiceRecovery {
    state: "started" | "in-flight" | "backoff" | "unavailable";
    retryAfterSeconds: number;
}
/** Runtime lifecycle surface required by notification transports. */
export interface NotificationServiceLifecycleRuntime {
    readonly agentId?: string;
    reportError(scope: string, error: unknown, context?: Record<string, unknown>): void;
    getService(serviceType: string): unknown;
    hasService(serviceType: string): boolean;
    getServiceRegistrationStatus(serviceType: string): "pending" | "registering" | "registered" | "failed" | "unknown";
    getServiceLoadPromise(serviceType: string): Promise<Service>;
}
export declare class NotificationService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    /** Newest-last ordered list (mirrors the persisted store). */
    private notifications;
    /** Resolved cache key (scoped per agent). */
    private get cacheKey();
    /**
     * Resolve the runtime lifecycle state without treating a failed instance as
     * an intentionally empty inbox. A registered class with no live instance is
     * fail-closed even if the runtime reports an inconsistent `registered` state.
     */
    static getAvailability(runtime: NotificationServiceLifecycleRuntime): NotificationServiceAvailability;
    /**
     * Start one background recovery attempt after a failed hydration. The
     * runtime already deduplicates concurrent service starts; this coordinator
     * adds a bounded cooldown so repeated HTTP and Android requests cannot turn
     * a persistent adapter outage into a retry stampede.
     */
    static requestRecovery(runtime: NotificationServiceLifecycleRuntime): NotificationServiceRecovery;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    /** Load persisted notifications from the DB-backed cache. */
    private hydrate;
    private persist;
    /**
     * Create, persist, and broadcast a notification. Returns the stamped record.
     */
    notify(input: NotificationInput): Promise<AgentNotification>;
    private broadcast;
    /** List notifications, newest first, with optional filtering. */
    list(query?: NotificationQuery): AgentNotification[];
    getUnreadCount(): number;
    /**
     * Compute the `data` for a notification that may be coalescing onto a prior
     * same-`groupKey` record (§C.3). A producer-set `data.count` always wins; a
     * bare supersede increments the surviving count (prior `count`, defaulting to
     * 1, plus one). A first (un-superseded) notification carries no count key.
     */
    private resolveCoalescedData;
    /** Mark one notification read. Returns true if it existed and changed. */
    markRead(id: string): Promise<boolean>;
    /**
     * §C.5 Acted-upon auto-read: mark every unread notification pointing at a
     * given `groupKey` read, without removing it (read is history, not deletion).
     * A producer whose action completed — an approval approved, a task opened —
     * calls this so the inbox never nags about a done thing. Returns the number of
     * records changed (0 for an unknown/already-read group). Never reorders the
     * inbox (§C.2): read state styles rows but does not move them.
     */
    markReadByGroupKey(groupKey: string): Promise<number>;
    /** Mark every notification read. Returns the number changed. */
    markAllRead(): Promise<number>;
    /** Remove one notification. Returns true if it existed. */
    remove(id: string): Promise<boolean>;
    /** Clear the entire inbox. */
    clear(): Promise<void>;
}
export default NotificationService;
//# sourceMappingURL=notification.d.ts.map