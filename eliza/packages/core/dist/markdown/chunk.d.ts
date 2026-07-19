/**
 * Text chunking utilities for markdown-aware splitting.
 *
 * Provides functions to split text into chunks while respecting:
 * - Fenced code blocks
 * - Paragraph boundaries
 * - Word boundaries
 *
 * @module markdown/chunk
 */
/**
 * Split text into chunks of maximum length.
 *
 * Prefers breaking at:
 * 1. Newlines (outside parentheses)
 * 2. Whitespace (word boundaries)
 * 3. Hard break at limit as fallback
 *
 * @param text - The text to chunk
 * @param limit - Maximum chunk length
 * @returns Array of text chunks
 */
export declare function chunkText(text: string, limit: number): string[];
/**
 * Split text into chunks on paragraph boundaries (blank lines).
 *
 * - Only breaks at paragraph separators ("\n\n" or more)
 * - Packs multiple paragraphs into a single chunk up to `limit`
 * - Falls back to length-based splitting when a paragraph exceeds `limit`
 *
 * @param text - The text to chunk
 * @param limit - Maximum chunk length
 * @param opts - Options for controlling splitting behavior
 * @returns Array of text chunks
 */
export declare function chunkByParagraph(text: string, limit: number, opts?: {
    splitLongParagraphs?: boolean;
}): string[];
/**
 * Split markdown text with awareness of code fences.
 *
 * When a chunk must be split inside a code fence, properly closes
 * the fence in the current chunk and reopens it in the next.
 *
 * @param text - The markdown text to chunk
 * @param limit - Maximum chunk length
 * @returns Array of text chunks
 */
export declare function chunkMarkdownText(text: string, limit: number): string[];
//# sourceMappingURL=chunk.d.ts.map