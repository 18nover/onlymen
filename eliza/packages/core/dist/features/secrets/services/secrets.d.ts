/**
 * Secrets Service
 *
 * Core service for multi-level secret management in ElizaOS.
 * Provides an API for accessing global, world, and user secrets
 * with encryption, access control, and change notification support.
 */
import { type IAgentRuntime, Service, type ServiceTypeName } from "../../../types/index.js";
import { KeyManager } from "../crypto/encryption.js";
import { CharacterSettingsStorage, ComponentSecretStorage, WorldMetadataStorage } from "../storage/index.js";
import type { PluginSecretRequirement, SecretAccessLog, SecretChangeCallback, SecretConfig, SecretContext, SecretMetadata, SecretsServiceConfig, ValidationResult } from "../types.js";
/**
 * Service type identifier
 */
export declare const SECRETS_SERVICE_TYPE: ServiceTypeName;
/**
 * Secrets Service
 *
 * service for managing secrets at all levels:
 * - Global: Stored in character settings (agent-wide config, API keys)
 * - World: Stored in world metadata (server/channel-specific)
 * - User: Stored as components (per-user secrets)
 */
export declare class SecretsService extends Service {
    static serviceType: ServiceTypeName;
    capabilityDescription: string;
    private secretsConfig;
    private keyManager;
    private storage;
    private globalStorage;
    private worldStorage;
    private userStorage;
    /**
     * Non-decrypting broker backend (issue #11536, phase E4). `undefined` unless
     * BOTH the broker env is configured (`ELIZA_SECRETS_BROKER_URL`/`_TOKEN`) AND
     * a concrete {@link ISecretBrokerClient} was supplied via config. When unset,
     * behaviour is byte-for-byte the existing local composite default.
     */
    private broker?;
    private accessLogs;
    private changeCallbacks;
    private globalChangeCallbacks;
    constructor(runtime?: IAgentRuntime, config?: Partial<SecretsServiceConfig>);
    /**
     * Start the service
     */
    static start(runtime: IAgentRuntime, config?: Partial<SecretsServiceConfig>): Promise<SecretsService>;
    /**
     * Initialize the service
     */
    private initialize;
    /**
     * Stop the service
     */
    stop(): Promise<void>;
    /**
     * Get a secret value.
     * Automatically resolves aliases to canonical names.
     */
    get(key: string, context: SecretContext): Promise<string | null>;
    /**
     * Set a secret value.
     */
    set(key: string, value: string, context: SecretContext, config?: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Delete a secret.
     */
    delete(key: string, context: SecretContext): Promise<boolean>;
    /**
     * Check if a secret exists.
     */
    exists(key: string, context: SecretContext): Promise<boolean>;
    /**
     * List secrets (metadata only, no values)
     */
    list(context: SecretContext): Promise<SecretMetadata>;
    /**
     * Get secret configuration
     */
    getConfig(key: string, context: SecretContext): Promise<SecretConfig | null>;
    /**
     * Update secret configuration
     */
    updateConfig(key: string, context: SecretContext, config: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Get a global secret (agent-level)
     */
    getGlobal(key: string): Promise<string | null>;
    /**
     * Set a global secret (agent-level)
     */
    setGlobal(key: string, value: string, config?: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Get a world secret
     */
    getWorld(key: string, worldId: string): Promise<string | null>;
    /**
     * Set a world secret
     */
    setWorld(key: string, value: string, worldId: string, config?: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Get a user secret
     */
    getUser(key: string, userId: string): Promise<string | null>;
    /**
     * Set a user secret
     */
    setUser(key: string, value: string, userId: string, config?: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Validate a secret value
     */
    validate(key: string, value: string, strategy?: string): Promise<ValidationResult>;
    /**
     * Get available validation strategies
     */
    getValidationStrategies(): string[];
    /**
     * Check which secrets are missing for a plugin
     */
    checkPluginRequirements(_pluginId: string, requirements: Record<string, PluginSecretRequirement>): Promise<{
        ready: boolean;
        missingRequired: string[];
        missingOptional: string[];
        invalid: string[];
    }>;
    /**
     * Get missing secrets for a set of keys
     */
    getMissingSecrets(keys: string[], level?: "global" | "world" | "user"): Promise<string[]>;
    /**
     * Register a callback for changes to a specific secret
     */
    onSecretChanged(key: string, callback: SecretChangeCallback): () => void;
    /**
     * Register a callback for all secret changes
     */
    onAnySecretChanged(callback: SecretChangeCallback): () => void;
    /**
     * Emit a change event to registered callbacks
     */
    private emitChangeEvent;
    /**
     * Log a secret access attempt
     */
    private logAccess;
    /**
     * Get access logs
     */
    getAccessLogs(filter?: {
        key?: string;
        action?: string;
        context?: Partial<SecretContext>;
        since?: number;
    }): SecretAccessLog[];
    /**
     * Clear access logs
     */
    clearAccessLogs(): void;
    /**
     * Get the global storage backend
     */
    getGlobalStorage(): CharacterSettingsStorage;
    /**
     * Get the world storage backend
     */
    getWorldStorage(): WorldMetadataStorage;
    /**
     * Get the user storage backend
     */
    getUserStorage(): ComponentSecretStorage;
    /**
     * Get the key manager (for advanced use cases)
     */
    getKeyManager(): KeyManager;
}
//# sourceMappingURL=secrets.d.ts.map