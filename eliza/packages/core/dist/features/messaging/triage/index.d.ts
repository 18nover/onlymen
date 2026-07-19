/**
 * Barrel for the messaging-triage capability: re-exports the individual triage
 * actions, the message adapters, the message-ref/send-policy/triage-engine/
 * triage-service singletons and their types, and `messagingTriageActions` — the
 * action list the runtime registers, which is the unified `messageAction` from
 * advanced-capabilities.
 */
export { draftFollowupAction } from "./actions/draftFollowup.js";
export { draftReplyAction } from "./actions/draftReply.js";
export { listInboxAction } from "./actions/listInbox.js";
export { manageMessageAction } from "./actions/manageMessage.js";
export { respondToMessageAction } from "./actions/respondToMessage.js";
export { scheduleDraftSendAction } from "./actions/scheduleDraftSend.js";
export { searchMessagesAction } from "./actions/searchMessages.js";
export { sendDraftAction } from "./actions/sendDraft.js";
export { triageMessagesAction } from "./actions/triageMessages.js";
export { BaseMessageAdapter, filterInMemory } from "./adapters/base.js";
export { __resetDefaultMessageRefStoreForTests, getDefaultMessageRefStore, MessageRefStore, } from "./message-ref-store.js";
export type { SendPolicy } from "./send-policy.js";
export { __resetSendPolicyForTests, getSendPolicy, registerSendPolicy, } from "./send-policy.js";
export type { ScoreContext } from "./triage-engine.js";
export { DEFAULT_CONTACT_WEIGHT, rankScored, resetMissingServiceWarning, resolveContactWeight, scoreMessage, scoreMessages, } from "./triage-engine.js";
export type { TriageOptions } from "./triage-service.js";
export { __resetDefaultTriageServiceForTests, getDefaultTriageService, TriageService, } from "./triage-service.js";
export * from "./types.js";
import type { Action } from "../../../types/index.js";
export declare const messagingTriageActions: readonly Action[];
//# sourceMappingURL=index.d.ts.map