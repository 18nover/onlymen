/**
 * Assembles the built-in character `StylePreset`s from character definitions,
 * shared style rules, and per-language reply rules. Kept separate from
 * character-language.ts because its module-level builders eagerly materialize
 * ~49KB of preset data; import from there for language helpers on hot paths.
 */
import { normalizeCharacterLanguage } from "./character-language.js";
import { SHARED_STYLE_RULES } from "./character-presets.shared.js";
import type { StylePreset } from "./contracts/first-run-options.js";
export { normalizeCharacterLanguage, SHARED_STYLE_RULES };
export declare function setDefaultAgentName(name: string | null | undefined): void;
export declare function getDefaultAgentName(): string;
export declare function getStylePresets(language?: unknown): StylePreset[];
export declare const STYLE_PRESETS: StylePreset[];
export declare function getDefaultStylePreset(language?: unknown): StylePreset;
export declare function resolveStylePresetById(id: string | null | undefined, language?: unknown): StylePreset | undefined;
export declare function resolveStylePresetByName(name: string | null | undefined, language?: unknown): StylePreset | undefined;
export declare function resolveStylePresetByAvatarIndex(avatarIndex: number | null | undefined, language?: unknown): StylePreset | undefined;
export declare const CHARACTER_PRESETS: {
    id: string;
    name: string;
    catchphrase: string;
    description: string;
    style: string;
}[];
export declare const CHARACTER_PRESET_META: Record<string, {
    id: string;
    name: string;
    avatarIndex: number;
    voicePresetId?: string;
    catchphrase: string;
}>;
export declare function getPresetNameMap(language?: unknown): Record<string, string>;
export declare function buildElizaCharacterCatalog(): {
    assets: Array<{
        id: number;
        slug: string;
        title: string;
        sourceName: string;
    }>;
    injectedCharacters: Array<{
        catchphrase: string;
        name: string;
        avatarAssetId: number;
        voicePresetId?: string;
    }>;
};
//# sourceMappingURL=character-presets.d.ts.map