export declare function getErrorMessage(error: unknown): string;
export declare function isTransientModelError(error: unknown): boolean;
/**
 * HTTP status carried by a model/provider error, or undefined when the error
 * carries none. Mirrors the canonical structural signal in
 * `services/message/fallback-reply.ts`: the AI SDK records the upstream status
 * on `APICallError.statusCode` (a `RetryError` wraps it on `.lastError` /
 * `.errors` once retries exhaust); legacy OpenAI-style SDK errors expose
 * `.status`. Read the status, never scan the message text.
 */
export declare function modelProviderErrorStatus(error: unknown): number | undefined;
/**
 * True when a thrown model-call error is an EXPECTED provider/transport failure
 * — the provider returned an HTTP error status (>= 400) or the request failed
 * at the network layer — as opposed to a programmer or schema-validation error
 * (`TypeError`, `SchemaValidationFailedError`) that indicates a real bug and
 * must propagate. Purely structural: HTTP status and network error codes, never
 * a message-substring guess. Used to gate the planner-loop's post-tool
 * evaluator relay so a transient provider failure degrades to an already
 * completed tool's truthful output while genuine bugs still surface.
 */
export declare function isModelProviderError(error: unknown): boolean;
//# sourceMappingURL=model-errors.d.ts.map