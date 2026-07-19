/**
 * Handler for the TRUST umbrella's `evaluate` subaction: reads a target entity's
 * `TrustProfile` from the `trust-engine` service and renders it as either a
 * one-line trust level or a detailed dimension/trend breakdown (`detailed`).
 * Requires an explicit `entityId` — name-based lookups are rejected — and
 * defaults to the message sender when no target is supplied. Fails soft with a
 * structured `ActionResult` when the service is unavailable or the evaluation
 * throws.
 */
import type { ActionResult, IAgentRuntime, Memory, State } from "../../../types/index.js";
type ActionOptions = Record<string, unknown>;
export declare function evaluateTrustHandler(runtime: IAgentRuntime, message: Memory, _state: State | undefined, options: ActionOptions | undefined): Promise<ActionResult>;
export {};
//# sourceMappingURL=evaluateTrust.d.ts.map