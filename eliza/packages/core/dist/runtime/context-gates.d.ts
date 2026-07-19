import type { AgentContext, ContextGate, RoleGate, RoleGateRole } from "../types/contexts.js";
export declare function normalizeGateRole(role: RoleGateRole): RoleGateRole;
export declare function roleRank(role: RoleGateRole): number;
export declare function satisfiesRoleGate(userRoles: readonly RoleGateRole[] | undefined, gate: RoleGate | undefined): boolean;
export declare function satisfiesContextGate(activeContexts: readonly AgentContext[] | undefined, gate: ContextGate | undefined, userRoles?: readonly RoleGateRole[]): boolean;
export interface ContextGateCandidate {
    contexts?: AgentContext[];
    contextGate?: ContextGate;
    roleGate?: RoleGate;
}
export declare function filterByContextGate<T extends ContextGateCandidate>(items: readonly T[], activeContexts: readonly AgentContext[] | undefined, userRoles?: readonly RoleGateRole[]): T[];
/** A provider-shaped gate candidate: the name enables the catalog fallback. */
export interface ProviderContextGateCandidate extends ContextGateCandidate {
    name: string;
}
/**
 * The effective context gate a provider declared, in full (#13203). A declared
 * `contextGate` with any context terms (contexts/anyOf/allOf/noneOf) is honored
 * verbatim — `filterByContextGate`'s `{contexts, roleGate}` reduction silently
 * dropped anyOf/allOf/noneOf, so a world-style `contextGate: { anyOf: [...] }`
 * provider lost its gate on the v5 planner selection path. Providers declaring
 * no gate terms resolve declared `contexts` → catalog (PROVIDER_CONTEXT_MAP);
 * a provider with neither declares no routing at all, and stays UNGATED
 * (#13204 follow-up): the pre-#13203 selection filter included that class on
 * every turn, and an injected `["general"]` here would silently drop
 * undeclared plugin providers (TWITTER_IDENTITY-shaped) from the narrow turns
 * they rode before. Only an explicit declaration or catalog entry may gate a
 * provider out; the wrapped registration path still materializes the
 * `["general"]` lean onto `contexts` (plugin-lifecycle), which this resolver
 * honors as declared.
 *
 * #12087 Item 14 preserved: a contextGate adds context requirements; it does
 * not waive the provider's top-level roleGate unless it declares its own.
 */
export declare function resolveProviderContextGate(provider: ProviderContextGateCandidate): ContextGate;
/**
 * Filter providers by their FULL effective context gate (see
 * {@link resolveProviderContextGate}). The v5 planner selection uses this
 * instead of {@link filterByContextGate} so declared anyOf/allOf/noneOf terms
 * and the catalog fallback for undeclared providers are honored.
 */
export declare function filterProvidersByContextGate<T extends ProviderContextGateCandidate>(providers: readonly T[], activeContexts: readonly AgentContext[] | undefined, userRoles?: readonly RoleGateRole[]): T[];
//# sourceMappingURL=context-gates.d.ts.map