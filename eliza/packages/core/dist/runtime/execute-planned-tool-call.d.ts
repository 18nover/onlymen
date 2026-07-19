import type { Action, ActionResult, HandlerOptions, IAgentRuntime, Memory, StreamChunkCallback } from "../types/index.js";
import type { AgentContext, RoleGateRole } from "../types/contexts.js";
import type { State } from "../types/state.js";
import { _resetActionRolePolicyCacheForTests as _resetCacheForTests } from "./action-role-policy.js";
import type { PlannerToolCall } from "./planner-loop.js";
export interface PlannedToolCall {
    id?: string;
    name: string;
    params?: Record<string, unknown>;
    args?: unknown;
    arguments?: unknown;
}
export interface ExecutePlannedToolCallContext {
    message: Memory;
    state?: State;
    activeContexts?: readonly AgentContext[];
    userRoles?: readonly RoleGateRole[];
    previousResults?: readonly ActionResult[];
    callback?: Parameters<Action["handler"]>[4];
    responses?: Memory[];
}
export type ExecutePlannedToolCallOptions = HandlerOptions & {
    actions?: readonly Action[];
    onStreamChunk?: StreamChunkCallback;
};
/**
 * A result may opt out per invocation because multi-mode actions only return
 * sensitive data for some operations. Static action metadata remains the
 * stronger default for actions whose every result is sensitive.
 */
export declare function shouldSuppressActionResultClipboard(action: Pick<Action, "suppressActionResultClipboard"> | undefined, result: {
    data?: Readonly<Record<string, unknown>>;
}): boolean;
/**
 * Keep the outcome and intentional user-facing projections while removing the
 * structured payload that must not enter planner prompts or client clipboards.
 */
export declare function projectActionResultForClipboard(action: Pick<Action, "name" | "suppressActionResultClipboard"> | undefined, result: ActionResult, actionName?: string | undefined): ActionResult;
export declare function executePlannedToolCall(runtime: IAgentRuntime, ctx: ExecutePlannedToolCallContext, toolCall: PlannerToolCall | PlannedToolCall, options?: ExecutePlannedToolCallOptions): Promise<ActionResult>;
export declare const _resetActionRolePolicyCacheForTests: typeof _resetCacheForTests;
/**
 * Short-form enum completion. When the action has a single closed-enum
 * parameter, accept three input shapes from the planner:
 *
 *   1. canonical:        `{ <paramName>: "<enum_value>" }`
 *   2. bare-string:      `"<enum_value>"`  (the entire args is the string)
 *   3. dispatch-shape:   `{ action: <name>, parameters: "<enum_value>" }`
 *
 * Shapes 2 and 3 are expanded into shape 1 here so `validateToolArgs` sees
 * the full JSON-schema shape and strict validation is unchanged. Anything
 * else flows through untouched — including planner emissions that don't
 * match an enum value, which are then caught by `validateToolArgs` and
 * surfaced as a normal failure.
 *
 * No-op when the action doesn't fit the single-enum-parameter pattern or when
 * the input doesn't look like a short-form emission.
 */
export declare function expandEnumShortForm(action: Action, args: Record<string, unknown>): Record<string, unknown>;
/**
 * Treat an empty-string value on a declared OPTIONAL parameter as omitted.
 *
 * Strict tool schemas force the model to emit every key, so `""` is its only
 * way to say "unset" for a parameter it doesn't want (observed live in the
 * #10694 trajectories: the planner emitted `BACKGROUND {preset: ""}` on a
 * color-only turn and enum validation rejected the whole call). Dropping the
 * key before validation restores the intended "omitted" semantics. Required
 * parameters are left untouched so an empty required value still fails loudly.
 */
export declare function dropEmptyOptionalArgs(action: Action, args: Record<string, unknown>): Record<string, unknown>;
//# sourceMappingURL=execute-planned-tool-call.d.ts.map