/**
 * Advanced Capabilities
 *
 * Extended functionality that can be enabled with `enableExtendedCapabilities: true`
 * or `advancedCapabilities: true` in plugin initialization.
 *
 * These provide additional agent features:
 * - Extended providers (facts, contacts, relationships, roles, settings, personality)
 * - Advanced actions (contacts management, room management, personality)
 *   Note: todos are owned entirely by @elizaos/plugin-todos (the `TODO` action +
 *   `currentTodosProvider` + DB-backed TodosService) and app-lifeops
 *   (`OWNER_TODOS`). Core registers no todos provider, service, or action.
 * - Registered post-turn evaluators (experience, skills, facts, relationships,
 *   identities, task success)
 * - Additional services (experience, personality)
 */
import type { RegisteredEvaluator } from "../../types/index.js";
import type { ServiceClass } from "../../types/plugin.js";
export * from "./actions/index.js";
export { roleAction } from "./actions/role.js";
export * from "./evaluators/index.js";
export * from "./experience/index.js";
export type * from "./form/index.js";
export * from "./personality/index.js";
export * from "./providers/index.js";
/**
 * Advanced providers - extended context and state management
 */
export declare const advancedProviders: import("../../index.node.js").Provider[];
/**
 * Advanced actions - extended agent capabilities.
 *
 * Includes planner actions only. Post-turn evaluation is registered through
 * `advancedEvaluators` and run by the EvaluatorService in one model call.
 */
export declare const advancedActions: import("../../index.node.js").Action[];
export declare const advancedEvaluators: RegisteredEvaluator[];
/**
 * Advanced services - extended service infrastructure
 */
export declare const advancedServices: ServiceClass[];
/**
 * Combined advanced capabilities object
 */
export declare const advancedCapabilities: {
    providers: import("../../index.node.js").Provider[];
    actions: import("../../index.node.js").Action[];
    evaluators: RegisteredEvaluator[];
    services: ServiceClass[];
};
export default advancedCapabilities;
//# sourceMappingURL=index.d.ts.map