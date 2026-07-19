/**
 * Barrel for the advanced-memory capability's abstract table schemas: re-exports
 * the backend-agnostic `SchemaTable` types plus the long-term-memories,
 * memory-access-logs, and session-summaries table definitions that database
 * plugins materialize. Also anchors the re-exported bindings against
 * tree-shake collapse (see the bundle-safety note below).
 */
export type { IndexColumn, SchemaColumn, SchemaIndex, SchemaTable, } from "../../../types/schema.js";
export { longTermMemories } from "./long-term-memories.js";
export { memoryAccessLogs } from "./memory-access-logs.js";
export { sessionSummaries } from "./session-summaries.js";
//# sourceMappingURL=index.d.ts.map