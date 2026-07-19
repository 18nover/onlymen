/**
 * Code fence parsing utilities for markdown.
 *
 * Parses fenced code blocks (``` or ~~~) and provides utilities
 * to check if a position is inside a fence or if a break is safe.
 *
 * @module markdown/fences
 */
/**
 * Represents a fenced code block span in the text.
 */
export type FenceSpan = {
    /** Start offset of the fence in the text */
    start: number;
    /** End offset of the fence in the text */
    end: number;
    /** The opening line of the fence (e.g., "```typescript") */
    openLine: string;
    /** The marker characters (e.g., "```" or "~~~") */
    marker: string;
    /** Leading whitespace/indent before the marker */
    indent: string;
};
/**
 * Parse all fenced code block spans from a string.
 *
 * Handles both backtick (```) and tilde (~~~) fences,
 * with proper matching of closing markers.
 *
 * @param buffer - The text to parse
 * @returns Array of fence spans found
 */
export declare function parseFenceSpans(buffer: string): FenceSpan[];
/**
 * Find the fence span that contains a given index.
 *
 * @param spans - Array of fence spans to search
 * @param index - Position to check
 * @returns The fence span containing the index, or undefined
 */
export declare function findFenceSpanAt(spans: FenceSpan[], index: number): FenceSpan | undefined;
/**
 * Check if it's safe to break text at a given index (not inside a fence).
 *
 * @param spans - Array of fence spans
 * @param index - Position to check
 * @returns True if safe to break (not inside a fence)
 */
export declare function isSafeFenceBreak(spans: FenceSpan[], index: number): boolean;
//# sourceMappingURL=fences.d.ts.map