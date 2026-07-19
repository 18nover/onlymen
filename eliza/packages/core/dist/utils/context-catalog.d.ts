/**
 * Context resolvers that pick a component's contexts: its own declared `contexts`
 * when present, otherwise a legacy fallback table, defaulting to "general".
 *
 * Actions are the source of truth for their own contexts and should declare
 * `contexts` on the action definition. LEGACY_ACTION_CONTEXT_FALLBACK is retained
 * only for plugin-owned / third-party action names that have not yet migrated (see its
 * doc comment). PROVIDER_CONTEXT_MAP still maps built-in provider names.
 */
import type { Action, AgentContext, Provider } from "../types/components.js";
/**
 * LEGACY_ACTION_CONTEXT_FALLBACK is a legacy, host-owned fallback map from action
 * NAME to domain contexts, consulted ONLY when an action does not declare its own
 * `contexts` array (see {@link resolveActionContexts}).
 *
 * The contexts contract now lives on the owner action: every action should declare
 * `contexts` on its own definition, and `resolveActionContexts` always prefers a
 * declared array over this table (declared wins, proven by the guard test in
 * `context-catalog.test.ts`).
 *
 * This table is retained ONLY for plugin-owned / third-party action NAMES whose
 * definitions live outside this repo (wallet, cron, browser, media, connector, and
 * other loadable plugins) and have not yet migrated their contexts onto the action.
 * It is NOT the source of truth and must not be extended with in-repo core actions.
 *
 * Invariant (enforced by `context-catalog.test.ts`): no core-owned action that
 * declares its own `contexts` may appear as a key here. Core owners that previously
 * relied on this table (ATTACHMENT, DOCUMENT, GENERATE_MEDIA, MESSAGE, POST,
 * MANAGE_PLUGINS, PAYMENT) now declare `contexts` on the action itself and were
 * removed from here. Several had drifted: the ATTACHMENT, GENERATE_MEDIA, and
 * MESSAGE map entries were narrower than the owner declaration, so the static entry
 * was silently wrong for those actions.
 */
export declare const LEGACY_ACTION_CONTEXT_FALLBACK: Record<string, AgentContext[]>;
export declare const PROVIDER_CONTEXT_MAP: Record<string, AgentContext[]>;
export declare function resolveActionContexts(action: Action): AgentContext[];
/**
 * Catalog lookup for a provider name (exact, lower, upper), or `undefined` when
 * the provider is uncataloged. Split out so registration can distinguish a
 * deliberate catalog entry of `["general"]` from the uncataloged default and
 * warn only on the latter (#13203).
 */
export declare function lookupProviderCatalogContexts(name: string): AgentContext[] | undefined;
export declare function resolveProviderContexts(provider: Pick<Provider, "name" | "contexts">): AgentContext[];
//# sourceMappingURL=context-catalog.d.ts.map