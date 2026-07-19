import type { Action, ActionParameter, ActionParameters } from "./types/index.js";
export { type ExtractorPipelineResult, type RunExtractorPipelineArgs, runExtractorPipeline, } from "./actions/extractor-pipeline.js";
export { parseJsonModelArray, parseJsonModelOutput, parseJsonModelRecord, } from "./actions/json-model-output.js";
export { isPromotedSubactionVirtual, listSubactionsFromParameters, type PromoteSubactionsOptions, promoteSubactionsToActions, type SubactionPromotionOverrides, } from "./actions/promote-subactions.js";
export { recentConversationTexts, recentConversationTextsFromState, } from "./actions/recent-context.js";
export { type ResolveActionArgsInput, type ResolveActionArgsResult, resolveActionArgs, type SubactionSpec, type SubactionsMap, } from "./actions/resolve-action-args.js";
export { CANONICAL_SUBACTION_KEY, DEFAULT_SUBACTION_KEYS, dispatchSubaction, normalizeSubaction, readSubaction, type SubactionHandler, type SubactionHandlerMap, type SubactionParameters, } from "./actions/subaction-dispatch.js";
export declare const composeActionExamples: (actionsData: Action[], count: number, seed?: string) => string;
/** Render canonical JSON action-call examples. */
export declare function composeActionCallExamples(actionsData: Action[], maxExamples: number): string;
export declare function formatActionNames(actions: Action[], seed?: string): string;
export declare function formatActions(actions: Action[], seed?: string): string;
export declare function formatActionParameters(parameters: ActionParameter[]): string;
export declare function parseActionParams(paramsInput: unknown): Map<string, ActionParameters>;
export declare function validateActionParams(action: Action, extractedParams: ActionParameters | undefined): {
    valid: boolean;
    params: ActionParameters | undefined;
    errors: string[];
};
//# sourceMappingURL=actions.d.ts.map