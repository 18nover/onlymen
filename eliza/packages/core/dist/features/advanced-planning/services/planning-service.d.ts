import { type ActionParameters, type ActionResult, type Content, type HandlerCallback, type IAgentRuntime, type Memory, Service, type State, type UUID } from "../../../types/index.js";
import type { JsonValue, PlanningContext, RetryPolicy } from "../types.js";
interface ActionStep {
    id?: UUID;
    actionName?: string;
    status?: "pending" | "completed" | "failed";
    error?: string;
    result?: ActionResult;
    parameters?: ActionParameters;
    dependencies?: UUID[];
    retryPolicy?: RetryPolicy;
    onError?: "abort" | "continue" | "skip";
    _dependencyStrings?: string[];
}
interface PlanState {
    status: "pending" | "running" | "completed" | "failed" | "cancelled";
    currentStepIndex?: number;
    startTime?: number;
    endTime?: number;
    error?: string;
}
interface ActionPlan {
    id?: UUID;
    goal?: string;
    thought: string;
    totalSteps: number;
    currentStep: number;
    steps: ActionStep[];
    executionModel?: "sequential" | "parallel" | "dag";
    state?: PlanState;
    metadata?: Record<string, JsonValue>;
}
interface PlanExecutionResult {
    planId: UUID;
    success: boolean;
    completedSteps: number;
    totalSteps: number;
    results: ActionResult[];
    errors?: Error[];
    duration?: number;
}
export declare class PlanningService extends Service {
    static serviceType: string;
    serviceType: string;
    capabilityDescription: string;
    private planExecutions;
    static start(runtime: IAgentRuntime): Promise<PlanningService>;
    createSimplePlan(_runtime: IAgentRuntime, message: Memory, _state: State, responseContent?: Content): Promise<ActionPlan | null>;
    createComprehensivePlan(runtime: IAgentRuntime, context: PlanningContext, message?: Memory, state?: State): Promise<ActionPlan>;
    executePlan(runtime: IAgentRuntime, plan: ActionPlan, message: Memory, callback?: HandlerCallback): Promise<PlanExecutionResult>;
    validatePlan(runtime: IAgentRuntime, plan: ActionPlan): Promise<{
        valid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    adaptPlan(runtime: IAgentRuntime, plan: ActionPlan, currentStepIndex: number, results: ActionResult[], error?: Error): Promise<ActionPlan>;
    getPlanStatus(planId: UUID): Promise<PlanState | null>;
    cancelPlan(planId: UUID): Promise<boolean>;
    stop(): Promise<void>;
    private buildPlanningPrompt;
    private parsePlanningResponse;
    private enhancePlan;
    private executeSequential;
    private executeParallel;
    private executeDAG;
    private executeStep;
    private detectCycles;
    private buildActionLookup;
    private buildDagExecutionOrder;
    private pushReadyStep;
    private popReadyStep;
    private buildAdaptationPrompt;
    private parseAdaptationResponse;
}
export {};
//# sourceMappingURL=planning-service.d.ts.map