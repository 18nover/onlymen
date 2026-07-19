/**
 * Canonical `SchemaTable` for the per-agent cache table — composite PK on
 * (key, agent_id), cascade-deleted with its owning agent. One of the descriptors
 * assembled by `buildBaseTables` (schemas/index.ts).
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the cache table.
 * Has a composite primary key on (key, agent_id).
 */
export declare const cacheSchema: SchemaTable;
//# sourceMappingURL=cache.d.ts.map