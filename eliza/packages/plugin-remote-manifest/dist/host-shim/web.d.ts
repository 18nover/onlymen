/**
 * Web / XR iframe implementation of {@link PluginHostShim}. The view
 * bundle loads inside an iframe whose parent is the elizaOS dashboard
 * (or the XR view-host page from `plugins/plugin-xr`). Requests are
 * delivered via `parent.postMessage` and the parent forwards them to
 * the agent's HTTP endpoint at `/api/plugins/remote/:name/invoke`.
 *
 * The wire envelope between iframe and parent is a tiny JSON object:
 *
 *     { kind: "elizaos.shim.request", id, method, params }
 *     { kind: "elizaos.shim.response", id, ok, payload?, error? }
 *     { kind: "elizaos.shim.event", event, data }
 */
import { type PluginHostShim } from "./index.js";
/**
 * Build and install the web shim. Idempotent — calling twice is a
 * single-install operation. Returns the installed shim for callers that want to keep a
 * reference (most just use {@link getHostShim}).
 */
export declare function installWebShim(options?: {
    /** Origin to send postMessage to. Defaults to "*"; production agents should pin this. */
    parentOrigin?: string;
    /** Milliseconds before a parent request is rejected. Default 30s. */
    requestTimeoutMs?: number;
    /** Base path the agent serves view bundles from. Default `/api/views`. */
    viewsBasePath?: string;
}): PluginHostShim;
export declare function resetWebShimForTests(): void;
//# sourceMappingURL=web.d.ts.map