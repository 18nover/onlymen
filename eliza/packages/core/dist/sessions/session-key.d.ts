/**
 * Session key utilities for elizaOS.
 *
 * Provides functions for building, parsing, and normalizing session keys
 * used to identify agent sessions, threads, and peer connections.
 *
 * Session keys follow the format: agent:{agentId}:{rest}
 *
 * @module sessions/session-key
 */
export declare const DEFAULT_AGENT_ID = "main";
export declare const DEFAULT_MAIN_KEY = "main";
export declare const DEFAULT_ACCOUNT_ID = "default";
/**
 * Parsed agent session key components.
 */
export type ParsedAgentSessionKey = {
    /** The full original session key */
    raw: string;
    /** Agent ID extracted from the key */
    agentId: string;
    /** The remainder of the key after agent:{agentId}: */
    rest: string;
    /** Whether this is an ACP (Agent Communication Protocol) session */
    isAcp: boolean;
    /** Whether this is a subagent session */
    isSubagent: boolean;
    /** Thread ID if present */
    threadId?: string;
    /** Parent session key if this is a thread */
    parentKey?: string;
};
/**
 * Parse an agent session key into its components.
 *
 * Session keys follow the format:
 * - agent:{agentId}:{rest}
 * - agent:{agentId}:acp:{...}
 * - agent:{agentId}:subagent:{subagentId}:{...}
 * - agent:{agentId}:{...}:thread:{threadId}
 *
 * @param sessionKey - The session key to parse
 * @returns Parsed components or null if invalid
 */
export declare function parseAgentSessionKey(sessionKey: string | undefined | null): ParsedAgentSessionKey | null;
/**
 * Check if a session key is an ACP session.
 *
 * @param sessionKey - The session key to check
 * @returns True if this is an ACP session
 */
export declare function isAcpSessionKey(sessionKey: string | undefined | null): boolean;
/**
 * Check if a session key is a subagent session.
 *
 * @param sessionKey - The session key to check
 * @returns True if this is a subagent session
 */
export declare function isSubagentSessionKey(sessionKey: string | undefined | null): boolean;
/**
 * Resolve the parent session key for a thread session.
 *
 * @param sessionKey - The session key to resolve
 * @returns Parent session key or the original key if not a thread
 */
export declare function resolveThreadParentSessionKey(sessionKey: string | undefined | null): string | null;
/**
 * Normalize a main key value.
 *
 * @param value - Value to normalize
 * @returns Normalized main key
 */
export declare function normalizeMainKey(value: string | undefined | null): string;
/**
 * Normalize an agent ID.
 *
 * Ensures the ID is path-safe and shell-friendly.
 *
 * @param value - Value to normalize
 * @returns Normalized agent ID
 */
export declare function normalizeAgentId(value: string | undefined | null): string;
/**
 * Sanitize an agent ID (alias for normalizeAgentId).
 *
 * @param value - Value to sanitize
 * @returns Sanitized agent ID
 */
export declare function sanitizeAgentId(value: string | undefined | null): string;
/**
 * Normalize an account ID.
 *
 * @param value - Value to normalize
 * @returns Normalized account ID
 */
export declare function normalizeAccountId(value: string | undefined | null): string;
/**
 * Build an agent session key from components.
 *
 * @param agentId - The agent ID
 * @param rest - The rest of the key
 * @returns Formatted session key
 */
export declare function buildAgentSessionKey(agentId: string, rest: string): string;
/**
 * Build the main session key for an agent.
 *
 * @param params - Session key parameters
 * @returns Main session key
 */
export declare function buildAgentMainSessionKey(params: {
    agentId: string;
    mainKey?: string | undefined;
}): string;
/**
 * Build an ACP session key.
 *
 * @param agentId - The agent ID
 * @param acpKey - The ACP-specific key portion
 * @returns Formatted ACP session key
 */
export declare function buildAcpSessionKey(agentId: string, acpKey: string): string;
/**
 * Build a subagent session key.
 *
 * @param agentId - The parent agent ID
 * @param subagentId - The subagent ID
 * @param rest - Additional key portion
 * @returns Formatted subagent session key
 */
export declare function buildSubagentSessionKey(agentId: string, subagentId: string, rest?: string): string;
/**
 * Build a peer session key for an agent.
 *
 * @param params - Peer session parameters
 * @returns Peer session key
 */
export declare function buildAgentPeerSessionKey(params: {
    agentId: string;
    mainKey?: string | undefined;
    channel: string;
    accountId?: string | null;
    peerKind?: "dm" | "group" | "channel" | null;
    peerId?: string | null;
    identityLinks?: Record<string, string[]>;
    /** DM session scope. */
    dmScope?: "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
}): string;
/**
 * Convert a store session key to a request session key.
 *
 * @param storeKey - Store session key
 * @returns Request session key or undefined
 */
export declare function toAgentRequestSessionKey(storeKey: string | undefined | null): string | undefined;
/**
 * Convert a request session key to a store session key.
 *
 * @param params - Conversion parameters
 * @returns Store session key
 */
export declare function toAgentStoreSessionKey(params: {
    agentId: string;
    requestKey: string | undefined | null;
    mainKey?: string | undefined;
}): string;
/**
 * Resolve the agent ID from a session key.
 *
 * @param sessionKey - Session key to parse
 * @returns Resolved agent ID
 */
export declare function resolveAgentIdFromSessionKey(sessionKey: string | undefined | null): string;
/**
 * Build a group history key.
 *
 * @param params - History key parameters
 * @returns Group history key
 */
export declare function buildGroupHistoryKey(params: {
    channel: string;
    accountId?: string | null;
    peerKind: "group" | "channel";
    peerId: string;
}): string;
/**
 * Resolve thread session keys.
 *
 * @param params - Thread resolution parameters
 * @returns Session key and optional parent session key
 */
export declare function resolveThreadSessionKeys(params: {
    baseSessionKey: string;
    threadId?: string | null;
    parentSessionKey?: string;
    useSuffix?: boolean;
}): {
    sessionKey: string;
    parentSessionKey?: string;
};
//# sourceMappingURL=session-key.d.ts.map