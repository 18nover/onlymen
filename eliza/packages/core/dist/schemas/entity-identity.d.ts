/**
 * Table descriptors for the entity-resolution subsystem: strengthened identity
 * claims (`entity_identities`), pending entity-merge proposals
 * (`entity_merge_candidates`), and fact-refinement candidates (`fact_candidates`).
 * These back the identity-merge engine and its human-review surfaces —
 * observations, collisions, and fact contradictions the runtime cannot resolve
 * automatically land here for a human (or an auto-merge threshold) to accept or
 * reject. Portable `SchemaTable` shapes assembled by `buildBaseTables` and
 * materialized by the plugin-sql / localdb adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Strengthened, normalized record of a (platform, handle) claim attached to an
 * entity. Lives alongside (and is more authoritative than) the legacy
 * `metadata.platformIdentities` array on entity rows.
 *
 * Each row carries provenance: which messages observed the claim, what the
 * source extractor scored its confidence at, and when it was first/last seen.
 * The (platform, handle) pair is unique per entity so re-observations bump
 * confidence + evidence rather than producing duplicate rows.
 */
export declare const entityIdentitySchema: SchemaTable;
/**
 * Pending merge proposals between two entities. Created when an identity claim
 * collision indicates two distinct entity rows actually represent the same
 * person. A human (or auto-merge threshold) flips `status` to "accepted" /
 * "rejected"; on accept the merge is applied transactionally.
 */
export declare const entityMergeCandidateSchema: SchemaTable;
export type EntityMergeCandidateStatus = "pending" | "accepted" | "rejected";
/**
 * Fact refinement candidates. When the FactRefinementEvaluator detects a
 * contradiction or merge opportunity that we cannot apply automatically, it
 * writes a row here for the user to resolve in the Facts tab.
 */
export declare const factCandidateSchema: SchemaTable;
export type FactCandidateKind = "contradict" | "merge";
export type FactCandidateStatus = "pending" | "accepted" | "rejected";
//# sourceMappingURL=entity-identity.d.ts.map