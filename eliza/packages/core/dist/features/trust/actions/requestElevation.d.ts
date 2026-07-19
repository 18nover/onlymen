/**
 * Handler for the TRUST umbrella's `request_elevation` subaction: asks the
 * `contextual-permissions` service to grant the sender temporary elevated
 * permission for a named action, using their `trust-engine` profile as context.
 * Renders either the grant (with expiry) or the denial (with current trust score
 * and remediation suggestions). Requires both the permission and trust services;
 * fails soft with a structured `ActionResult` when either is missing or the
 * request throws.
 */
import type { ActionResult, IAgentRuntime, Memory, State } from "../../../types/index.js";
type ActionOptions = Record<string, unknown>;
export declare function requestElevationHandler(runtime: IAgentRuntime, message: Memory, _state: State | undefined, options: ActionOptions | undefined): Promise<ActionResult>;
export {};
//# sourceMappingURL=requestElevation.d.ts.map