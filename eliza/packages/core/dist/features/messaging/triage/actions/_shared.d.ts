/**
 * Shared parameter parsers for triage actions.
 *
 * Agents pass parameters via HandlerOptions.parameters (structured) or may
 * leave them unset, in which case the action falls back to a minimal
 * default. We validate presence + shape here and emit strong-typed inputs
 * so the handlers themselves stay flat.
 */
import type { ActionParameter, AgentContext, HandlerOptions, Memory, State } from "../../../../types/index.js";
import { type ManageOperation, type MessageSource, type SearchMessagesFilters } from "../types.js";
export declare const MESSAGE_ACTION_CONTEXTS: ("messaging" | "email" | "contacts")[];
export declare function validateMessageAction(message: Memory, state: State | undefined, contexts?: readonly AgentContext[]): boolean;
export declare const messageSourceParameter: ActionParameter;
export declare const messageIdParameter: ActionParameter;
export declare const draftIdParameter: ActionParameter;
export declare const bodyParameter: ActionParameter;
export declare const limitParameter: ActionParameter;
export declare const sinceMsParameter: ActionParameter;
export interface MessageLookupHints {
    sources?: MessageSource[];
    sender?: SearchMessagesFilters["sender"];
    content?: string;
}
export interface TriageParams {
    sources?: MessageSource[];
    worldIds?: string[];
    channelIds?: string[];
    sinceMs?: number;
    limit?: number;
}
export declare function parseTriageParams(options: HandlerOptions | undefined): TriageParams;
export interface ListInboxParams {
    sources?: MessageSource[];
    worldIds?: string[];
    channelIds?: string[];
    limit?: number;
    sinceMs?: number;
}
export declare function parseListInboxParams(options: HandlerOptions | undefined): ListInboxParams;
export interface DraftReplyParams {
    messageId?: string;
    body: string;
    lookup: MessageLookupHints;
}
export declare function parseDraftReplyParams(options: HandlerOptions | undefined): DraftReplyParams | {
    error: string;
};
export interface DraftFollowupParams {
    source: MessageSource;
    to: Array<{
        identifier: string;
        displayName?: string;
    }>;
    body: string;
    subject?: string;
    threadId?: string;
    worldId?: string;
    channelId?: string;
}
export declare function parseDraftFollowupParams(options: HandlerOptions | undefined): DraftFollowupParams | {
    error: string;
};
export interface SendDraftParams {
    draftId: string;
    confirmed: boolean;
}
export declare function parseSendDraftParams(options: HandlerOptions | undefined): SendDraftParams | {
    error: string;
};
export declare function parseSearchMessagesParams(options: HandlerOptions | undefined): SearchMessagesFilters;
export interface ManageMessageParams {
    messageId?: string;
    source?: MessageSource;
    operation: ManageOperation;
    lookup: MessageLookupHints;
}
export declare function parseManageMessageParams(options: HandlerOptions | undefined): ManageMessageParams | {
    error: string;
};
export interface ScheduleDraftSendParams {
    draftId: string;
    sendAtMs: number;
}
export declare function parseScheduleDraftSendParams(options: HandlerOptions | undefined): ScheduleDraftSendParams | {
    error: string;
};
export interface RespondToMessageParams {
    messageId?: string;
    body?: string;
    lookup: MessageLookupHints;
}
export declare function parseRespondToMessageParams(options: HandlerOptions | undefined): RespondToMessageParams | {
    error: string;
};
//# sourceMappingURL=_shared.d.ts.map