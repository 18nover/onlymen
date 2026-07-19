/**
 * Backend-agnostic table schema for the advanced-memory capability's long-term
 * store: durable per-entity facts categorized as episodic / semantic /
 * procedural, each carrying a confidence score, optional source, optional
 * embedding for vector recall, and access bookkeeping (count + last-accessed).
 * MemoryService reads and writes these rows through a registered
 * MemoryStorageProvider.
 */
import type { SchemaTable } from "../../../types/schema.js";
/**
 * Abstract schema definition for the long_term_memories table.
 *
 * This is the canonical, backend-agnostic description of the table structure.
 * Database adapters (Drizzle, Knex, raw SQL, etc.) translate this into their
 * own runtime representations.
 */
export declare const longTermMemories: SchemaTable;
//# sourceMappingURL=long-term-memories.d.ts.map