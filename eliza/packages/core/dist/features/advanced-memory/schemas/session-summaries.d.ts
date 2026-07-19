/**
 * Backend-agnostic table schema for the advanced-memory capability's short-term
 * rollups: one row per room-scoped (optionally entity-scoped) conversation
 * summary, holding the summary text, message count and last-processed offset,
 * the covered time window, extracted topics, and an optional embedding.
 * MemoryService writes these as conversations grow so the context-summary
 * provider can inject recent history.
 */
import type { SchemaTable } from "../../../types/schema.js";
/**
 * Abstract schema definition for the session_summaries table.
 *
 * This is the canonical, backend-agnostic description of the table structure.
 * Database adapters (Drizzle, Knex, raw SQL, etc.) translate this into their
 * own runtime representations.
 */
export declare const sessionSummaries: SchemaTable;
//# sourceMappingURL=session-summaries.d.ts.map