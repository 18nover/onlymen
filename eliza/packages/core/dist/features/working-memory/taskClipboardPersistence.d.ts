/**
 * Bridges the ATTACHMENT action to the task clipboard service of the
 * working-memory capability. Decides whether a message requested clipboard
 * persistence via the addToClipboard/persistToClipboard/saveToClipboard flags,
 * resolves a display title, and stores one item through createTaskClipboardService
 * — returning a discriminated result describing whether persistence was requested
 * and whether it succeeded. Empty content and service errors surface as
 * stored:false with a reason rather than throwing.
 */
import type { IAgentRuntime, Memory } from "../../types/index.js";
import type { AddTaskClipboardItemInput, TaskClipboardItem, TaskClipboardSnapshot } from "./taskClipboardService.js";
type TaskClipboardPersistenceInput = AddTaskClipboardItemInput & {
    fallbackTitle?: string;
};
export type TaskClipboardPersistenceResult = {
    requested: false;
    stored: false;
} | {
    requested: true;
    stored: true;
    replaced: boolean;
    item: TaskClipboardItem;
    snapshot: TaskClipboardSnapshot;
} | {
    requested: true;
    stored: false;
    reason: string;
};
export declare function shouldAddToClipboard(message: Memory): boolean;
export declare function resolveClipboardTitle(message: Memory, fallbackTitle?: string): string | undefined;
export declare function maybeStoreTaskClipboardItem(runtime: IAgentRuntime, message: Memory, input: TaskClipboardPersistenceInput): Promise<TaskClipboardPersistenceResult>;
export {};
//# sourceMappingURL=taskClipboardPersistence.d.ts.map