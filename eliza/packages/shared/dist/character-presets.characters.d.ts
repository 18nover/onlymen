/**
 * Static data table of built-in character definitions (catchphrases, hints, post
 * examples) plus per-language variants. Consumed by character-presets.ts to build
 * the exported `StylePreset`s; this is the ~49KB payload kept off hot import paths.
 */
import type { CharacterLanguage, StylePreset } from "./contracts/first-run-options.js";
export type CharacterVariant = {
    catchphrase: string;
    hint: string;
    postExamples: string[];
};
export type CharacterDefinition = {
    id: StylePreset["id"];
    name: StylePreset["name"];
    avatarIndex: StylePreset["avatarIndex"];
    voicePresetId: StylePreset["voicePresetId"];
    greetingAnimation: StylePreset["greetingAnimation"];
    bio: StylePreset["bio"];
    system: string;
    adjectives: StylePreset["adjectives"];
    style: StylePreset["style"];
    topics: StylePreset["topics"];
    messageExamples: StylePreset["messageExamples"];
    variants: Record<CharacterLanguage, CharacterVariant>;
};
export declare const CHARACTER_DEFINITIONS: CharacterDefinition[];
//# sourceMappingURL=character-presets.characters.d.ts.map