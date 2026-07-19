/**
 * Chat-upload limits shared by the client composer and the server validator.
 *
 * The server (`packages/agent/src/api/server-helpers.ts`,
 * `validateChatImages`) rejects a chat send with a 400 BEFORE the message
 * persists when any attachment breaks these caps, so the client
 * (`packages/ui/src/utils/image-attachment.ts`) must enforce the exact same
 * numbers up front. Both sides import THIS module — hardcoding a copy on
 * either side reintroduces the drift that destroyed user messages (the client
 * accepted a 20 MB HEIC, the server 400'd after the composer was already
 * cleared, and the post-failure reload wiped the optimistic bubble).
 */
/** Max number of attachments on a single chat message (all kinds). */
export declare const MAX_CHAT_UPLOAD_ATTACHMENTS = 4;
/**
 * Server cap on the BASE64 payload length of an image attachment. The server
 * measures the base64 string, not the decoded bytes, so 5 MiB of base64 is
 * only ~3.75 MiB of raw image ({@link MAX_CHAT_IMAGE_RAW_BYTES}).
 */
export declare const MAX_CHAT_IMAGE_BASE64_BYTES: number;
/**
 * Server cap on the BASE64 payload length of a non-image attachment
 * (audio / video / pdf / text). ~11.25 MiB of raw bytes
 * ({@link MAX_CHAT_MEDIA_RAW_BYTES}).
 */
export declare const MAX_CHAT_MEDIA_BASE64_BYTES: number;
/** Max attachment file-name length (UTF-16 code units) the server accepts. */
export declare const MAX_CHAT_ATTACHMENT_NAME_LENGTH = 255;
/**
 * Largest RAW byte size whose base64 encoding fits under `base64Cap`.
 * Base64 encodes every 3 raw bytes as 4 characters (padded), so
 * `raw <= floor(cap / 4) * 3` guarantees `base64Length <= cap`.
 */
export declare function maxRawBytesForBase64(base64Cap: number): number;
/** Largest raw image file whose base64 payload fits the image cap (~3.75 MiB). */
export declare const MAX_CHAT_IMAGE_RAW_BYTES: number;
/** Largest raw non-image file whose base64 payload fits the media cap (~11.25 MiB). */
export declare const MAX_CHAT_MEDIA_RAW_BYTES: number;
/**
 * Image subtypes the server accepts as-is. Anything else (HEIC, TIFF, BMP,
 * SVG, …) must be re-encoded client-side (canvas → JPEG) before send, or the
 * server rejects the whole message.
 */
export declare const CHAT_IMAGE_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp"];
/** Every MIME type the chat upload endpoint accepts. */
export declare const CHAT_UPLOAD_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "image/webp", "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/wave", "audio/ogg", "audio/webm", "audio/mp4", "audio/aac", "audio/flac", "video/mp4", "video/webm", "video/quicktime", "video/ogg", "application/pdf", "text/plain", "text/csv", "text/markdown", "application/json"];
export type ChatUploadMimeType = (typeof CHAT_UPLOAD_MIME_TYPES)[number];
/** Set view of {@link CHAT_IMAGE_MIME_TYPES} for O(1) membership checks (lowercase). */
export declare const CHAT_IMAGE_MIME_TYPE_SET: ReadonlySet<string>;
/** Set view of {@link CHAT_UPLOAD_MIME_TYPES} for O(1) membership checks (lowercase). */
export declare const CHAT_UPLOAD_MIME_TYPE_SET: ReadonlySet<string>;
//# sourceMappingURL=chat-upload-limits.d.ts.map