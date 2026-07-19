/**
 * Corpus-wide pseudonym consistency for the PII scrub pipeline (#14805).
 *
 * Chunk-local scrubbing produces inconsistent pseudonyms: "John Smith" in a
 * document becomes one surrogate, "Johnny" in a chat room another, "@jsmith" in
 * a transcript mirror survives untouched — the corpus stays linkable and
 * partially unscrubbed. This module owns the fix: **one real-world person — all
 * aliases, nicknames, platform handles — maps to exactly ONE pseudonym across
 * the entire corpus** (text, transcript fragments, and audio-redaction span
 * labels alike).
 *
 * Design points (issue #14805, followed exactly):
 *
 * - **Keyed by entity cluster, not by surface string.** The unit of identity is
 *   a `clusterId` — the caller derives it from the resolved entity (the
 *   `EntityStore` alias backbone, `packages/agent/src/services/knowledge-graph/
 *   entity-store.ts`) or its own clustering. Two distinct people who share a
 *   name are two clusters and get two different pseudonyms; identity merges
 *   keep going through the merge engine, never through this map.
 * - **Surrogate generation seeds from the session pseudonymizer**
 *   ({@link mintSurrogate} in `./pii-pseudonymizer.ts`), extended from
 *   per-session to corpus-persistent: the mint seed is
 *   `(salt, kind, clusterId, attempt)`, so the same cluster deterministically
 *   re-mints the same pseudonym under the same map salt, and the salt is
 *   persisted inside the (secret) snapshot so re-runs are stable.
 * - **The map itself is a secret artifact.** The alias→pseudonym map inverts
 *   the scrub. This class only holds it in memory; persistence goes through a
 *   {@link ./pii-pseudonym-map-store | protected store} that lives OUTSIDE the
 *   retrievable corpus (never a document/memory row, never embedded, never
 *   indexed). Slices handed to a model are {@link PiiPseudonymAssignment}s —
 *   `{entityClusterId, surrogate, kind}` only, never a real alias, and only
 *   for clusters relevant to the chunk at hand.
 * - **Ambiguity is escalated, never guessed.** An alias claimed by two or more
 *   clusters ("John" could be either person) is never blind-substituted; it is
 *   reported as ambiguous so the LLM-pass judges it with the context pack
 *   attached ({@link ./pii-context-pack}).
 *
 * Ruleset interplay: the map records the ruleset version a cluster was first
 * assigned and last touched under, but the pseudonym is STABLE across ruleset
 * bumps — a `v<rulesetVersion>` bump re-scrubs content (the content-hash
 * done-marker `pii:<sha256>:v<ruleset>` no longer matches,
 * `./pii-scrub-markers.ts`) with the SAME pseudonyms, so a re-scrub never
 * re-links or re-shuffles identities.
 */
import type { PiiPseudonymAssignment } from "../types/model.js";
/** One platform identity claim attached to a cluster (`{platform, handle}`). */
export interface PseudonymClusterIdentity {
    readonly platform: string;
    readonly handle: string;
}
/**
 * One persisted cluster of the corpus pseudonym map:
 * `{clusterId → pseudonym, aliases[], identities[], evidence[], firstSeen,
 * rulesetVersion}` (the issue's map shape). `supersededPseudonyms` is the audit
 * trail of pseudonyms this cluster previously held — non-empty only after a
 * re-mint (a newly learned real alias collided with the old pseudonym), so the
 * write-back stage can repair artifacts written under the old value.
 */
export interface PseudonymClusterRecord {
    /** Stable cluster id (e.g. `entity:<entityId>` from the EntityStore). */
    readonly clusterId: string;
    /** Canonical entity class (`person`, `org`, `location`, …). */
    readonly kind: string;
    /** The single corpus-wide replacement for every alias of this cluster. */
    readonly pseudonym: string;
    /** Every observed surface form (full name, nickname, @handle, …). */
    readonly aliases: readonly string[];
    /** Platform identity claims linking the aliases to one person. */
    readonly identities: readonly PseudonymClusterIdentity[];
    /** Why the caller believes these aliases co-refer (audit only). */
    readonly evidence: readonly string[];
    /** Unix ms this cluster was first assigned. */
    readonly firstSeen: number;
    /** Ruleset version of the most recent assignment touching this cluster. */
    readonly rulesetVersion: string;
    /** Pseudonyms this cluster previously held (re-mint audit trail). */
    readonly supersededPseudonyms: readonly string[];
}
/** Serializable snapshot of the whole map — the SECRET artifact. */
export interface PseudonymMapSnapshot {
    readonly version: 1;
    /** The mint salt. Secret: with it (plus cluster ids) the mapping re-derives. */
    readonly salt: string;
    readonly clusters: readonly PseudonymClusterRecord[];
}
/** Input to {@link CorpusPseudonymMap.assign} — one upsert of cluster facts. */
export interface AssignClusterInput {
    /**
     * Stable cluster id. REQUIRED: the map never invents identity — the caller
     * resolves who-is-who through the entity backbone / merge engine and hands
     * the resulting stable id in.
     */
    readonly clusterId: string;
    /** Entity class; used to shape the pseudonym (`person`, `org`, …). */
    readonly kind: string;
    /** Surface forms observed for this cluster (idempotently unioned). */
    readonly aliases: readonly string[];
    /** Platform identities (idempotently unioned; one identity = one cluster). */
    readonly identities?: readonly PseudonymClusterIdentity[];
    /** Evidence strings (idempotently unioned, audit only). */
    readonly evidence?: readonly string[];
    /** The active ruleset version this assignment happens under. */
    readonly rulesetVersion: string;
}
/** Result of {@link CorpusPseudonymMap.substituteAliases}. */
export interface AliasSubstitutionResult {
    /** The text with every unambiguous alias replaced by its cluster pseudonym. */
    readonly text: string;
    /** Assignment slice for every cluster that was actually applied. */
    readonly applied: readonly PiiPseudonymAssignment[];
    /**
     * Aliases present in the text that are claimed by 2+ clusters. NOT
     * substituted — ambiguity is escalated to the model with context, never
     * guessed (a wrong guess links two people).
     */
    readonly ambiguous: readonly string[];
}
export interface CorpusPseudonymMapOptions {
    /**
     * Deterministic mint salt. Omit to generate a cryptographically random one
     * (persisted in the snapshot so the corpus mapping stays stable across
     * runs while remaining unlinkable across corpora).
     */
    readonly salt?: string;
    /**
     * Values never treated as aliases (merged with
     * {@link DEFAULT_PSEUDONYM_BLOCKLIST}). Compared case-insensitively.
     */
    readonly blocklist?: Iterable<string>;
    /** Minimum trimmed alias length (guards stopword spans). Default 2. */
    readonly minAliasLength?: number;
    /** Clock override for tests. */
    readonly now?: () => number;
}
/** Thrown when the map refuses an operation that would corrupt identity. */
export declare class PseudonymMapIntegrityError extends Error {
    constructor(message: string);
}
/**
 * The corpus-persistent pseudonym map: cluster-keyed, deterministic,
 * collision-safe, idempotent. See the module doc for the contract. Not
 * thread-safe; the scrub pipeline runs it on the single-drain task rails.
 */
export declare class CorpusPseudonymMap {
    private readonly salt;
    private readonly blocklistLower;
    private readonly minAliasLength;
    private readonly now;
    private readonly clusters;
    /** alias (lowercased) → owning cluster ids. Size > 1 marks ambiguity. */
    private readonly aliasOwners;
    /** identity key → owning cluster id (unique — see {@link assign}). */
    private readonly identityOwner;
    /** All pseudonyms in use, lowercased, for O(1) mint collision checks. */
    private readonly pseudonymsLower;
    constructor(options?: CorpusPseudonymMapOptions);
    /** Number of clusters in the map. */
    get size(): number;
    /** Immutable view of every cluster record (audit/persistence). */
    get records(): PseudonymClusterRecord[];
    /**
     * Upsert cluster facts. Idempotent: re-assigning the same cluster (in any
     * order, across any number of runs) never creates a duplicate cluster and
     * never changes its pseudonym — with ONE exception: when a newly learned
     * REAL alias equals an existing pseudonym (of any cluster), that cluster is
     * re-minted (the old pseudonym would otherwise be a real person's name — a
     * fail-open) and the old value is kept in `supersededPseudonyms` so
     * write-back can repair earlier artifacts.
     *
     * @throws PseudonymMapIntegrityError when a platform identity is claimed by
     *   a second cluster. One identity = one person; merging identities is the
     *   merge engine's job, and silently re-homing a handle here would either
     *   link two people or split one — both corruption.
     */
    assign(input: AssignClusterInput): PseudonymClusterRecord;
    /** The cluster record, or `undefined`. */
    getCluster(clusterId: string): PseudonymClusterRecord | undefined;
    /**
     * Every cluster claiming `alias` (case-insensitive). Length 0 = unknown,
     * 1 = resolvable, 2+ = ambiguous (escalate with context, never guess).
     */
    clustersForAlias(alias: string): PseudonymClusterRecord[];
    /** The cluster owning a platform identity, or `undefined`. */
    clusterForIdentity(platform: string, handle: string): PseudonymClusterRecord | undefined;
    /**
     * The model-facing assignment slice for one cluster:
     * `{entityClusterId, surrogate, kind}` — never a real alias.
     */
    assignmentFor(clusterId: string): PiiPseudonymAssignment | undefined;
    /**
     * The per-chunk assignment slice: assignments for every cluster with at
     * least one alias occurring in `text` (boundary-aware, longest-first,
     * case-sensitive — aliases are learned in their observed forms). Ambiguous
     * aliases contribute ALL owning clusters, so the model sees every candidate
     * identity and decides with context. NEVER returns the whole map.
     */
    assignmentsForText(text: string): PiiPseudonymAssignment[];
    /**
     * Deterministically replace every UNAMBIGUOUS alias in `text` with its
     * cluster's pseudonym (single boundary-aware longest-first pass, the exact
     * semantics of the session pseudonymizer). Aliases owned by 2+ clusters are
     * left untouched and reported in `ambiguous` — they are model-judgment
     * candidates, not deterministic rewrites.
     */
    substituteAliases(text: string): AliasSubstitutionResult;
    /** Serialize the whole map — the SECRET artifact. Persist ONLY via a
     * {@link ./pii-pseudonym-map-store | protected store}. */
    toSnapshot(): PseudonymMapSnapshot;
    /**
     * Rebuild a map from a snapshot. Structural validation is fail-closed: a
     * malformed snapshot throws rather than yielding a partial map (a partial
     * map would mint NEW pseudonyms for already-mapped people — a corpus-wide
     * consistency break, worse than stopping the pipeline).
     */
    static fromSnapshot(snapshot: PseudonymMapSnapshot, options?: Omit<CorpusPseudonymMapOptions, "salt">): CorpusPseudonymMap;
    /** Filter raw alias inputs down to swappable surface forms. */
    private acceptableAliases;
    /**
     * Mint a pseudonym unique across the corpus: never (case-insensitively)
     * equal to any existing pseudonym, any known real alias of ANY cluster, or
     * a blocklisted value. Deterministic probe on collision, seeded by
     * `(salt, kind, clusterId, attempt)` — cluster-keyed, so the same cluster
     * re-mints identically under the same salt regardless of surface strings.
     */
    private mintUniquePseudonym;
    /** Replace a cluster's pseudonym after a real-alias collision. */
    private remint;
    /** Single alternation over every observed alias form, for one-pass matching. */
    private compileAliasMatcher;
}
/**
 * Structural fail-closed validation of a snapshot (see
 * {@link CorpusPseudonymMap.fromSnapshot}).
 */
export declare function assertValidSnapshot(snapshot: unknown): asserts snapshot is PseudonymMapSnapshot;
//# sourceMappingURL=pii-pseudonym-map.d.ts.map