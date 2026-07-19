/**
 * Standardized argument-extraction substrate for umbrella actions.
 *
 * Replaces the per-action hand-rolled `resolveSubactionPlan`-style helpers
 * (one per umbrella action) with a single shared resolver that:
 *   1. Trusts planner-supplied parameters when they are complete.
 *   2. Falls through to a single LLM extraction pass (with one repair shot)
 *      that picks the right subaction and pulls its required params from
 *      free-form intent + recent conversation.
 *
 * Intentionally narrow: this resolver knows about subactions and required
 * params, nothing else. Domain-specific param normalization, post-extraction
 * confirmation flows, and side-effect dispatch stay in the umbrella action.
 */
import type { HandlerOptions, IAgentRuntime, Memory, State } from "../types/index.js";
export interface SubactionSpec<TParams = Record<string, unknown>> {
    /** Full description (per-subaction; surfaced into LLM prompt). */
    description: string;
    /** Caveman compressed: max semantic info per token, drop articles/conjunctions. */
    descriptionCompressed: string;
    /** Required parameter keys; missing any -> triggers extraction. */
    required: ReadonlyArray<keyof TParams & string>;
    /** Optional keys; surfaced to extractor as "may extract if obvious". */
    optional?: ReadonlyArray<keyof TParams & string>;
}
export type SubactionsMap<TSubaction extends string = string> = {
    readonly [K in TSubaction]: SubactionSpec;
};
export interface ResolveActionArgsInput<TSubaction extends string, _TParams> {
    runtime: IAgentRuntime;
    message: Memory;
    state?: State;
    options?: HandlerOptions;
    actionName: string;
    subactions: SubactionsMap<TSubaction>;
    defaultSubaction?: TSubaction;
    intentHint?: string;
}
export type ResolveActionArgsResult<TSubaction extends string, TParams> = {
    ok: true;
    subaction: TSubaction;
    params: TParams;
    missing?: never;
    clarification?: never;
} | {
    ok: false;
    missing: string[];
    clarification: string;
    partial?: Partial<TParams>;
};
/**
 * Resolve the (subaction, params) pair for an umbrella action.
 *
 * Trusts complete planner-supplied parameters when present; otherwise runs
 * a single LLM extraction pass (with one repair retry) over the registered
 * subactions and returns either a fully resolved result or a structured
 * "missing fields + clarification" failure.
 */
export declare function resolveActionArgs<TSubaction extends string, TParams = Record<string, unknown>>(input: ResolveActionArgsInput<TSubaction, TParams>): Promise<ResolveActionArgsResult<TSubaction, TParams>>;
//# sourceMappingURL=resolve-action-args.d.ts.map