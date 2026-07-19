/**
 * World Metadata Storage
 *
 * Stores world-level secrets in the world's metadata.secrets object.
 * This is used for server/channel-specific configuration like Discord tokens.
 */
import type { IAgentRuntime } from "../../../types/index.js";
import { type KeyManager } from "../crypto/encryption.js";
import type { SecretConfig, SecretContext, SecretMetadata, StorageBackend } from "../types.js";
import { BaseSecretStorage } from "./interface.js";
/**
 * World metadata-based storage for world-level secrets
 *
 * Secrets are stored in world.metadata.secrets with access control
 * based on world roles (OWNER/ADMIN can write, all members can read).
 */
export declare class WorldMetadataStorage extends BaseSecretStorage {
    readonly storageType: StorageBackend;
    private runtime;
    private keyManager;
    private worldCache;
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
     * Get a world from cache or database
     */
    private getWorld;
    /**
     * Get secrets object from world metadata
     */
    private getWorldSecrets;
    /**
     * Check if a user has write permission in a world
     */
    private checkWritePermission;
    private assertReadPermission;
    private assertWritePermission;
    private checkReadPermission;
    /**
     * Clear the world cache
     */
    clearCache(): void;
    /**
     * Invalidate a specific world in the cache
     */
    invalidateWorld(worldId: string): void;
}
//# sourceMappingURL=world-store.d.ts.map