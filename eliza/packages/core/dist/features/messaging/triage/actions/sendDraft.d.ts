import type { Action, HandlerOptions, IAgentRuntime, Memory } from "../../../../types/index.js";
export declare function outboundDraftOptionsFromMessage(runtime: IAgentRuntime, message: Memory, options: HandlerOptions | undefined): Promise<HandlerOptions | undefined>;
/**
 * SAFETY INVARIANT: MESSAGE must never send without an explicit
 * `confirmed: true` parameter. When confirmation is missing the handler
 * returns the preview and asks the user to confirm.
 */
export declare const sendDraftAction: Action;
//# sourceMappingURL=sendDraft.d.ts.map