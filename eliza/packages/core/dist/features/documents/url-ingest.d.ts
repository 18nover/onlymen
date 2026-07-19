type ResolvedUrlTarget = {
    parsed: URL;
    hostname: string;
    pinnedAddress: string;
};
type PinnedFetchInput = {
    url: URL;
    init: RequestInit;
    target: ResolvedUrlTarget;
    timeoutMs: number;
};
type PinnedFetchImpl = (input: PinnedFetchInput) => Promise<Response>;
export declare function __setDocumentUrlFetchImplForTests(impl: PinnedFetchImpl | null): void;
export declare function isYouTubeUrl(url: string): boolean;
export type FetchedDocumentUrlKind = "text" | "transcript" | "html" | "binary";
export interface FetchedDocumentUrl {
    /** Filename derived from the URL or YouTube video id. */
    filename: string;
    /** UTF-8 string for text/transcript/html, base64 for binary. */
    content: string;
    /** Coarse classification of the fetched payload. */
    contentType: FetchedDocumentUrlKind;
    /** Underlying MIME type from the response headers (or synthesised for transcripts). */
    mimeType: string;
}
export interface FetchDocumentFromUrlOptions {
    /** Reserved: surfaced through to caller metadata when handling images. */
    includeImageDescriptions?: boolean;
}
/**
 * Fetch a remote URL and return document-friendly content. Supports YouTube
 * transcript extraction, HTML pages, plain-text resources, and a small set of
 * binary document types (returned as base64).
 */
export declare function fetchDocumentFromUrl(url: string, _opts?: FetchDocumentFromUrlOptions): Promise<FetchedDocumentUrl>;
export {};
//# sourceMappingURL=url-ingest.d.ts.map