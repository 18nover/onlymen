/**
 * Triage action that mutates a single message or sender — archive, trash, spam,
 * mark read/unread, add/remove a label or tag, mute thread, unsubscribe, or
 * block. Registered under the shared `MESSAGE` action name; resolves the target
 * by explicit `messageId` or by searching sender/content hints, then applies the
 * parsed operation through the TriageService's `manage`. The `unsubscribe`
 * operation first gates on user confirmation (`requireConfirmation`) before it
 * runs. ADMIN-gated.
 */
import type { Action } from "../../../../types/index.js";
export declare const manageMessageAction: Action;
//# sourceMappingURL=manageMessage.d.ts.map