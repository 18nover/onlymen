import type { Action, ActionResult } from "../types/components.js";
import { type GenerateTextResult } from "../types/model.js";
import type { ContextObject, PlannerLoopParams, PlannerLoopResult, PlannerToolCall, PlannerToolResult, PlannerTrajectory } from "./planner-types.js";
export { cacheProviderOptions, trajectoryStepsToMessages, } from "./planner-rendering.js";
export declare function __renderRoutingHintsBlockForTests(context: ContextObject): string | null;
export type { ContextObject, EvaluatorEffects, EvaluatorOutput, PlannerLoopParams, PlannerLoopResult, PlannerRuntime, PlannerStep, PlannerToolCall, PlannerToolResult, PlannerTrajectory, } from "./planner-types.js";
export declare function runPlannerLoop(params: PlannerLoopParams): Promise<PlannerLoopResult>;
export declare function parsePlannerOutput(raw: string | GenerateTextResult): {
    thought?: string;
    toolCalls: PlannerToolCall[];
    messageToUser?: string;
    raw: Record<string, unknown>;
};
/**
 * Returns the canonical user-facing text from a trajectory whose
 * `verifiedUserFacing` opt-in is unambiguous: exactly one completed tool step
 * set `verifiedUserFacing: true` with a non-empty `userFacingText`.
 *
 * Failed steps are intentionally ignored unless they are explicit
 * confirmation-required previews. A plan whose first tool errored and whose
 * second tool emitted a verified canonical reply must still echo the verified
 * reply. LifeOps can draft more than once while refining a request; the latest
 * verified preview is the user-complete state even though `success:false`
 * correctly records that nothing was persisted yet.
 *
 * Tools that emit structured data the evaluator could paraphrase
 * incorrectly (paths, ids, counts, numeric metrics) set the flag so the
 * framework echoes their output verbatim instead of trusting the
 * evaluator's rewording.
 */
export declare function singleVerifiedUserFacingToolResultText(trajectory: PlannerTrajectory): string | undefined;
/** Marker the gate stamps onto synthesized EvaluatorOutputs so trajectory
 * dumps and replay tools can identify gated (i.e. evaluator-skipped) decisions
 * cheaply. */
export declare const GATED_EVALUATOR_THOUGHT = "Gated FINISH: queue drained successfully with a clean planner messageToUser; evaluator LLM call skipped.";
export declare function looksLikeSpawnEnvelopeJson(text: string): boolean;
/**
 * Detects a planner/evaluator CONTROL envelope returned in a user-visible
 * channel — `{"decision":"CONTINUE"|"FINISH"|"NEXT_RECOMMENDED", …}` (or
 * `route`) carrying at least one evaluator discriminator
 * (`success`/`thought`/`nextTool`/`recommendedToolCallId`). Narrow by design:
 * a bare `{"decision":"approve"}` from a real reply does not match.
 */
export declare function looksLikeEvaluatorEnvelopeJson(text: string): boolean;
export declare const PROGRESS_ONLY_REPLY_OPENERS_PATTERN = "checking|fetching|gathering|looking (?:up|into)|running|using|spawning|starting|working on|one moment|let me|i(?:'|\u2019)ll|i will";
export declare const PROGRESS_ONLY_ANSWER_REJECT: RegExp;
/**
 * Canonical conversion from {@link ActionResult} to {@link PlannerToolResult}.
 * Both the top-level executor and the sub-planner produce ActionResults from
 * action handlers; the planner queue consumes PlannerToolResults. Keeping the
 * mapping in one place avoids drift between the two paths.
 */
export declare function actionResultToPlannerToolResult(result: ActionResult, options?: {
    summary?: string;
}): PlannerToolResult;
export declare function summarizeActionResultForPlanner(action: Pick<Action, "summarize"> | undefined, result: ActionResult, params?: Record<string, unknown>): string | undefined;
//# sourceMappingURL=planner-loop.d.ts.map