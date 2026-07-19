/**
 * Canonical UI language codes and BCP-47 → supported-language normalization.
 * Pure, React-free, and dependency-free so Node route handlers (content
 * negotiation in `@elizaos/app-core`) can normalize `Accept-Language` without
 * pulling the renderer's message dictionaries. `@elizaos/ui/i18n` re-exports
 * these and layers the message-dictionary lookup on top.
 */
export declare const UI_LANGUAGES: readonly ["en", "zh-CN", "ko", "es", "pt", "vi", "tl", "ja"];
export type UiLanguage = (typeof UI_LANGUAGES)[number];
export declare const DEFAULT_UI_LANGUAGE: UiLanguage;
/**
 * Map an arbitrary language tag (or non-string input) onto one of the
 * supported {@link UI_LANGUAGES}, falling back to {@link DEFAULT_UI_LANGUAGE}.
 */
export declare function normalizeLanguage(input: unknown): UiLanguage;
//# sourceMappingURL=language.d.ts.map