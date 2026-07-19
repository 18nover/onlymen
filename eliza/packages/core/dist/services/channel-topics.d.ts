/**
 * ChannelTopicsService — per-channel topic LRU.
 *
 * Maintains, per `roomId`, a bounded most-recently-used list of short topic
 * labels extracted at Stage-1 (the `topics` field-evaluator). The list is the
 * running answer to "what is this channel about lately?" and is surfaced back
 * into Stage-1 routing through the `CHANNEL_TOPICS` provider so shouldRespond /
 * the planner can weigh topic relevance.
 *
 * Semantics:
 *   - Bounded LRU per room. {@link CHANNEL_TOPICS_LRU_CAPACITY} slots
 *     (≈ the last ~100 messages worth of distinct topics). FIFO eviction:
 *     when the list is full, the oldest entry is dropped to make room.
 *   - Dedupe on insert: re-recording an existing topic refreshes its recency
 *     (moves it to the most-recent end) rather than adding a duplicate.
 *   - Ordering: index 0 is the OLDEST, the last index is the MOST RECENT.
 *
 * Persistence:
 *   - Each room's list is mirrored to `room.metadata.currentTopics` via
 *     `runtime.updateRoom` so it survives a restart.
 *   - The in-memory cache is hydrated from `room.metadata.currentTopics` the
 *     first time a room is touched.
 *   - Missing rooms are expected during deletion races and skip persistence;
 *     database failures propagate to the message-loop boundary for reporting.
 *
 * This service is PURE LOGIC (no fs / process / native deps) so it is safe for
 * the Node, browser, and edge build targets.
 */
import type { UUID } from "../types/index.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
/** Metadata key under which a room's topic LRU is persisted. */
export declare const CHANNEL_TOPICS_METADATA_KEY = "currentTopics";
/**
 * Max distinct topics retained per room. ~20 slots ≈ the last ~100 messages
 * worth of salient topics (each message contributes 0-5 topics, most repeat).
 */
export declare const CHANNEL_TOPICS_LRU_CAPACITY = 20;
export declare class ChannelTopicsService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    /** roomId → ordered topic list (index 0 oldest, last most recent). */
    private readonly topicsByRoom;
    /** Rooms whose metadata has already been hydrated into the cache. */
    private readonly hydrated;
    private reportDatabaseFailure;
    static start(runtime: IAgentRuntime): Promise<ChannelTopicsService>;
    stop(): Promise<void>;
    /**
     * Hydrate a room's LRU from `room.metadata.currentTopics` the first time it
     * is accessed. Failed database reads remain unhydrated so callers can retry.
     */
    private hydrateRoom;
    /**
     * Apply new topics to a room's in-memory LRU. Dedupe refreshes recency
     * (move-to-most-recent); FIFO eviction drops the oldest when over capacity.
     * Returns the updated list (a fresh array, safe to hand out).
     */
    private applyTopics;
    /**
     * Persist a room's topic list to `room.metadata.currentTopics`. A missing room
     * is an expected deletion race; database failures propagate to the boundary.
     */
    private persistRoom;
    /**
     * Record newly-extracted topics for a room: hydrate (first touch) → apply to
     * the LRU (dedupe + FIFO evict) → persist to room metadata. A no-op when
     * `topics` is empty. Persistence failures propagate to the caller boundary.
     */
    recordTopics(roomId: UUID, topics: string[]): Promise<void>;
    /**
     * Synchronous accessor for a room's current LRU, most-recent last. Returns a
     * defensive copy (mutating it does not affect the cache). Returns the
     * cached list only — call {@link recordTopics} to hydrate from metadata. The
     * `CHANNEL_TOPICS` provider drives hydration via {@link ensureHydrated}.
     */
    getTopicsForRoom(roomId: UUID): string[];
    /**
     * Hydrate a room from metadata if not already done, then return its LRU.
     * Async variant used by read paths (e.g. the provider) that need the
     * persisted state on a cold cache (after restart).
     */
    ensureHydrated(roomId: UUID): Promise<string[]>;
    /**
     * Snapshot of every room's LRU currently in memory. Each list is a
     * defensive copy. Reflects only rooms touched since process start (plus
     * whatever was hydrated on access).
     */
    getTopicsForAllRooms(): Record<string, string[]>;
    /**
     * Cross-channel topic search (#8927): rank rooms whose recent topics match
     * the query, most-matching first. Scans the in-memory per-channel LRUs.
     */
    searchTopics(query: string, limit?: number): TopicSearchHit[];
}
/** A cross-channel topic search hit: a room whose topics matched the query. */
export interface TopicSearchHit {
    roomId: string;
    /** The room's topics that matched a query token. */
    matchedTopics: string[];
    /** The room's full current topic LRU (most-recent last). */
    topics: string[];
}
/**
 * Pure matcher for {@link ChannelTopicsService.searchTopics}: rank rooms whose
 * topics contain any whitespace-delimited query token (case-insensitive),
 * scored by match count, capped at `limit`. Deterministic; no I/O.
 */
export declare function matchTopicRooms(topicsByRoom: Record<string, string[]>, query: string, limit?: number): TopicSearchHit[];
//# sourceMappingURL=channel-topics.d.ts.map