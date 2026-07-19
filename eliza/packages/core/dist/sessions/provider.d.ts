/**
 * Session provider for elizaOS runtime.
 *
 * Exposes session context to agents during message processing.
 *
 * @module sessions/provider
 */
import type { Provider } from "../types/components.js";
import type { Memory } from "../types/memory.js";
import type { SessionEntry } from "./types.js";
/**
 * Extract session context from a memory object.
 *
 * Looks for session information in:
 * 1. memory.sessionId / memory.sessionKey
 * 2. memory.metadata.session
 * 3. memory.metadata.sessionId / memory.metadata.sessionKey
 *
 * @param memory - Memory to extract session from
 * @returns Session context or null
 */
export declare function extractSessionContext(memory: Memory): {
    sessionId?: string;
    sessionKey?: string;
    entry?: SessionEntry;
} | null;
/**
 * Create a session provider that exposes session context.
 *
 * @param options - Provider options
 * @returns Provider instance
 */
export declare function createSessionProvider(options?: {
    /** Path to session store (defaults to runtime's configured store) */
    storePath?: string;
    /** Custom name for the provider */
    name?: string;
}): Provider;
/**
 * Create a provider that exposes session skills.
 *
 * @param options - Provider options
 * @returns Provider instance
 */
export declare function createSessionSkillsProvider(options?: {
    storePath?: string;
    name?: string;
}): Provider;
/**
 * Create a provider that enforces session send policy.
 *
 * When sendPolicy is "deny", adds strong guidance to prevent
 * the agent from sending external messages.
 *
 * @param options - Provider options
 * @returns Provider instance
 */
export declare function createSendPolicyProvider(options?: {
    storePath?: string;
    name?: string;
}): Provider;
/**
 * Get all default session providers.
 *
 * @param options - Provider options
 * @returns Array of session providers
 */
export declare function getSessionProviders(options?: {
    storePath?: string;
}): Provider[];
//# sourceMappingURL=provider.d.ts.map