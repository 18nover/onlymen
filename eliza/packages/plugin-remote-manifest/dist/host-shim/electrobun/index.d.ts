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
import { type PluginHostShim } from "../index.js";
interface ElectrobunBridge {
    postMessage(message: unknown): void;
    addListener(event: string, handler: (data: unknown) => void): () => void;
}
declare global {
    var __elizaosElectrobunBridge: ElectrobunBridge | undefined;
}
export declare function installElectrobunShim(options?: {
    /** Milliseconds before a bridge request is rejected. Default 30s. */
    requestTimeoutMs?: number;
}): PluginHostShim;
export declare function resetElectrobunShimForTests(): void;
export {};
//# sourceMappingURL=index.d.ts.map