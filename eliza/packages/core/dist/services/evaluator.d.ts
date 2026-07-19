import type { EvaluatorRunOptions, EvaluatorRunResult, IAgentRuntime, Memory, RegisteredEvaluator, Service, State } from "../types/index.js";
import { Service as BaseService } from "../types/service.js";
export declare const EVALUATOR_PROMPT_MAX_CHARS = 120000;
export declare class EvaluatorService extends BaseService {
    static serviceType: "evaluator";
    capabilityDescription: string;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    list(): RegisteredEvaluator[];
    register(evaluator: RegisteredEvaluator): void;
    unregister(name: string): boolean;
    private sortEvaluators;
    private collectActiveEvaluators;
    private composeEvaluatorState;
    private collectPreparedEntries;
    private emitEvaluatorCompleted;
    private readEvaluatorOutput;
    private processPreparedEntries;
    private runEntryProcessors;
    private skippedResult;
    private failedResult;
    run(message: Memory, state?: State, options?: EvaluatorRunOptions): Promise<EvaluatorRunResult>;
}
export declare function runPostTurnEvaluators(runtime: IAgentRuntime, message: Memory, state?: State, options?: EvaluatorRunOptions): Promise<EvaluatorRunResult | null>;
//# sourceMappingURL=evaluator.d.ts.map