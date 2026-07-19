import type { Plugin as ElizaPlugin } from "../../../types/plugin.js";
import type { IAgentRuntime } from "../../../types/runtime.js";
import type { ServiceTypeName } from "../../../types/service.js";
import { Service } from "../../../types/service.js";
import { type EjectedPluginInfo, type EjectResult, type InstallProgress, type InstallResult, type LoadPluginParams, type PluginManagerConfig, type PluginRegistry, type PluginState, type ReinjectResult, type SyncResult, type UninstallResult, type UnloadPluginParams } from "../types.js";
import { type PluginSearchResult, type RegistryPlugin } from "./pluginRegistryService.js";
export declare function resetRegistryCache(): void;
export declare class PluginManagerService extends Service implements PluginRegistry {
    static serviceType: ServiceTypeName;
    capabilityDescription: string;
    plugins: Map<string, PluginState>;
    private pluginManagerConfig;
    private originalPlugins;
    private originalActions;
    private originalProviders;
    private originalServices;
    private componentRegistry;
    private installLock;
    private ejectLock;
    private readonly PROTECTED_PLUGINS;
    constructor(runtime?: IAgentRuntime, config?: PluginManagerConfig);
    static start(runtime: IAgentRuntime, config?: PluginManagerConfig): Promise<PluginManagerService>;
    private storeOriginalComponents;
    private initializeRegistry;
    getPlugin(id: string): PluginState | undefined;
    getAllPlugins(): PluginState[];
    getLoadedPlugins(): PluginState[];
    updatePluginState(id: string, update: Partial<PluginState>): void;
    loadPlugin({ pluginId, force, }: LoadPluginParams): Promise<void>;
    unloadPlugin({ pluginId }: UnloadPluginParams): Promise<void>;
    registerPlugin(plugin: ElizaPlugin): Promise<string>;
    private trackComponentRegistration;
    private registerPluginComponents;
    private unregisterPluginComponents;
    stop(): Promise<void>;
    private isProtectedPlugin;
    getProtectedPlugins(): string[];
    getOriginalPlugins(): string[];
    canUnloadPlugin(pluginName: string): boolean;
    getProtectionReason(pluginName: string): string | null;
    private serialiseInstall;
    private serialiseEject;
    private getPluginsBaseDir;
    private getEjectedBaseDir;
    private isWithinDir;
    private sanitisePackageName;
    private getPluginInstallPath;
    /**
     * Install a plugin from the registry.
     * Supports `PLUGIN_MANAGER_LOCAL_CLONE` to auto-clone instead of npm install.
     */
    installPlugin(pluginName: string, onProgress?: (progress: InstallProgress) => void): Promise<InstallResult>;
    private installFromNpm;
    private installFromGit;
    private resolveRegistrySourceDir;
    private clonePluginTo;
    /**
     * Update an installed plugin to the latest available version.
     *
     * Resolves the registry entry (which always points to the latest npm
     * version) and re-runs install. The package manager treats the existing
     * install as unchanged when the version already matches and as an upgrade
     * otherwise.
     */
    updatePlugin(pluginName: string, onProgress?: (progress: InstallProgress) => void): Promise<InstallResult>;
    uninstallPlugin(pluginName: string): Promise<UninstallResult>;
    listInstalledPlugins(): Promise<EjectedPluginInfo[]>;
    searchRegistry(query: string, limit?: number): Promise<PluginSearchResult[]>;
    getRegistryPlugin(name: string): Promise<RegistryPlugin | null>;
    refreshRegistry(): Promise<Map<string, RegistryPlugin>>;
    private resolveEntryPoint;
    ejectPlugin(pluginId: string): Promise<EjectResult>;
    syncPlugin(pluginId: string): Promise<SyncResult>;
    reinjectPlugin(pluginId: string): Promise<ReinjectResult>;
    listEjectedPlugins(): Promise<EjectedPluginInfo[]>;
}
//# sourceMappingURL=pluginManagerService.d.ts.map