import type { Action } from "../../../../types/index.js";
/**
 * One-shot reply: drafts a reply, then either sends immediately or hands off
 * to the registered SendPolicy for owner approval. Equivalent to MESSAGE
 * followed by MESSAGE, collapsed into a single agent step.
 */
export declare const respondToMessageAction: Action;
//# sourceMappingURL=respondToMessage.d.ts.map