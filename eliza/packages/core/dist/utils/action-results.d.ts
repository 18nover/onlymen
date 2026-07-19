/**
 * Bounds how much of a (potentially huge) action/tool result reaches prompt
 * state. Estimates token cost from character length, truncates the text and
 * error fields in the middle while preserving head and tail, and surfaces a
 * filesystem reference (e.g. `fullOutputPath`) to the complete output when one
 * is present in the result data. `collectActionResultSizeWarnings` flags fields
 * over a token threshold, and `formatActionResultsForPrompt` renders the most
 * recent results (capped at `MAX_PROMPTED_ACTION_RESULTS`) into the prompt block.
 */
import type { ActionResult } from "../types/components.js";
export declare const MAX_PROMPTED_ACTION_RESULTS = 8;
export declare const MAX_ACTION_RESULT_TEXT_CHARS = 4000;
export declare const MAX_ACTION_RESULT_ERROR_CHARS = 2000;
export declare const ACTION_RESULT_OVERSIZE_WARNING_TOKENS = 10000;
export declare const ACTION_RESULT_TOKEN_ESTIMATE_CHARS = 4;
export declare const ACTION_RESULT_FULL_OUTPUT_REFERENCE_KEYS: Set<string>;
export declare const ACTION_RESULT_FULL_ERROR_REFERENCE_KEYS: Set<string>;
export type ActionResultTextField = "text" | "error";
export interface ActionResultSizeWarning {
    actionName: string;
    field: ActionResultTextField;
    rawCharLength: number;
    estimatedTokens: number;
    thresholdTokens: number;
}
export interface ActionResultReferences {
    text?: string;
    error?: string;
}
export declare function estimateActionResultTokens(text: string): number;
export declare function getActionResultActionName(result: ActionResult): string;
export declare function stringifyActionResultError(error: ActionResult["error"]): string | undefined;
export declare function getActionResultReference(result: ActionResult, field: ActionResultTextField): string | undefined;
export declare function truncateMiddle(text: string, maxChars: number, reference?: string): string;
export declare function collectActionResultSizeWarnings(result: ActionResult, thresholdTokens?: number): ActionResultSizeWarning[];
export declare function trimActionResultForPromptState<T extends ActionResult>(result: T, references?: ActionResultReferences): T;
export declare function formatActionResultsForPrompt(actionResults: ActionResult[], options?: {
    header?: string;
    maxResults?: number;
    preserveAbsoluteIndex?: boolean;
}): string;
//# sourceMappingURL=action-results.d.ts.map