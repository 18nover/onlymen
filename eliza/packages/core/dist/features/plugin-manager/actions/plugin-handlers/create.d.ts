import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { Memory } from "../../../../types/memory.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export declare const PLUGIN_CREATE_INTENT_TAG = "plugin-create-intent";
export interface PluginCreateInput {
    runtime: IAgentRuntime;
    message: Memory;
    options?: Record<string, unknown>;
    callback?: HandlerCallback;
    intent?: string;
    choice?: string;
    editTarget?: string;
    repoRoot: string;
}
interface PluginChoice {
    key: string;
    label: string;
    pluginName?: string;
    pluginPath?: string;
}
export interface PluginCreateIntentMetadata {
    roomId: string;
    intent: string;
    choices: PluginChoice[];
    intentCreatedAt: string;
    [key: string]: object | string | number | boolean | null | undefined;
}
export declare function isPluginCreateChoiceReply(text: string): boolean;
export declare function runCreate({ runtime, message, options, callback, intent: explicitIntent, choice: explicitChoice, editTarget, repoRoot, }: PluginCreateInput): Promise<ActionResult>;
export declare function hasPendingPluginCreateIntent(runtime: IAgentRuntime, roomId: string): Promise<boolean>;
export {};
//# sourceMappingURL=create.d.ts.map