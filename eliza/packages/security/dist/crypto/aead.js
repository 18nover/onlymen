/**
 * AES-256-GCM helpers for KMS adapters that require authenticated associated data.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
export const AEAD_KEY_BYTES = 32;
export const AEAD_NONCE_BYTES = 12;
export const AEAD_TAG_BYTES = 16;
export class AeadError extends Error {
    constructor(message) {
        super(message);
        this.name = "AeadError";
    }
}
function asBuffer(value) {
    return Buffer.isBuffer(value) ? value : Buffer.from(value);
}
function requireAad(aad) {
    if (!aad || aad.length === 0) {
        throw new AeadError("AEAD aad is required");
    }
    return aad;
}
export function aeadEncrypt(key, plaintext, aad) {
    if (key.length !== AEAD_KEY_BYTES) {
        throw new AeadError(`AEAD key must be ${AEAD_KEY_BYTES} bytes`);
    }
    const requiredAad = requireAad(aad);
    const nonce = randomBytes(AEAD_NONCE_BYTES);
    const cipher = createCipheriv("aes-256-gcm", asBuffer(key), nonce);
    cipher.setAAD(asBuffer(requiredAad));
    const ct = Buffer.concat([
        cipher.update(asBuffer(plaintext)),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return {
        ciphertext: new Uint8Array(ct),
        nonce: new Uint8Array(nonce),
        authTag: new Uint8Array(authTag),
    };
}
export function aeadDecrypt(key, ciphertext, nonce, authTag, aad) {
    if (key.length !== AEAD_KEY_BYTES) {
        throw new AeadError(`AEAD key must be ${AEAD_KEY_BYTES} bytes`);
    }
    if (nonce.length !== AEAD_NONCE_BYTES) {
        throw new AeadError(`AEAD nonce must be ${AEAD_NONCE_BYTES} bytes`);
    }
    if (authTag.length !== AEAD_TAG_BYTES) {
        throw new AeadError(`AEAD tag must be ${AEAD_TAG_BYTES} bytes`);
    }
    const decipher = createDecipheriv("aes-256-gcm", asBuffer(key), asBuffer(nonce));
    if (aad && aad.length > 0)
        decipher.setAAD(asBuffer(aad));
    decipher.setAuthTag(asBuffer(authTag));
    try {
        const pt = Buffer.concat([
            decipher.update(asBuffer(ciphertext)),
            decipher.final(),
        ]);
        return new Uint8Array(pt);
    }
    catch (err) {
        // error-policy:J2 context-adding rethrow — a GCM auth-tag failure (tampered
        // ciphertext / wrong key / wrong AAD) must surface as a decrypt failure,
        // never as fabricated plaintext. Fail closed.
        throw new AeadError(err instanceof Error
            ? `AEAD decrypt failed: ${err.message}`
            : "AEAD decrypt failed");
    }
}
//# sourceMappingURL=aead.js.map