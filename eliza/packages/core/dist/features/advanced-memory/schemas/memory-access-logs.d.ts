/**
 * Backend-agnostic table schema for the advanced-memory capability's access log:
 * one row per read of a long-term memory or session summary, recording which
 * memory (id + type), which agent, the access type, and when. Feeds usage
 * bookkeeping for stored memories independent of the memory rows themselves.
 */
import type { SchemaTable } from "../../../types/schema.js";
/**
 * Abstract schema definition for the memory_access_logs table.
 *
 * This is the canonical, backend-agnostic description of the table structure.
 * Database adapters (Drizzle, Knex, raw SQL, etc.) translate this into their
 * own runtime representations.
 */
export declare const memoryAccessLogs: SchemaTable;
//# sourceMappingURL=memory-access-logs.d.ts.map