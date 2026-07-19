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
// Import from the data-free language module (not character-presets.js) so the
// i18n keyword matcher — which is on the eager renderer path via the shared
// barrel — does not pull the ~49KB CHARACTER_DEFINITIONS preset data.
import { normalizeCharacterLanguage } from "../character-language.js";
import { VALIDATION_KEYWORD_DOCS } from "./generated/validation-keyword-data.js";
// Re-export the generated data so existing consumers can still reach it
export { VALIDATION_KEYWORD_DOCS };
function isValidationKeywordDoc(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    const record = value;
    return "base" in record || "locales" in record;
}
function lookupValidationKeywordDoc(key) {
    let current = VALIDATION_KEYWORD_DOCS;
    for (const segment of key.split(".")) {
        if (!current || typeof current !== "object") {
            throw new Error(`Unknown validation keyword key: ${key}`);
        }
        current = current[segment];
    }
    if (!isValidationKeywordDoc(current)) {
        throw new Error(`Unknown validation keyword key: ${key}`);
    }
    return current;
}
function escapePattern(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function normalizeKeywordMatchText(value) {
    return value.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}
function usesAsciiWordBoundaries(term) {
    return /^[a-z0-9][a-z0-9' -]*$/i.test(term);
}
export function splitKeywordDoc(value) {
    if (!value) {
        return [];
    }
    const seen = new Set();
    const terms = [];
    for (const entry of value.split(/\n+/)) {
        const trimmed = entry.trim();
        if (!trimmed) {
            continue;
        }
        const key = normalizeKeywordMatchText(trimmed);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        terms.push(trimmed);
    }
    return terms;
}
export function textIncludesKeywordTerm(text, term) {
    const normalizedText = normalizeKeywordMatchText(text);
    const normalizedTerm = normalizeKeywordMatchText(term);
    if (!normalizedText || !normalizedTerm) {
        return false;
    }
    if (usesAsciiWordBoundaries(normalizedTerm)) {
        const pattern = new RegExp(`\\b${escapePattern(normalizedTerm).replace(/\\ /g, "\\s+")}\\b`, "i");
        if (pattern.test(text)) {
            return true;
        }
        const hasNonAsciiText = [...text].some((char) => char.charCodeAt(0) > 0x7f);
        if (hasNonAsciiText) {
            return normalizedText.includes(normalizedTerm);
        }
        return false;
    }
    return normalizedText.includes(normalizedTerm);
}
export function collectKeywordTermMatches(texts, terms) {
    const matches = new Set();
    for (const text of texts) {
        for (const term of terms) {
            if (textIncludesKeywordTerm(text, term)) {
                matches.add(term);
            }
        }
    }
    return matches;
}
export function findKeywordTermMatch(text, terms) {
    const sorted = [...terms].sort((left, right) => right.length - left.length);
    return sorted.find((term) => textIncludesKeywordTerm(text, term));
}
export function getValidationKeywordTerms(key, options) {
    const doc = lookupValidationKeywordDoc(key);
    if (options?.includeAllLocales) {
        return splitKeywordDoc([doc.base, ...Object.values(doc.locales ?? {})]
            .filter((value) => typeof value === "string")
            .join("\n"));
    }
    const locale = normalizeCharacterLanguage(options?.locale);
    return splitKeywordDoc(`${doc.base ?? ""}\n${doc.locales?.[locale] ?? ""}`);
}
export function getValidationKeywordLocaleTerms(key, locale) {
    const doc = lookupValidationKeywordDoc(key);
    const normalizedLocale = normalizeCharacterLanguage(locale);
    return splitKeywordDoc(doc.locales?.[normalizedLocale] ?? "");
}
//# sourceMappingURL=keyword-matching.js.map