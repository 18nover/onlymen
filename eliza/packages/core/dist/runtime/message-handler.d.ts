/**
 * Stage 1 of the message loop: parses the response-handler model output (the
 * canonical JSON envelope or a plain-text keyed transcript) into a
 * `MessageHandlerResult`, then routes the turn — direct reply, ignore/stop, or
 * hand off to the planner — based on the selected contexts and tool hints.
 */
import type { MessageHandlerResult } from "../types/components.js";
import type { AgentContext } from "../types/contexts.js";
export type V5MessageHandlerOutput = MessageHandlerResult;
export type MessageHandlerRoute = {
    type: "ignored" | "stopped";
    output: V5MessageHandlerOutput;
} | {
    type: "final_reply";
    reply: string;
    output: V5MessageHandlerOutput;
} | {
    type: "planning_needed";
    output: V5MessageHandlerOutput;
    contexts: AgentContext[];
};
/**
 * Identifier used by the messageHandler to mark a direct reply that needs no
 * tools or context providers. When `contexts` is exactly `[SIMPLE_CONTEXT_ID]`
 * (or empty) the runtime takes the shortcut and emits `replyText` without
 * invoking the planner.
 */
export declare const SIMPLE_CONTEXT_ID = "simple";
/**
 * Parse a HANDLE_RESPONSE payload into the internal {@link MessageHandlerResult}.
 *
 * Expects the canonical response-handler field-registry envelope:
 * `{ shouldRespond, contexts, intents, replyText, candidateActionNames, facts,
 * relationships, addressedTo, emotion }`. The internal result carries the
 * `plan` sub-object to match the downstream runtime contract.
 */
export declare function parseMessageHandlerOutput(raw: string): V5MessageHandlerOutput | null;
export declare function routeMessageHandlerOutput(output: V5MessageHandlerOutput, options?: {
    suppressToolPromotion?: boolean;
}): MessageHandlerRoute;
export declare function getMessageHandlerReply(output: V5MessageHandlerOutput): string;
//# sourceMappingURL=message-handler.d.ts.map