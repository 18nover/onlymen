/**
 * Canonical first-party context ids and their normalization helpers. Lower-cases
 * and underscores raw context ids, expands the narrow finance/crypto aliases to
 * their canonical set, and de-duplicates a context list — the shared normal form
 * every gate and registry comparison runs against.
 */
import type { AgentContext } from "../types/contexts.js";
export declare const FIRST_PARTY_CONTEXT_IDS: readonly ["simple", "general", "memory", "documents", "knowledge", "research", "web", "browser", "code", "files", "terminal", "email", "calendar", "contacts", "tasks", "goals", "todos", "productivity", "health", "screen_time", "subscriptions", "finance", "payments", "wallet", "crypto", "messaging", "phone", "social", "social_posting", "media", "automation", "connectors", "settings", "character", "secrets", "admin", "system", "state", "world", "game", "agent_internal"];
/**
 * Aliases for context names that aren't themselves canonical first-party
 * contexts but expand to one or more canonical contexts. Aliases are
 * intentionally narrow — callers should declare canonical first-party contexts
 * directly; only convenience aliases for finance/crypto remain.
 */
export declare const CONTEXT_ALIASES: Readonly<Record<string, readonly AgentContext[]>>;
export declare function normalizeContextId(context: string): AgentContext;
export declare function expandContextAliases(context: AgentContext): AgentContext[];
export declare function normalizeContextList(contexts: readonly AgentContext[] | undefined): AgentContext[];
//# sourceMappingURL=context-normalization.d.ts.map