import type { EvaluatorEffects, EvaluatorOutput, EvaluatorRoute, RunEvaluatorParams } from "./planner-types.js";
export type { EvaluatorEffects, EvaluatorOutput, EvaluatorRoute, EvaluatorRuntime, RunEvaluatorParams, } from "./planner-types.js";
export declare function runEvaluator(params: RunEvaluatorParams): Promise<EvaluatorOutput>;
export declare function parseEvaluatorOutput(raw: string | {
    text?: string;
    object?: unknown;
}): EvaluatorOutput;
export declare function applyEvaluatorEffects(output: EvaluatorOutput, effects?: EvaluatorEffects): Promise<void>;
export declare function normalizeEvaluatorRoute(route: unknown): EvaluatorRoute;
//# sourceMappingURL=evaluator.d.ts.map