/**
 * First-sentence snip helper for the TTS first-line cache.
 *
 * Pure, deterministic, no I/O. Both the local runtime and the Eliza Cloud
 * `/api/v1/voice/tts` route call into this module so that byte-equal sentence
 * text on either side maps to byte-equal cache keys.
 *
 * Algorithm summary (see R4 §2 in `.swarm/research/R4-tts-cache.md`):
 *   1. Trim leading whitespace.
 *   2. Walk char-by-char, tracking quote depth (skip terminators inside
 *      `"..."`/`'...'`/`“...”`), decimal context (digit-`.`-digit isn't a
 *      boundary), and abbreviation context (e.g. `Mr.`, `e.g.`, `U.S.`).
 *   3. First surviving terminator (`.`/`!`/`?`/`…`/`。`/`！`/`？`) or `\n`
 *      ends the sentence. Consume any contiguous run of terminators that
 *      follow (so `"Wait..."` stays intact).
 *   4. If no terminator and no newline → null (don't cache unterminated text).
 *   5. Apply ≤10-word filter on the normalised form. If wordCount > 10,
 *      return null (don't cache).
 *
 * `FIRST_SENTENCE_SNIP_VERSION` is part of the cache key — bumping it
 * invalidates every existing cached entry.
 */
/**
 * Cache-key algorithm version. Bump when the snip/normalise logic changes
 * in a way that would produce different keys for the same input. Local and
 * cloud caches re-key off this constant, so a bump rolls the entire cache.
 */
export declare const FIRST_SENTENCE_SNIP_VERSION: "1";
export type FirstSentenceSnipVersion = typeof FIRST_SENTENCE_SNIP_VERSION;
/**
 * Maximum word count (Unicode-aware) for a cacheable first-sentence snip.
 * Beyond this the bytes won't repeat often enough to amortise the cache.
 */
export declare const FIRST_SENTENCE_MAX_WORDS: 10;
/**
 * Unicode-aware word count. Hyphenated words and apostrophe-internal words
 * count as one (e.g. "twenty-three" → 1, "it's" → 1). Dotted acronyms with
 * single-letter segments (e.g. "U.S.", "U.S.A.") count as one word. Decimal
 * numbers like "3.14" count as one word.
 */
export declare function wordCount(s: string): number;
/**
 * Normalise a snip for cache-key purposes. NFC + lower-case + collapse
 * whitespace + strip trailing terminators/whitespace. Apostrophes preserved.
 */
export declare function normalizeForKey(snip: string): string;
export interface FirstSentenceSnipResult {
    /** Raw snip including the terminator run, exactly as it appeared. */
    raw: string;
    /** Normalised form for cache-key hashing (`normalizeForKey(raw)`). */
    normalized: string;
    /** Unicode-aware word count over `normalized`. Always ≤ 10. */
    wordCount: number;
    /** End-exclusive offset into the original input where the snip ends. */
    endOffset: number;
}
/**
 * Attempt to snip the first sentence from `text`. Returns `null` if:
 *   - input is empty / whitespace only
 *   - no sentence-terminator found
 *   - normalised snip has > 10 words
 *   - normalised snip is empty after stripping terminators
 *
 * Otherwise returns a `FirstSentenceSnipResult` carrying the raw and
 * normalised forms plus the word count.
 */
export declare function firstSentenceSnip(text: string): FirstSentenceSnipResult | null;
//# sourceMappingURL=first-sentence-snip.d.ts.map