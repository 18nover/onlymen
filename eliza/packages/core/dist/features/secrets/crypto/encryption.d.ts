/**
 * Encryption module for secrets management
 *
 * Provides AES-256-GCM encryption with secure key derivation for protecting sensitive data.
 */
import type { EncryptedSecret, KeyDerivationParams } from "../types.js";
declare const ALGORITHM_GCM = "aes-256-gcm";
declare const IV_LENGTH = 16;
declare const KEY_LENGTH = 32;
declare const DEFAULT_SALT_LENGTH = 32;
declare const DEFAULT_PBKDF2_ITERATIONS = 100000;
/**
 * Generate a cryptographically secure random salt
 */
export declare function generateSalt(length?: number): string;
/**
 * Generate a random encryption key
 */
export declare function generateKey(): Buffer;
/**
 * Derive an encryption key from a password/passphrase using PBKDF2
 *
 * @param password - The password or passphrase to derive from
 * @param salt - The salt (should be unique per key)
 * @param iterations - Number of PBKDF2 iterations (default: 100000)
 * @returns The derived key as a Buffer
 */
export declare function deriveKeyPbkdf2(password: string, salt: string | Buffer, iterations?: number): Buffer;
/**
 * Derive an encryption key from a password using scrypt (more memory-hard)
 *
 * @param password - The password or passphrase to derive from
 * @param salt - The salt (should be unique per key)
 * @returns The derived key as a Buffer
 */
export declare function deriveKeyScrypt(password: string, salt: string | Buffer): Buffer;
/**
 * Create key derivation parameters for storage
 */
export declare function createKeyDerivationParams(salt?: string, iterations?: number): KeyDerivationParams;
/**
 * Encrypt a value using AES-256-GCM
 *
 * GCM mode provides both confidentiality and authenticity, making it the preferred
 * choice for encrypting secrets. The authentication tag prevents tampering.
 *
 * @param plaintext - The value to encrypt
 * @param key - The encryption key (32 bytes)
 * @param keyId - Identifier for the key (for rotation support)
 * @returns Encrypted secret container
 */
export declare function encryptGcm(plaintext: string, key: Buffer, keyId?: string): EncryptedSecret;
/**
 * Encrypt a value using the default algorithm (GCM)
 */
export declare function encrypt(plaintext: string, key: Buffer, keyId?: string): EncryptedSecret;
/**
 * Decrypt a value encrypted with AES-256-GCM
 *
 * @param encrypted - The encrypted secret container
 * @param key - The decryption key (32 bytes)
 * @returns The decrypted plaintext
 */
export declare function decryptGcm(encrypted: EncryptedSecret, key: Buffer): string;
/**
 * Decrypt a value using the appropriate algorithm
 *
 * @param encrypted - The encrypted secret container
 * @param key - The decryption key (32 bytes)
 * @returns The decrypted plaintext
 */
export declare function decrypt(encrypted: EncryptedSecret, key: Buffer): string;
/**
 * Check if a value appears to be an encrypted secret
 */
export declare function isEncryptedSecret(value: unknown): value is EncryptedSecret;
/**
 * Generate a secure random string for tokens, IDs, etc.
 */
export declare function generateSecureToken(length?: number): string;
/**
 * Hash a value for comparison or fingerprinting (not for passwords)
 */
export declare function hashValue(value: string, algorithm?: "sha256" | "sha512"): string;
/**
 * Securely compare two strings in constant time to prevent timing attacks
 */
export declare function secureCompare(a: string, b: string): boolean;
/**
 * Manages encryption keys with support for rotation and multiple key IDs
 */
export declare class KeyManager {
    private keys;
    private currentKeyId;
    private derivationParams;
    constructor(options?: {
        primaryKey?: Buffer;
        primaryKeyId?: string;
        derivationParams?: KeyDerivationParams;
    });
    /**
     * Initialize with a password-derived key
     */
    initializeFromPassword(password: string, salt?: string): void;
    /**
     * Add a key for decryption (supports key rotation)
     */
    addKey(keyId: string, key: Buffer): void;
    /**
     * Set the current key for encryption
     */
    setCurrentKey(keyId: string): void;
    /**
     * Get the current key ID
     */
    getCurrentKeyId(): string;
    /**
     * Get a key by ID
     */
    getKey(keyId: string): Buffer | undefined;
    /**
     * Get the current encryption key
     */
    getCurrentKey(): Buffer;
    /**
     * Get derivation parameters (for storage)
     */
    getDerivationParams(): KeyDerivationParams | null;
    /**
     * Encrypt a value with the current key
     */
    encrypt(plaintext: string): EncryptedSecret;
    /**
     * Decrypt a value (automatically selects the correct key)
     */
    decrypt(encrypted: EncryptedSecret): string;
    /**
     * Re-encrypt a value with the current key (for key rotation)
     */
    reencrypt(encrypted: EncryptedSecret): EncryptedSecret;
    /**
     * Clear all keys from memory
     */
    clear(): void;
}
export { ALGORITHM_GCM, DEFAULT_PBKDF2_ITERATIONS, DEFAULT_SALT_LENGTH, IV_LENGTH, KEY_LENGTH, };
//# sourceMappingURL=encryption.d.ts.map