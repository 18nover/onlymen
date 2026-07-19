/**
 * Directed, agent-scoped edges between two entities — the relationship graph
 * the relationships service reads and writes.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the relationships table.
 * Has unique constraint on (source_entity_id, target_entity_id, agent_id).
 */
export declare const relationshipSchema: SchemaTable;
//# sourceMappingURL=relationship.d.ts.map