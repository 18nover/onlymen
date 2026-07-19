/**
 * Component Storage
 *
 * Stores user-level secrets as Components in the ElizaOS database.
 * Each user's secrets are isolated via the component's entityId.
 */
import type { IAgentRuntime } from "../../../types/index.js";
import { type KeyManager } from "../crypto/encryption.js";
import type { SecretConfig, SecretContext, SecretMetadata, StorageBackend } from "../types.js";
import { BaseSecretStorage } from "./interface.js";
/**
 * Component-based storage for user-level secrets
 *
 * Each secret is stored as a Component with type='secret' and entityId
 * set to the user's ID, providing natural isolation per user.
 */
export declare class ComponentSecretStorage extends BaseSecretStorage {
    readonly storageType: StorageBackend;
    private runtime;
    private keyManager;
    constructor(runtime: IAgentRuntime, keyManager: KeyManager);
    initialize(): Promise<void>;
    exists(key: string, context: SecretContext): Promise<boolean>;
    get(key: string, context: SecretContext): Promise<string | null>;
    set(key: string, value: string, context: SecretContext, config?: Partial<SecretConfig>): Promise<boolean>;
    delete(key: string, context: SecretContext): Promise<boolean>;
    list(context: SecretContext): Promise<SecretMetadata>;
    getConfig(key: string, context: SecretContext): Promise<SecretConfig | null>;
    updateConfig(key: string, context: SecretContext, config: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Find a secret component for a user by key
     */
    private findSecretComponent;
    private assertUserAccess;
    /**
     * Get all secret keys for a user
     */
    listKeys(userId: string): Promise<string[]>;
    /**
     * Delete all secrets for a user
     */
    deleteAllForUser(userId: string): Promise<number>;
    /**
     * Count secrets for a user
     */
    countForUser(userId: string): Promise<number>;
}
//# sourceMappingURL=component-store.d.ts.map