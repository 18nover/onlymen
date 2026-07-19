/** Parameters for {@link RecursiveCharacterTextSplitter}. */
export interface RecursiveCharacterTextSplitterParams {
    chunkSize?: number;
    chunkOverlap?: number;
    separators?: string[];
    keepSeparator?: boolean;
    lengthFunction?: (text: string) => number | Promise<number>;
}
/**
 * Recursively splits text on progressively finer separators until chunks fit `chunkSize`,
 * merging small pieces with overlap handling (character-length; default keepSeparator: true).
 */
export declare class RecursiveCharacterTextSplitter {
    private chunkSize;
    private chunkOverlap;
    private separators;
    private keepSeparator;
    private lengthFunction;
    constructor(fields?: RecursiveCharacterTextSplitterParams);
    private splitOnSeparator;
    private joinDocs;
    private mergeSplits;
    private _splitText;
    splitText(text: string): Promise<string[]>;
}
//# sourceMappingURL=recursive-character-text-splitter.d.ts.map