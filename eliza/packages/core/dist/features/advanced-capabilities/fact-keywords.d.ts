/**
 * Lexical keyword tooling behind fact retrieval in the advanced-capabilities
 * bundle. Tokenizes fact text (lowercase, strip punctuation/stopwords, split
 * hyphens, length floors), extracts and frequency-ranks keywords, and builds the
 * per-fact search text and query text used for recall. `scoreFactKeywordRelevance`
 * ranks candidate fact memories with BM25 over that search text, while
 * `factLexicalSimilarity` blends coverage (0.7) and Jaccard (0.3) into a
 * keyword-set similarity (1.0 identical, 0 disjoint) for dedupe/matching.
 */
import type { Memory } from "../../types/index.js";
export declare function tokenizeFactText(text: string): string[];
export declare function extractFactKeywords(...values: unknown[]): string[];
export declare function readStoredFactKeywords(memory: Memory): string[];
export declare function buildFactSearchText(memory: Memory): string;
export declare function buildFactQueryText(...values: unknown[]): string;
export declare function buildFactKeywordsForStorage(...values: unknown[]): string[];
export interface FactKeywordRelevance {
    memory: Memory;
    relevance: number;
}
export declare function scoreFactKeywordRelevance(queryText: string, memories: Memory[]): FactKeywordRelevance[];
export declare function factLexicalSimilarity(leftValues: unknown[], rightValues: unknown[]): number;
//# sourceMappingURL=fact-keywords.d.ts.map