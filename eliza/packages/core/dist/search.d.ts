/**
 * Interface for tokenization statistics.
 */
interface TokenizationStats {
    /** Number of words in the original text before any processing. */
    originalWordCount: number;
    /** Number of words removed because they were identified as stop words. */
    stopWordsRemoved: number;
    /** Number of words that were stemmed (only if stemming is enabled). */
    stemmedWords: number;
    /** Time taken for tokenization in milliseconds. */
    processingTimeMs: number;
}
/**
 * Interface for the result of tokenization.
 */
interface TokenizationResult {
    /** Array of processed tokens (words). */
    tokens: string[];
    /** Optional statistics about the tokenization process. */
    stats?: TokenizationStats;
}
/**
 * Interface for stemming rules.
 */
interface StemmingRule {
    /** A RegExp pattern or string to match suffixes. */
    pattern: RegExp | string;
    /** The replacement string or function. */
    replacement: string | ((substring: string, ...args: unknown[]) => string);
    /** Optional minimum measure (complexity) of the word stem for the rule to apply. */
    minMeasure?: number;
}
/**
 * Options for configuring the Tokenizer.
 */
export interface TokenizerOptions {
    /** A set of words to be ignored during tokenization. Defaults to an empty set. */
    stopWords?: Set<string>;
    /** The minimum length for a token to be kept. Defaults to 2. Numeric tokens are always kept. */
    minLength?: number;
    /** Whether to apply stemming to tokens. Defaults to false. */
    stemming?: boolean;
    /** Custom stemming rules to apply before the default Porter2 stemmer. Defaults to an empty array. */
    stemmingRules?: StemmingRule[];
}
/**
 * Flexible text tokenizer with support for stop words, minimum token length,
 * Unicode normalization, and optional Porter2 stemming with custom rules.
 */
export declare class Tokenizer {
    /** Set of stop words to ignore. */
    readonly stopWords: Set<string>;
    /** Minimum length of tokens to keep. */
    readonly minLength: number;
    /** Flag indicating if stemming is enabled. */
    readonly stemming: boolean;
    /** Custom stemming rules. */
    readonly stemmingRules: {
        pattern: RegExp;
        replacement: string | ((substring: string, ...args: unknown[]) => string);
        minMeasure?: number;
    }[];
    /** Default options for the Tokenizer. */
    static readonly DEFAULT_OPTIONS: Required<TokenizerOptions>;
    /**
     * Creates a new tokenizer instance.
     * @param options - Tokenization options including stop words, min length, stemming, and custom rules.
     */
    constructor(options?: TokenizerOptions);
    /**
     * Tokenizes input text into an array of processed terms.
     * Steps:
     * 1. Cleans the text (lowercase, normalize, remove punctuation/symbols).
     * 2. Splits the text into potential tokens.
     * 3. Filters tokens based on `minLength` and `stopWords`.
     * 4. Applies stemming if `stemming` is true (custom rules first, then Porter2).
     * 5. Optionally calculates statistics.
     *
     * @param text - The input text string to tokenize.
     * @param includeStats - If true, returns tokenization statistics along with tokens. Defaults to false.
     * @returns A `TokenizationResult` object containing the array of tokens and optional stats.
     * @throws {Error} If the input text is null, undefined, or empty.
     */
    tokenize(text: string, includeStats?: boolean): TokenizationResult;
    /**
     * Cleans and normalizes text for tokenization.
     * - Converts to lowercase.
     * - Normalizes Unicode characters (NFKD).
     * - Removes control characters and zero-width spaces.
     * - Removes diacritical marks (accents).
     * - Removes emojis and pictographs.
     * - Removes common symbols (™, ®, ©, ℠, ‼).
     * - Replaces Unicode punctuation with spaces.
     * - Removes characters not matching basic Latin, CJK, Hangul, or whitespace.
     * - Collapses multiple spaces into single spaces.
     * - Trims leading/trailing whitespace.
     *
     * @param text - Input text to clean.
     * @returns Cleaned and normalized text, ready for splitting into tokens.
     *
     * @example
     * cleanText("Hello, World™!") // "hello world"
     * cleanText("héllo 👋") // "hello"
     * cleanText("Hello 世界!") // "hello 世界"
     * cleanText("I'm don't") // "i'm don't" (apostrophes kept by replacing punctuation with space)
     * cleanText("test©2023") // "test 2023"
     */
    cleanText(text: string): string;
    /**
     * Checks if a token is valid (meets `minLength` criteria and is not a stop word).
     * Numeric tokens are always considered valid regardless of length.
     * @param token - The token string to validate.
     * @returns `true` if the token is valid, `false` otherwise.
     */
    isValidToken(token: string): boolean;
    /**
     * Applies stemming to a single word.
     * First, tries to apply custom stemming rules defined in `stemmingRules`.
     * If no custom rule matches, applies the default Porter2 stemming algorithm.
     * Words shorter than 3 characters are not stemmed.
     * @param word - The word to stem.
     * @returns The stemmed word.
     */
    stemWord(word: string): string;
    /**
     * Checks if the character at a given index in a word is a consonant.
     * Treats 'y' as a consonant if it's the first letter or follows a consonant.
     * @param word - The word string.
     * @param i - The index of the character to check.
     * @returns `true` if the character is a consonant, `false` otherwise.
     */
    isConsonant(word: string, i: number): boolean;
    /**
     * Calculates the "measure" of a word stem (approximates syllable count).
     * The measure (m) is the number of times a sequence of vowels is followed by a
     * sequence of consonants (VC). Used in some stemming rules.
     * Example: measure("tree") = 0, measure("trouble") = 1, measure("private") = 2
     * @param word - The word (or stem) to measure.
     * @returns The measure (m) of the word.
     */
    measure(word: string): number;
}
/**
 * BM25 Options Interface.
 * Extends TokenizerOptions and adds BM25 specific parameters.
 */
interface BM25Options extends TokenizerOptions {
    /**
     * Term frequency saturation parameter (k1). Controls how quickly term frequency
     * saturates. Higher values mean TF contributes more significantly even for high counts.
     * Typical values are between 1.2 and 2.0. Default: 1.2.
     */
    k1?: number;
    /**
     * Document length normalization parameter (b). Controls the influence of document
     * length. 0 means no length normalization, 1 means full normalization.
     * Typical values are around 0.75. Default: 0.75.
     */
    b?: number;
    /**
     * A dictionary defining boost factors for specific document fields.
     * Terms found in fields with higher boost factors will contribute more to the score.
     * Example: `{ title: 2, body: 1 }`. Default: `{}` (no boosts).
     */
    fieldBoosts?: {
        [key: string]: number;
    };
}
/**
 * Represents a search result item.
 */
interface SearchResult {
    /** The index of the matching document in the original document array. */
    index: number;
    /** The BM25 relevance score for the document. Higher scores indicate better relevance. */
    score: number;
    /** The actual document object (optional, depends on how results are retrieved). */
    doc?: Record<string, unknown>;
}
/**
 * Implements the Okapi BM25 (Best Matching 25) ranking function for information retrieval.
 *
 * BM25 ranks documents based on the query terms appearing in each document,
 * considering term frequency (TF) and inverse document frequency (IDF).
 * It improves upon basic TF-IDF by incorporating:
 * - Term Frequency Saturation (k1): Prevents overly frequent terms from dominating the score.
 * - Document Length Normalization (b): Penalizes documents that are longer than average,
 *   assuming longer documents are more likely to contain query terms by chance.
 *
 * Key Components:
 * - Tokenizer: Processes text into terms (words), handles stop words and stemming.
 * - Document Indexing: Stores document lengths, term frequencies per document,
 *   and overall document frequency for each term.
 * - IDF Calculation: Measures the informativeness of a term based on how many documents contain it.
 * - Scoring: Combines TF, IDF, document length, and parameters k1/b to calculate relevance.
 */
export declare class BM25 {
    /** Term frequency saturation parameter (k1). */
    readonly termFrequencySaturation: number;
    /** Document length normalization factor (b). */
    readonly lengthNormalizationFactor: number;
    /** Tokenizer instance used for processing text. */
    readonly tokenizer: Tokenizer;
    /** Array storing the length (number of tokens, adjusted by field boosts) of each document. */
    documentLengths: Uint32Array;
    /** Average length of all documents in the index. */
    averageDocLength: number;
    /** Map from term (string) to its unique integer index. */
    termToIndex: Map<string, number>;
    /** Array storing the document frequency (number of docs containing the term) for each term index. */
    documentFrequency: Uint32Array;
    /** Map from term index to another map storing `docIndex: termFrequencyInDoc`. */
    termFrequencies: Map<number, Map<number, number>>;
    /** Boost factors for different fields within documents. */
    readonly fieldBoosts: {
        [key: string]: number;
    };
    /** Array storing the original documents added to the index. */
    documents: Array<Record<string, unknown>>;
    /**
     * Creates a new BM25 search instance.
     * @param docs - Optional array of initial documents (objects with string fields) to index.
     * @param options - Configuration options for BM25 parameters (k1, b), tokenizer (stopWords, stemming, minLength), and field boosts.
     */
    constructor(docs?: Array<Record<string, unknown>>, options?: BM25Options);
    /**
     * Processes an array of documents to build the initial index structures.
     * Calculates document lengths, term frequencies, document frequencies, and average document length.
     * @param docs - Array of documents to process.
     * @returns An object containing the calculated index data.
     * @internal
     */
    private processDocuments;
    /**
     * Recalculates the average document length based on the current `documentLengths`.
     * @internal
     */
    private recalculateAverageLength;
    /**
     * Searches the indexed documents for a given query string using the BM25 ranking formula.
     *
     * @param query - The search query text.
     * @param topK - The maximum number of top-scoring results to return. Defaults to 10.
     * @returns An array of `SearchResult` objects, sorted by descending BM25 score.
     */
    search(query: string, topK?: number): SearchResult[];
    /**
     * Searches for an exact phrase within the indexed documents.
     * Ranks documents containing the exact sequence of tokens higher.
     * Basic implementation - proximity-based phrase search could improve results.
     *
     * @param phrase - The exact phrase to search for.
     * @param topK - The maximum number of results to return. Defaults to 10.
     * @returns An array of `SearchResult` objects, sorted by score, for documents containing the phrase.
     */
    searchPhrase(phrase: string, topK?: number): SearchResult[];
    /**
     * Calculates a BM25-like score for a sequence of phrase tokens within a specific document.
     * Sums the individual BM25 scores of the terms in the phrase for that document.
     * @param phraseTokens - The tokenized phrase.
     * @param docIndex - The index of the document to score against.
     * @returns The calculated phrase score for the document.
     * @internal
     */
    private calculatePhraseScore;
    /**
     * Adds a single new document to the index.
     * Updates all internal index structures incrementally.
     * For bulk additions, prefer `addDocumentsParallel` for better performance.
     *
     * @param doc - The document object (with string fields) to add.
     * @throws {Error} If the document is null or undefined.
     */
    addDocument(doc: Record<string, unknown>): Promise<void>;
    /**
     * Calculates the Inverse Document Frequency (IDF) for a given term index.
     * Uses the BM25 IDF formula: log(1 + (N - n + 0.5) / (n + 0.5))
     * where N is the total number of documents and n is the number of documents
     * containing the term. The +1 smooths the logarithm.
     *
     * @param termIndex - The integer index of the term.
     * @returns The IDF score for the term. Returns 0 if the term is not found or has 0 DF.
     */
    calculateIdf(termIndex: number): number;
    /**
     * Retrieves the term frequency (TF) for a specific term in a specific document.
     * @param termIndex - The integer index of the term.
     * @param docIndex - The index of the document.
     * @returns The term frequency, or 0 if the term is not in the document or indices are invalid.
     */
    getTermFrequency(termIndex: number, docIndex: number): number;
    /**
     * Retrieves the original document object stored at a given index.
     * @param index - The index of the document to retrieve.
     * @returns The document object.
     * @throws {Error} If the index is out of bounds.
     */
    getDocument(index: number): Record<string, unknown>;
    /**
     * Clears all indexed documents and resets the BM25 instance to its initial state.
     */
    clearDocuments(): void;
    /**
     * Gets the total number of documents currently indexed.
     * @returns The document count.
     */
    getDocumentCount(): number;
    /**
     * Adds multiple documents sequentially by calling `addDocument` for each.
     * This method processes documents sequentially in the main thread.
     * @param docs - An array of documents to add.
     */
    addDocuments(docs: Array<Record<string, unknown>>): Promise<void>;
}
/** Source identifier for hybrid search results */
export type HybridSource = string;
/** Result from vector similarity search */
export type HybridVectorResult = {
    id: string;
    path: string;
    startLine: number;
    endLine: number;
    source: HybridSource;
    snippet: string;
    vectorScore: number;
};
/** Result from keyword (BM25) search */
export type HybridKeywordResult = {
    id: string;
    path: string;
    startLine: number;
    endLine: number;
    source: HybridSource;
    snippet: string;
    textScore: number;
};
/**
 * Build an FTS (Full-Text Search) query from a raw search string.
 * Extracts alphanumeric tokens and joins them with AND for strict matching.
 *
 * @param raw - The raw search query string.
 * @returns The FTS query string, or null if no valid tokens found.
 */
export declare function buildFtsQuery(raw: string): string | null;
/**
 * Convert BM25 rank to a normalized score between 0 and 1.
 * Lower rank = higher score.
 *
 * @param rank - The BM25 rank value.
 * @returns A normalized score where 1 is best and 0 is worst.
 */
export declare function bm25RankToScore(rank: number): number;
/**
 * Merge vector similarity and keyword search results using weighted scoring.
 *
 * This implements a hybrid search approach where results from both vector
 * similarity search and keyword (BM25) search are combined. Results that
 * appear in both searches get boosted scores.
 *
 * @param params.vector - Results from vector similarity search.
 * @param params.keyword - Results from keyword (BM25) search.
 * @param params.vectorWeight - Weight for vector similarity scores (default: 0.7).
 * @param params.textWeight - Weight for keyword/text scores (default: 0.3).
 * @returns Merged and sorted results with combined scores.
 */
export declare function mergeHybridResults(params: {
    vector: HybridVectorResult[];
    keyword: HybridKeywordResult[];
    vectorWeight: number;
    textWeight: number;
}): Array<{
    path: string;
    startLine: number;
    endLine: number;
    score: number;
    snippet: string;
    source: HybridSource;
}>;
/**
 * Normalize text for keyword matching: NFC-normalize, lowercase, strip
 * combining accents (café → cafe), and drop in-word apostrophes/backticks
 * (don't → dont). The SQL message-search path folds identically in Postgres via
 * an immutable `eliza_search_fold` function; this JS twin keeps the in-memory
 * adapters' `searchMessages` behaviorally aligned with the DB so both surfaces
 * agree on what a query matches. CJK and other scripts pass through unchanged.
 */
export declare function foldForSearch(text: string): string;
/**
 * The searchable text of a message: its body plus any attachment titles/URLs.
 * Mirrors the SQL `eliza_message_search_document` so a message matched only by
 * an attachment filename is found on both the in-memory and DB paths (#13534).
 */
export declare function messageSearchDocument(content: {
    text?: unknown;
    attachments?: unknown;
}): string;
/**
 * Whether a message's `createdAt` falls inside an inclusive `[since, until]`
 * epoch-ms window. The in-memory twin of the SQL adapters' `created_at`
 * range conditions in `searchMessages`, so both store paths agree on window
 * semantics. When a bound is set, a row without a numeric `createdAt` is
 * excluded — an unknown timestamp cannot be proven to be inside the window.
 */
export declare function withinCreatedAtWindow(createdAt: number | undefined, since?: number, until?: number): boolean;
/** A message-shaped record the in-memory search ranker can score and order. */
export interface SearchableMessage {
    content: {
        text?: unknown;
        attachments?: unknown;
    };
    createdAt?: number;
    id?: string;
}
/**
 * In-memory twin of the SQL message search (`IDatabaseAdapter.searchMessages`):
 * folds the query and each message's document identically to Postgres, keeps a
 * row when every query term appears (FTS analog) or the whole folded query is a
 * substring (trigram/phrase analog), and ranks corpus-wide by `ftsRank` then
 * trigram similarity then recency then id. Returned fully sorted; the caller
 * applies its own offset/limit window. Used by the in-memory database adapters
 * so their results agree with the DB path (#13534).
 */
export declare function rankMessageSearch<T extends SearchableMessage>(items: T[], query: string): Array<{
    item: T;
    ftsRank: number;
    trigramSimilarity: number;
}>;
export {};
//# sourceMappingURL=search.d.ts.map