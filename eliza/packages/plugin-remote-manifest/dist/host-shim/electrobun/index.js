/**
 * Electrobun implementation of {@link PluginHostShim}. The view bundle
 * runs inside an Electrobun BrowserView whose preload script exposes
 * `globalThis.__elizaosElectrobunBridge` (set up by the
 * `app-core/platforms/electrobun` host). The shim layers a typed
 * request / event surface on top of that bridge so view code is
 * indistinguishable from the iOS/Android/web variants.
 *
 * Usage inside a view bundle:
 *
 * ```ts
 * import { installElectrobunShim } from "@elizaos/plugin-remote-manifest/host-shim/electrobun";
 * installElectrobunShim();
 * import { getHostShim } from "@elizaos/plugin-remote-manifest/host-shim";
 * const result = await getHostShim().request("provider.spotify", {});
 * ```
 */
import { installHostShim } from "../index.js";
export function installElectrobunShim(options = {}) {
    if (installedElectrobunShim)
        return installedElectrobunShim;
    const bridge = globalThis.__elizaosElectrobunBridge;
    if (!bridge) {
        throw new Error("installElectrobunShim(): __elizaosElectrobunBridge missing — " +
            "is the view loaded inside an Electrobun BrowserView with the host preload script?");
    }
    const subscribers = new Map();
    const requestTimeoutMs = Math.max(0, options.requestTimeoutMs ?? 30_000);
    const pending = new Map();
    let nextId = 0;
    const removeResponseListener = bridge.addListener("response", (data) => {
        if (!isResponse(data))
            return;
        const slot = pending.get(data.id);
        if (!slot)
            return;
        pending.delete(data.id);
        clearTimeout(slot.timeout);
        if (data.ok) {
            slot.resolve((data.payload ?? null));
        }
        else {
            slot.reject(new Error(data.error ?? "Unknown bridge error"));
        }
    });
    const removeEventListener = bridge.addListener("event", (data) => {
        if (!isEvent(data))
            return;
        const set = subscribers.get(data.event);
        if (!set)
            return;
        for (const handler of set)
            handler(data.data);
    });
    const shim = {
        resolveViewUrl(pluginName, relativePath) {
            // Electrobun serves plugin assets via the `views://` URL scheme
            // rooted at the plugin's currentDir.
            const safeRelativePath = normalizeRelativePath(relativePath);
            return new URL(`views://${encodeURIComponent(pluginName)}/${safeRelativePath}`);
        },
        request(method, params) {
            const id = ++nextId;
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    pending.delete(id);
                    reject(new Error(`Electrobun bridge request timed out: ${method}`));
                }, requestTimeoutMs);
                pending.set(id, {
                    reject,
                    resolve: (v) => resolve(v),
                    timeout,
                });
                try {
                    bridge.postMessage({ kind: "request", id, method, params });
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
    installedElectrobunShim = shim;
    installedElectrobunShimCleanup = () => {
        removeResponseListener();
        removeEventListener();
        for (const slot of pending.values()) {
            clearTimeout(slot.timeout);
        }
        pending.clear();
    };
    return shim;
}
let installedElectrobunShim = null;
let installedElectrobunShimCleanup = null;
export function resetElectrobunShimForTests() {
    installedElectrobunShimCleanup?.();
    installedElectrobunShimCleanup = null;
    installedElectrobunShim = null;
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