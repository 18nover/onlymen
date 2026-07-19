/**
 * Payments — action slice.
 *
 * Re-exports the PAYMENT action, the plugin scaffold, and the runtime contract
 * types (`PaymentRequestsClient`, `PaymentBusClient`, `PaymentSettler`,
 * envelope/settlement shapes, service name constants).
 */
export { paymentAction } from "./actions/payment.js";
export { paymentsPlugin, paymentsPlugin as default } from "./plugin.js";
export type { CreatePaymentRequestInput, PaymentBusClient, PaymentContext, PaymentContextKind, PaymentProofVerification, PaymentProvider, PaymentRequestEnvelope, PaymentRequestStatus, PaymentRequestsClient, PaymentSettlementResult, PaymentSettler, } from "./types.js";
export { eligibleDeliveryTargetsFor, PAYMENT_BUS_CLIENT_SERVICE, PAYMENT_REQUESTS_CLIENT_SERVICE, PAYMENT_SETTLER_SERVICE, } from "./types.js";
//# sourceMappingURL=index.d.ts.map