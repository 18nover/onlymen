/**
 * Keyword matching utilities for i18n validation keywords.
 *
 * These functions operate on keyword terms (individual words/phrases) that are
 * loaded from the generated keyword data. They handle Unicode normalization,
 * word boundary detection, and greedy matching across message history.
 *
 * The keyword data itself lives in generated/validation-keyword-data.js
 * at runtime (codegen'd from keywords/*.keywords.json).
 */
import { VALIDATION_KEYWORD_DOCS } from "./generated/validation-keyword-data.js";
export { VALIDATION_KEYWORD_DOCS };
export declare function normalizeKeywordMatchText(value: string): string;
export declare function splitKeywordDoc(value: string | undefined): string[];
export declare function textIncludesKeywordTerm(text: string, term: string): boolean;
export declare function collectKeywordTermMatches(texts: readonly string[], terms: readonly string[]): Set<string>;
export declare function findKeywordTermMatch(text: string, terms: readonly string[]): string | undefined;
export declare function getValidationKeywordTerms(key: string, options?: {
    includeAllLocales?: boolean;
    locale?: unknown;
}): string[];
export declare function getValidationKeywordLocaleTerms(key: string, locale: unknown): string[];
//# sourceMappingURL=keyword-matching.d.ts.map