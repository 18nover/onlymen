/**
 * Local desktop KMS adapter that derives persistent symmetric keys from a caller-provided root key.
 */
import { createHmac, createPrivateKey, createPublicKey, sign as nodeSign, verify as nodeVerify, randomBytes, scryptSync, timingSafeEqual, } from "node:crypto";
import { aeadDecrypt, aeadEncrypt } from "../crypto/aead.js";
import { hkdfSha256 } from "../crypto/hkdf.js";
import { parseKeyId } from "./key-namespace.js";
import { MemoryKmsAdapter } from "./memory-adapter.js";
import { KmsError, } from "./types.js";
const HKDF_DOMAIN = "elizaos.security.local-kms.v1";
export class LocalKmsAdapter {
    rootKey;
    state = new Map();
    inner;
    constructor(opts) {
        if (opts.rootKey.length !== 32) {
            throw new KmsError("LocalKmsAdapter rootKey must be 32 bytes");
        }
        this.rootKey = opts.rootKey;
        this.inner = new MemoryKmsAdapter();
    }
    static fromPassphrase(passphrase, salt) {
        const rootKey = new Uint8Array(scryptSync(passphrase, salt, 32));
        return new LocalKmsAdapter({ rootKey });
    }
    deriveSym(keyId, version) {
        const info = Buffer.from(`${HKDF_DOMAIN}|sym|${keyId}|v${version}`, "utf8");
        return hkdfSha256(this.rootKey, 32, info);
    }
    deriveEd25519PrivateKey(keyId, version) {
        const info = Buffer.from(`${HKDF_DOMAIN}|sign|ed25519|${keyId}|v${version}`, "utf8");
        const seed = Buffer.from(hkdfSha256(this.rootKey, 32, info));
        const pkcs8 = Buffer.concat([
            Buffer.from("302e020100300506032b657004220420", "hex"),
            seed,
        ]);
        return createPrivateKey({ key: pkcs8, format: "der", type: "pkcs8" });
    }
    ensureState(keyId) {
        parseKeyId(keyId);
        let s = this.state.get(keyId);
        if (!s) {
            s = { current: 1, versions: new Set([1]) };
            this.state.set(keyId, s);
        }
        return s;
    }
    async getOrCreateKey(keyId, _opts = {}) {
        const s = this.ensureState(keyId);
        return { keyId, version: s.current };
    }
    async rotateKey(keyId) {
        const s = this.ensureState(keyId);
        const newVersion = s.current + 1;
        s.versions.add(newVersion);
        s.current = newVersion;
        return { keyId, newVersion };
    }
    async listKeyVersions(keyId) {
        const s = this.ensureState(keyId);
        return [...s.versions].sort((a, b) => a - b);
    }
    async encrypt(keyId, plaintext, aad) {
        const s = this.ensureState(keyId);
        const k = this.deriveSym(keyId, s.current);
        const out = aeadEncrypt(k, plaintext, aad);
        return { ...out, keyId, keyVersion: s.current };
    }
    async decrypt(keyId, ciphertext, nonce, authTag, aad, keyVersion) {
        const s = this.ensureState(keyId);
        const version = keyVersion ?? s.current;
        const k = this.deriveSym(keyId, version);
        const plaintext = aeadDecrypt(k, ciphertext, nonce, authTag, aad);
        s.versions.add(version);
        return plaintext;
    }
    async hmac(keyId, data) {
        const s = this.ensureState(keyId);
        const info = Buffer.from(`${HKDF_DOMAIN}|hmac|${keyId}|v${s.current}`, "utf8");
        const macKey = hkdfSha256(this.rootKey, 32, info);
        const mac = createHmac("sha256", Buffer.from(macKey))
            .update(Buffer.from(data))
            .digest();
        return new Uint8Array(mac);
    }
    async hmacVerify(keyId, data, tag) {
        const s = this.ensureState(keyId);
        for (const v of s.versions) {
            const info = Buffer.from(`${HKDF_DOMAIN}|hmac|${keyId}|v${v}`, "utf8");
            const macKey = hkdfSha256(this.rootKey, 32, info);
            const expected = createHmac("sha256", Buffer.from(macKey))
                .update(Buffer.from(data))
                .digest();
            if (expected.length !== tag.length)
                continue;
            if (timingSafeEqual(expected, Buffer.from(tag)))
                return true;
        }
        return false;
    }
    async sign(keyId, data, algo = "ed25519") {
        if (algo === "ed25519") {
            const s = this.ensureState(keyId);
            const privateKey = this.deriveEd25519PrivateKey(keyId, s.current);
            const signature = nodeSign(null, Buffer.from(data), privateKey);
            return {
                signature: new Uint8Array(signature),
                algorithm: algo,
                keyId,
                keyVersion: s.current,
            };
        }
        return this.inner.sign(keyId, data, algo);
    }
    async verify(keyId, data, signature, algo = "ed25519") {
        if (algo === "ed25519") {
            const s = this.ensureState(keyId);
            for (const version of s.versions) {
                const privateKey = this.deriveEd25519PrivateKey(keyId, version);
                const publicKey = createPublicKey(privateKey);
                if (nodeVerify(null, Buffer.from(data), publicKey, Buffer.from(signature))) {
                    return true;
                }
            }
            return false;
        }
        return this.inner.verify(keyId, data, signature, algo);
    }
    async getPublicKey(keyId) {
        const s = this.ensureState(keyId);
        const privateKey = this.deriveEd25519PrivateKey(keyId, s.current);
        const publicKey = createPublicKey(privateKey);
        return new Uint8Array(publicKey.export({ format: "der", type: "spki" }));
    }
}
export function randomRootKey() {
    return new Uint8Array(randomBytes(32));
}
//# sourceMappingURL=local-adapter.js.map