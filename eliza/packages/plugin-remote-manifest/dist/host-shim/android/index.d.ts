/**
 * Android implementation of {@link PluginHostShim}. View bundles load
 * inside a `WebView` whose `addJavascriptInterface` exposes
 * `globalThis.ElizaosAndroidBridge` (a `@JavascriptInterface`-annotated
 * Kotlin object). The Kotlin side forwards messages into the in-process
 * Bun runtime and calls `webView.evaluateJavascript(...)` to push
 * responses back as JSON via `globalThis.__elizaosAndroidDeliver(...)`.
 */
import { type PluginHostShim } from "../index.js";
interface AndroidBridge {
    postMessage(message: string): void;
}
declare global {
    interface Window {
        ElizaosAndroidBridge?: AndroidBridge;
        __elizaosAndroidDeliver?: (json: string) => void;
    }
}
export declare function installAndroidShim(options?: {
    /** Milliseconds before a bridge request is rejected. Default 30s. */
    requestTimeoutMs?: number;
}): PluginHostShim;
export declare function resetAndroidShimForTests(): void;
export {};
//# sourceMappingURL=index.d.ts.map