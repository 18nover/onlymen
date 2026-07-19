/**
 * MIME type detection and media utilities for Eliza.
 *
 * Provides robust MIME type detection from file buffers, headers, and extensions.
 */
/** Media kind categories */
export type MediaKind = "image" | "audio" | "video" | "document" | "unknown";
/**
 * Get the file extension from a path or URL.
 */
export declare function getFileExtension(filePath?: string | null): string | undefined;
/**
 * Detect MIME type from buffer, headers, and/or file path.
 * Prioritizes sniffed types over extension-based detection.
 */
export declare function detectMime(opts: {
    buffer?: Buffer | Uint8Array;
    headerMime?: string | null;
    filePath?: string;
}): Promise<string | undefined>;
/**
 * Get the file extension for a MIME type.
 */
export declare function extensionForMime(mime?: string | null): string | undefined;
/**
 * Check if a file appears to be an audio file by extension.
 */
export declare function isAudioFileName(fileName?: string | null): boolean;
/**
 * Check if media is a GIF.
 */
export declare function isGifMedia(opts: {
    contentType?: string | null;
    fileName?: string | null;
}): boolean;
/**
 * Check if audio is voice-compatible (Opus/Ogg format).
 */
export declare function isVoiceCompatibleAudio(opts: {
    contentType?: string | null;
    fileName?: string | null;
}): boolean;
/**
 * Get media kind from MIME type.
 */
export declare function mediaKindFromMime(mime?: string | null): MediaKind;
/**
 * Get image MIME type from format name.
 */
export declare function imageMimeFromFormat(format?: string | null): string | undefined;
//# sourceMappingURL=mime.d.ts.map