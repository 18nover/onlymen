import type { IAgentRuntime } from "../../types/index.js";
export type TaskClipboardSourceType = "manual" | "command" | "file" | "attachment" | "image_attachment" | "channel" | "conversation_search" | "entity" | "entity_search" | "action_result";
export interface TaskClipboardItem {
    id: string;
    title: string;
    content: string;
    sourceType: TaskClipboardSourceType;
    sourceId?: string;
    sourceLabel?: string;
    mimeType?: string;
    createdAt: string;
    updatedAt: string;
}
export interface TaskClipboardSnapshot {
    maxItems: number;
    items: TaskClipboardItem[];
}
export interface AddTaskClipboardItemInput {
    title?: string;
    content: string;
    sourceType?: TaskClipboardSourceType;
    sourceId?: string;
    sourceLabel?: string;
    mimeType?: string;
}
interface WorkingMemoryConfig {
    basePath: string;
    maxFileSize?: number;
    allowedExtensions?: string[];
}
export declare const TASK_CLIPBOARD_MAX_ITEMS = 5;
export declare class TaskClipboardService {
    private readonly config;
    constructor(runtime: IAgentRuntime, config?: Partial<WorkingMemoryConfig>);
    private ensureDirectory;
    private getStorePath;
    private readStore;
    private writeStore;
    getSnapshot(entityId?: string): Promise<TaskClipboardSnapshot>;
    listItems(entityId?: string): Promise<TaskClipboardItem[]>;
    getItem(id: string, entityId?: string): Promise<TaskClipboardItem | null>;
    addItem(input: AddTaskClipboardItemInput, entityId?: string): Promise<{
        item: TaskClipboardItem;
        replaced: boolean;
        snapshot: TaskClipboardSnapshot;
    }>;
    removeItem(id: string, entityId?: string): Promise<{
        removed: boolean;
        snapshot: TaskClipboardSnapshot;
    }>;
}
export declare function createTaskClipboardService(runtime: IAgentRuntime, config?: Partial<WorkingMemoryConfig>): TaskClipboardService;
export {};
//# sourceMappingURL=taskClipboardService.d.ts.map