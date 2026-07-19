/**
 * Turn-level context routing: derives the active agent contexts for a turn —
 * from routing metadata carried on state/message, or by scoring the message
 * text against keyword signals — and gates which actions/providers surface by
 * testing whether a component's declared contexts overlap the active set.
 * Gating is permissive: a component with no declared contexts, or an empty
 * active set, is always included.
 */
import type { Action, AgentContext, Provider } from "../types/components.js";
import type { Memory } from "../types/memory.js";
import type { State } from "../types/state.js";
export declare const AVAILABLE_CONTEXTS_STATE_KEY = "availableContexts";
export declare const CONTEXT_CAPABILITIES_STATE_KEY = "__contextCapabilities";
export declare const CONTEXT_ROUTING_METADATA_KEY = "__responseContext";
export declare const CONTEXT_ROUTING_STATE_KEY = "__contextRouting";
export interface ContextRoutingDecision {
    primaryContext?: AgentContext;
    secondaryContexts?: AgentContext[];
}
export declare function parseContextList(value: unknown): AgentContext[];
export declare function isPageScopedRoutingContext(context: unknown): boolean;
export declare function normalizeRoutingContexts(contexts: readonly unknown[] | undefined): AgentContext[];
export declare function getExplicitRoutingContexts(activeContexts: readonly AgentContext[] | undefined): AgentContext[];
export declare function routingContextsOverlap(left: readonly AgentContext[] | undefined, right: readonly AgentContext[] | undefined): boolean;
export declare function shouldSurfaceContextCapabilities(declaredContexts: readonly AgentContext[] | undefined, activeContexts: readonly AgentContext[] | undefined): boolean;
export declare function parseContextRoutingMetadata(raw: unknown): ContextRoutingDecision;
export declare function getContextRoutingFromState(state: State | null | undefined): ContextRoutingDecision;
export declare function getContextRoutingFromMessage(message: Memory): ContextRoutingDecision;
export declare function mergeContextRouting(state: State | null | undefined, message: Memory): ContextRoutingDecision;
export declare function getActiveRoutingContexts(routing: ContextRoutingDecision): AgentContext[];
export declare function getActiveRoutingContextsForTurn(state: State | null | undefined, message: Memory): AgentContext[];
export declare function shouldIncludeByContext(declaredContexts: AgentContext[] | undefined, activeContexts: AgentContext[] | undefined): boolean;
export declare function setContextRoutingMetadata(message: Memory, routing: ContextRoutingDecision): void;
export declare function deriveAvailableContexts(actions: Action[], providers: Provider[]): AgentContext[];
export declare function inferContextRoutingFromText(text: string | null | undefined): ContextRoutingDecision;
export declare function inferContextRoutingFromMessage(message: Pick<Memory, "content">): ContextRoutingDecision;
export declare function attachAvailableContexts(state: State, runtime: {
    actions: Action[];
    providers: Provider[];
}): State;
//# sourceMappingURL=context-routing.d.ts.map