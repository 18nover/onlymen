/**
 * Base class for MessageAdapters. Concrete adapters own:
 *  - availability detection (is the underlying plugin registered?)
 *  - capability declaration (what verbs the connector actually supports)
 *  - list/fetch mapping from platform payload to MessageRef
 *  - draft lifecycle (createDraft + sendDraft) and optional schedule/manage/search
 *
 * Adapters without an available underlying plugin report isAvailable=false
 * and return an empty list from listMessages. sendDraft throws
 * NotYetImplementedError because silent success would violate the connector
 * contract.
 */
import type { IAgentRuntime } from "../../../../types/index.js";
import { type DraftRequest, type ListOptions, type ManageOperation, type ManageResult, type MessageAdapter, type MessageAdapterCapabilities, type MessageRef, type MessageSource, type SearchMessagesFilters } from "../types.js";
export declare abstract class BaseMessageAdapter implements MessageAdapter {
    abstract readonly source: MessageSource;
    private unavailableLogged;
    abstract isAvailable(runtime: IAgentRuntime): boolean;
    /**
     * Default capability profile: an unavailable base adapter advertises
     * nothing. Concrete adapters override to declare what their underlying
     * connector supports.
     */
    capabilities(): MessageAdapterCapabilities;
    protected logUnavailableOnce(): void;
    listMessages(runtime: IAgentRuntime, opts: ListOptions): Promise<MessageRef[]>;
    getMessage(runtime: IAgentRuntime, id: string): Promise<MessageRef | null>;
    searchMessages(runtime: IAgentRuntime, filters: SearchMessagesFilters): Promise<MessageRef[]>;
    manageMessage(runtime: IAgentRuntime, messageId: string, op: ManageOperation): Promise<ManageResult>;
    createDraft(runtime: IAgentRuntime, draft: DraftRequest): Promise<{
        draftId: string;
        preview: string;
    }>;
    sendDraft(runtime: IAgentRuntime, draftId: string): Promise<{
        externalId: string;
    }>;
    scheduleSend(runtime: IAgentRuntime, draftId: string, sendAtMs: number): Promise<{
        scheduledId: string;
    }>;
    protected listMessagesImpl(_runtime: IAgentRuntime, _opts: ListOptions): Promise<MessageRef[]>;
    protected getMessageImpl(_runtime: IAgentRuntime, _id: string): Promise<MessageRef | null>;
    protected searchMessagesImpl(_runtime: IAgentRuntime, _filters: SearchMessagesFilters): Promise<MessageRef[]>;
    protected manageMessageImpl(_runtime: IAgentRuntime, _messageId: string, _op: ManageOperation): Promise<ManageResult>;
    protected createDraftImpl(_runtime: IAgentRuntime, _draft: DraftRequest): Promise<{
        draftId: string;
        preview: string;
    }>;
    protected sendDraftImpl(_runtime: IAgentRuntime, _draftId: string): Promise<{
        externalId: string;
    }>;
    protected scheduleSendImpl(_runtime: IAgentRuntime, _draftId: string, _sendAtMs: number): Promise<{
        scheduledId: string;
    }>;
}
/**
 * Pure in-memory filter shared by adapters that lack native search and by
 * the cross-connector MESSAGE action when it merges results.
 */
export declare function filterInMemory(messages: MessageRef[], filters: SearchMessagesFilters): MessageRef[];
//# sourceMappingURL=base.d.ts.map