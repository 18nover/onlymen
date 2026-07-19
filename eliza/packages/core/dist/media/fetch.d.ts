/**
 * Media fetching utilities with SSRF protection.
 *
 * Provides secure remote media fetching with:
 * - SSRF protection via DNS pinning
 * - Content-Disposition parsing
 * - Size limits
 * - MIME type detection
 */
import { type LookupFn, type PinnedLookupFetchLike, type SsrfPolicy } from "../network/index.js";
export type FetchMediaResult = {
    buffer: Buffer;
    contentType?: string;
    fileName?: string;
};
export type MediaFetchErrorCode = "max_bytes" | "http_error" | "fetch_failed";
export declare class MediaFetchError extends Error {
    readonly code: MediaFetchErrorCode;
    constructor(code: MediaFetchErrorCode, message: string);
}
export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
export type FetchMediaOptions = {
    url: string;
    fetchImpl?: FetchLike;
    filePathHint?: string;
    maxBytes?: number;
    maxRedirects?: number;
    timeoutMs?: number;
    ssrfPolicy?: SsrfPolicy;
    lookupFn?: LookupFn;
    pinnedFetchImpl?: PinnedLookupFetchLike;
};
/**
 * Fetch remote media with SSRF protection.
 *
 * @param options - Fetch options
 * @returns Promise resolving to buffer, content type, and filename
 * @throws MediaFetchError on fetch failures
 */
export declare function fetchRemoteMedia(options: FetchMediaOptions): Promise<FetchMediaResult>;
//# sourceMappingURL=fetch.d.ts.map