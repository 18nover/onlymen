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
import { installHostShim } from "../index.js";
export function installIosShim(options = {}) {
    if (installedIosShim)
        return installedIosShim;
    const handler = window.webkit?.messageHandlers?.elizaosBridge;
    if (!handler || typeof handler.postMessage !== "function") {
        throw new Error("installIosShim(): window.webkit.messageHandlers.elizaosBridge missing — " +
            "is the WKWebView configured with the elizaosBridge WKScriptMessageHandler?");
    }
    const subscribers = new Map();
    const requestTimeoutMs = Math.max(0, options.requestTimeoutMs ?? 30_000);
    const pending = new Map();
    let nextId = 0;
    // Swift calls window.__elizaosIosDeliver(...) via evaluateJavaScript
    // to push responses + events back into the view.
    window.__elizaosIosDeliver = (data) => {
        if (isResponse(data)) {
            const slot = pending.get(data.id);
            if (!slot)
                return;
            pending.delete(data.id);
            clearTimeout(slot.timeout);
            if (data.ok) {
                slot.resolve((data.payload ?? null));
            }
            else {
                slot.reject(new Error(data.error ?? "iOS bridge error"));
            }
            return;
        }
        if (isEvent(data)) {
            const set = subscribers.get(data.event);
            if (!set)
                return;
            for (const fn of set)
                fn(data.data);
        }
    };
    const shim = {
        resolveViewUrl(pluginName, relativePath) {
            // iOS host serves plugin assets via a custom URL scheme rooted
            // at the app sandbox: app-resource://plugin/<name>/<path>.
            const safeRelativePath = normalizeRelativePath(relativePath);
            return new URL(`app-resource://plugin/${encodeURIComponent(pluginName)}/${safeRelativePath}`);
        },
        request(method, params) {
            const id = ++nextId;
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    pending.delete(id);
                    reject(new Error(`iOS bridge request timed out: ${method}`));
                }, requestTimeoutMs);
                pending.set(id, {
                    reject,
                    resolve: (v) => resolve(v),
                    timeout,
                });
                try {
                    handler.postMessage({ kind: "request", id, method, params });
                }
                catch (cause) {
                    pending.delete(id);
                    clearTimeout(timeout);
                    reject(cause instanceof Error ? cause : new Error(String(cause)));
                }
            });
        },
        on(event, handler) {
            let set = subscribers.get(event);
            if (!set) {
                set = new Set();
                subscribers.set(event, set);
            }
            set.add(handler);
            return () => set?.delete(handler);
        },
    };
    installHostShim(shim);
    installedIosShim = shim;
    installedIosShimCleanup = () => {
        for (const slot of pending.values()) {
            clearTimeout(slot.timeout);
        }
        pending.clear();
    };
    return shim;
}
let installedIosShim = null;
let installedIosShimCleanup = null;
export function resetIosShimForTests() {
    installedIosShimCleanup?.();
    installedIosShimCleanup = null;
    installedIosShim = null;
    if (typeof window !== "undefined") {
        delete window.__elizaosIosDeliver;
    }
}
function normalizeRelativePath(relativePath) {
    const raw = relativePath.replace(/\\/g, "/");
    if (!raw || raw.startsWith("/") || /^[A-Za-z]:/.test(raw)) {
        throw new Error(`Invalid view asset path: ${relativePath || "<empty>"}`);
    }
    const normalized = raw
        .split("/")
        .filter((segment) => segment.length > 0)
        .map((segment) => {
        if (segment === "." || segment === "..") {
            throw new Error(`Invalid view asset path: ${relativePath}`);
        }
        return encodeURIComponent(segment);
    })
        .join("/");
    if (!normalized) {
        throw new Error(`Invalid view asset path: ${relativePath || "<empty>"}`);
    }
    return normalized;
}
function isResponse(data) {
    return (typeof data === "object" &&
        data !== null &&
        data.kind === "response" &&
        typeof data.id === "number" &&
        Number.isFinite(data.id) &&
        typeof data.ok === "boolean" &&
        (data.error === undefined ||
            typeof data.error === "string"));
}
function isEvent(data) {
    return (typeof data === "object" &&
        data !== null &&
        data.kind === "event" &&
        typeof data.event === "string" &&
        Object.hasOwn(data, "data"));
}
//# sourceMappingURL=index.js.map