/**
 * MESSAGE — single polymorphic action surface for the messaging domain, and the
 * only messaging action the runtime registers (there are no per-op leaf
 * actions).
 *
 * Dispatches on a switch over MESSAGE_OPS. Connector-backed ops (read_channel,
 * search, list_channels, list_servers, react, edit, delete, pin, join, leave,
 * get_user) call MessageConnector hooks directly. read_with_contact resolves a
 * person via the relationships graph and views their conversations across every
 * connected platform. Triage / inbox / draft ops delegate to the triage actions
 * in features/messaging/triage.
 */
import type { Action, ActionParameter } from "../../../types/index.js";
export declare const MESSAGE_OPS: readonly ["send", "read_channel", "read_with_contact", "search", "list_channels", "list_servers", "list_connections", "join", "leave", "react", "edit", "delete", "pin", "get_user", "triage", "list_inbox", "search_inbox", "draft_reply", "draft_followup", "respond", "send_draft", "schedule_draft_send", "manage"];
export type MessageOperation = (typeof MESSAGE_OPS)[number];
type ParamRecord = Record<string, unknown>;
export declare function inferOp(params: ParamRecord): MessageOperation;
export declare const MESSAGE_PARAMETERS: ActionParameter[];
export declare const messageAction: Action;
export default messageAction;
//# sourceMappingURL=message.d.ts.map