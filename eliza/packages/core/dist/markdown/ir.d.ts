/**
 * Markdown to Intermediate Representation (IR) conversion.
 *
 * Converts markdown text to a structured format with:
 * - Plain text content
 * - Style spans (bold, italic, code, etc.)
 * - Link spans
 *
 * This enables consistent rendering across different platforms
 * that may have different markdown support.
 *
 * @module markdown/ir
 */
/**
 * Style types that can be applied to text.
 */
export type MarkdownStyle = "bold" | "italic" | "strikethrough" | "code" | "code_block" | "spoiler";
/**
 * A span of styled text.
 */
export type MarkdownStyleSpan = {
    /** Start offset in the text */
    start: number;
    /** End offset in the text */
    end: number;
    /** The style applied */
    style: MarkdownStyle;
};
/**
 * A span containing a link.
 */
export type MarkdownLinkSpan = {
    /** Start offset in the text */
    start: number;
    /** End offset in the text */
    end: number;
    /** The link URL */
    href: string;
};
/**
 * Intermediate Representation of parsed markdown.
 */
export type MarkdownIR = {
    /** Plain text content with markdown stripped */
    text: string;
    /** Style spans applied to the text */
    styles: MarkdownStyleSpan[];
    /** Link spans in the text */
    links: MarkdownLinkSpan[];
};
/**
 * How to render tables in the output.
 */
export type MarkdownTableMode = "off" | "bullets" | "code";
/**
 * Options for markdown parsing.
 */
export type MarkdownParseOptions = {
    /** Whether to auto-link URLs */
    linkify?: boolean;
    /** Whether to enable ||spoiler|| syntax */
    enableSpoilers?: boolean;
    /** How to style headings */
    headingStyle?: "none" | "bold";
    /** Prefix for blockquotes */
    blockquotePrefix?: string;
    /** Whether to enable autolink detection */
    autolink?: boolean;
    /** How to render tables */
    tableMode?: MarkdownTableMode;
};
/**
 * Convert markdown text to Intermediate Representation.
 *
 * @param markdown - The markdown text to parse
 * @param options - Parse options
 * @returns The parsed IR with text, styles, and links
 */
export declare function markdownToIR(markdown: string, options?: MarkdownParseOptions): MarkdownIR;
/**
 * Convert markdown text to IR with metadata.
 *
 * @param markdown - The markdown text to parse
 * @param options - Parse options
 * @returns Object containing IR and metadata (hasTables)
 */
export declare function markdownToIRWithMeta(markdown: string, options?: MarkdownParseOptions): {
    ir: MarkdownIR;
    hasTables: boolean;
};
/**
 * Split a markdown IR into chunks.
 *
 * Preserves style and link spans across chunk boundaries.
 *
 * @param ir - The IR to chunk
 * @param limit - Maximum chunk length
 * @returns Array of IR chunks
 */
export declare function chunkMarkdownIR(ir: MarkdownIR, limit: number): MarkdownIR[];
//# sourceMappingURL=ir.d.ts.map