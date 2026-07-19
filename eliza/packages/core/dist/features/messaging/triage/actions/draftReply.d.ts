/**
 * Triage action that composes a draft reply to an existing message. Registered
 * under the shared `MESSAGE` action name; resolves the target from an explicit
 * `messageId` or, failing that, by searching the TriageService for the best
 * match to sender/content lookup hints (`resolveTargetMessageId`), then
 * delegates to `draftReply` to build a preview. Never sends — sending is a
 * separate, confirmed step. ADMIN-gated.
 */
import type { Action } from "../../../../types/index.js";
export declare const draftReplyAction: Action;
//# sourceMappingURL=draftReply.d.ts.map