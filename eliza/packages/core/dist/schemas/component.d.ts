/**
 * Canonical `SchemaTable` for the components table — typed data records attached
 * to an entity within an agent/room/world, keyed by a natural
 * (entity_id, type, world_id, source_entity_id) tuple for idempotent upserts.
 * Assembled by `buildBaseTables` (schemas/index.ts).
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the components table.
 * Has multiple foreign keys to entities, agents, rooms, worlds.
 */
export declare const componentSchema: SchemaTable;
//# sourceMappingURL=component.d.ts.map