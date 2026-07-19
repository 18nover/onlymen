/**
 * Memory-based Secret Storage
 *
 * In-memory storage backend for secrets. Useful for testing and
 * ephemeral environments where persistence is not required.
 */
import type { SecretConfig, SecretContext, SecretMetadata, StorageBackend } from "../types.js";
import { BaseSecretStorage } from "./interface.js";
/**
 * Memory-based secret storage implementation
 */
export declare class MemorySecretStorage extends BaseSecretStorage {
    readonly storageType: StorageBackend;
    private store;
    initialize(): Promise<void>;
    exists(key: string, context: SecretContext): Promise<boolean>;
    get(key: string, context: SecretContext): Promise<string | null>;
    set(key: string, value: string, context: SecretContext, config?: Partial<SecretConfig>): Promise<boolean>;
    delete(key: string, context: SecretContext): Promise<boolean>;
    list(context: SecretContext): Promise<SecretMetadata>;
    getConfig(key: string, context: SecretContext): Promise<SecretConfig | null>;
    updateConfig(key: string, context: SecretContext, config: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Generate a storage key from the secret key and context
     */
    private generateStorageKey;
    /**
     * Get the storage key prefix for a context level
     */
    private getContextPrefix;
    /**
     * Extract the original key from a storage key
     */
    private extractOriginalKey;
    /**
     * Clear all stored secrets (for testing)
     */
    clear(): void;
    /**
     * Get the number of stored secrets (for testing)
     */
    size(): number;
}
//# sourceMappingURL=memory-store.d.ts.map