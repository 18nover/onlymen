/**
 * PAYMENT — payment action.
 *
 * Routes all payment operations through a single structural discriminator:
 * `action=create_request|deliver_link|verify_payload|settle|await_callback|cancel_request`.
 */
import type { Action } from "../../../types/index.js";
export declare const paymentAction: Action;
//# sourceMappingURL=payment.d.ts.map