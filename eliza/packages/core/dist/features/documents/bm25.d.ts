/**
 * BM25 (Best Match 25) scoring for document retrieval.
 *
 * Implements the Okapi BM25 ranking function for keyword-based relevance
 * scoring over a corpus of text documents.
 *
 * Default parameters follow Robertson et al. (1994):
 *   k1 = 1.5 (term saturation)
 *   b  = 0.75 (length normalization)
 */
export interface Bm25Document {
    id: string;
    text: string;
}
export interface Bm25Score {
    id: string;
    score: number;
}
export interface Bm25Options {
    /** Term frequency saturation. Higher → more weight on repeated terms. Default 1.5 */
    k1?: number;
    /** Document-length normalization. 1.0 = full normalization, 0 = none. Default 0.75 */
    b?: number;
}
/**
 * Tokenize text into lowercase words, stripping punctuation.
 * Shared between index building and query processing.
 */
export declare function tokenize(text: string): string[];
/**
 * Score each document in `documents` against `query` using BM25.
 *
 * Documents with a score of 0 are included in the result (they simply
 * did not match any query term) so callers can normalize across the
 * full candidate set. Returned array is in the same order as input.
 */
export declare function bm25Scores(query: string, documents: Bm25Document[], opts?: Bm25Options): Bm25Score[];
/**
 * Normalize an array of BM25 scores to [0, 1].
 * All-zero arrays are returned unchanged.
 */
export declare function normalizeBm25Scores(scores: Bm25Score[]): Bm25Score[];
//# sourceMappingURL=bm25.d.ts.map