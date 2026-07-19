/**
 * Shared error classification helpers.
 *
 * Consolidates the timeout detection pattern that was independently
 * implemented in cloud-routes.ts and cloud-connection.ts.
 */
import { formatError } from "@elizaos/core";
/** Classify an error as a fetch/AbortSignal timeout. */
export declare function isTimeoutError(error: unknown): boolean;
/** Classify a fetch Response as a redirect (3xx). */
export declare function isRedirectResponse(response: Response): boolean;
/** Extract a human-readable message from an unknown caught value. */
export declare const errorMessage: typeof formatError;
//# sourceMappingURL=errors.d.ts.map