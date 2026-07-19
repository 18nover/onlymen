/**
 * Table descriptor for `memories` — the core store for everything an agent
 * remembers (messages, facts, documents and their fragments), typed by `type`
 * and scoped by agent/room/world. Metadata check constraints enforce the
 * document/fragment shape (fragments must carry documentId + position);
 * embedding vectors live in a separate 1:1 table. Portable `SchemaTable` shape
 * assembled by `buildBaseTables` and materialized by the plugin-sql / localdb
 * adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the memories table.
 * Has expression-based indexes on JSON fields and check constraints for metadata validation.
 */
export declare const memorySchema: SchemaTable;
//# sourceMappingURL=memory.d.ts.map