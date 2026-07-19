/**
 * Registration slot and typed contract for the message-history compaction hook
 * a plugin attaches to the runtime. The hook rewrites conversation history
 * inside `State` before a response/continuation stage renders and reports what
 * it did through the telemetry shape defined here; register/get store it on the
 * runtime under a well-known symbol.
 */
import type { Memory } from "../types/memory.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { State } from "../types/state.js";
export declare const MESSAGE_HISTORY_COMPACTION_HOOK: unique symbol;
export interface MessageHistoryCompactionTelemetry {
    source: "message-history";
    didCompact: boolean;
    strategy: string | null;
    thresholdTokens: number;
    targetTokens: number;
    originalTokens: number;
    compactedTokens: number;
    originalMessageCount: number;
    compactedMessageCount: number;
    preserveTailMessages: number;
    latencyMs: number;
    skipReason?: string;
    replacementMessageCount?: number;
    conversationKey?: string;
}
export interface MessageHistoryCompactionHookArgs {
    runtime: IAgentRuntime;
    message: Memory;
    state: State;
    source: "compose-response-state" | "provider-grounded-state" | "continuation-state";
}
export interface MessageHistoryCompactionHookResult {
    state: State;
    telemetry?: MessageHistoryCompactionTelemetry;
}
export type MessageHistoryCompactionHook = (args: MessageHistoryCompactionHookArgs) => Promise<MessageHistoryCompactionHookResult | null | undefined>;
export type RuntimeWithMessageHistoryCompactionHook = IAgentRuntime & {
    [MESSAGE_HISTORY_COMPACTION_HOOK]?: MessageHistoryCompactionHook;
};
export declare function registerMessageHistoryCompactionHook(runtime: IAgentRuntime, hook: MessageHistoryCompactionHook | null): void;
export declare function getMessageHistoryCompactionHook(runtime: IAgentRuntime): MessageHistoryCompactionHook | null;
//# sourceMappingURL=conversation-compaction-hook.d.ts.map