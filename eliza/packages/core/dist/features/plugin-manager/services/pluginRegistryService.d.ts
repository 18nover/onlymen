import type { PluginMetadata } from "../types.js";
export interface RegistryPlugin {
    name: string;
    gitRepo: string;
    gitUrl: string;
    directory?: string | null;
    description: string;
    homepage: string | null;
    topics: string[];
    stars: number;
    language: string;
    npm: {
        package: string;
        v0Version: string | null;
        v1Version: string | null;
        v2Version: string | null;
        v0CoreRange: string | null;
        v1CoreRange: string | null;
        v2CoreRange: string | null;
    };
    git: {
        v0Branch: string | null;
        v1Branch: string | null;
        v2Branch: string | null;
    };
    supports: {
        v0: boolean;
        v1: boolean;
        v2: boolean;
    };
    viewer?: {
        url: string;
        embedParams?: Record<string, string>;
        postMessageAuth?: boolean;
        sandbox?: string;
    };
    launchType?: "connect" | "local" | "url" | "overlay" | string;
    launchUrl?: string;
    displayName?: string;
    kind?: string;
    category?: string;
    capabilities?: string[];
    icon?: string | null;
    registryKind?: string;
    origin?: "builtin" | "third-party" | string;
    source?: string;
    support?: "first-party" | "community" | string;
    builtIn?: boolean;
    firstParty?: boolean;
    thirdParty?: boolean;
    status?: string;
}
export interface PluginSearchResult {
    name: string;
    description: string;
    score: number;
    tags: string[];
    version: string | null;
    npmPackage: string;
    repository: string;
    stars: number;
    supports: {
        v0: boolean;
        v1: boolean;
        v2: boolean;
    };
}
export interface CloneResult {
    success: boolean;
    error?: string;
    pluginName?: string;
    localPath?: string;
    hasTests?: boolean;
    dependencies?: Record<string, string>;
}
export declare function resetRegistryCache(): void;
/**
 * Load the plugin registry from the next@registry branch.
 * Tries generated-registry.json first, falls back to index.json.
 * Also scans local plugins/ directory for elizaos.plugin.json files.
 * Local plugins override remote registry entries.
 * Cached in-memory for 1 hour.
 */
export declare function loadRegistry(): Promise<Map<string, RegistryPlugin>>;
export declare function getRegistryEntry(name: string): Promise<RegistryPlugin | null>;
export declare function searchPluginsByContent(query: string, limit?: number): Promise<PluginSearchResult[]>;
export declare function getPluginDetails(name: string): Promise<PluginMetadata | null>;
export declare function getAllPlugins(): Promise<PluginMetadata[]>;
export declare function listNonAppPlugins(): Promise<RegistryPlugin[]>;
export declare function searchNonAppPlugins(query: string, limit?: number): Promise<PluginSearchResult[]>;
export declare function refreshRegistry(): Promise<Map<string, RegistryPlugin>>;
export declare function clonePlugin(pluginName: string): Promise<CloneResult>;
//# sourceMappingURL=pluginRegistryService.d.ts.map