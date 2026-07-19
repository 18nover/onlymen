/**
 * Inline code span detection for markdown.
 *
 * Handles backtick-delimited inline code spans with proper
 * tracking of state across streaming chunks.
 *
 * @module markdown/code-spans
 */
/**
 * State for tracking open inline code spans across chunks.
 */
export type InlineCodeState = {
    /** Whether we're currently inside an inline code span */
    open: boolean;
    /** Number of backticks in the opening sequence */
    ticks: number;
};
/**
 * Create initial inline code state.
 */
export declare function createInlineCodeState(): InlineCodeState;
/**
 * Index for checking if positions are inside code.
 */
export type CodeSpanIndex = {
    /** Updated inline code state after processing */
    inlineState: InlineCodeState;
    /** Check if an index is inside any code (fence or inline) */
    isInside: (index: number) => boolean;
};
/**
 * Build an index for checking if positions are inside code spans.
 *
 * This handles both fenced code blocks and inline code spans.
 * State can be passed in for streaming scenarios.
 *
 * @param text - The text to analyze
 * @param inlineState - Optional state from previous chunk
 * @returns Index object with isInside() method
 */
export declare function buildCodeSpanIndex(text: string, inlineState?: InlineCodeState): CodeSpanIndex;
//# sourceMappingURL=code-spans.d.ts.map