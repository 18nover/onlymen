/**
 * ResponseHandlerFieldRegistry — owns the registered set of field evaluators
 * and provides the composition primitives (schema, prompt, dispatch) used by
 * the Stage-1 response handler.
 *
 * See ./response-handler-field-evaluator.ts for the contract.
 */
import type { Memory } from "../types/memory.js";
import type { JSONSchema } from "../types/model.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { State } from "../types/state.js";
import type { ResponseHandlerFieldContext, ResponseHandlerFieldEvaluator, ResponseHandlerFieldRunResult, ResponseHandlerSenderRole } from "./response-handler-field-evaluator.js";
/**
 * Stable registration. The registry de-dupes by `name` (first-wins, matches
 * runtime.registerAction). Throws when a registration would violate strict-
 * schema rules.
 */
export declare class ResponseHandlerFieldRegistry {
    private evaluators;
    private cachedSchema;
    private cachedSchemaSignature;
    register(evaluator: ResponseHandlerFieldEvaluator): void;
    unregister(name: string): boolean;
    list(options?: ResponseHandlerFieldSelectionOptions): ReadonlyArray<ResponseHandlerFieldEvaluator>;
    size(): number;
    /**
     * Build the composed HANDLE_RESPONSE schema. Cached across calls; the
     * cache invalidates only when registrations change. The schema is the
     * same bytes every turn, which is what keeps Anthropic / OpenAI prompt
     * caches warm.
     *
     * All fields are REQUIRED (per the user directive). The LLM emits the
     * declared empty value for fields that don't apply this turn.
     *
     * Canonical-source note: this is the schema the Stage-1 LLM actually
     * receives in production — `services/message.ts` passes it to
     * `createHandleResponseTool({ parameters: ... })`, and `buildResponseGrammar`
     * (`./response-grammar.ts`) composes the GBNF skeleton from the same
     * registered field set. The static `HANDLE_RESPONSE_SCHEMA` in
     * `../actions/to-tool.ts` mirrors the builtin shape for older callers that
     * build the tool without passing an explicit registry-composed schema.
     */
    composeSchema(options?: ResponseHandlerFieldSelectionOptions): JSONSchema;
    /**
     * Hash-like signature of the composed schema. Used by the cache plan to
     * detect "schema changed → invalidate prompt cache" situations. Stable
     * across boots as long as the registered set is the same.
     */
    composeSchemaSignature(options?: ResponseHandlerFieldSelectionOptions): string;
    /**
     * Compose the per-turn system-prompt slices. Each active evaluator
     * contributes its `description` verbatim — or its `descriptionCompressed`
     * when the caller asks for the `compact` variant (compact Stage-1 tiers;
     * schema composition is unaffected). The composition is one big
     * markdown block of `### {name}\n{description}` sections in priority
     * order — matching how the post-turn EvaluatorService composes its prompt
     * at services/evaluator.ts:327-333.
     *
     * Returns both the rendered string and the list of active field names
     * (for the trace).
     */
    composePromptSlices(ctx: ResponseHandlerFieldContext, options?: ResponseHandlerFieldSelectionOptions): Promise<{
        rendered: string;
        activeFieldNames: string[];
        skippedFieldNames: string[];
    }>;
    /**
     * Parse the LLM's structured output and dispatch each field's slice to
     * its handler in priority order. Handlers may preempt downstream
     * processing (abort, ack-and-stop, ignore, direct-reply).
     *
     * Active set is recomputed here (we don't trust the prompt-slice run to
     * tell us — the prompt is rendered into stable cache and may be reused
     * across turns where shouldRun returned different values).
     */
    dispatch(args: {
        rawParsed: Record<string, unknown>;
        runtime: IAgentRuntime;
        message: Memory;
        state: State;
        senderRole: ResponseHandlerSenderRole;
        turnSignal: AbortSignal;
    }): Promise<ResponseHandlerFieldRunResult>;
    private sortedEvaluators;
}
export interface ResponseHandlerFieldSelectionOptions {
    includeFieldNames?: ReadonlySet<string> | readonly string[];
    /**
     * Render `descriptionCompressed` prompt slices when available (compact
     * Stage-1 tiers). Prompt-only: field selection, schema composition, and
     * schema signatures ignore this flag, so the composed HANDLE_RESPONSE
     * schema stays byte-identical across tiers.
     */
    compact?: boolean;
}
//# sourceMappingURL=response-handler-field-registry.d.ts.map