/**
 * Canonical `SchemaTable` for the channels table — messaging channels scoped to a
 * message_server, with text (not native uuid) ids. Assembled by `buildBaseTables`
 * (schemas/index.ts).
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the channels table.
 * ID is stored as text (not native uuid).
 */
export declare const channelSchema: SchemaTable;
//# sourceMappingURL=channel.d.ts.map