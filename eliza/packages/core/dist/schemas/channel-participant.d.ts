/**
 * Canonical `SchemaTable` for the channel_participants join table linking
 * channels to entities (composite PK, plus a reverse index on entity_id).
 * Assembled by `buildBaseTables` (schemas/index.ts).
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the channel_participants table.
 * Composite primary key on (channel_id, entity_id).
 */
export declare const channelParticipantSchema: SchemaTable;
//# sourceMappingURL=channel-participant.d.ts.map