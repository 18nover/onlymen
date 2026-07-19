/**
 * Helpers for the subscription/OAuth callback flow: normalize provider callback
 * input into a typed ok/error result and format request errors for display.
 * Keeps callback parsing consistent across the auth surfaces that consume it.
 */
export declare function formatSubscriptionRequestError(err: unknown): string;
export declare function normalizeOpenAICallbackInput(input: string): {
    ok: true;
    code: string;
} | {
    ok: false;
    error: string;
};
//# sourceMappingURL=subscription-auth.d.ts.map