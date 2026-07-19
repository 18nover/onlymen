/**
 * Plugin Activator Service
 *
 * Enables dynamic plugin activation when required secrets become available.
 * Plugins can register for activation with their secret requirements,
 * and will be activated automatically once all secrets are present.
 */
import { type IAgentRuntime, type Plugin, Service, type ServiceTypeName } from "../../../types/index.js";
import type { PluginActivatorConfig, PluginRequirementStatus, PluginSecretRequirement } from "../types.js";
/**
 * Service type identifier
 */
export declare const PLUGIN_ACTIVATOR_SERVICE_TYPE: ServiceTypeName;
/**
 * Extended Plugin interface with secret requirements
 */
export interface PluginWithSecrets extends Plugin {
    /** Required secrets for this plugin to function */
    requiredSecrets?: Record<string, PluginSecretRequirement>;
    /** Called when all required secrets become available */
    onSecretsReady?: (runtime: IAgentRuntime) => Promise<void>;
    /** Called when a required secret changes */
    onSecretChanged?: (key: string, value: string | null, runtime: IAgentRuntime) => Promise<void>;
}
/**
 * Plugin Activator Service
 *
 * Manages the lifecycle of plugins that depend on secrets:
 * - Tracks plugins waiting for secrets
 * - Automatically activates plugins when requirements are met
 * - Notifies plugins when their secrets change
 * - Supports onSecretsReady and onSecretChanged callbacks
 */
export declare class PluginActivatorService extends Service {
    static serviceType: ServiceTypeName;
    capabilityDescription: string;
    private activatorConfig;
    private secretsService;
    private pendingPlugins;
    private activatedPlugins;
    private pluginSecretMapping;
    private pollingInterval;
    private unsubscribeSecretChanges;
    /** Registered plugins with their callbacks */
    private registeredPlugins;
    /** Listeners for secrets ready events */
    private secretsReadyListeners;
    /** Listeners for secret changed events */
    private secretChangedListeners;
    constructor(runtime?: IAgentRuntime, config?: Partial<PluginActivatorConfig>);
    /**
     * Start the service
     */
    static start(runtime: IAgentRuntime, config?: Partial<PluginActivatorConfig>): Promise<PluginActivatorService>;
    /**
     * Initialize the service
     */
    private initialize;
    /**
     * Wait for SecretsService to become available using runtime's service load promise
     */
    private waitForSecretsService;
    /**
     * Bind to the SecretsService for change notifications
     */
    private bindToSecretsService;
    /**
     * Stop the service
     */
    stop(): Promise<void>;
    /**
     * Register a plugin for activation when secrets are ready
     */
    registerPlugin(plugin: PluginWithSecrets, activationCallback?: () => Promise<void>): Promise<boolean>;
    /**
     * Unregister a pending plugin
     */
    unregisterPlugin(pluginId: string): boolean;
    /**
     * Activate a plugin
     */
    private activatePlugin;
    /**
     * Check requirements for a plugin
     */
    checkPluginRequirements(plugin: PluginWithSecrets): Promise<PluginRequirementStatus>;
    /**
     * Get status of all registered plugins
     */
    getPluginStatuses(): Map<string, {
        pending: boolean;
        activated: boolean;
        missingSecrets: string[];
    }>;
    /**
     * Handle secret change event
     */
    private onSecretChanged;
    /**
     * Notify activated plugins about a secret change.
     */
    private notifySecretChanged;
    /**
     * Get missing secrets from a list
     */
    private getMissingSecrets;
    /**
     * Start polling for pending plugins
     */
    private startPolling;
    /**
     * Check all pending plugins
     */
    private checkPendingPlugins;
    /**
     * Get list of pending plugins
     */
    getPendingPlugins(): string[];
    /**
     * Get list of activated plugins
     */
    getActivatedPlugins(): string[];
    /**
     * Check if a plugin is pending
     */
    isPending(pluginId: string): boolean;
    /**
     * Check if a plugin is activated
     */
    isActivated(pluginId: string): boolean;
    /**
     * Get secrets required by pending plugins
     */
    getRequiredSecrets(): Set<string>;
    /**
     * Get plugins waiting for a specific secret
     */
    getPluginsWaitingFor(secretKey: string): string[];
    /**
     * Subscribe to secrets ready event for a specific plugin.
     * The callback will be invoked when all required secrets for the plugin become available.
     *
     * @param pluginId - Plugin identifier to subscribe to
     * @param callback - Callback to invoke when secrets are ready
     * @returns Unsubscribe function
     */
    onSecretsReady(pluginId: string, callback: (runtime: IAgentRuntime) => Promise<void>): () => void;
    /**
     * Subscribe to secret changed events for a specific secret key.
     * The callback will be invoked whenever the specified secret changes.
     *
     * @param secretKey - Secret key to subscribe to
     * @param callback - Callback to invoke when secret changes
     * @returns Unsubscribe function
     */
    onSecretChangedKey(secretKey: string, callback: (key: string, value: string | null, runtime: IAgentRuntime) => Promise<void>): () => void;
    /**
     * Subscribe to all secret changed events.
     * The callback will be invoked whenever any secret changes.
     *
     * @param callback - Callback to invoke when any secret changes
     * @returns Unsubscribe function
     */
    onAnySecretChanged(callback: (key: string, value: string | null, runtime: IAgentRuntime) => Promise<void>): () => void;
    /**
     * Get the registered plugin by ID.
     */
    getRegisteredPlugin(pluginId: string): PluginWithSecrets | undefined;
    /**
     * Get all registered plugin IDs.
     */
    getRegisteredPluginIds(): string[];
    /**
     * Check if a plugin has the onSecretChanged callback.
     */
    hasSecretChangedCallback(pluginId: string): boolean;
    /**
     * Check if a plugin has the onSecretsReady callback.
     */
    hasSecretsReadyCallback(pluginId: string): boolean;
}
//# sourceMappingURL=plugin-activator.d.ts.map