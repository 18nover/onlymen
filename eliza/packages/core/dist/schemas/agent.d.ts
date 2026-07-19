/**
 * Canonical `SchemaTable` for the agents table — the root of the data model that
 * many core tables foreign-key back to via `agent_id`. Assembled into concrete
 * ORM tables by `buildBaseTables` (schemas/index.ts).
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the agents table.
 * Contains agent/character configuration and metadata.
 */
export declare const agentSchema: SchemaTable;
//# sourceMappingURL=agent.d.ts.map