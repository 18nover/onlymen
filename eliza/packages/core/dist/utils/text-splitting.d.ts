/**
 * Splits text into the first sentence and the rest of the text.
 * Handles common abbreviations to avoid false positives.
 */
export declare function extractFirstSentence(text: string): {
    first: string;
    rest: string;
};
/**
 * Checks if the text likely contains a complete first sentence.
 * Useful for streaming to know when to call extractFirstSentence.
 */
export declare function hasFirstSentence(text: string): boolean;
//# sourceMappingURL=text-splitting.d.ts.map