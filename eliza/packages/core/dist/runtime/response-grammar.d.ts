/**
 * Per-turn grammar / response-skeleton generation for the Stage-1 response
 * handler and the Stage-2 planner.
 *
 * Eliza-1 is the local voice target: we get to shape the response envelope, the
 * action/evaluator registration, and the decode loop to match. This module is
 * the *producer* side — it walks the registered actions, the registered
 * Stage-1 field evaluators, and the available context ids and emits a
 * {@link ResponseSkeleton} (engine-neutral structure-forcing description) plus,
 * where the skeleton can't express a constraint (the `contexts` array is an
 * array whose *elements* are drawn from a fixed enum), an explicit GBNF
 * `grammar` string. The local llama-server engine (W4,
 * `packages/app-core/src/services/local-inference/structured-output.ts`)
 * consumes either: `grammar` wins, else it compiles the skeleton to a lazy
 * GBNF. Cloud adapters ignore both — `responseSchema` / `tools` carry the
 * equivalent (unforced) contract for them, so there is no fallback branch here.
 *
 * Source of truth:
 *   `ResponseHandlerFieldRegistry.composeSchema()`
 *   (`./response-handler-field-registry.ts`) is canonical. Production Stage 1
 *   sends that composed schema as the HANDLE_RESPONSE tool's `parameters`.
 *   `buildResponseGrammar` emits the same field-registry envelope in priority
 *   order; when a caller omits fields, this module defaults to the builtin
 *   field evaluator set.
 *
 * Caching: `buildResponseGrammar` is pure given the runtime registries
 * snapshot. The result is byte-stable across turns when the registries haven't
 * changed, so callers may cache on the returned `responseSkeleton.id` (which is
 * derived from the field-registry signature + the context-id set + the channel
 * flag + the action set). A small process-wide cache is kept here keyed on that
 * id.
 */
import { type JsonSchema, normalizeActionJsonSchema } from "../actions/action-schema.js";
import type { Action } from "../types/components.js";
import type { JSONSchema, ResponseSkeleton, SpanSamplerPlan } from "../types/model.js";
/**
 * A registered Stage-1 field evaluator, narrowed to the bits this module needs
 * (name / priority / schema). The full contract lives in
 * `runtime/response-handler-field-evaluator.ts`; we keep the dependency
 * structural so this module doesn't drag the registry's transitive imports
 * into the browser bundle.
 */
export interface ResponseHandlerFieldShape {
    name: string;
    priority?: number;
    schema: JSONSchema;
}
/**
 * Minimal runtime view `buildResponseGrammar` needs. Accepting this rather than
 * the full `IAgentRuntime` keeps the function testable in isolation.
 */
export interface ResponseGrammarRuntimeView {
    /** Registered actions (the planner's action universe). */
    actions: ReadonlyArray<Pick<Action, "name" | "parameters" | "allowAdditionalParameters">>;
    /**
     * Registered Stage-1 field evaluators. Pass
     * `runtime.responseHandlerFieldRegistry.list()` here. May be omitted /
     * empty when no plugin registered any.
     */
    responseHandlerFields?: ReadonlyArray<ResponseHandlerFieldShape>;
    /**
     * The composed-schema signature of the field registry — used to key the
     * compiled-grammar cache. Pass
     * `runtime.responseHandlerFieldRegistry.composeSchemaSignature()`. Optional;
     * when omitted a signature is derived from `responseHandlerFields`.
     */
    responseHandlerFieldSignature?: string;
}
export interface BuildResponseGrammarOptions {
    /**
     * Context ids the model may engage this turn (the `contexts` array's
     * element enum). Pass `runtime.contexts.listAvailable(roles).map(d => d.id)`.
     * `simple` and `general` are always merged in if absent so the model can
     * always route to the direct path / planning-against-general.
     */
    contexts: ReadonlyArray<string>;
    /**
     * The inbound message's channel type (`ChannelType.*` string). On
     * DM/API/SELF drop the `shouldRespond` span. Voice channels keep it because
     * semantic turn-taking can choose IGNORE.
     */
    channelType?: string;
    /**
     * Override the registered action universe (e.g. the per-turn exposed action
     * set). When omitted, `runtime.actions` is used.
     */
    actions?: ReadonlyArray<Pick<Action, "name" | "parameters" | "allowAdditionalParameters">>;
}
export interface ResponseGrammarResult {
    /** Engine-neutral structure-forcing description (W4 compiles to lazy GBNF). */
    responseSkeleton: ResponseSkeleton;
    /**
     * Precise GBNF grammar string for the Stage-1 envelope, including the
     * `contexts` array-of-enum constraint (which the flat span model can't
     * express). W4's `resolveGrammarForParams` prefers this over the skeleton.
     * Always present for Stage-1.
     */
    grammar: string;
}
/**
 * Build the Stage-1 response envelope skeleton + a precise GBNF grammar.
 *
 * The skeleton's spans, in order:
 *   `{` literal
 *   [one span per registered field evaluator, priority-ordered]
 *   `}` literal
 *
 * Single-value enums (e.g. a field evaluator whose schema is a one-element
 * string enum) lower to literal spans here — no tokens spent.
 */
export declare function buildResponseGrammar(runtime: ResponseGrammarRuntimeView, options: BuildResponseGrammarOptions): ResponseGrammarResult;
/** Clear the process-wide Stage-1 grammar cache (test hook). */
export declare function clearResponseGrammarCache(): void;
/**
 * Merge `eliza.guidedDecode = true` into a provider-options bag so the local
 * llama-server engine builds the {@link ResponseSkeleton}'s deterministic-token
 * prefill plan (`eliza_prefill_plan`) and fast-forwards the forced scaffold
 * spans — turning the ≈28% of envelope tokens the GBNF already pins into ≈28%
 * fewer `decode()` calls (the fork-side fast-forward consumes the plan; without
 * it the runtime degrades to grammar-only / byte-identical output). Idempotent;
 * returns the same object reference with `eliza.guidedDecode` set. When the
 * operator opted out via `ELIZA_LOCAL_GUIDED_DECODE=0`, an existing
 * `providerOptions.eliza.guidedDecode` (likely absent) is left alone.
 */
export declare function withGuidedDecodeProviderOptions<T extends Record<string, unknown>>(providerOptions: T): T;
/**
 * Derive a {@link SpanSamplerPlan} from a {@link ResponseSkeleton} using the
 * canonical policy: every `enum` (with ≥2 values), `number`, and `boolean` span
 * gets `temperature: 0, topK: 1` (argmax). `literal`, `free-string`, and
 * `free-json` spans get no override — the call-level temperature applies.
 *
 * `spanIndex` addresses the position INTO `skeleton.spans` directly, so the
 * caller (and tests) can stare at `skeleton.spans[overrides[i].spanIndex]` to
 * verify the policy. Engines that need free-span addressing convert at the
 * boundary by counting non-literal spans up to `spanIndex`.
 *
 * Single-value enums are skipped because they collapse to `literal` upstream;
 * defensively skipped here too. Returns a plan with `overrides: []` when the
 * skeleton has no argmax-eligible spans (caller decides whether to send it).
 *
 * Hardcoded policy matches the user's request: "for any enum or numerical
 * temperature, we should turn temperature to 0 and in fact just select the
 * most likely token." Applies to local inference and Eliza Cloud hosted
 * `eliza-1` (Wave 3 wires the cloud honor path).
 */
export declare function buildSpanSamplerPlan(skeleton: ResponseSkeleton): SpanSamplerPlan;
/**
 * A minimal description of an action available to the planner this turn: the
 * tool name plus the normalized JSON schema for its `parameters` object. The
 * planner renders these into the conversation's `available_actions` block; this
 * module turns the *name set* into an enum constraint and exposes the per-action
 * schemas so the engine can do the second pass (constrain `parameters` once the
 * `action` value is known).
 */
export interface PlannerActionDescriptor {
    name: string;
    parametersSchema: JSONSchema;
    /** True when the action's parameters schema allows undeclared properties. */
    allowAdditionalParameters: boolean;
}
export interface PlannerActionGrammarResult {
    /**
     * Skeleton for the PLAN_ACTIONS tool-call arguments
     * `{ "action": <enum>, "parameters": <free-json>, "thought": <free-string> }`.
     * `parameters` is a `free-json` span — the per-action constraint can't be
     * expressed in a single skeleton (it is conditional on the sampled `action`
     * value), so the engine does a second pass against
     * {@link PlannerActionGrammarResult.actionSchemas}.
     */
    responseSkeleton: ResponseSkeleton;
    /**
     * Precise GBNF for the PLAN_ACTIONS args with `action` pinned to the enum of
     * available action names. `parameters` is left as a free JSON object.
     */
    grammar: string;
    /**
     * Map of action name → normalized JSON schema for that action's `parameters`
     * object. The engine uses this for the second constrained pass; cloud
     * adapters ignore it. Carried alongside the grammar/skeleton on
     * `providerOptions.eliza.plannerActionSchemas`.
     */
    actionSchemas: Record<string, JSONSchema>;
}
/**
 * Build a {@link PlannerActionDescriptor} from a registered action.
 */
export declare function actionToPlannerDescriptor(action: Pick<Action, "name" | "parameters" | "allowAdditionalParameters">): PlannerActionDescriptor;
/**
 * Build the per-turn grammar for the Stage-2 planner's `PLAN_ACTIONS` call from
 * the set of actions exposed this turn. Constrains the `action` field to the
 * exact enum of available action names and exposes each action's normalized
 * parameter schema for the engine's second pass.
 *
 * Returns `null` when there are no actions to expose (the planner falls back to
 * its unconstrained behavior).
 */
export declare function buildPlannerActionGrammar(actions: ReadonlyArray<Pick<Action, "name" | "parameters" | "allowAdditionalParameters">>): PlannerActionGrammarResult | null;
/**
 * Single-call counterpart to `buildPlannerActionGrammar`: instead of pinning
 * only the `action` field and leaving `parameters` as free-JSON, the strict
 * variant produces a per-action *union* grammar where each branch encodes
 * `{"action":"<NAME>","parameters":<params_NAME>,"thought":<thought>}` with a
 * GBNF rule for `params_NAME` that constrains every property of that action's
 * normalized schema. Branches are root-level alternatives, so the chosen
 * action name and the parameter shape are co-determined by construction —
 * something a single-pass loose grammar cannot guarantee.
 *
 * Tradeoff vs. the loose `buildPlannerActionGrammar`: grammar size grows with
 * `actions × properties_per_action`, but the model only needs ONE call to
 * produce a validated structure (no engine-level second pass, no
 * coercion/reroll round in `validate-tool-args.ts`). Matches the intent of
 * P2-4 in `packages/training/benchmarks/INFERENCE_OPTIMIZATION_PLAN.md`.
 *
 * The returned `responseSkeleton` is intentionally minimal — the grammar
 * carries the entire structural contract, so the engine's prefill plan has
 * nothing useful to inject statically. Adapters that do not honor local
 * skeleton/grammar hints still receive the equivalent portable `tools`
 * contract.
 *
 * Returns `null` when no actions are exposed.
 */
/**
 * Group action names by longest common prefix (≥3 chars, ≥2 names sharing it).
 * Returns a map of prefix → suffixes, plus a list of ungrouped names.
 */
export declare function buildPlannerActionGrammarStrict(actions: ReadonlyArray<Pick<Action, "name" | "parameters" | "allowAdditionalParameters">>): PlannerActionGrammarResult | null;
/**
 * Build a {@link ResponseSkeleton} for the *second* planner pass: the
 * `parameters` object of a specific chosen action. The engine uses this once it
 * has sampled the `action` value. `properties` whose value is a single-element
 * string enum collapse to literal spans; everything else is `free-json` /
 * `free-string`.
 *
 * Exposed for completeness — the engine may instead just hand the JSON schema
 * to its own grammar compiler. We keep it here so the contract is in one place.
 */
export declare function buildPlannerParamsSkeleton(action: Pick<Action, "name" | "parameters" | "allowAdditionalParameters">): ResponseSkeleton;
export type { JsonSchema };
export { normalizeActionJsonSchema };
//# sourceMappingURL=response-grammar.d.ts.map