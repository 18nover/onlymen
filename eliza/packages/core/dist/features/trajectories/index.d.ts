import type { Plugin } from "../../types/index.js";
/**
 * Native trajectories plugin.
 *
 * Captures complete agent interaction trajectories for:
 * - Debugging and analysis (UI viewing)
 * - RL training data collection
 * - Export to various formats (JSON, ART, CSV)
 *
 * Registers the native "trajectories" service so the runtime can automatically
 * log LLM calls and provider accesses when trajectory capture is active.
 */
export declare const trajectoriesPlugin: Plugin;
export default trajectoriesPlugin;
export type { TrajectoryExportOptions } from "../../services/trajectory-types.js";
export * from "./action-interceptor.js";
export * from "./art-format.js";
export * from "./export.js";
export * from "./game-rewards.js";
export * from "./integration.js";
export type { ModelPriceUsdPerMTokens, PriceLookupResult, PriceTableId, ProviderName, TokenUsageForCost, } from "./pricing.js";
export { computeCallCostUsd, isLocalProvider, lookupModelPrice, MODEL_PRICES_USD_PER_M_TOKENS, PRICE_TABLE_ID, } from "./pricing.js";
export * from "./reward-service.js";
export type { TrajectoryListItem, TrajectoryListOptions, TrajectoryListResult, TrajectoryStats, TrajectoryZipEntry, TrajectoryZipExportOptions, TrajectoryZipExportResult, } from "./TrajectoriesService.js";
export { TrajectoriesService } from "./TrajectoriesService.js";
export * from "./types.js";
//# sourceMappingURL=index.d.ts.map