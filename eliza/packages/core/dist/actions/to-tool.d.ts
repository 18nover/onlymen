/**
 * Builds the model's tool-calling surface from Actions. Defines the canonical
 * Stage 1 `HANDLE_RESPONSE` tool (schema + description, with a direct-message
 * variant) through which the model declares turn intent, and the Stage 2 planner
 * tools where each Action becomes a native tool named by the action name with its
 * `parameters` JSON Schema. Tier-aware expansion promotes tier-A parents'
 * sub-actions to first-class tools; tier-B parents stay parent-only and route
 * internally. Also emits the always-available REPLY / IGNORE / STOP terminal
 * sentinels so the planner can end a turn regardless of action narrowing. Sits
 * between the action catalog and the model layer; parameter schemas come from
 * `normalizeActionJsonSchema` (`action-schema.ts`). Tool names must match
 * `NATIVE_TOOL_NAME_PATTERN` or conversion throws.
 */
import type { Action } from "../types/index.js";
import type { JSONSchema, ToolDefinition } from "../types/model.js";
import { type ActionParametersJsonSchema, type JsonSchema } from "./action-schema.js";
export declare const NATIVE_TOOL_NAME_PATTERN: RegExp;
/**
 * Canonical Stage 1 tool name.
 *
 * - HANDLE_RESPONSE: stage 1, called once per inbound message. The model
 *   declares intent (RESPOND / IGNORE / STOP), picks contexts to engage,
 *   may emit a simple-mode reply directly, and may extract durable
 *   facts / relationships for the memory pipeline.
 *
 * Stage 2 (planning) does not go through a single wrapper tool. Each
 * Action is exposed to the LLM as its own native tool whose name is the
 * action name and whose `parameters` is the action's parameter JSONSchema.
 * The model picks the action by name and calls it directly.
 */
export declare const HANDLE_RESPONSE_TOOL_NAME: "HANDLE_RESPONSE";
/**
 * Canonical Stage-1 HANDLE_RESPONSE parameters. This mirrors the builtin
 * ResponseHandlerFieldRegistry field order used in production. Plugin callers
 * may still pass an explicit `parameters` object to `createHandleResponseTool`;
 * callers that omit it get the same builtin field shape.
 */
export declare const HANDLE_RESPONSE_SCHEMA: JSONSchema;
export interface PlannerToolDefinition {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: ActionParametersJsonSchema | JsonSchema;
        strict: true;
    };
}
export declare function assertNativeToolName(name: string): void;
/**
 * Build the Stage 1 tool definition. Pass `directMessage: true` for DM /
 * API / SELF channels to use the direct-message description. The schema stays
 * canonical and still includes `shouldRespond`; the field evaluator decides the
 * value, and direct-message defaults are handled by prompt/parse policy.
 */
export declare function createHandleResponseTool(options?: {
    directMessage?: boolean;
    parameters?: JSONSchema;
    description?: string;
}): ToolDefinition;
/**
 * Stage 1 tool. The model uses this once per inbound message to declare
 * how it wants to handle the turn. Output drives the rest of the pipeline:
 *
 *   shouldRespond = "RESPOND" → engage `contexts`, run planner against the per-action tools
 *   shouldRespond = "IGNORE"  → terminate silently
 *   shouldRespond = "STOP"    → terminate with terminal stop signal
 *
 * `replyText` is always present (the user-facing reply). For trivially simple
 * replies that don't need action planning the model sets `contexts = ["simple"]`
 * (or leaves it empty) and `replyText` is the whole answer — the runtime emits
 * it without invoking the planner. Otherwise planning runs against `contexts`
 * and the planner produces the final message; `replyText` then serves as the
 * early acknowledgement.
 */
export declare const HANDLE_RESPONSE_TOOL: ToolDefinition;
/** Minimal Action shape consumed by the planner-tool conversion helpers. */
export type PlannerToolActionShape = Pick<Action, "name" | "description" | "descriptionCompressed" | "compressedDescription" | "routingHint" | "parameters" | "allowAdditionalParameters"> & {
    subActions?: Action["subActions"];
};
/**
 * Build a per-turn list of `ToolDefinition`s from the narrowed Stage 2
 * action surface. Each action becomes a native tool whose name is the
 * action name and whose `parameters` is the action's parameter
 * JSONSchema, so the LLM calls each action directly by name.
 *
 * Tool description is composed from (in order):
 *   - the action's `routingHint` (if present, on its own line)
 *   - `descriptionCompressed ?? description`
 *
 * The order of `actions` is preserved in the output (callers control
 * tool ordering by ordering the input). Names are validated against
 * {@link NATIVE_TOOL_NAME_PATTERN}; an invalid name throws.
 */
export declare function buildPlannerToolsFromActions(actions: ReadonlyArray<PlannerToolActionShape>): ToolDefinition[];
/**
 * Options accepted by {@link buildPlannerToolsFromTieredActions}.
 */
export interface BuildPlannerToolsFromTieredActionsOptions {
    /**
     * Set of parent action names (case-insensitive, matched against
     * `Action.name` after normalization) whose `subActions` should be expanded
     * as first-class planner tools. Parents not in this set get only their own
     * tool exposed — the parent's handler is responsible for routing to a
     * sub-action when the planner picks the umbrella.
     *
     * Pass the tiered-action-surface `tierAParents` from the action surface
     * metadata. When omitted or empty, no expansion happens and the behavior
     * matches {@link buildPlannerToolsFromActions} exactly.
     */
    tierAParents?: ReadonlySet<string> | readonly string[];
    /**
     * Optional registry of `name → Action` used to resolve string-only
     * sub-action references (parents may declare `subActions: ["FOO_BAR"]`).
     * When a string reference is not resolvable through this map, it is
     * skipped silently — string refs are advisory and the parent's handler
     * can still dispatch to them internally if the planner picks the parent.
     *
     * Inline-Action sub-actions (where `parent.subActions[i]` is an Action
     * object, not a string) are always expanded regardless of this map.
     */
    actionLookup?: ReadonlyMap<string, PlannerToolActionShape> | Readonly<Record<string, PlannerToolActionShape>>;
    /**
     * Optional callback invoked when a string sub-action reference could not
     * be resolved through `actionLookup`. Defaults to skipped. Useful for
     * threading log messages without coupling the helper to a logger.
     */
    onUnresolvedSubAction?: (info: {
        parentName: string;
        subActionName: string;
    }) => void;
    /**
     * Per-parent allow-list of sub-action names (case-insensitive) to expand
     * for tier-A parents. Produced by the tiering surface's per-parent child
     * narrowing (`maxTierAChildrenPerParent` in `tierActionResults`): when a
     * parent has an entry, only the listed children become first-class tools;
     * every other subaction stays reachable through the parent umbrella tool,
     * whose handler dispatches any subaction. Parents WITHOUT an entry expand
     * all sub-actions, so full-surface mode and callers that never narrow are
     * unaffected.
     */
    tierAChildrenByParent?: ReadonlyMap<string, readonly string[]> | Readonly<Record<string, readonly string[]>>;
}
/**
 * Build a per-turn list of `ToolDefinition`s from a tier-aware Stage 2 action
 * surface. Behaves like {@link buildPlannerToolsFromActions} when no
 * `tierAParents` are provided. When `tierAParents` is non-empty, sub-actions of
 * any input action whose name is in that set are expanded into first-class
 * tools alongside the parent, so the planner can call a specific sub-action
 * directly without a "dig into the parent" round-trip.
 *
 * Tier-B parents (anything in `actions` but NOT in `tierAParents`) are exposed
 * as parent-only tools — the parent's handler is responsible for dispatching
 * to a sub-action when the planner picks the umbrella.
 *
 * Sub-action resolution:
 *   - Inline `Action` sub-actions on `parent.subActions` are always expanded.
 *   - String-only sub-action references are resolved through `actionLookup`
 *     when provided; references that cannot be resolved are skipped silently
 *     (the parent's handler can still route to them).
 *
 * The output is deduplicated by tool `name` — if a child appears both as a
 * top-level entry in `actions` AND as a sub-action under a tier-A parent, it
 * is emitted only once. Input order is preserved: each parent is followed by
 * its expanded children (in `subActions` declaration order) before the next
 * parent in `actions`.
 */
export declare function buildPlannerToolsFromTieredActions(actions: ReadonlyArray<PlannerToolActionShape>, options?: BuildPlannerToolsFromTieredActionsOptions): ToolDefinition[];
/**
 * Universal terminal-sentinel tools. Always exposed to the planner regardless
 * of action narrowing so the model can end the turn with a stable, known
 * surface. REPLY emits the final user-facing message; IGNORE / STOP terminate
 * without a reply.
 *
 * Computed lazily inside the array so a static import does not pull in the
 * action runtime; the shapes are simple data.
 */
export declare const CORE_PLANNER_TERMINALS: ReadonlyArray<ToolDefinition>;
/**
 * Build a per-action tool definition. Retained for internal renderers and
 * external callers (e.g. local-AI grammar wiring) that still want the
 * `{type, function: {...}}` envelope shape. Stage 2 planning itself uses
 * {@link buildPlannerToolsFromActions} instead — that shape is the flat
 * `ToolDefinition` accepted by the provider plumbing.
 */
export declare function actionToTool(action: Action): PlannerToolDefinition;
//# sourceMappingURL=to-tool.d.ts.map