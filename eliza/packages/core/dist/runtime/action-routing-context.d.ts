/**
 * Action-scoped routing context.
 *
 * The runtime wraps every action handler invocation in
 * {@link runWithActionRoutingContext}, exposing the executing action's
 * `modelClass` (if any) to any `useModel` call made transitively. The
 * `useModel` resolver reads {@link getActionRoutingContext} to decide whether
 * to reroute via the strategy registry in {@link ./action-model-routing}.
 *
 * Node.js: AsyncLocalStorage for async-safe propagation across `await`s
 * inside action handlers.
 * Browser / non-Node: stack-based fallback (sync-only).
 *
 * Why a separate context (rather than threading an extra `useModel` param):
 *   - `useModel` callers inside action handlers are deep call chains — every
 *     helper would have to take an extra param. The async-context pattern
 *     keeps the call sites unchanged and back-compat clean.
 *   - The trajectory recorder already uses the same pattern; this matches.
 */
import type { ActionModelClass } from "../types/components.js";
export interface ActionRoutingContext {
    /** Name of the action currently executing. Surfaced for telemetry. */
    readonly actionName: string;
    /** The action's `modelClass` hint, if set. */
    readonly modelClass: ActionModelClass | undefined;
}
interface IActionRoutingContextManager {
    run<T>(ctx: ActionRoutingContext | undefined, fn: () => T | Promise<T>): T | Promise<T>;
    active(): ActionRoutingContext | undefined;
}
export declare function runWithActionRoutingContext<T>(ctx: ActionRoutingContext | undefined, fn: () => T | Promise<T>): T | Promise<T>;
export declare function getActionRoutingContext(): ActionRoutingContext | undefined;
/**
 * Run `fn` with the action routing context temporarily cleared. Used by the
 * runtime's `useModel` to invoke a routed sub-call without re-entering the
 * routing seam (which would otherwise loop on the same chain).
 */
export declare function runWithoutActionRoutingContext<T>(fn: () => T | Promise<T>): T | Promise<T>;
/**
 * Test-only helper to inject a context manager (e.g. a deterministic stack
 * implementation). Not used in production.
 */
export declare function setActionRoutingContextManager(manager: IActionRoutingContextManager): void;
export {};
//# sourceMappingURL=action-routing-context.d.ts.map