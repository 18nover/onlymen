import type { Plugin } from "./types/index.js";
/**
 * Resolves a plugin package name to a loaded {@link Plugin} object.
 *
 * Core never imports plugin modules by name and never installs packages — both
 * are host concerns and a supply-chain surface that must not live in the
 * kernel. Hosts (the `elizaos` CLI / `@elizaos/agent`, which already own plugin
 * loaders) inject a `PluginResolver` so that string plugin references coming
 * from character config can be turned into `Plugin` objects. Any package
 * installation must happen behind explicit user approval in that host layer,
 * never here.
 *
 * When no resolver is injected, string references are skipped (fail closed)
 * rather than dynamically imported.
 */
export interface PluginResolver {
    /**
     * Resolve a plugin package name (e.g. `@elizaos/plugin-sql`) to a Plugin
     * object, or `null` when the plugin cannot be resolved.
     */
    resolve(pluginName: string): Promise<Plugin | null>;
}
export declare function isValidPluginShape(obj: unknown): obj is Plugin;
export declare function validatePlugin(plugin: unknown): {
    isValid: boolean;
    errors: string[];
};
export declare function normalizePluginName(pluginName: string): string;
export declare function resolvePluginDependencies(availablePlugins: Map<string, Plugin>, isTestMode?: boolean): Plugin[];
export declare function loadPlugin(nameOrPlugin: string | Plugin, resolver?: PluginResolver): Promise<Plugin | null>;
export declare function resolvePlugins(plugins: (string | Plugin)[], isTestMode?: boolean, resolver?: PluginResolver): Promise<Plugin[]>;
//# sourceMappingURL=plugin.d.ts.map