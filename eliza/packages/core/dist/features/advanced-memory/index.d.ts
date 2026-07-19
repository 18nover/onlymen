/**
 * Entry point for the advanced-memory capability. `createAdvancedMemoryPlugin`
 * assembles the `memory` plugin from the summary + long-term evaluators, the
 * summarized-context + long-term-recall providers, and `MemoryService`. The
 * file also re-exports the capability's public surface — those
 * evaluators/providers, the backend-agnostic schema definitions, the service,
 * and its types.
 */
import type { Plugin } from "../../types/index.js";
export { longTermMemoryEvaluator, memoryItems, summaryEvaluator, } from "./evaluators/index.js";
export { contextSummaryProvider, longTermMemoryProvider, } from "./providers/index.js";
export * from "./schemas/index.js";
export { MemoryService } from "./services/memory-service.js";
export { type LongTermMemory, LongTermMemoryCategory, type MemoryConfig, type MemoryExtraction, type MemoryServiceTypeName, type SessionSummary, type SummaryResult, } from "./types.js";
/**
 * Create the advanced-memory plugin.
 *
 * No database-specific arguments needed. MemoryService discovers a
 * MemoryStorageProvider at runtime via runtime.getService("memoryStorage").
 * If none is registered by a database plugin, storage-backed features
 * gracefully disable.
 */
export declare function createAdvancedMemoryPlugin(): Plugin;
//# sourceMappingURL=index.d.ts.map