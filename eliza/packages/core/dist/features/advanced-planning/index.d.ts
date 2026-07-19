/**
 * Barrel and plugin factory for the advanced-planning capability:
 * `createAdvancedPlanningPlugin` registers the PLAN action and PlanningService,
 * and disposes the service on unload. Also re-exports the capability's public
 * types.
 */
import type { Plugin } from "../../types/index.js";
export declare function createAdvancedPlanningPlugin(): Plugin;
export { PlanningService } from "./services/planning-service.js";
export * from "./types.js";
//# sourceMappingURL=index.d.ts.map