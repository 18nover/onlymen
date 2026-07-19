/**
 * Nested planner descent for a parent action's declared sub-actions: resolves and
 * gates the child actions (context + role policy, cycle detection), exposes each
 * admissible child as its own native tool alongside the REPLY/IGNORE/STOP
 * terminals, and runs a `runPlannerLoop` pass over them — recording a `subPlanner`
 * trajectory stage so consumers can render the call tree.
 */
import type { Action, ActionResult, IAgentRuntime } from "../types/index.js";
import type { ContextObject } from "../types/context-object.js";
import { type ExecutePlannedToolCallContext, type ExecutePlannedToolCallOptions } from "./execute-planned-tool-call.js";
import { type PlannerLoopParams, type PlannerLoopResult, type PlannerRuntime, type PlannerToolCall } from "./planner-loop.js";
import type { TrajectoryRecorder } from "./trajectory-recorder.js";
export declare function actionHasSubActions(action: Action): boolean;
export declare function resolveSubActions(runtime: Pick<IAgentRuntime, "actions">, action: Action): Action[];
export declare function detectSubActionCycles(actions: readonly Action[]): string[][];
export type SubPlannerExecute = (runtime: IAgentRuntime, ctx: ExecutePlannedToolCallContext, toolCall: PlannerToolCall, options: ExecutePlannedToolCallOptions) => Promise<ActionResult> | ActionResult;
export interface RunSubPlannerParams {
    runtime: IAgentRuntime & PlannerRuntime;
    action: Action;
    context: ContextObject;
    ctx: ExecutePlannedToolCallContext;
    options?: ExecutePlannedToolCallOptions;
    config?: PlannerLoopParams["config"];
    evaluate?: PlannerLoopParams["evaluate"];
    onToolCallEnqueued?: PlannerLoopParams["onToolCallEnqueued"];
    modelType?: PlannerLoopParams["modelType"];
    evaluatorEffects?: PlannerLoopParams["evaluatorEffects"];
    provider?: string;
    execute?: SubPlannerExecute;
    recorder?: TrajectoryRecorder;
    trajectoryId?: string;
    parentStageId?: string;
}
export declare function runSubPlanner(params: RunSubPlannerParams): Promise<PlannerLoopResult>;
//# sourceMappingURL=sub-planner.d.ts.map