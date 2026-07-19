/**
 * Canonical, channel-scoped log of central messages — the shared message-bus
 * store, distinct from per-agent `memories`.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the central_messages table.
 * Has a self-referencing foreign key (in_reply_to_root_message_id).
 */
export declare const messageSchema: SchemaTable;
//# sourceMappingURL=message.d.ts.map