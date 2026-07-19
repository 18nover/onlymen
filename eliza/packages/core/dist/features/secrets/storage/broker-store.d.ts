/**
 * Broker-backed non-decrypting secret storage (issue #11536, phase E4).
 *
 * ============================================================================
 *  NON-DECRYPTING INVARIANT (the whole point of this file)
 * ----------------------------------------------------------------------------
 *  This store NEVER returns a plaintext secret value and NEVER calls the local
 *  AES-GCM decrypt path (`crypto/encryption.ts`). Its `get`/read path returns a
 *  {@link SecretHandle} \u2014 a reference to the secret \u2014 serialized as an opaque,
 *  detectably-non-credential string. The real credential is resolved only at
 *  USE-TIME, outside the runtime, through the already-shipped seams: the model
 *  gateway (E1/E2) for provider keys and the credential proxy (E3) for
 *  arbitrary API credentials. The broker injects the credential outbound
 *  (header-only) and the runtime never holds it.
 *
 *  This is the "eliza enterprise" guarantee: on shared/cloud infra the operator
 *  can prove the runtime CANNOT exfiltrate tenant credentials, because a broker
 *  store literally has no code path that yields plaintext. There is
 *  deliberately no `KeyManager`, no `decrypt`, no encryption import in this
 *  module \u2014 if plaintext isn't reachable, it can't leak.
 * ============================================================================
 *
 * Vendor-neutral: the store talks to an {@link ISecretBrokerClient}. Steward is
 * the reference broker; this file has no branded import.
 *
 * @module features/secrets/storage/broker-store
 */
import type { ISecretBrokerClient, SecretConfig, SecretContext, SecretMetadata, StorageBackend } from "../types.js";
import type { SecretsBrokerConfig } from "./broker-config.js";
import { BaseSecretStorage } from "./interface.js";
/**
 * Non-decrypting, broker-backed secret storage.
 *
 * `get` returns a SERIALIZED {@link SecretHandle}, never plaintext. `set`
 * delegates to the broker's optional write path, or REFUSES when the broker is
 * read-only (the runtime is not permitted to hand tenant credentials to the
 * broker). `list`/`getConfig` expose metadata only \u2014 never values.
 */
export declare class BrokerSecretStorage extends BaseSecretStorage {
    readonly storageType: StorageBackend;
    private readonly broker;
    private readonly config;
    constructor(broker: ISecretBrokerClient, config: SecretsBrokerConfig);
    initialize(): Promise<void>;
    /**
     * Whether the broker holds this secret. Fail-closed under strict mode: a
     * broker error becomes a thrown {@link SecretsBrokerUnavailableError} rather
     * than a silent `false` that could let a local store answer with plaintext.
     */
    exists(key: string, context: SecretContext): Promise<boolean>;
    /**
     * NON-DECRYPTING READ. Returns a serialized {@link SecretHandle}, or `null`
     * when the broker has no such secret. NEVER returns plaintext and NEVER
     * touches the local decrypt path.
     */
    get(key: string, context: SecretContext): Promise<string | null>;
    /**
     * WRITE path. Delegates to the broker's optional `storeSecret`. When the
     * broker is read-only (no `storeSecret`), this REFUSES \u2014 returns `false` \u2014
     * because there is no local encrypted store to silently fall back to, and
     * writing a plaintext credential anywhere would defeat the invariant.
     */
    set(key: string, value: string, context: SecretContext, _config?: Partial<SecretConfig>): Promise<boolean>;
    delete(key: string, context: SecretContext): Promise<boolean>;
    /** Metadata only \u2014 never values. */
    list(context: SecretContext): Promise<SecretMetadata>;
    /**
     * Broker stores expose no per-key config surface of their own (the broker
     * owns lifecycle/expiry). Returns `null` rather than fabricating a config.
     */
    getConfig(_key: string, _context: SecretContext): Promise<SecretConfig | null>;
    /** Config is broker-owned; updates are a no-op refusal. */
    updateConfig(_key: string, _context: SecretContext, _config: Partial<SecretConfig>): Promise<boolean>;
    /**
     * Central fail-closed vs fail-soft decision. Under strict mode any broker
     * error is fatal (throw) so the caller cannot degrade to a plaintext-capable
     * local store; otherwise the error is logged and the soft default returned.
     */
    private onBrokerError;
}
//# sourceMappingURL=broker-store.d.ts.map