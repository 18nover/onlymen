/**
 * Shared HTTP helper for e2e tests.
 */
import http from "node:http";
export type HttpResponse = {
    status: number;
    headers: http.IncomingHttpHeaders;
    data: Record<string, unknown>;
};
export type HttpRequestOptions = {
    timeoutMs?: number;
};
export declare function readConversationId(data: Record<string, unknown>): string;
/**
 * Make an HTTP request to a local test server.
 */
export declare function req(port: number, method: string, path: string, body?: Record<string, unknown> | string, headersOrContentType?: Record<string, string> | string, options?: HttpRequestOptions): Promise<HttpResponse>;
export declare function createConversation(port: number, options?: {
    title?: string;
    includeGreeting?: boolean;
    lang?: string;
}, headersOrContentType?: Record<string, string> | string, requestOptions?: HttpRequestOptions): Promise<HttpResponse & {
    conversationId: string;
}>;
export declare function postConversationMessage(port: number, conversationId: string, body?: Record<string, unknown> | string, headersOrContentType?: Record<string, string> | string, requestOptions?: HttpRequestOptions): Promise<HttpResponse>;
//# sourceMappingURL=http.d.ts.map