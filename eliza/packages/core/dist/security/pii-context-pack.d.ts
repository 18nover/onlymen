/**
 * Context-retrieval pass for the PII scrub pipeline (#14805).
 *
 * Stage position: between candidate-mining and the LLM-pass. A scrubber that
 * sees only the chunk cannot classify: is "Paris" a person or a city? does
 * "Dr. K" corefer with an entity already pseudonymized elsewhere? Before the
 * LLM-pass judges a chunk, this pass gathers related memories, knowledge,
 * conversations, and resolved-entity candidates so the verdict is
 * context-aware, and extracts the per-chunk pseudonym-assignment slice so the
 * rewrite is consistent with the corpus-wide map
 * ({@link ./pii-pseudonym-map | CorpusPseudonymMap}).
 *
 * Retrieval sources (all existing infra — this module builds none):
 * - **Entity resolution** — the alias backbone. The structural
 *   {@link PiiEntityResolverStore} seam matches `EntityStore.resolve`
 *   (`packages/agent/src/services/knowledge-graph/entity-store.ts`) exactly, so
 *   the pipeline wires `entityResolverFromStore(kg.getEntityStore())` with zero
 *   adaptation; standalone/batch callers construct the store with just
 *   `{agentId, adapter.db.execute}` per the issue. Identity merges keep going
 *   through the merge engine — this pass only READS resolution candidates.
 * - **Knowledge** — `DocumentService.searchDocuments` (hybrid vector+BM25).
 * - **Memories** — `runtime.searchMemories` with the caller-supplied embedding
 *   from `runtime.useModel(TEXT_EMBEDDING)`; the embeddings doctrine holds
 *   (a failure THROWS — never fabricate). When no embedding model is
 *   registered the source is structurally absent (a configuration fact,
 *   recorded in `sourcesQueried`), not silently empty.
 * - **Conversations** — `adapter.searchMessages` FTS; requires explicit
 *   `roomIds` (enumerate via `getRoomsByWorld` / `getRoomsForParticipant`).
 *
 * Failure doctrine: an ABSENT source is skipped and audited; a PRESENT source
 * that throws propagates (fail-closed — the scrub rails retry the item;
 * degraded context silently producing a wrong verdict is the failure mode this
 * pass exists to prevent).
 *
 * Secrecy: the assembled pack text contains retrieved corpus fragments (they
 * flow only to the PII_SCRUB model seam, local-first by registration priority)
 * but NEVER the pseudonym map — assignments travel separately as the
 * `{entityClusterId, surrogate, kind}` slice for exactly the clusters relevant
 * to this chunk, never the whole secret artifact and never a real alias.
 */
import type { PiiScrubRequestPayload } from "../types/events.js";
import type { UUID } from "../types/index.js";
import type { PiiPseudonymAssignment } from "../types/model.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { CorpusPseudonymMap } from "./pii-pseudonym-map.js";
/**
 * One mined candidate from the candidate-mining stage — the issue's input
 * shape: `{surfaceForm, kind, sourceRef: {memoryId|documentId, tableName,
 * fragment position}, span}`.
 */
export interface PiiScrubCandidate {
    /** The surface form as it appears in the chunk ("Dr. K", "@jsmith"). */
    readonly surfaceForm: string;
    /** Mined entity class guess (`person`, `org`, `location`, …). */
    readonly kind: string;
    /** Where the candidate was mined from. */
    readonly sourceRef?: {
        readonly memoryId?: string;
        readonly documentId?: string;
        readonly tableName?: string;
        /** Fragment position within the parent document, when applicable. */
        readonly position?: number;
    };
    /** Offsets of the surface form within the chunk. */
    readonly span?: {
        readonly start: number;
        readonly end: number;
    };
    /**
     * Platform identity, when the candidate IS a handle mined from a platform
     * mirror (e.g. `{platform: "discord", handle: "jsmith"}`). Drives exact
     * identity-based entity resolution.
     */
    readonly identity?: {
        readonly platform: string;
        readonly handle: string;
    };
}
/** One retrieved context fragment, ranked and bounded into the pack. */
export interface PiiContextFragment {
    readonly text: string;
    readonly origin: "document" | "memory" | "message" | "attachment";
    /** Source row/document id, for the audit trail. */
    readonly ref?: string;
    /** Relevance in [0,1] when the source measured one (never fabricated). */
    readonly score?: number;
}
/**
 * A resolved entity candidate, normalized for the scrub pipeline. `clusterId`
 * is the stable corpus-map key (`entity:<entityId>` for EntityStore-backed
 * resolution).
 */
export interface PiiResolvedEntity {
    readonly clusterId: string;
    readonly kind: string;
    /** Known surface forms: preferred name, full name, identity handles. */
    readonly aliases: readonly string[];
    readonly identities: readonly {
        readonly platform: string;
        readonly handle: string;
    }[];
    readonly confidence: number;
    readonly evidence: readonly string[];
}
/**
 * Structural subset of `EntityStore` (the alias backbone) that this pass
 * consumes — field-for-field the shape of
 * `EntityStore.resolve({name?, identity?, type?}) → EntityResolveCandidate[]`
 * so the real store satisfies it with zero adaptation.
 */
export interface PiiEntityResolverStore {
    resolve(query: {
        name?: string;
        identity?: {
            platform: string;
            handle: string;
        };
        type?: string;
    }): Promise<readonly {
        readonly entity: {
            readonly entityId: string;
            readonly type: string;
            readonly preferredName: string;
            readonly fullName?: string;
            readonly identities: readonly {
                readonly platform: string;
                readonly handle: string;
            }[];
        };
        readonly confidence: number;
        readonly evidence: readonly string[];
    }[]>;
}
/** The retrieval seams the pass draws from. Absent = not available (audited). */
export interface PiiContextSources {
    readonly resolveEntity?: (candidate: PiiScrubCandidate) => Promise<readonly PiiResolvedEntity[]>;
    readonly searchDocuments?: (query: string) => Promise<readonly PiiContextFragment[]>;
    readonly searchMemories?: (query: string) => Promise<readonly PiiContextFragment[]>;
    readonly searchMessages?: (query: string) => Promise<readonly PiiContextFragment[]>;
}
/** Output 1 of the stage: the context pack for the LLM-pass. */
export interface PiiContextPack {
    /**
     * Bounded, human-readable context text for the `PII_SCRUB` model call:
     * resolved-entity summaries (with the assigned pseudonym marker when the
     * cluster is already mapped) + nearest fragments. Never the secret map.
     */
    readonly contextPack: string;
    /** The per-chunk cluster→surrogate slice (never the whole map). */
    readonly assignments: readonly PiiPseudonymAssignment[];
    /** Entity candidates that resolved with sufficient confidence. */
    readonly resolvedEntities: readonly PiiResolvedEntity[];
    /** Candidate surface forms, deduped — the seam's `candidateSpans`. */
    readonly candidateSpans: readonly string[];
    /** Which sources were queried vs structurally absent (audit). */
    readonly sourcesQueried: readonly string[];
}
export interface AssembleContextPackRequest {
    /** The chunk of text the LLM-pass will judge. */
    readonly chunk: string;
    /** Mined candidates for this chunk. */
    readonly candidates: readonly PiiScrubCandidate[];
    /** The corpus pseudonym map (read + upserted for confident resolutions). */
    readonly map: CorpusPseudonymMap;
    /** Active ruleset version (threaded into map assignments). */
    readonly rulesetVersion: string;
    /**
     * Minimum resolution confidence for a candidate to be clustered into the
     * map. Below it, the entity still appears in the pack (as context) but no
     * assignment is made. Default 0.6 — the EntityStore's exact-name match
     * scores 0.9, substring 0.55, so defaults cluster exact/identity matches
     * and leave fuzzy ones to the model.
     */
    readonly minEntityConfidence?: number;
    /** Max fragments folded into the pack (default 8). */
    readonly maxFragments?: number;
    /** Max pack characters (default 4000). Fragments are trimmed to fit. */
    readonly maxChars?: number;
}
/**
 * Assemble the context pack + pseudonym-assignment slice for one chunk.
 * See the module doc for the source/failure/secrecy contract.
 */
export declare function assembleContextPack(sources: PiiContextSources, request: AssembleContextPackRequest): Promise<PiiContextPack>;
/**
 * Adapt anything with `EntityStore.resolve`'s shape into the pass's
 * `resolveEntity` seam. The stable corpus-map cluster id is
 * `entity:<entityId>`; kinds are canonicalized to the pseudonymizer's
 * vocabulary (`organization` → `org`, …) via {@link canonicalKind}.
 */
export declare function entityResolverFromStore(store: PiiEntityResolverStore, options?: {
    maxCandidates?: number;
}): (candidate: PiiScrubCandidate) => Promise<readonly PiiResolvedEntity[]>;
export interface RuntimeContextSourceOptions {
    /**
     * Rooms for conversation FTS (`adapter.searchMessages` requires explicit
     * roomIds — enumerate via `getRoomsByWorld` / `getRoomsForParticipant`).
     * When omitted, the messages source is structurally absent.
     */
    readonly roomIds?: readonly UUID[];
    /** Per-source result limit (default 5). */
    readonly limit?: number;
    /**
     * The entity resolver, wired by the pipeline from the knowledge-graph
     * service (`entityResolverFromStore(kg.getEntityStore())`). Core does not
     * reach into `@elizaos/agent`, so this is injected.
     */
    readonly resolveEntity?: PiiContextSources["resolveEntity"];
}
/**
 * Wire {@link PiiContextSources} from a live runtime using only existing
 * surfaces: the documents service (hybrid search, keyword fallback built-in),
 * `runtime.searchMemories` (only when a TEXT_EMBEDDING model is registered —
 * the embeddings doctrine throws on failure, never fabricates), and
 * `adapter.searchMessages` (only when `roomIds` are supplied).
 */
export declare function sourcesFromRuntime(runtime: IAgentRuntime, options?: RuntimeContextSourceOptions): PiiContextSources;
/**
 * Fold a chunk + its assembled context pack into the scrub-rails request
 * payload (`PII_SCRUB_REQUESTED`, drained by `PiiScrubService`). The payload
 * carries the pack text and the per-chunk assignment slice into the merged
 * seam (`scrubWithEscalation`) with ZERO changes to the landed rails. The
 * emitter supplies `runtime` at `emitEvent` time.
 */
export declare function buildScrubRequestDraft(input: {
    readonly content: string;
    readonly rulesetVersion: string;
    readonly pack: PiiContextPack;
    readonly priority?: PiiScrubRequestPayload["priority"];
    readonly inferencePriority?: PiiScrubRequestPayload["inferencePriority"];
    readonly jobId?: PiiScrubRequestPayload["jobId"];
    readonly itemRef?: string;
}): Omit<PiiScrubRequestPayload, "runtime">;
//# sourceMappingURL=pii-context-pack.d.ts.map