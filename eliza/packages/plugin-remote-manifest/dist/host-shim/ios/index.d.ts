/**
 * iOS implementation of {@link PluginHostShim}. View bundles run inside
 * a `WKWebView` whose `WKUserContentController` exposes the
 * `elizaosBridge` script-message handler. The Swift side forwards
 * messages into the in-process Bun runtime (`plugin-capacitor-bridge`
 * → `bootElizaRuntime()` → `RemotePluginBridge`) and posts responses
 * back via `evaluateJavaScript`.
 *
 * Wire envelope between WKWebView and Swift bridge is the same JSON
 * shape as the Electrobun preload bridge:
 *
 *     { kind: "request",  id, method, params }
 *     { kind: "response", id, ok, payload?, error? }
 *     { kind: "event",    event, data }
 */
import { type PluginHostShim } from "../index.js";
interface IosMessageHandler {
    postMessage(message: unknown): void;
}
interface IosWebkit {
    messageHandlers: {
        elizaosBridge?: IosMessageHandler;
    };
}
declare global {
    interface Window {
        webkit?: IosWebkit;
        /** Set by the Swift bridge before posting an "elizaosBridge" message back. */
        __elizaosIosDeliver?: (data: unknown) => void;
    }
}
export declare function installIosShim(options?: {
    /** Milliseconds before a bridge request is rejected. Default 30s. */
    requestTimeoutMs?: number;
}): PluginHostShim;
export declare function resetIosShimForTests(): void;
export {};
//# sourceMappingURL=index.d.ts.map