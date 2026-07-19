/**
 * Data-free character-language helpers.
 *
 * Split out of `character-presets.ts` so that importing `normalizeCharacterLanguage`
 * (used by the i18n keyword matcher, which is on the eager renderer path via the
 * `@elizaos/shared` barrel) does NOT execute `character-presets.ts`'s module-level
 * `CHARACTER_DEFINITIONS.map(...)` builders — which would otherwise pull ~49KB of
 * character preset data (catchphrases/postExamples/bios) into the eager bundle.
 * This module depends only on the language enum + a tiny rules table.
 */
import { CHARACTER_LANGUAGES, } from "./contracts/first-run-options.js";
export const DEFAULT_CHARACTER_LANGUAGE = "en";
export const LANGUAGE_REPLY_RULES = {
    en: "Default to natural English unless the user clearly switches languages.",
    "zh-CN": "Default to natural simplified Chinese unless the user clearly switches languages.",
    ko: "Default to natural Korean unless the user clearly switches languages.",
    es: "Default to natural Spanish unless the user clearly switches languages.",
    pt: "Default to natural Brazilian Portuguese unless the user clearly switches languages.",
    vi: "Default to natural Vietnamese unless the user clearly switches languages.",
    tl: "Default to natural Tagalog unless the user clearly switches languages.",
};
export function addLanguageRule(system, language) {
    const rule = LANGUAGE_REPLY_RULES[language];
    return `${system} ${rule}`;
}
export function normalizeCharacterLanguage(input) {
    if (typeof input !== "string") {
        return DEFAULT_CHARACTER_LANGUAGE;
    }
    const trimmed = input.trim();
    if (!trimmed) {
        return DEFAULT_CHARACTER_LANGUAGE;
    }
    if (CHARACTER_LANGUAGES.includes(trimmed)) {
        return trimmed;
    }
    const lower = trimmed.toLowerCase();
    if (lower === "zh" || lower === "zh-cn" || lower.startsWith("zh-hans")) {
        return "zh-CN";
    }
    if (lower.startsWith("ko")) {
        return "ko";
    }
    if (lower.startsWith("es")) {
        return "es";
    }
    if (lower.startsWith("pt")) {
        return "pt";
    }
    if (lower.startsWith("vi")) {
        return "vi";
    }
    if (lower.startsWith("tl") || lower.startsWith("fil")) {
        return "tl";
    }
    return DEFAULT_CHARACTER_LANGUAGE;
}
//# sourceMappingURL=character-language.js.map