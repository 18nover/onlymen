/**
 * Payments capability — action slice.
 *
 * Registers the PAYMENT umbrella action with structural subactions:
 *   create_request, deliver_link, verify_payload, settle, await_callback,
 *   cancel_request.
 *
 * Composition (create + deliver + await + finalize) lives in the planner.
 * The cloud-backed client implementations (`PaymentRequestsClient`,
 * `PaymentBusClient`, `PaymentSettler`) are registered by sibling Wave B
 * packages and resolved here via `runtime.getService(...)`.
 *
 * This plugin is intentionally NOT auto-enabled. Wave H wires it into the
 * default plugin set; until then it's an opt-in import for callers that need
 * the atomic surface.
 */
import type { Plugin } from "../../types/index.js";
export declare const paymentsPlugin: Plugin;
export default paymentsPlugin;
//# sourceMappingURL=plugin.d.ts.map