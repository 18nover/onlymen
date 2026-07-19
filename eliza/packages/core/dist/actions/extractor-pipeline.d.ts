/**
 * Shared extraction pipeline for LLM argument/field extractors.
 *
 * Each extractor implements the same call → parse → repair → parse loop with
 * a try/catch fallback. The differences are the prompt, the parser, and the
 * optional repair prompt. This helper owns only that orchestration — callers
 * retain full control of their schema, validators, and prompts.
 */
import type { IAgentRuntime } from "../types/index.js";
import { ModelType } from "../types/index.js";
type ModelTypeValue = (typeof ModelType)[keyof typeof ModelType];
export interface ExtractorPipelineResult<TParsed> {
    /** Parsed value from the first or repaired model call, or null when both failed. */
    parsed: TParsed | null;
    /**
     * Raw model output. When the repair pass ran, this is the repair output;
     * otherwise it is the first call's output.
     */
    raw: string;
    /** True when the repair prompt was issued. */
    repaired: boolean;
}
export interface RunExtractorPipelineArgs<TParsed> {
    runtime: IAgentRuntime;
    prompt: string;
    /**
     * Convert the raw model text into a typed value. Return `null` when the
     * output is unparseable or fails validation; that triggers the repair pass.
     */
    parser: (raw: string) => TParsed | null;
    /**
     * Build the repair prompt from the raw first-pass output. Omit to skip
     * the repair pass entirely.
     */
    buildRepairPrompt?: (rawFirstPass: string) => string;
    /** Defaults to {@link ModelType.TEXT_LARGE}. */
    modelType?: ModelTypeValue;
}
/**
 * Run the canonical extractor pipeline.
 *
 * Order of operations:
 *   1. Call the model with `prompt`.
 *   2. Run `parser` on the result. If it returns non-null, return that.
 *   3. Otherwise, if `buildRepairPrompt` is provided, call the model again
 *      with the repair prompt and run `parser` on that result.
 *   4. On any thrown error, log a warning and return `{parsed:null,...}`.
 *
 * Returns `{parsed:null, raw:"", repaired:false}` (with no model call) when
 * `runtime.useModel` is unavailable.
 */
export declare function runExtractorPipeline<TParsed>(args: RunExtractorPipelineArgs<TParsed>): Promise<ExtractorPipelineResult<TParsed>>;
export {};
//# sourceMappingURL=extractor-pipeline.d.ts.map