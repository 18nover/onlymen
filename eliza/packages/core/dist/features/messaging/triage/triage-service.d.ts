/**
 * TriageService — coordinates adapters, scoring, and the draft store.
 *
 * Concrete adapters live in their owning connector plugin and register
 * themselves during plugin init via `service.register(adapter)`. Core owns only
 * the registry + `BaseMessageAdapter`; it never pre-registers connector adapters.
 *
 * Usage (from a connector plugin's init):
 *   getDefaultTriageService().register(new MyConnectorAdapter());
 *   await getDefaultTriageService().triage(runtime, { sources: ["my-source"] });
 */
import type { IAgentRuntime } from "../../../types/index.js";
import { type MessageRefStore } from "./message-ref-store.js";
import { type DraftRecord, type ManageOperation, type ManageResult, type MessageAdapter, type MessageRef, type MessageSource, type SearchMessagesFilters } from "./types.js";
export interface TriageOptions {
    sources?: MessageSource[];
    worldIds?: string[];
    channelIds?: string[];
    sinceMs?: number;
    limit?: number;
    nowMs?: number;
}
export declare class TriageService {
    private readonly store;
    private adapters;
    private adapterByMessageId;
    constructor(store?: MessageRefStore);
    register(adapter: MessageAdapter): void;
    getAdapter(source: MessageSource): MessageAdapter | undefined;
    listRegisteredSources(): MessageSource[];
    listAdapters(): MessageAdapter[];
    getStore(): MessageRefStore;
    private static readonly MAX_ADAPTER_ROUTES;
    private trackAdapterForMessage;
    getAdapterForMessage(messageId: string): MessageAdapter | undefined;
    /**
     * Fetch messages from every requested (and registered) source, score
     * them, persist them in the store, and return the ranked list.
     *
     * Per-source failures are isolated: one broken/unimplemented adapter must
     * not abort the sweep across the other connectors. When failures leave
     * zero results overall, the first error is rethrown so the caller never
     * mistakes a broken sweep for a genuinely empty inbox.
     */
    triage(runtime: IAgentRuntime, opts?: TriageOptions): Promise<MessageRef[]>;
    /**
     * Cross-connector search. Each adapter contributes either via its native
     * searchMessages (capabilities.search === true) or by falling back to
     * listMessages + in-memory filter.
     */
    search(runtime: IAgentRuntime, filters: SearchMessagesFilters): Promise<MessageRef[]>;
    manage(runtime: IAgentRuntime, messageId: string, op: ManageOperation, hint?: {
        source?: MessageSource;
    }): Promise<ManageResult>;
    draftReply(runtime: IAgentRuntime, inReplyToId: string, body: string): Promise<DraftRecord>;
    draftFollowup(runtime: IAgentRuntime, params: {
        source: MessageSource;
        to: Array<{
            identifier: string;
            displayName?: string;
        }>;
        subject?: string;
        body: string;
        threadId?: string;
        worldId?: string;
        channelId?: string;
    }): Promise<DraftRecord>;
    sendDraft(runtime: IAgentRuntime, draftId: string): Promise<DraftRecord>;
    scheduleDraftSend(runtime: IAgentRuntime, draftId: string, sendAtMs: number): Promise<DraftRecord>;
}
export declare function getDefaultTriageService(): TriageService;
export declare function __resetDefaultTriageServiceForTests(): void;
//# sourceMappingURL=triage-service.d.ts.map