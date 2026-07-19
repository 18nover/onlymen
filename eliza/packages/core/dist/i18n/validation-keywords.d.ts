/**
 * Validation keywords for @elizaos/core.
 *
 * Keyword DATA is generated from JSON: @elizaos/shared/src/i18n/keywords/*.keywords.json
 *   → generated/validation-keyword-data.ts  (codegen, do not edit)
 *
 * Matching UTILITIES are below (hand-written).
 *
 * To add/edit keywords, edit the JSON files and run:
 *   node packages/shared/scripts/generate-keywords.mjs
 */
import { VALIDATION_KEYWORD_DOCS as _DOCS, VALIDATION_KEYWORD_LOCALES as _LOCALES } from "./generated/validation-keyword-data.js";
export type { ValidationKeywordLocale } from "./generated/validation-keyword-data.js";
export { _DOCS as VALIDATION_KEYWORD_DOCS, _LOCALES as VALIDATION_KEYWORD_LOCALES, };
export declare function normalizeKeywordMatchText(value: string): string;
export declare function splitKeywordDoc(value: string | undefined): string[];
export declare function textIncludesKeywordTerm(text: string, term: string): boolean;
export declare function collectKeywordTermMatches(texts: readonly string[], terms: readonly string[]): Set<string>;
export declare function findKeywordTermMatch(text: string, terms: readonly string[]): string | undefined;
export declare function getValidationKeywordTerms(key: string, options?: {
    includeAllLocales?: boolean;
    locale?: string;
}): string[];
export declare function getValidationKeywordLocaleTerms(key: string, locale: string): string[];
//# sourceMappingURL=validation-keywords.d.ts.map