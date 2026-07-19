/**
 * @elizaos/plugin-remote-manifest/host-shim
 *
 * The cross-platform shim contract that a remote-mode plugin's view JS
 * uses to talk to whichever environment it's mounted in (Electrobun
 * webview, iOS WKWebView, Android WebView, web iframe). Per-platform
 * packages provide the wire wiring; the contract is identical, so view
 * code is the same on all four.
 *
 * Author usage inside a view bundle:
 *
 * ```ts
 * import { getHostShim } from "@elizaos/plugin-remote-manifest/host-shim";
 * const shim = getHostShim();
 * const ctx = await shim.request("provider.get", { name: "spotify" });
 * shim.on("plugin.event", (payload) => { /* ... *\/ });
 * ```
 *
 * The bundle MUST be served by the agent's view registry at
 * `/api/views/:id/bundle.js` (or the platform's equivalent
 * file/asset URL). The shim resolves the right URL via
 * `resolveViewUrl()` per platform.
 */
/**
 * Module-level singleton slot. The platform shim registers itself once
 * the view bundle loads (via `installHostShim`); the view code reaches
 * for `getHostShim()`.
 */
let activeShim = null;
/** Install a shim. Called once by the platform package. */
export function installHostShim(shim) {
    activeShim = shim;
}
/** Get the active shim. Throws if no platform has installed one. */
export function getHostShim() {
    if (!activeShim) {
        throw new Error("PluginHostShim not installed. Did you import a platform package " +
            "(@elizaos/plugin-remote-manifest/host-shim/electrobun / -ios / -android / -web)?");
    }
    return activeShim;
}
/** Reset the shim. Used in tests; never in production. */
export function resetHostShim() {
    activeShim = null;
}
//# sourceMappingURL=index.js.map