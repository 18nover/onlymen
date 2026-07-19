/**
 * Storage Interface Definitions
 *
 * Defines the contract that all storage backends must implement.
 * Designed for ElizaOS native storage patterns.
 */
import type { ISecretStorage, SecretConfig, SecretContext, SecretMetadata, StorageBackend } from "../types.js";
export type { ISecretStorage };
/**
 * Abstract base class for secret storage implementations
 *
 * Provides common functionality and enforces the storage interface.
 */
export declare abstract class BaseSecretStorage implements ISecretStorage {
    abstract readonly storageType: StorageBackend;
    abstract initialize(): Promise<void>;
    abstract exists(key: string, context: SecretContext): Promise<boolean>;
    abstract get(key: string, context: SecretContext): Promise<string | null>;
    abstract set(key: string, value: string, context: SecretContext, config?: Partial<SecretConfig>): Promise<boolean>;
    abstract delete(key: string, context: SecretContext): Promise<boolean>;
    abstract list(context: SecretContext): Promise<SecretMetadata>;
    abstract getConfig(key: string, context: SecretContext): Promise<SecretConfig | null>;
    abstract updateConfig(key: string, context: SecretContext, config: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Create a default secret configuration
     */
    protected createDefaultConfig(key: string, context: SecretContext, partial?: Partial<SecretConfig>): SecretConfig;
}
/**
 * Composite storage that delegates to multiple backends based on context
 */
export declare class CompositeSecretStorage implements ISecretStorage {
    readonly storageType: StorageBackend;
    private globalStorage;
    private worldStorage;
    private userStorage;
    constructor(options: {
        globalStorage: ISecretStorage;
        worldStorage: ISecretStorage;
        userStorage: ISecretStorage;
    });
    initialize(): Promise<void>;
    private getStorageForContext;
    exists(key: string, context: SecretContext): Promise<boolean>;
    get(key: string, context: SecretContext): Promise<string | null>;
    set(key: string, value: string, context: SecretContext, config?: Partial<SecretConfig>): Promise<boolean>;
    delete(key: string, context: SecretContext): Promise<boolean>;
    list(context: SecretContext): Promise<SecretMetadata>;
    getConfig(key: string, context: SecretContext): Promise<SecretConfig | null>;
    updateConfig(key: string, context: SecretContext, config: Partial<SecretConfig>): Promise<boolean>;
}
//# sourceMappingURL=interface.d.ts.map