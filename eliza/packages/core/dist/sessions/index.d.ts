/**
 * Session management utilities for elizaOS.
 *
 * Provides:
 * - Session key building and parsing
 * - Session types and data structures
 * - Session storage with caching and locking
 * - Session path resolution
 * - Agent/peer/thread session management
 * - Identity linking for cross-platform users
 *
 * @module sessions
 */
export { buildAcpSessionKey, buildAgentMainSessionKey, buildAgentPeerSessionKey, buildAgentSessionKey, buildGroupHistoryKey, buildSubagentSessionKey, DEFAULT_ACCOUNT_ID, DEFAULT_AGENT_ID, DEFAULT_MAIN_KEY, isAcpSessionKey, isSubagentSessionKey, normalizeAccountId, normalizeAgentId, normalizeMainKey, type ParsedAgentSessionKey, parseAgentSessionKey, resolveAgentIdFromSessionKey, resolveThreadParentSessionKey, resolveThreadSessionKeys, sanitizeAgentId, toAgentRequestSessionKey, toAgentStoreSessionKey, } from "./session-key.js";
export { createSessionEntry, DEFAULT_IDLE_MINUTES, DEFAULT_RESET_TRIGGER, DEFAULT_RESET_TRIGGERS, type GroupKeyResolution, isValidSessionEntry, mergeSessionEntry, type SessionChatType, type SessionDeliveryContext, type SessionEntry, type SessionResolution, type SessionStore, } from "./types.js";
export { createSendPolicyProvider, createSessionProvider, createSessionSkillsProvider, extractSessionContext, getSessionProviders, } from "./provider.js";
//# sourceMappingURL=index.d.ts.map