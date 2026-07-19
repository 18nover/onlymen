/**
 * Shared connector attachment helpers — the canonical, connector-agnostic way to
 * (a) classify a platform attachment's MIME type into the coarse `ContentType`,
 * (b) build a normalized `Media` from a connector's raw attachment shape, and
 * (c) fetch attachment bytes safely (SSRF-guarded + size-capped).
 *
 * Every connector (Discord, Telegram, Slack, …) previously reimplemented these,
 * often inconsistently (some set no `contentType`, some fetched with a raw,
 * unguarded `fetch`). Connectors should import these instead. `contentTypeForMime`
 * returns the literal `ContentType` string values (not the enum object) so it has
 * no runtime dependency on the `ContentType` const and is safe to import from any
 * package/runtime.
 */
import type { ContentType, Media } from "../types/primitives.js";
/** Default hard cap on bytes pulled when resolving a connector attachment. */
export declare const DEFAULT_CONNECTOR_ATTACHMENT_MAX_BYTES: number;
/**
 * Map a platform attachment's MIME type to the coarse core `ContentType`.
 * Returns the literal value so callers never touch the `ContentType` enum object.
 */
export declare function contentTypeForMime(mime?: string | null): ContentType;
/** A connector's raw attachment, before normalization to {@link Media}. */
export interface RawConnectorAttachment {
    /** Platform attachment id (used as Media.id when present). */
    id?: string | number;
    /** A servable/fetchable URL for the bytes. */
    url: string;
    /** Platform-reported MIME type, if any. */
    mimeType?: string | null;
    /** Original filename, if any. */
    fileName?: string | null;
    /** Byte size, if known. */
    size?: number | null;
    /** Optional human title / description / extracted text. */
    title?: string;
    description?: string;
    text?: string;
}
/**
 * Normalize a connector's raw attachment into a `Media`, deriving `contentType`
 * from the MIME type so audio/video are transcribed downstream and every
 * attachment round-trips safely across connectors. Pass a default index to mint
 * a stable id when the platform doesn't supply one.
 */
export declare function toMedia(raw: RawConnectorAttachment, opts?: {
    idFallback?: string;
}): Media;
/** Bytes + resolved metadata for a connector attachment. */
export interface ResolvedAttachmentBytes {
    buffer: Buffer;
    contentType: string;
    fileName?: string;
}
/**
 * Fetch a remote connector attachment's bytes through the SSRF-guarded fetcher
 * (blocks private/loopback/link-local hosts) with a hard size cap. Use this for
 * any inbound/outbound connector media fetch instead of a raw `fetch`.
 */
export declare function resolveAttachmentBytes(url: string, opts?: {
    maxBytes?: number;
}): Promise<ResolvedAttachmentBytes>;
//# sourceMappingURL=attachments.d.ts.map