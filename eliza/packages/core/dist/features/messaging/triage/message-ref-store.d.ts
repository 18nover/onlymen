/**
 * In-memory store for MessageRefs and drafts, keyed by deterministic IDs.
 *
 * This is intentionally process-local: adapters fetch from their underlying
 * plugins, but the triage actions need a stable handle to refer to messages
 * and drafts across subsequent agent turns. Long-term persistence is owned
 * by each adapter's underlying plugin.
 */
import type { DraftRecord, MessageRef, MessageSource } from "./types.js";
export declare class MessageRefStore {
    private messages;
    private drafts;
    saveMessage(ref: MessageRef): void;
    saveMessages(refs: readonly MessageRef[]): void;
    getMessage(id: string): MessageRef | null;
    findByExternalId(source: MessageSource, externalId: string): MessageRef | null;
    addTag(messageId: string, tag: string): MessageRef | null;
    removeTag(messageId: string, tag: string): MessageRef | null;
    saveDraft(record: DraftRecord): void;
    getDraft(draftId: string): DraftRecord | null;
    markDraftSent(draftId: string, externalId: string): DraftRecord | null;
    markDraftScheduled(draftId: string, sendAtMs: number, scheduledId: string): DraftRecord | null;
    listMessages(): MessageRef[];
    clear(): void;
}
export declare function getDefaultMessageRefStore(): MessageRefStore;
export declare function __resetDefaultMessageRefStoreForTests(): void;
//# sourceMappingURL=message-ref-store.d.ts.map