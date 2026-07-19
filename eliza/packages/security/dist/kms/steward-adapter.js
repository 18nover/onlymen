/**
 * Steward KMS HTTP client that implements the production key-management wire contract.
 */
import { KmsError, } from "./types.js";
function trimSlash(s) {
    return s.replace(/\/+$/, "");
}
function endpoint(base, path) {
    return `${trimSlash(base)}${path}`;
}
function encodeBase64(bytes) {
    return Buffer.from(bytes).toString("base64");
}
function decodeBase64(value, field) {
    try {
        return new Uint8Array(Buffer.from(value, "base64"));
    }
    catch (err) {
        throw new KmsError(`Steward KMS response field ${field} is not valid base64: ${err instanceof Error ? err.message : String(err)}`);
    }
}
function isRecord(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function requireString(record, field) {
    const value = record[field];
    if (typeof value !== "string" || value.length === 0) {
        throw new KmsError(`Steward KMS response missing string field: ${field}`);
    }
    return value;
}
function requireNumber(record, field) {
    const value = record[field];
    if (typeof value !== "number" || !Number.isInteger(value)) {
        throw new KmsError(`Steward KMS response missing integer field: ${field}`);
    }
    return value;
}
function requireBoolean(record, field) {
    const value = record[field];
    if (typeof value !== "boolean") {
        throw new KmsError(`Steward KMS response missing boolean field: ${field}`);
    }
    return value;
}
function optionalBase64(field, bytes) {
    return bytes ? { [field]: encodeBase64(bytes) } : {};
}
export class StewardKmsAdapter {
    baseUrl;
    tokenProvider;
    fetchImpl;
    constructor(opts) {
        if (!opts.baseUrl)
            throw new KmsError("StewardKmsAdapter requires baseUrl");
        this.baseUrl = trimSlash(opts.baseUrl);
        this.tokenProvider = opts.tokenProvider;
        this.fetchImpl = opts.fetch ?? globalThis.fetch;
    }
    async call(method, path, body) {
        const token = await this.tokenProvider();
        const headers = {
            accept: "application/json",
            authorization: `Bearer ${token}`,
        };
        const init = { method, headers };
        if (body !== undefined) {
            headers["content-type"] = "application/json";
            init.body = JSON.stringify(body);
        }
        const url = endpoint(this.baseUrl, path);
        const response = await this.fetchImpl(url, init);
        const text = await response.text();
        let parsed = {};
        if (text.trim().length > 0) {
            try {
                parsed = JSON.parse(text);
            }
            catch (err) {
                throw new KmsError(`Steward KMS ${method} ${path} returned invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
            }
        }
        if (!response.ok) {
            const message = isRecord(parsed) && typeof parsed.error === "string"
                ? parsed.error
                : isRecord(parsed) && typeof parsed.message === "string"
                    ? parsed.message
                    : text.trim();
            // Carry the HTTP status so consumers (e.g. the backup restorability
            // verifier) can classify a 404 as key-unavailable instead of treating
            // it as opaque infrastructure breakage.
            throw new KmsError(`Steward KMS ${method} ${path} failed (${response.status}${response.statusText ? ` ${response.statusText}` : ""})${message ? `: ${message}` : ""}`, response.status);
        }
        if (!isRecord(parsed)) {
            throw new KmsError(`Steward KMS ${method} ${path} returned non-object JSON`);
        }
        return parsed;
    }
    async getOrCreateKey(keyId, opts = {}) {
        const out = await this.call("POST", `/v1/kms/keys`, { keyId, ...opts });
        return {
            keyId: requireString(out, "keyId"),
            version: requireNumber(out, "version"),
        };
    }
    async rotateKey(keyId) {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/rotate`);
        return {
            keyId: requireString(out, "keyId"),
            newVersion: requireNumber(out, "newVersion"),
        };
    }
    async listKeyVersions(keyId) {
        const out = await this.call("GET", `/v1/kms/keys/${encodeURIComponent(keyId)}/versions`);
        const versions = out.versions;
        if (!Array.isArray(versions) ||
            versions.some((version) => !Number.isInteger(version))) {
            throw new KmsError("Steward KMS response missing integer versions array");
        }
        return versions;
    }
    async encrypt(keyId, plaintext, aad) {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/encrypt`, {
            plaintext_b64: encodeBase64(plaintext),
            ...optionalBase64("aad_b64", aad),
        });
        return {
            ciphertext: decodeBase64(requireString(out, "ciphertext_b64"), "ciphertext_b64"),
            nonce: decodeBase64(requireString(out, "nonce_b64"), "nonce_b64"),
            authTag: decodeBase64(requireString(out, "auth_tag_b64"), "auth_tag_b64"),
            keyId,
            keyVersion: requireNumber(out, "version"),
        };
    }
    async decrypt(keyId, ciphertext, nonce, authTag, aad, keyVersion) {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/decrypt`, {
            ciphertext_b64: encodeBase64(ciphertext),
            nonce_b64: encodeBase64(nonce),
            auth_tag_b64: encodeBase64(authTag),
            ...(keyVersion !== undefined ? { version: keyVersion } : {}),
            ...optionalBase64("aad_b64", aad),
        });
        return decodeBase64(requireString(out, "plaintext_b64"), "plaintext_b64");
    }
    async hmac(keyId, data) {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/hmac`, { data_b64: encodeBase64(data) });
        return decodeBase64(requireString(out, "tag_b64"), "tag_b64");
    }
    async hmacVerify(keyId, data, tag) {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/hmac/verify`, {
            data_b64: encodeBase64(data),
            tag_b64: encodeBase64(tag),
        });
        return requireBoolean(out, "valid");
    }
    async sign(keyId, data, algo = "ed25519") {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/sign`, { data_b64: encodeBase64(data), algorithm: algo });
        const algorithm = requireString(out, "algorithm");
        if (algorithm !== "ed25519" && algorithm !== "rsa-pss-sha256") {
            throw new KmsError(`Steward KMS response has unsupported algorithm: ${algorithm}`);
        }
        return {
            signature: decodeBase64(requireString(out, "signature_b64"), "signature_b64"),
            algorithm,
            keyId,
            keyVersion: requireNumber(out, "version"),
        };
    }
    async verify(keyId, data, signature, algo = "ed25519") {
        const out = await this.call("POST", `/v1/kms/keys/${encodeURIComponent(keyId)}/verify`, {
            data_b64: encodeBase64(data),
            signature_b64: encodeBase64(signature),
            algorithm: algo,
        });
        return requireBoolean(out, "valid");
    }
    async getPublicKey(keyId) {
        const out = await this.call("GET", `/v1/kms/keys/${encodeURIComponent(keyId)}/public`);
        return decodeBase64(requireString(out, "public_key_b64"), "public_key_b64");
    }
    /** Exposed for diagnostics — the auth token the adapter will use next. */
    async _resolveToken() {
        return this.tokenProvider();
    }
}
//# sourceMappingURL=steward-adapter.js.map