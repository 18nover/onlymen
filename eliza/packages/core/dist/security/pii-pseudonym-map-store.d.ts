/**
 * Protected persistence for the corpus pseudonym map (#14805).
 *
 * The alias→pseudonym map inverts the scrub, so **the map itself is a secret
 * artifact**: owner-only, never embedded, never indexed, never retrievable.
 * The issue mandates structural confidentiality — the map lives OUTSIDE the
 * retrievable corpus, in a store with NO ingestion path — plus at-rest
 * protection (the "vault-encrypted blob" option):
 *
 * - **Structural isolation.** The snapshot is persisted as a single value in
 *   the runtime cache (the adapter-backed durable KV the scrub done-markers
 *   already use, `./pii-scrub-markers.ts`) under the dedicated key
 *   {@link PII_PSEUDONYM_MAP_CACHE_KEY}. Cache rows are NEVER a document or
 *   memory row: they are not chunked into `document_fragments`, not embedded,
 *   and unreachable via `searchDocuments`, `searchMessages`, `searchMemories`,
 *   and the `SEARCH_KNOWLEDGE` action — there is no ingestion path from the
 *   cache into any retrieval surface. The cache table is additionally
 *   agent-scoped by the SQL adapter (owner's agent only).
 * - **Encrypted at rest, fail-closed.** The blob is AES-256-GCM ciphertext
 *   (v2 settings-secret scheme: key = SHA-256(salt), 12-byte IV, auth tag)
 *   under the dedicated AAD {@link PII_PSEUDONYM_MAP_AAD} — domain-separated
 *   from settings ciphertext so neither store can be coaxed into decrypting
 *   the other's blobs. `save` REFUSES to persist plaintext; `load` throws on
 *   a wrong key, tampered ciphertext, or a malformed snapshot rather than
 *   returning a partial map (a partial map would silently re-mint pseudonyms
 *   for already-mapped people — a corpus-wide consistency break). Note this is
 *   deliberately stricter than `decryptStringValue` in `../settings.ts`, which
 *   returns the raw value on failure — acceptable for settings, fail-open for
 *   a secret artifact.
 *
 * The encryption salt follows the canonical secret-settings lifecycle
 * (`getSalt()`, `SECRET_SALT`) so the map is protected by the same key
 * material and production non-default enforcement as every other at-rest
 * secret. The map's *mint* salt is a separate secret that lives INSIDE the
 * encrypted snapshot (see `./pii-pseudonym-map.ts`).
 */
import { type PseudonymMapSnapshot } from "./pii-pseudonym-map.js";
import type { ScrubMarkerCache } from "./pii-scrub-markers.js";
/**
 * The single cache key the map is persisted under. Deliberately inside the
 * `pii:` namespace next to the scrub done-markers; the trailing `:v1` is the
 * BLOB FORMAT version (snapshot schema), not the scrub ruleset version.
 */
export declare const PII_PSEUDONYM_MAP_CACHE_KEY = "pii:pseudonym-map:v1";
/** Domain-separation AAD for the map ciphertext. */
export declare const PII_PSEUDONYM_MAP_AAD = "elizaos:pii-pseudonym-map:v1";
/** Thrown when the protected store cannot prove the artifact is intact. */
export declare class PseudonymMapStoreError extends Error {
    constructor(message: string);
}
/**
 * Persistence seam for the corpus pseudonym map. Implementations MUST keep the
 * artifact outside every retrieval surface (never a document/memory row, never
 * embedded, never indexed) — confidentiality is structural, not filter-based.
 */
export interface PseudonymMapStore {
    /** The persisted snapshot, or `null` when none exists yet. */
    load(): Promise<PseudonymMapSnapshot | null>;
    /** Persist the snapshot (idempotent overwrite of the single artifact). */
    save(snapshot: PseudonymMapSnapshot): Promise<void>;
}
export interface EncryptedCachePseudonymMapStoreOptions {
    /**
     * Encryption salt. Defaults to the canonical secret-settings salt
     * (`getSalt()` — `SECRET_SALT`, production-enforced non-default). Tests pass
     * a fixed value.
     */
    readonly encryptionSalt?: string;
}
/**
 * The default protected store: AES-256-GCM-encrypted blob in the runtime
 * cache under {@link PII_PSEUDONYM_MAP_CACHE_KEY}. See the module doc for the
 * confidentiality contract.
 */
export declare class EncryptedCachePseudonymMapStore implements PseudonymMapStore {
    private readonly cache;
    private readonly key;
    constructor(cache: ScrubMarkerCache, options?: EncryptedCachePseudonymMapStoreOptions);
    load(): Promise<PseudonymMapSnapshot | null>;
    save(snapshot: PseudonymMapSnapshot): Promise<void>;
}
//# sourceMappingURL=pii-pseudonym-map-store.d.ts.map