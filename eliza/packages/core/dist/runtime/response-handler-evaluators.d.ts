/**
 * Runs the registered response-handler evaluators over a Stage-1 message-handler
 * result, applying each evaluator's patch to the plan — contexts, candidate
 * actions, parent-action hints, deterministic tool call, reply — in priority
 * order and collecting a per-evaluator trace of what changed.
 */
import type { MessageHandlerAction, MessageHandlerDeterministicToolCall, MessageHandlerResult } from "../types/components.js";
import type { AgentContext, ContextDefinition } from "../types/contexts.js";
import type { Memory } from "../types/memory.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { State } from "../types/state.js";
export interface ResponseHandlerPatch {
    processMessage?: MessageHandlerAction;
    requiresTool?: boolean;
    setContexts?: readonly AgentContext[];
    addContexts?: readonly AgentContext[];
    addCandidateActions?: readonly string[];
    addParentActionHints?: readonly string[];
    addContextSlices?: readonly string[];
    clearCandidateActions?: boolean;
    clearParentActionHints?: boolean;
    deterministicToolCall?: MessageHandlerDeterministicToolCall;
    clearReply?: boolean;
    reply?: string;
    debug?: readonly string[];
}
type ResponseHandlerEvaluatorResult = ResponseHandlerPatch | undefined;
export interface ResponseHandlerEvaluatorContext {
    runtime: IAgentRuntime;
    message: Memory;
    state: State;
    messageHandler: MessageHandlerResult;
    availableContexts: readonly ContextDefinition[];
}
export interface ResponseHandlerEvaluator {
    name: string;
    description?: string;
    priority?: number;
    shouldRun(context: ResponseHandlerEvaluatorContext): boolean | Promise<boolean>;
    evaluate(context: ResponseHandlerEvaluatorContext): ResponseHandlerEvaluatorResult | Promise<ResponseHandlerEvaluatorResult>;
}
export interface ResponseHandlerPatchTrace {
    evaluatorName: string;
    debug: string[];
    changed: string[];
}
export interface ResponseHandlerEvaluationRunResult {
    activeEvaluators: string[];
    appliedPatches: ResponseHandlerPatchTrace[];
    candidateActionsAddedByEvaluators: string[];
    errors: Array<{
        evaluatorName: string;
        error: string;
    }>;
}
export declare function runResponseHandlerEvaluators(args: {
    runtime: IAgentRuntime;
    message: Memory;
    state: State;
    messageHandler: MessageHandlerResult;
    availableContexts: readonly ContextDefinition[];
    evaluators?: readonly ResponseHandlerEvaluator[];
}): Promise<ResponseHandlerEvaluationRunResult>;
export {};
//# sourceMappingURL=response-handler-evaluators.d.ts.map