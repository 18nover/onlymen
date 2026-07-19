/**
 * Shared prompt-injection / obfuscation primitives.
 *
 * This is the single source of truth for the injection pattern bank and the
 * obfuscation-aware matching helpers. Both the rich `SecurityModule` advisory
 * detector and the fast deterministic should-respond risk gate
 * (`should-respond-risk-gate.ts`) consume these — there is intentionally NO
 * second pattern set (see issue #9949).
 */
/** Regexes for direct prompt-injection phrasing (multi-language + obfuscation). */
export declare const INJECTION_PATTERNS: readonly RegExp[];
/** Canonical prompt-injection phrases used for obfuscation-aware matching. */
export declare const INJECTION_KEYWORDS: readonly string[];
/**
 * Dangerous-command and forged chat-template indicators that appear in
 * untrusted EXTERNAL content (email / webhook / web). These are a distinct
 * concept from the prompt-injection PHRASING above: they flag destructive
 * commands and counterfeit role/system delimiters rather than instruction
 * overrides. They are intentionally kept out of `INJECTION_PATTERNS` so the
 * should-respond risk gate does not escalate ordinary developer chat that
 * merely mentions e.g. `rm -rf`. Consumed by the external-content monitor.
 */
export declare const EXTERNAL_CONTENT_RISK_PATTERNS: readonly RegExp[];
/** Keyword banks for social-engineering pressure tactics. */
export declare const URGENCY_KEYWORDS: readonly string[];
export declare const AUTHORITY_KEYWORDS: readonly string[];
export declare const INTIMIDATION_KEYWORDS: readonly string[];
/** Lowercase + strip every non-alphanumeric char for separator-insensitive scans. */
export declare function normalizeForScan(input: string): string;
export declare function reverseString(input: string): string;
/**
 * Build (and cache) a regex that matches a keyword even when its letters are
 * split by whitespace/punctuation (e.g. `i g n o r e`, `i.g.n.o.r.e`).
 */
export declare function getKeywordPattern(keyword: string): RegExp;
/**
 * True when `message` contains `keyword` directly, reversed, separator-split,
 * or token-reversed. Covers the common obfuscation tricks without an LLM.
 */
export declare function containsObfuscatedKeyword(message: string, keyword: string): boolean;
export declare function detectObfuscatedKeywordMatches(message: string, keywords: readonly string[]): string[];
//# sourceMappingURL=injection-primitives.d.ts.map