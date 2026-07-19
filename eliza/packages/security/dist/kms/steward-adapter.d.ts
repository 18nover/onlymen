/**
 * Steward KMS HTTP client that implements the production key-management wire contract.
 */
import { type EncryptResult, type GetOrCreateKeyOptions, type KeyHandle, type KeyId, type KeyVersion, type KmsClient, type SignatureAlgorithm, type SignResult } from "./types.js";
/**
 * Production adapter — talks to Steward's credential-proxy / KMS endpoints.
 *
 * Steward (https://github.com/Steward-Fi/steward) is the open-source agent-
 * wallet / credential-proxy / auth platform Eliza uses in production. The
 * KMS endpoints listed below MUST exist on the Steward side for this adapter
 * to function. This adapter implements the client wire format and fails loudly
 * on missing or malformed Steward responses.
 *
 * Steward endpoint contract:
 *
 *   POST   /v1/kms/keys                          { keyId, rotationDays? } -> { keyId, version }
 *   POST   /v1/kms/keys/:keyId/rotate            -> { keyId, newVersion }
 *   GET    /v1/kms/keys/:keyId/versions          -> { versions: number[] }
 *   POST   /v1/kms/keys/:keyId/encrypt           { plaintext_b64, aad_b64? } -> { ciphertext_b64, nonce_b64, auth_tag_b64, version }
 *   POST   /v1/kms/keys/:keyId/decrypt           { ciphertext_b64, nonce_b64, auth_tag_b64, aad_b64?, version? } -> { plaintext_b64 }
 *   POST   /v1/kms/keys/:keyId/hmac              { data_b64 } -> { tag_b64 }
 *   POST   /v1/kms/keys/:keyId/hmac/verify       { data_b64, tag_b64 } -> { valid: boolean }
 *   POST   /v1/kms/keys/:keyId/sign              { data_b64, algorithm } -> { signature_b64, algorithm, version }
 *   POST   /v1/kms/keys/:keyId/verify            { data_b64, signature_b64, algorithm } -> { valid: boolean }
 *   GET    /v1/kms/keys/:keyId/public            { algorithm? } -> { public_key_b64, algorithm }
 *
 * All requests authenticate via short-lived OIDC bearer (preferred) or mTLS;
 * the adapter reuses the credential-proxy auth pattern from
 * `packages/cloud/api/src/steward/embedded.ts`.
 */
export interface StewardKmsOptions {
    /** Base URL of the Steward instance, e.g. https://steward.example.com */
    baseUrl: string;
    /** OIDC bearer token (short-lived). Caller is responsible for refresh. */
    tokenProvider: () => Promise<string>;
    /** Optional fetch override (e.g. undici with mTLS dispatcher). */
    fetch?: typeof fetch;
}
export declare class StewardKmsAdapter implements KmsClient {
    private readonly baseUrl;
    private readonly tokenProvider;
    private readonly fetchImpl;
    constructor(opts: StewardKmsOptions);
    private call;
    getOrCreateKey(keyId: KeyId, opts?: GetOrCreateKeyOptions): Promise<KeyHandle>;
    rotateKey(keyId: KeyId): Promise<{
        keyId: KeyId;
        newVersion: KeyVersion;
    }>;
    listKeyVersions(keyId: KeyId): Promise<KeyVersion[]>;
    encrypt(keyId: KeyId, plaintext: Uint8Array, aad?: Uint8Array): Promise<EncryptResult>;
    decrypt(keyId: KeyId, ciphertext: Uint8Array, nonce: Uint8Array, authTag: Uint8Array, aad?: Uint8Array, keyVersion?: KeyVersion): Promise<Uint8Array>;
    hmac(keyId: KeyId, data: Uint8Array): Promise<Uint8Array>;
    hmacVerify(keyId: KeyId, data: Uint8Array, tag: Uint8Array): Promise<boolean>;
    sign(keyId: KeyId, data: Uint8Array, algo?: SignatureAlgorithm): Promise<SignResult>;
    verify(keyId: KeyId, data: Uint8Array, signature: Uint8Array, algo?: SignatureAlgorithm): Promise<boolean>;
    getPublicKey(keyId: KeyId): Promise<Uint8Array>;
    /** Exposed for diagnostics — the auth token the adapter will use next. */
    _resolveToken(): Promise<string>;
}
//# sourceMappingURL=steward-adapter.d.ts.map