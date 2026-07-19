/**
 * Role-aware artifact disclosure decision for shared artifacts (transcripts,
 * stored files, chat attachments, meeting sessions) — the read-side selector
 * behind #14778, designed inside the #8876 attachments doctrine: bytes stay on
 * the pre-auth content-addressed store (the sha256 URL is the capability), so
 * "permission" here means URL/DTO disclosure on the REFERENCING record, never
 * a byte-serve gate. Redacted variants are separate records/media objects; this
 * module only decides which variant a viewer's DTO may reference.
 *
 * One decision, three outcomes: `full` (emit the artifact as stored),
 * `redacted` (emit the redacted-variant fields, flagged), `none` (omit the row
 * entirely). Every disclosure surface routes through this single function so
 * the role matrix — OWNER/ADMIN/agent-self full; USER grant-driven; ungranted
 * viewers fall back to the scope ladder (which fails closed on the
 * `owner-private` default) — cannot drift per surface.
 *
 * Grants ride additively on the referencing record's metadata
 * (`metadata.share.grants`, jsonb — no migration, no sha256-keyed table per
 * doctrine AD1). The grant WRITE path (share actions, room-snapshot capture)
 * belongs to the PERM-ACL/PERM-REDACT children of #14749; this module only
 * evaluates what is stored. Default-matrix ratification is tracked in #14777 —
 * revisit the ordering below if D4/D5 land differently.
 */
import type { AccessContext, ArtifactRoomSnapshot, ArtifactShareGrant, ArtifactShareGrantMode, ArtifactShareMetadata, Memory, MemoryScope, UUID } from "../types/index.js";
/** What a viewer's DTO may contain for one artifact. */
export type ArtifactDisclosure = "full" | "redacted" | "none";
export type { ArtifactRoomSnapshot, ArtifactShareGrant, ArtifactShareGrantMode, ArtifactShareMetadata, };
/** Full and redacted artifact references carried by a DTO-capable record. */
export interface ArtifactVariantReferences<TFull, TRedacted = TFull> {
    full: TFull;
    redacted?: TRedacted | null;
}
/** The concrete reference a disclosure DTO should emit. */
export interface ResolvedArtifactVariant<T> {
    disclosure: Exclude<ArtifactDisclosure, "none">;
    value: T;
}
/** Room roster captured with a share so later disclosure can be replayed. */
export type ArtifactShareRoomSnapshot = ArtifactRoomSnapshot;
/** Typed share metadata parsed from a record's jsonb metadata. */
export interface ParsedArtifactShareMetadata {
    grants: ArtifactShareGrant[];
    roomSnapshot?: ArtifactShareRoomSnapshot;
}
/**
 * Parse `metadata.share.grants` off an untyped stored record into typed
 * grants. Malformed entries are dropped — a grant that cannot be read grants
 * NOTHING (fail closed), it never degrades into some default access.
 */
export declare function parseArtifactShareMetadata(metadata: unknown): ParsedArtifactShareMetadata;
export declare function parseArtifactShareGrants(metadata: unknown): ArtifactShareGrant[];
/** The disclosure-relevant fields of one artifact-referencing record. */
export interface ArtifactDisclosureRecord {
    /** Stored visibility scope (callers normalize; unknown fails closed). */
    scope: MemoryScope;
    /** Entity the record is scoped to (owner/speaker), for entity-scoped tiers. */
    scopedEntityId?: UUID;
    /** Parsed share grants from the record's metadata. */
    grants?: readonly ArtifactShareGrant[];
    /** Full typed share metadata when callers already carry the parsed contract. */
    share?: ParsedArtifactShareMetadata | ArtifactShareMetadata;
}
/**
 * Normalize one stored memory into the artifact-disclosure record shape.
 *
 * Storage metadata is jsonb and therefore untrusted at read time. Unknown scope
 * values collapse to `owner-private`, and malformed grants/scoped ids are
 * ignored, so a corrupt row cannot widen disclosure by accident.
 */
export declare function artifactDisclosureRecordFromMemory(memory: Pick<Memory, "entityId" | "metadata">): ArtifactDisclosureRecord;
/**
 * Decide what `ctx`'s requester may see of one artifact record.
 *
 * Tier order (most privileged first):
 *  1. No access context → `full`. The single-owner local boundary deliberately
 *     omits a context (see `RouteHandlerContext.accessContext`), and existing
 *     unfiltered behavior there is a documented product decision.
 *  2. Agent self-read, OWNER, or ADMIN rank → `full`.
 *  3. An explicit per-entity grant wins in BOTH directions: a `full` grant
 *     elevates past the scope ladder, and a `redacted` grant narrows the viewer
 *     to the variant even when the scope ladder would allow full — the owner's
 *     per-viewer instruction (e.g. an admin "redact for everyone" pass) must
 *     not be undone by a coarse `global` scope.
 *  4. No grant → the scope ladder (`canReadScope`): a USER still reads global
 *     records and their own user-private records in full; the `owner-private`
 *     default fails closed to `none`.
 */
export declare function resolveArtifactDisclosure(record: ArtifactDisclosureRecord, ctx: AccessContext | undefined, agentId: UUID): ArtifactDisclosure;
/** Resolve artifact disclosure directly from a memory row. */
export declare function resolveArtifactDisclosureForMemory(memory: Pick<Memory, "entityId" | "metadata">, ctx: AccessContext | undefined, agentId: UUID): ArtifactDisclosure;
export interface ArtifactVariantUrls {
    fullUrl?: string | null;
    redactedUrl?: string | null;
}
export interface DisclosedArtifactUrl {
    disclosure: Exclude<ArtifactDisclosure, "none">;
    url: string;
    redacted: boolean;
}
/**
 * Select the URL a DTO may disclose for a resolved artifact decision.
 *
 * A redacted grant is fail-closed: if no redacted variant exists yet, callers
 * must omit the artifact instead of falling back to the original bytes.
 */
export declare function selectDisclosedArtifactUrl(disclosure: ArtifactDisclosure, urls: ArtifactVariantUrls): DisclosedArtifactUrl | null;
/** Boolean artifact predicate for disclosure points that only need allow/deny. */
export declare function canAccessArtifact(record: ArtifactDisclosureRecord, ctx: AccessContext | undefined, agentId: UUID): boolean;
/**
 * Select the concrete full/redacted reference for a DTO after the caller has
 * resolved disclosure. A redacted grant never falls back to full bytes; if no
 * redacted variant exists the artifact is omitted until the variant writer
 * catches up.
 */
export declare function selectArtifactVariant<TFull, TRedacted = TFull>(disclosure: ArtifactDisclosure, references: ArtifactVariantReferences<TFull, TRedacted>): ResolvedArtifactVariant<TFull | TRedacted> | null;
//# sourceMappingURL=artifact-disclosure.d.ts.map