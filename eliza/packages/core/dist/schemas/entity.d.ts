/**
 * Table descriptor for `entities` — the per-agent record of the people and
 * things an agent knows, keyed uniquely by (id, agent_id). Portable
 * `SchemaTable` shape assembled by `buildBaseTables` and materialized by the
 * plugin-sql / localdb adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the entities table.
 * Has a unique constraint on (id, agent_id).
 */
export declare const entitySchema: SchemaTable;
//# sourceMappingURL=entity.d.ts.map