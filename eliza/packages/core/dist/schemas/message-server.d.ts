/**
 * Table descriptor for `message_servers` — the top-level container that a set of
 * rooms and messages belongs to, identified by (source_type, source_id) for
 * find-or-create. Portable `SchemaTable` shape assembled by `buildBaseTables`
 * and materialized by the plugin-sql / localdb adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the message_servers table.
 */
export declare const messageServerSchema: SchemaTable;
//# sourceMappingURL=message-server.d.ts.map