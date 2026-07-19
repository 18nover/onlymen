/**
 * Server health check utilities for waiting for servers to be ready
 */
export interface ServerHealthOptions {
    port: number;
    endpoint?: string;
    maxWaitTime?: number;
    pollInterval?: number;
    requestTimeout?: number;
    host?: string;
    protocol?: "http" | "https";
}
/**
 * Error thrown when server fails to become ready within the timeout
 */
export declare class ServerHealthError extends Error {
    readonly url: string;
    readonly cause?: Error | undefined;
    constructor(message: string, url: string, cause?: Error | undefined);
}
/**
 * Wait for server to be ready by polling health endpoint
 *
 * @param options - Configuration options for server health check
 * @throws ServerHealthError if server doesn't become ready within maxWaitTime
 */
export declare function waitForServerReady(options: ServerHealthOptions): Promise<void>;
/**
 * Simple ping check for server availability (no stabilization wait)
 *
 * @param options - Configuration options for server ping
 * @returns true if server responds with 2xx, false otherwise
 */
export declare function pingServer(options: ServerHealthOptions): Promise<boolean>;
//# sourceMappingURL=server-health.d.ts.map