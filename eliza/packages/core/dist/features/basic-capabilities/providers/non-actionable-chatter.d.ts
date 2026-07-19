/**
 * Text heuristic for one-off relationship follow-up reminders. The ACTIONS
 * provider uses this to keep follow-up-capable actions visible when a user gives
 * an informal reminder-like instruction without scheduling language broad
 * enough to warrant the whole catalog. Matching runs over normalized user text.
 */
import type { Memory } from "../../../types/index.js";
export declare function normalizeMessageText(message: Memory): string;
export declare function looksLikeRelationshipFollowUpReminder(message: Memory): boolean;
//# sourceMappingURL=non-actionable-chatter.d.ts.map