/**
 * Table descriptor for `logs` — the per-room/entity event log the runtime
 * writes typed records (actions, thoughts, errors) into, read back by `getLogs`
 * and aggregated by `getAgentRunSummaries`. Portable `SchemaTable` shape
 * assembled by `buildBaseTables` and materialized by the plugin-sql / localdb
 * adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the logs table.
 */
export declare const logSchema: SchemaTable;
//# sourceMappingURL=log.d.ts.map