/**
 * Implements the ATTACHMENT action of the working-memory capability: an
 * ADMIN-gated action that reads or persists attachments, link previews, and media
 * already present in the current conversation (it never fetches new URLs — that
 * routes to WEB_FETCH). action=read gathers the readable content and, per the
 * request, answers the user's question via a TEXT_SMALL call, returns an
 * attachment metadata record, or stashes the content into the bounded task
 * clipboard; action=save_as_document writes the content to the DocumentService.
 *
 * Attachment gathering and selection are delegated to attachmentContext.ts,
 * clipboard persistence to taskClipboardPersistence.ts, and document storage to
 * features/documents. readAttachmentActionKind resolves the operation purely from
 * the planner-emitted enum, deliberately doing no natural-language keyword
 * inference so routing stays language-agnostic (#10471).
 */
import { type Action } from "../../types/index.js";
declare const ATTACHMENT_ACTIONS: readonly ["read", "save_as_document"];
type AttachmentAction = (typeof ATTACHMENT_ACTIONS)[number];
export declare function readAttachmentActionKind(params: Record<string, unknown>): AttachmentAction;
export declare const readAttachmentAction: Action;
export default readAttachmentAction;
//# sourceMappingURL=readAttachmentAction.d.ts.map