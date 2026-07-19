/**
 * The `pluginState` provider: injects the current lifecycle state of every
 * plugin known to PluginManagerService into the prompt — loaded/ready/error/
 * unloaded status, load errors, plus ejected, protected, and startup-original
 * plugins. Owner-gated and relevance-gated to the connectors/settings contexts.
 */
import type { Provider } from "../../../types/components.js";
export declare const pluginStateProvider: Provider & {
    relevanceKeywords: string[];
};
//# sourceMappingURL=pluginStateProvider.d.ts.map