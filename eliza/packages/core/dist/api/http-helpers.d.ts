/**
 * Shared HTTP request/response plumbing for the API and benchmark route layers:
 * bounded body reads (size-guarded, with optional size/error-to-null fallbacks)
 * and JSON responders in both awaitable and fire-and-forget forms. The raw body
 * buffer and its parsed JSON are memoized on the request via `Symbol.for` keys
 * so several handlers can read one body without re-consuming the stream.
 */
import type http from "node:http";
/**
 * Common request body size guard used across API/benchmark endpoints.
 */
export declare const DEFAULT_MAX_BODY_BYTES = 1048576;
export interface RequestBodyOptions {
    /** Maximum accepted body size in bytes. */
    maxBytes?: number;
    /** String conversion encoding for body text helpers. */
    encoding?: BufferEncoding;
    /** Error message returned when the request body exceeds `maxBytes`. */
    tooLargeMessage?: string;
    /** When true, resolves to `null` instead of rejecting on body read failure. */
    returnNullOnError?: boolean;
    /** When true, resolves to `null` instead of rejecting on size limit exceed. */
    returnNullOnTooLarge?: boolean;
    /** Whether to destroy the request stream as soon as the body limit is exceeded. */
    destroyOnTooLarge?: boolean;
}
export declare function readRequestBodyBuffer(req: http.IncomingMessage, { maxBytes, returnNullOnError, returnNullOnTooLarge, destroyOnTooLarge, tooLargeMessage, }?: RequestBodyOptions): Promise<Buffer | null>;
export interface ReadTextBodyOptions extends RequestBodyOptions {
}
export declare function readRequestBody(req: http.IncomingMessage, options?: ReadTextBodyOptions): Promise<string | null>;
export interface ReadJsonBodyOptions extends ReadTextBodyOptions {
    /** Whether to require JSON object shape (not arrays/null). */
    requireObject?: boolean;
    /** Response status used for parse/read failures. */
    readErrorStatus?: number;
    /** Response status used for non-object body when `requireObject` is true. */
    nonObjectStatus?: number;
    /** Response status used for invalid JSON syntax. */
    parseErrorStatus?: number;
    /** Override for read errors (including size / stream errors). */
    readErrorMessage?: string;
    /** Override when JSON is valid but not an object. */
    nonObjectMessage?: string;
    /** Override for malformed JSON parse errors. */
    parseErrorMessage?: string;
}
export declare function isJsonObjectBody(value: unknown): value is Record<string, unknown>;
export declare function writeJsonResponse(res: http.ServerResponse, body: unknown, status?: number): Promise<void>;
export declare function writeJsonError(res: http.ServerResponse, message: string, status?: number): Promise<void>;
export declare function writeJsonResponseSafe(res: http.ServerResponse, body: unknown, status?: number): void;
/** Shorthand responder for successful JSON payloads with safe fire-and-forget write. */
export declare function sendJson(res: http.ServerResponse, body: unknown, status?: number): void;
/** Shorthand responder for JSON error payloads with safe fire-and-forget write. */
export declare function sendJsonError(res: http.ServerResponse, message: string, status?: number): void;
export declare function writeJsonErrorSafe(res: http.ServerResponse, message: string, status?: number): void;
export declare function readJsonBody<T = Record<string, unknown>>(req: http.IncomingMessage, res: http.ServerResponse, { readErrorStatus, nonObjectStatus, parseErrorStatus, readErrorMessage, nonObjectMessage, parseErrorMessage, requireObject, ...readOptions }?: ReadJsonBodyOptions): Promise<T | null>;
//# sourceMappingURL=http-helpers.d.ts.map