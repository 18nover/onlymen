/**
 * Shared hardware-checkout client.
 *
 * Both elizaos.ai (os-homepage `CheckoutPage`) and elizacloud.ai
 * (cloud-frontend `CheckoutPage`) POST to the same Stripe create-session
 * endpoint and then redirect the browser to the returned Stripe URL.
 *
 * The two surfaces differ on auth (os-homepage uses a Steward bearer token
 * for guest checkout; cloud-frontend uses the logged-in session cookie),
 * and on the API base URL (os-homepage hits the absolute Cloud API origin;
 * cloud-frontend hits its own same-origin proxy at `/api/...`). All of that
 * is passed in by the caller — this module only owns the POST + redirect
 * contract so the two pages cannot drift apart on it.
 */
export interface StripeCheckoutRequest {
    hardwareSku: string;
    hardwareColor: string;
    /** Where Stripe should return the user after success/cancel. */
    returnUrl: string;
}
export interface StripeCheckoutOptions {
    /**
     * Absolute base URL of the Cloud API, or empty string for same-origin.
     * The endpoint path `/api/stripe/create-checkout-session` is appended.
     */
    apiBaseUrl: string;
    /** Optional bearer token (Steward session) for guest-flow auth. */
    bearerToken?: string | null;
    /** Whether to send credentials (cookies). Defaults to "include". */
    credentials?: RequestCredentials;
}
export declare class StripeCheckoutError extends Error {
    readonly status: number;
    constructor(message: string, status: number);
}
/**
 * POST to the Stripe create-checkout-session endpoint and return the
 * redirect URL. Throws `StripeCheckoutError` on a non-OK response or
 * a missing URL in the body.
 */
export declare function createStripeCheckoutSession(request: StripeCheckoutRequest, options: StripeCheckoutOptions): Promise<string>;
/**
 * Convenience wrapper: create the Stripe session and navigate the browser
 * to it. Returns nothing — the page is gone by the time the promise would
 * otherwise resolve. Errors propagate to the caller.
 */
export declare function startStripeCheckout(request: StripeCheckoutRequest, options: StripeCheckoutOptions): Promise<void>;
//# sourceMappingURL=index.d.ts.map