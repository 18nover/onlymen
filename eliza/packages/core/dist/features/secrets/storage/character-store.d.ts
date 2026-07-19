/**
 * Character Settings Storage
 *
 * Stores global secrets in the character's settings.secrets object.
 * This is the primary storage for agent-level configuration and API keys.
 *
 * Note: This implementation directly accesses character.settings rather than
 * using getSetting()/setSetting() because those methods don't support object
 * values - they only return primitives (string | boolean | number | null).
 */
import type { IAgentRuntime } from "../../../types/index.js";
import { type KeyManager } from "../crypto/encryption.js";
import type { SecretConfig, SecretContext, SecretMetadata, StorageBackend } from "../types.js";
import { BaseSecretStorage } from "./interface.js";
/**
 * Character settings-based storage for global secrets
 *
 * Secrets are stored in character.settings.secrets with metadata
 * tracked separately for configuration management.
 */
export declare class CharacterSettingsStorage extends BaseSecretStorage {
    readonly storageType: StorageBackend;
    private runtime;
    private keyManager;
    private initialized;
    constructor(runtime: IAgentRuntime, keyManager: KeyManager);
    initialize(): Promise<void>;
    /**
     * Ensure the character.settings.secrets structure exists
     */
    private ensureSettingsStructure;
    exists(key: string, context: SecretContext): Promise<boolean>;
    get(key: string, context: SecretContext): Promise<string | null>;
    set(key: string, value: string, context: SecretContext, config?: Partial<SecretConfig>): Promise<boolean>;
    delete(key: string, context: SecretContext): Promise<boolean>;
    list(context: SecretContext): Promise<SecretMetadata>;
    getConfig(key: string, context: SecretContext): Promise<SecretConfig | null>;
    updateConfig(key: string, context: SecretContext, config: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Get the secrets object from character settings
     *
     * Accesses character.settings.secrets directly instead of using getSetting()
     * because getSetting() only returns primitives, not objects.
     */
    private getSecretsObject;
    private assertGlobalAccess;
}
//# sourceMappingURL=character-store.d.ts.map