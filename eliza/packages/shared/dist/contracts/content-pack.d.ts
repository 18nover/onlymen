/**
 * Content Pack manifest and types.
 *
 * A content pack bundles visual assets (VRM, background, color scheme),
 * personality data, and optional stream overlay into a single installable unit.
 * Packs are loaded from the splash page before first-run setup begins.
 */
import type { ThemeDefinition } from "./theme.js";
export interface ContentPackManifest {
    /** Unique pack identifier (kebab-case, e.g. "cyberpunk-neon") */
    id: string;
    /** Human-readable display name */
    name: string;
    /** Semantic version */
    version: string;
    /** Optional author or creator name */
    author?: string;
    /** Short description shown in the pack browser */
    description?: string;
    /** Preview image filename (relative to pack root) */
    preview?: string;
    /** Asset declarations — all fields are optional */
    assets: ContentPackAssets;
}
export interface ContentPackAssets {
    /** VRM avatar model */
    vrm?: ContentPackVrmAsset;
    /** Background image filename (relative to pack root) */
    background?: string;
    /** Gaussian splat companion world scene filename */
    world?: string;
    /** Color scheme overrides (narrow — 6 color fields) */
    colorScheme?: ContentPackColorScheme;
    /**
     * Full theme definition (light + dark palettes, fonts, radii, etc.).
     * Takes precedence over colorScheme when present.
     */
    theme?: ThemeDefinition;
    /** Stream overlay directory (relative to pack root) */
    streamOverlay?: string;
    /** Personality definition (subset of StylePreset) */
    personality?: ContentPackPersonality;
}
export interface ContentPackVrmAsset {
    /** VRM file path (relative to pack root, typically .vrm or .vrm.gz) */
    file: string;
    /** Preview thumbnail path (relative to pack root) */
    preview?: string;
    /** Slug used for URL resolution */
    slug: string;
}
export interface ContentPackColorScheme {
    /** Primary accent color (hex) */
    accent?: string;
    /** Background color (hex) */
    bg?: string;
    /** Card/surface color (hex) */
    card?: string;
    /** Border color (hex) */
    border?: string;
    /** Text color (hex) */
    text?: string;
    /** Muted text color (hex) */
    textMuted?: string;
    /** Additional CSS custom properties (key without --prefix, value) */
    customProperties?: Record<string, string>;
}
export interface ContentPackPersonality {
    /** Character display name */
    name?: string;
    /** Bio lines */
    bio?: string[];
    /**
     * System prompt override.
     *
     * SECURITY: intentionally deferred — not wired in applyContentPack().
     * A remote pack controlling the agent's system prompt is significant
     * attack surface. Wiring this requires the same trust/review enforcement
     * as other prompt sources (character editor, config file).
     */
    system?: string;
    /** Catchphrase shown during first-run setup */
    catchphrase?: string;
    /** Adjectives describing the character */
    adjectives?: string[];
    /** Voice preset ID (e.g. "alice", "brian") */
    voicePresetId?: string;
    /** Greeting animation filename */
    greetingAnimation?: string;
}
export interface ResolvedContentPack {
    manifest: ContentPackManifest;
    /** Absolute URL or data URL for the VRM model (custom packs) */
    vrmUrl?: string;
    /** Bundled avatar index (1-8) — used instead of vrmUrl for built-in characters */
    avatarIndex?: number;
    /** Absolute URL for the VRM preview thumbnail */
    vrmPreviewUrl?: string;
    /** Absolute URL for the background image */
    backgroundUrl?: string;
    /** Absolute URL for the companion world scene */
    worldUrl?: string;
    /** Resolved color scheme (same shape, just validated) */
    colorScheme?: ContentPackColorScheme;
    /** Absolute path to stream overlay directory */
    streamOverlayPath?: string;
    /** Validated personality data */
    personality?: ContentPackPersonality;
    /** Where the pack was loaded from */
    source: ContentPackSource;
}
export type ContentPackSource = {
    kind: "bundled";
    id: string;
} | {
    kind: "file";
    path: string;
} | {
    kind: "url";
    url: string;
};
export interface ContentPackValidationError {
    field: string;
    message: string;
}
export declare function validateContentPackManifest(data: unknown): ContentPackValidationError[];
/** Manifest filename expected at the root of a content pack */
export declare const CONTENT_PACK_MANIFEST_FILENAME = "pack.json";
/** Maximum pack file size (100 MB) */
export declare const CONTENT_PACK_MAX_SIZE_BYTES: number;
//# sourceMappingURL=content-pack.d.ts.map