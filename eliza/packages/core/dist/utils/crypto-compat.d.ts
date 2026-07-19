type BufferEncodingName = "utf8" | "utf-8" | "base64" | "hex";
type HashDigestEncoding = BufferEncodingName;
interface HashBuilder {
    update(data: string | Uint8Array): HashBuilder;
    digest(): Uint8Array;
    digest(encoding: HashDigestEncoding): string;
}
/**
 * Create a hash object for incremental hashing (cross-platform - synchronous)
 *
 * This function works in both Node.js and browser environments using
 * synchronous noble hash implementations.
 *
 * @param algorithm - Hash algorithm ('sha256', 'sha1', 'sha512')
 * @returns Hash object with update() and digest() methods
 */
export declare function createHash(algorithm: string): {
    update(data: string | Uint8Array): HashBuilder;
    digest(): Uint8Array;
    digest(encoding: HashDigestEncoding): string;
};
/**
 * Create a hash asynchronously (works in both Node.js and browser)
 *
 * This is the recommended method for cross-platform code.
 *
 * @param algorithm - Hash algorithm ('sha256', 'sha1', 'sha512')
 * @param data - Data to hash
 * @returns Hash result
 */
export declare function createHashAsync(algorithm: string, data: string | Uint8Array): Promise<Uint8Array>;
export declare function createCipheriv(algorithm: string, key: Uint8Array, iv: Uint8Array): {
    update(data: string, inputEncoding: string, outputEncoding: string): string;
    final(encoding: string): string;
};
export declare function createDecipheriv(algorithm: string, key: Uint8Array, iv: Uint8Array): {
    update(data: string, inputEncoding: string, outputEncoding: string): string;
    final(encoding: string): string;
};
export declare function encryptAsync(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array>;
export declare function decryptAsync(key: Uint8Array, iv: Uint8Array, data: Uint8Array): Promise<Uint8Array>;
/**
 * Encrypt using AES-256-GCM (synchronous).
 *
 * This is used for cross-language secret encryption with integrity protection.
 */
export declare function encryptAes256Gcm(key: Uint8Array, iv: Uint8Array, plaintext: Uint8Array, aad?: Uint8Array): {
    ciphertext: Uint8Array;
    tag: Uint8Array;
};
/**
 * Decrypt using AES-256-GCM (synchronous).
 */
export declare function decryptAes256Gcm(key: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array, tag: Uint8Array, aad?: Uint8Array): Uint8Array;
export {};
//# sourceMappingURL=crypto-compat.d.ts.map