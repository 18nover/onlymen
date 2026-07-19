/**
 * Ed25519 signature verification for the Eliza Cloud voice-model catalog.
 *
 * Per R5-versioning §6.4: the catalog API JSON returned by Eliza Cloud is
 * signed with the elizaOS publishing key. The runtime auto-updater MUST
 * reject any catalog response whose signature does not verify before it
 * recommends any download. The public verification key is compiled into
 * the runtime binary; rotation is a two-release cycle (publish-with-both →
 * rotate-to-new → retire-old).
 *
 * Implementation uses Web Crypto's Ed25519 primitive (Node ≥ 24, browsers
 * since 2023). No vendor crypto dep — the runtime already targets Node 24+
 * (`packages/shared/package.json:"engines.node": ">=24.0.0"`).
 *
 * Spec: `.swarm/research/R5-versioning.md` §3.1 + §6.4.
 */
/**
 * Raw 32-byte Ed25519 public key, or a PEM/SPKI/JWK representation parsed
 * to a `CryptoKey` already. Most callers pass the raw 32-byte form because
 * that is how compile-time-embedded keys look.
 */
export type Ed25519PublicKey = Uint8Array | CryptoKey;
export interface SignatureVerifyInput {
    /** Raw response body bytes (UTF-8 encoded JSON or arbitrary bytes). */
    readonly body: Uint8Array;
    /**
     * Base64-encoded 64-byte Ed25519 signature, as it would arrive in an
     * HTTP header such as `X-Eliza-Signature`.
     */
    readonly signatureBase64: string;
    /**
     * One or more candidate public keys; the verify succeeds if ANY key
     * accepts. This is the rotation-window contract (current + next).
     */
    readonly publicKeys: ReadonlyArray<Ed25519PublicKey>;
}
export declare class ManifestSignatureError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
/**
 * Verify `body` against `signatureBase64` using one or more Ed25519 public
 * keys. Returns the index of the first key that accepted the signature.
 * Throws `ManifestSignatureError` when no key accepts.
 *
 * The "accept any of N keys" contract is what makes signing-key rotation
 * safe — during rotation we ship both the current and next key, the
 * publisher signs with whichever it has access to, and the runtime accepts
 * either.
 */
export declare function verifyManifestSignature(input: SignatureVerifyInput): Promise<number>;
/**
 * Convenience wrapper: encode a string body to UTF-8 bytes and verify. The
 * caller MUST pass the EXACT body bytes the server signed — JSON `.parse`
 * round-trips lose whitespace and would change the hash. The Cloud
 * endpoint at `packages/cloud/api/v1/voice-models/catalog/route.ts` signs the
 * serialized response body before sending; mirror that on the client by
 * verifying the raw response text before parsing.
 */
export declare function verifyManifestSignatureText(body: string, signatureBase64: string, publicKeys: ReadonlyArray<Ed25519PublicKey>): Promise<number>;
//# sourceMappingURL=manifest-signature.d.ts.map