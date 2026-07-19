/**
 * The `pluginConfigurationStatus` provider: injects per-plugin configuration
 * readiness into the prompt — which registered plugins are configured versus
 * missing required env keys/secrets — derived from each plugin's config schema
 * via PluginConfigurationService. Owner-gated and relevance-gated to the
 * connectors/settings contexts, so it only fires on plugin-configuration talk.
 */
import type { Provider } from "../../../types/components.js";
export declare const pluginConfigurationStatusProvider: Provider & {
    relevanceKeywords: string[];
};
//# sourceMappingURL=pluginConfigurationStatus.d.ts.map