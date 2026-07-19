/**
 * Backs the plugin-manager's readiness checks for a registered plugin: given a
 * plugin, it reports which required config keys are still unset by reading the
 * plugin's own declared `config` schema and testing each key against
 * `process.env`. Works from real registered-plugin data, never by scanning
 * source files on disk.
 */
import type { Plugin as ElizaPlugin } from "../../../types/plugin.js";
import type { IAgentRuntime } from "../../../types/runtime.js";
import { Service } from "../../../types/service.js";
/**
 * Plugin configuration service that checks actual plugin config schemas
 * against the runtime's environment/settings.
 *
 * This service works with real data from registered plugins, NOT by
 * guessing paths or scanning source files on disk.
 */
export declare class PluginConfigurationService extends Service {
    static serviceType: import("../../../index.node.js").ServiceTypeName;
    capabilityDescription: string;
    static start(runtime: IAgentRuntime): Promise<PluginConfigurationService>;
    /**
     * Check which env vars from a plugin's config schema are missing.
     * Uses the plugin's actual `config` field (if defined) to determine requirements.
     */
    getMissingConfigKeys(plugin: ElizaPlugin): string[];
    /**
     * Get configuration status for a specific plugin.
     * Returns actual missing keys based on the plugin's config schema.
     */
    getPluginConfigStatus(plugin: ElizaPlugin): {
        configured: boolean;
        missingKeys: string[];
        totalKeys: number;
    };
    stop(): Promise<void>;
}
//# sourceMappingURL=pluginConfigurationService.d.ts.map