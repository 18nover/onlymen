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
export class StripeCheckoutError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = "StripeCheckoutError";
        this.status = status;
    }
}
/**
 * POST to the Stripe create-checkout-session endpoint and return the
 * redirect URL. Throws `StripeCheckoutError` on a non-OK response or
 * a missing URL in the body.
 */
export async function createStripeCheckoutSession(request, options) {
    const endpoint = `${options.apiBaseUrl}/api/stripe/create-checkout-session`;
    const headers = {
        "Content-Type": "application/json",
    };
    if (options.bearerToken) {
        headers.Authorization = `Bearer ${options.bearerToken}`;
    }
    const response = await fetch(endpoint, {
        method: "POST",
        credentials: options.credentials ?? "include",
        headers,
        body: JSON.stringify(request),
    });
    // error-policy:J3 a non-JSON checkout body → null; the failure is surfaced by
    // the throw below when `response.ok` is false or `body.url` is absent.
    const body = (await response
        .json()
        .catch(() => null));
    if (!response.ok || !body?.url) {
        throw new StripeCheckoutError(body?.error || "Could not start checkout.", response.status);
    }
    return body.url;
}
/**
 * Convenience wrapper: create the Stripe session and navigate the browser
 * to it. Returns nothing — the page is gone by the time the promise would
 * otherwise resolve. Errors propagate to the caller.
 */
export async function startStripeCheckout(request, options) {
    const url = await createStripeCheckoutSession(request, options);
    window.location.href = url;
}
//# sourceMappingURL=index.js.map