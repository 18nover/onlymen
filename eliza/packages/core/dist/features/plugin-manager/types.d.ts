/**
 * Shared type surface for the plugin-manager capability: the `ServiceTypeRegistry`
 * augmentation and `PluginManagerServiceType` constants for its four services,
 * the `PluginStatus` lifecycle enum, the in-runtime plugin/component tracking
 * shapes (`PluginState`, `PluginComponents`, `PluginRegistry`,
 * `ComponentRegistration`), and the result/progress DTOs for install, uninstall,
 * eject, sync, and reinject operations plus registry metadata.
 */
import type { EventPayload, EventPayloadMap } from "../../types/events.js";
import type { Plugin as ElizaPlugin } from "../../types/plugin.js";
import type { ServiceTypeName } from "../../types/service.js";
declare module "../../types/service.ts" {
    interface ServiceTypeRegistry {
        PLUGIN_MANAGER: "plugin_manager";
        PLUGIN_CONFIGURATION: "plugin_configuration";
        REGISTRY: "registry";
        CORE_MANAGER: "core_manager";
    }
}
export declare const PluginManagerServiceType: {
    readonly PLUGIN_MANAGER: ServiceTypeName;
    readonly PLUGIN_CONFIGURATION: ServiceTypeName;
    readonly REGISTRY: ServiceTypeName;
    readonly CORE_MANAGER: ServiceTypeName;
};
export declare enum PluginStatus {
    READY = "ready",
    LOADED = "loaded",
    ERROR = "error",
    UNLOADED = "unloaded"
}
export interface PluginComponents {
    actions: Set<string>;
    providers: Set<string>;
    services: Set<string>;
    eventHandlers: Map<string, Set<(params: EventPayloadMap[keyof EventPayloadMap] | EventPayload) => Promise<void>>>;
}
export interface ComponentRegistration {
    pluginId: string;
    componentType: "action" | "provider" | "service" | "eventHandler";
    componentName: string;
    timestamp: number;
}
export interface PluginState {
    id: string;
    name: string;
    status: PluginStatus;
    plugin?: ElizaPlugin;
    error?: string;
    createdAt: number;
    loadedAt?: number;
    unloadedAt?: number;
    version?: string;
    components?: PluginComponents;
}
export interface PluginRegistry {
    plugins: Map<string, PluginState>;
    getPlugin(id: string): PluginState | undefined;
    getAllPlugins(): PluginState[];
    getLoadedPlugins(): PluginState[];
    updatePluginState(id: string, update: Partial<PluginState>): void;
}
export interface LoadPluginParams {
    pluginId: string;
    force?: boolean;
}
export interface UnloadPluginParams {
    pluginId: string;
    force?: boolean;
}
export interface PluginManagerConfig {
    pluginDirectory?: string;
}
export interface InstallProgress {
    phase: "fetching-registry" | "resolving" | "downloading" | "extracting" | "installing-deps" | "validating" | "configuring" | "restarting" | "complete" | "error";
    pluginName?: string;
    message: string;
}
export interface PluginMetadata {
    name: string;
    description: string;
    author: string;
    repository: string;
    versions: string[];
    latestVersion: string;
    runtimeVersion: string;
    maintainer: string;
    tags?: string[];
    categories?: string[];
}
export interface UpstreamMetadata {
    $schema: "eliza-upstream-v1";
    source: string;
    gitUrl: string;
    branch: string;
    commitHash: string;
    ejectedAt: string;
    npmPackage: string;
    npmVersion: string;
    lastSyncAt: string | null;
    localCommits: number;
}
export interface EjectedPluginInfo {
    name: string;
    path: string;
    version: string;
    upstream: UpstreamMetadata | null;
}
export interface EjectResult {
    success: boolean;
    pluginName: string;
    ejectedPath: string;
    upstreamCommit: string;
    requiresRestart: boolean;
    error?: string;
}
export interface SyncResult {
    success: boolean;
    pluginName: string;
    ejectedPath: string;
    upstreamCommits: number;
    localChanges: boolean;
    conflicts: string[];
    commitHash: string;
    requiresRestart: boolean;
    error?: string;
}
export interface ReinjectResult {
    success: boolean;
    pluginName: string;
    removedPath: string;
    requiresRestart: boolean;
    error?: string;
}
export interface InstallResult {
    success: boolean;
    pluginName: string;
    version: string;
    installPath: string;
    requiresRestart: boolean;
    error?: string;
}
export interface UninstallResult {
    success: boolean;
    pluginName: string;
    requiresRestart: boolean;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map