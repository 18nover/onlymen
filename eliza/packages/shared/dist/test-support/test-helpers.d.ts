import type http from "node:http";
/** Standardized test result for mocked updater checks. */
export type MockUpdateCheckResult = {
    updateAvailable: boolean;
    currentVersion: string;
    latestVersion: string | null;
    channel: string;
    distTag: string;
    cached: boolean;
    error: string | null;
};
/** Snapshot and restore the configured environment variables around a test. */
export declare function createEnvSandbox(keys: readonly string[]): {
    clear: () => void;
    restore: () => void;
};
export type PluginModuleShape = {
    [key: string]: unknown;
    default?: unknown;
    plugin?: unknown;
};
/** Loose plugin-shape predicate used in dynamic test imports across suites. */
export declare function looksLikePlugin(value: unknown): value is {
    name: string;
};
/** Extract a plugin-like object from a dynamic module export shape. */
export declare function extractPlugin(mod: PluginModuleShape): {
    name: string;
} | null;
export declare function isPackageImportResolvable(packageName: string): boolean;
export declare function isWorkspaceDependency(version: string | undefined): boolean;
export declare function resolveDiscordPluginImportSpecifier(): string | null;
export declare function resolveTelegramPluginImportSpecifier(): string | null;
export declare function resolveLensPluginImportSpecifier(): string | null;
export declare function resolveFarcasterPluginImportSpecifier(): string | null;
export declare function resolveNostrPluginImportSpecifier(): string | null;
export declare function resolveMatrixPluginImportSpecifier(): string | null;
export declare function resolveFeishuPluginImportSpecifier(): string | null;
export declare function resolveWechatPluginImportSpecifier(): string | null;
/** Build a mock update check result with deterministic defaults. */
export declare function buildMockUpdateCheckResult(overrides?: Partial<MockUpdateCheckResult>): MockUpdateCheckResult;
/** Small utility to wait for asynchronous side-effects in tests. */
export declare function waitMs(ms: number): Promise<void>;
type MockResponsePayload<T> = {
    res: MockHttpServerResponse;
    getStatus: () => number;
    getJson: () => T;
};
type MockHttpServerResponse = http.ServerResponse & {
    _status: number;
    _body: string;
    writeHead: (statusCode: number) => void;
};
type MockBodyChunk = string | Buffer;
export type MockRequestOptions = {
    method?: string;
    url?: string;
    headers?: Record<string, string>;
    body?: unknown;
    bodyChunks?: MockBodyChunk[];
    json?: boolean;
};
/** Create a lightweight mocked HTTP response used by handler tests. */
export declare function createMockHttpResponse<T = unknown>(): MockResponsePayload<T>;
export declare function createMockHeadersRequest(headers?: Record<string, string>, options?: Omit<MockRequestOptions, "headers" | "body">): http.IncomingMessage & {
    destroy: () => void;
};
export declare function createMockIncomingMessage({ method, url, headers, body, bodyChunks, json, }: MockRequestOptions): http.IncomingMessage & {
    destroy: () => void;
};
export declare function createMockJsonRequest(body: unknown, options?: Omit<MockRequestOptions, "body" | "json">): http.IncomingMessage & {
    destroy: () => void;
};
/** Return true when optional plugin imports are intentionally unavailable in this env. */
export declare function isOptionalImportError(error: unknown, extraMarkers?: readonly string[]): boolean;
/** Safely import optional plugin modules while allowing hard failures to bubble. */
export declare function tryOptionalDynamicImport<T>(moduleName: string, markers?: readonly string[]): Promise<T | null>;
export {};
//# sourceMappingURL=test-helpers.d.ts.map