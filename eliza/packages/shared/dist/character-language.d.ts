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
import { type CharacterLanguage } from "./contracts/first-run-options.js";
export declare const DEFAULT_CHARACTER_LANGUAGE: CharacterLanguage;
export declare const LANGUAGE_REPLY_RULES: Record<CharacterLanguage, string>;
export declare function addLanguageRule(system: string, language: CharacterLanguage): string;
export declare function normalizeCharacterLanguage(input: unknown): CharacterLanguage;
//# sourceMappingURL=character-language.d.ts.map