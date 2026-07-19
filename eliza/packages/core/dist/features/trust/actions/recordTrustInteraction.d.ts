/**
 * Handler for the TRUST umbrella's `record_interaction` subaction: parses a
 * trust-affecting interaction (evidence type, target entity, impact,
 * description) from the message JSON or action parameters, validates the type
 * against `TrustEvidenceType`, and records it through the `trust-engine`
 * service. The target defaults to the agent itself when none is given; the
 * source is always the message sender. Fails soft with a structured
 * `ActionResult` when the service is absent, the type is missing, or the type is
 * invalid.
 */
import type { ActionResult, IAgentRuntime, Memory, State } from "../../../types/index.js";
type ActionOptions = Record<string, unknown>;
export declare function recordTrustInteractionHandler(runtime: IAgentRuntime, message: Memory, _state: State | undefined, options: ActionOptions | undefined): Promise<ActionResult>;
export {};
//# sourceMappingURL=recordTrustInteraction.d.ts.map