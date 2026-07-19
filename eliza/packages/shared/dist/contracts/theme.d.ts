/**
 * Theme definition types and utilities.
 *
 * A ThemeDefinition provides a complete set of design tokens (colors, fonts,
 * radii, shadows) for both light and dark modes. Themes are applied at
 * runtime by setting CSS custom properties on the document root, which
 * propagate through the existing Tailwind @theme inline mapping.
 */
/** All themeable CSS custom properties for a single color mode. */
export interface ThemeColorSet {
    bg: string;
    bgAccent: string;
    bgElevated: string;
    bgHover: string;
    bgMuted: string;
    card: string;
    cardForeground: string;
    surface: string;
    text: string;
    textStrong: string;
    chatText: string;
    muted: string;
    mutedStrong: string;
    border: string;
    borderStrong: string;
    borderHover: string;
    input: string;
    ring: string;
    accent: string;
    accentRgb: string;
    accentHover: string;
    accentMuted: string;
    accentSubtle: string;
    accentForeground: string;
    primary: string;
    primaryForeground: string;
    ok: string;
    okMuted: string;
    okSubtle: string;
    destructive: string;
    destructiveForeground: string;
    destructiveSubtle: string;
    danger: string;
    warn: string;
    warnMuted: string;
    warnSubtle: string;
    info: string;
    statusInfo: string;
    statusInfoBg: string;
    focus: string;
    focusRing: string;
    scrollbarTrack: string;
    scrollbarThumbStart: string;
    scrollbarThumbMid: string;
    scrollbarThumbEnd: string;
    scrollbarThumbHoverStart: string;
    scrollbarThumbHoverMid: string;
    scrollbarThumbHoverEnd: string;
    scrollbarThumbEdge: string;
    headerBarBg: string;
    headerBarFg: string;
    sectionBarBg: string;
    sectionBarFg: string;
    linkColor: string;
    linkHoverColor: string;
    shadowXs: string;
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    shadowXl: string;
    shadow2xl: string;
    shadowInset: string;
    radius: string;
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusXl: string;
    radius2xl: string;
    radius3xl: string;
    durationNormal: string;
}
export interface ThemeFonts {
    /** Body text font-family stack */
    body?: string;
    /** Display / heading font-family stack */
    display?: string;
    /** Chat message font-family stack */
    chat?: string;
    /** Monospace font-family stack */
    mono?: string;
    /**
     * URL to load external fonts (e.g. Google Fonts).
     * A <link rel="stylesheet"> is injected into <head> when the theme is applied.
     */
    fontImportUrl?: string;
}
export interface ThemeDefinition {
    /** Unique theme identifier (kebab-case, e.g. "neon-cyber") */
    id: string;
    /** Human-readable display name */
    name: string;
    /** Short description shown in the theme picker */
    description?: string;
    /** Preview — CSS gradient string or image path for the theme card */
    preview?: string;
    /** Font overrides */
    fonts?: ThemeFonts;
    /** Color tokens for light mode */
    light: Partial<ThemeColorSet>;
    /** Color tokens for dark mode */
    dark: Partial<ThemeColorSet>;
}
/**
 * Maps ThemeColorSet camelCase keys to their CSS custom property names.
 * Used by applyThemeToDocument() to set properties on the root element.
 */
export declare const THEME_CSS_VAR_MAP: Record<keyof ThemeColorSet, string>;
/** All CSS variable names that the theme system manages. */
export declare const THEME_CSS_VAR_NAMES: string[];
/** Font CSS variable names set by ThemeFonts. */
export declare const THEME_FONT_CSS_VARS: {
    readonly body: "--font-body";
    readonly display: "--font-display";
    readonly chat: "--font-chat";
    readonly mono: "--mono";
};
export interface ThemeValidationError {
    field: string;
    message: string;
}
export declare function validateThemeDefinition(data: unknown): ThemeValidationError[];
/** Data attribute used to identify the injected font <link> */
export declare const THEME_FONT_LINK_ID = "eliza-theme-font";
//# sourceMappingURL=theme.d.ts.map