/**
 * Registry of the agent's context taxonomy. Stores normalized `ContextDefinition`
 * records, validates on every mutation that parent and subcontext edges reference
 * known contexts and form no cycles, and supports idempotent registration plus
 * role-gated listing for prompt rendering. Exports a default registry seeded with
 * the first-party context definitions.
 */
import type { AgentContext, ContextDefinition, RoleGateRole } from "../types/contexts.js";
export { CONTEXT_ALIASES, expandContextAliases, FIRST_PARTY_CONTEXT_IDS, normalizeContextId, normalizeContextList, } from "./context-normalization.js";
export declare class ContextRegistryError extends Error {
    constructor(message: string);
}
export declare class ContextRegistry {
    #private;
    constructor(definitions?: readonly ContextDefinition[]);
    list(): ContextDefinition[];
    get(context: AgentContext): ContextDefinition | undefined;
    has(context: AgentContext): boolean;
    register(definition: ContextDefinition): void;
    registerMany(definitions: readonly ContextDefinition[]): void;
    /**
     * Idempotent registration. Returns true when the definition was added,
     * false when an entry with the same id already existed and was kept.
     *
     * Used by the runtime startup wiring to register the first-party context
     * taxonomy without throwing if a plugin already registered the same id.
     */
    tryRegister(definition: ContextDefinition): boolean;
    /**
     * Idempotent batch registration. Skips entries whose id is already
     * registered (returning their ids in `skipped`), and inserts the remainder
     * atomically through `registerMany` so cross-references between the new
     * definitions resolve correctly.
     *
     * Used by the runtime startup wiring to seed the first-party context
     * taxonomy without choking on subcontext edges.
     */
    tryRegisterMany(definitions: readonly ContextDefinition[]): {
        added: AgentContext[];
        skipped: AgentContext[];
    };
    /**
     * Return all context definitions whose role gate (if any) is satisfied by
     * the supplied caller role(s). Contexts without a role gate are always
     * included. The order matches `list()` for stable prompt rendering.
     */
    listAvailable(roles: RoleGateRole | readonly RoleGateRole[] | undefined): ContextDefinition[];
    normalize(context: AgentContext): AgentContext;
    normalizeList(contexts: readonly AgentContext[] | undefined): AgentContext[];
}
export declare const defaultContextRegistry: ContextRegistry;
//# sourceMappingURL=context-registry.d.ts.map