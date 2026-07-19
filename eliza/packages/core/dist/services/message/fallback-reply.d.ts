/**
 * Render any thrown model-call failure as one diagnostic line — the HTTP
 * status (unwrapped from the AI SDK retry envelope) plus the most specific
 * message found on the error or its structured body. Providers throw a mix of
 * `Error` instances and bare `{ status, error }` objects; a bare object
 * stringifies to the useless "[object Object]", so the model-failover rethrow
 * routes non-trivial values through here to keep logs, trajectories, and any
 * user-surfaced failure text diagnostic. Never returns "[object Object]": when
 * no status or message is recoverable it serializes the payload instead.
 */
export declare function describeModelCallError(error: unknown): string;
/**
 * Detect provider rate-limit / 429 failures so the user-facing failure reply
 * can say "I'm being rate-limited, try again shortly" instead of the opaque
 * generic "something went wrong".
 *
 * The structural check runs FIRST and is the canonical signal: the AI SDK
 * carries the upstream HTTP status on `APICallError.statusCode` (wrapped by
 * `RetryError` when retries are exhausted), so we unwrap the retry envelope and
 * read `statusCode === 429` directly — mirroring cloud-shared `aiSdkErrorStatus`.
 * The message substring scan is only a status-less fallback for errors that do
 * not surface a structured status (e.g. raw text), and the legacy `.status`
 * duck-type covers raw OpenAI-SDK errors that expose `.status` instead.
 */
export declare function isRateLimitError(error: unknown): boolean;
/**
 * The user-facing reply for a credit-exhausted provider. One string for every
 * delivery path: the direct chat API (`packages/agent` re-uses it) and the
 * connector failure-reply path below, so a Discord/Telegram user and a
 * dashboard user read the same actionable condition. Characters override via
 * `character.templates.insufficientCreditsReply`.
 */
export declare const INSUFFICIENT_CREDITS_REPLY = "Eliza Cloud credits are depleted. Top up the cloud balance and try again.";
export declare function isInsufficientCreditsMessage(message: string): boolean;
/**
 * Detect provider credit/quota exhaustion — HTTP 402, a structured
 * `insufficient_credits`/`insufficient_quota` error body, or a 429 that
 * carries billing context — so the user-facing failure reply can say "top up"
 * instead of suggesting a retry that can never succeed against a drained
 * balance. Mirrors {@link isRateLimitError}: the structural signal (status
 * after unwrapping the AI SDK retry envelope, then the provider error body)
 * runs first; the message-substring scan is only a status-less fallback.
 *
 * Callers MUST check this before {@link isRateLimitError}: a 429 *with*
 * billing context is credit exhaustion ("top up"), whereas a bare 429 is
 * "try again in a moment".
 */
export declare function isInsufficientCreditsError(error: unknown): boolean;
/**
 * Detect provider auth failures (401/403 — invalid/expired/unauthorized API key)
 * so the user-facing failure reply can say "my cloud key isn't authorized — check
 * your Eliza Cloud key / add credits" instead of the opaque generic
 * "something went wrong". Mirrors {@link isRateLimitError}: structured HTTP status
 * first, message-substring fallback second.
 */
export declare function isAuthError(error: unknown): boolean;
/**
 * Detect failures where another model provider is worth trying before giving up.
 * This intentionally includes {@link isRateLimitError} so subscription-credit
 * exhaustion from CLI-SDK providers follows the same structural 429/session-limit
 * classifier as the graceful reply path.
 *
 * `modelType` gates the decision per slot. `TEXT_TO_SPEECH` never fails over:
 * a voice swap is not a transient-recoverable condition, and a Kokoro
 * model-download failure surfaces as `fetch failed`, which would otherwise match
 * the transient heuristics below and silently rotate to a different voice engine
 * (#12253). TTS fails closed — the configured voice errors loudly instead.
 */
export declare function isModelProviderFallbackError(error: unknown, modelType?: string): boolean;
export declare function buildFailureReplyPrompt(recentMessages: string): string;
export declare function stripReasoningBlocks(raw: string): string;
//# sourceMappingURL=fallback-reply.d.ts.map