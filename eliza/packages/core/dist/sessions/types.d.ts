/**
 * Session types for elizaOS.
 *
 * Defines the core data structures for session management including
 * session entries, scopes, origins, and related metadata.
 *
 * Note: Some session-related types (SessionOrigin, SessionModelOverride, etc.)
 * are defined in types/memory.ts to avoid circular dependencies. This module
 * imports them for use in SessionEntry but does not re-export them to avoid
 * duplicate exports when both sessions and types are exported from index.
 *
 * @module sessions/types
 */
import type { SessionOrigin, SessionSkillsSnapshot } from "../types/memory.js";
/**
 * Normalized chat type for session classification.
 */
export type SessionChatType = "dm" | "group" | "channel" | "thread";
/**
 * Delivery context for routing responses.
 */
export type SessionDeliveryContext = {
    /** Channel to deliver to */
    channel?: string;
    /** Target recipient/destination */
    to?: string;
    /** Account to use for delivery */
    accountId?: string;
    /** Thread to deliver to */
    threadId?: string | number;
};
/**
 * Core session entry representing a conversation session.
 *
 * This is the primary data structure for session state in elizaOS.
 */
export type SessionEntry = {
    /** Unique session identifier (UUID) */
    sessionId: string;
    /** Last update timestamp (milliseconds since epoch) */
    updatedAt: number;
    /** Path to the session transcript file */
    sessionFile?: string;
    /** Parent session key that spawned this session (for subagent scoping) */
    spawnedBy?: string;
    /** Human-readable label for the session */
    label?: string;
    /** Display name for UI purposes */
    displayName?: string;
    /** Whether system introduction has been sent */
    systemSent?: boolean;
    /** Whether the last run was aborted */
    abortedLastRun?: boolean;
    /** Type of chat (dm, group, channel, thread) */
    chatType?: SessionChatType;
    /** Primary channel for this session */
    channel?: string;
    /** Group identifier (for group chats) */
    groupId?: string;
    /** Group subject/name */
    subject?: string;
    /** Group channel name (e.g., "#general") */
    groupChannel?: string;
    /** Space/server name (e.g., Discord guild) */
    space?: string;
    /** Origin information */
    origin?: SessionOrigin;
    /** Current delivery context */
    deliveryContext?: SessionDeliveryContext;
    /** Last channel used for delivery */
    lastChannel?: string;
    /** Last recipient */
    lastTo?: string;
    /** Last account used */
    lastAccountId?: string;
    /** Last thread ID */
    lastThreadId?: string | number;
    /** Thinking/reasoning level */
    thinkingLevel?: string;
    /** Verbose output level */
    verboseLevel?: string;
    /** Reasoning level */
    reasoningLevel?: string;
    /** Elevated permissions level */
    elevatedLevel?: string;
    /** Provider override */
    providerOverride?: string;
    /** Model override */
    modelOverride?: string;
    /** Auth profile override */
    authProfileOverride?: string;
    /** Source of auth profile override */
    authProfileOverrideSource?: "auto" | "user";
    /** Compaction count when auth profile was set */
    authProfileOverrideCompactionCount?: number;
    /** Input tokens consumed */
    inputTokens?: number;
    /** Output tokens generated */
    outputTokens?: number;
    /** Total tokens */
    totalTokens?: number;
    /** Context window tokens */
    contextTokens?: number;
    /** Number of compaction operations */
    compactionCount?: number;
    /** Model provider used */
    modelProvider?: string;
    /** Model identifier used */
    model?: string;
    /** Group activation mode (mention or always) */
    groupActivation?: "mention" | "always";
    /** Whether group needs system introduction */
    groupActivationNeedsSystemIntro?: boolean;
    /** Send policy (allow or deny responses) */
    sendPolicy?: "allow" | "deny";
    /** Response usage display mode */
    responseUsage?: "on" | "off" | "tokens" | "full";
    /** Text-to-speech auto mode */
    ttsAuto?: "on" | "off" | "voice-only";
    /** Execution host */
    execHost?: string;
    /** Execution security mode */
    execSecurity?: string;
    /** Execution ask mode */
    execAsk?: string;
    /** Execution node */
    execNode?: string;
    /** Timestamp when memory was last flushed */
    memoryFlushAt?: number;
    /** Compaction count when memory was flushed */
    memoryFlushCompactionCount?: number;
    /** Snapshot of active skills */
    skillsSnapshot?: SessionSkillsSnapshot;
    /** Last delivered heartbeat payload */
    lastHeartbeatText?: string;
    /** Timestamp when last heartbeat was sent */
    lastHeartbeatSentAt?: number;
    /** Map of CLI session identifiers */
    cliSessionIds?: Record<string, string>;
};
/**
 * Session store mapping session keys to entries.
 */
export type SessionStore = Record<string, SessionEntry>;
/**
 * Merge a session entry with a partial update.
 *
 * @param existing - Existing session entry (or undefined for new)
 * @param patch - Partial updates to apply
 * @returns Merged session entry
 */
export declare function mergeSessionEntry(existing: SessionEntry | undefined, patch: Partial<SessionEntry>): SessionEntry;
/**
 * Create a new session entry with minimal required fields.
 *
 * @param overrides - Optional field overrides
 * @returns New session entry
 */
export declare function createSessionEntry(overrides?: Partial<SessionEntry>): SessionEntry;
/**
 * Check if a session entry is valid.
 *
 * @param entry - Entry to validate
 * @returns True if entry has required fields
 */
export declare function isValidSessionEntry(entry: unknown): entry is SessionEntry;
/**
 * Result of resolving a session key.
 */
export type SessionResolution = {
    /** The resolved session key */
    sessionKey: string;
    /** Whether this is a new session */
    isNew: boolean;
    /** The session entry */
    entry: SessionEntry;
};
/**
 * Result of resolving a group session key.
 */
export type GroupKeyResolution = {
    /** The resolved group key */
    key: string;
    /** Channel identifier */
    channel?: string;
    /** Group/room identifier */
    id?: string;
    /** Chat type */
    chatType?: SessionChatType;
};
/** Default trigger for resetting a session */
export declare const DEFAULT_RESET_TRIGGER = "/new";
/** All default reset triggers */
export declare const DEFAULT_RESET_TRIGGERS: string[];
/** Default idle timeout in minutes */
export declare const DEFAULT_IDLE_MINUTES = 60;
//# sourceMappingURL=types.d.ts.map