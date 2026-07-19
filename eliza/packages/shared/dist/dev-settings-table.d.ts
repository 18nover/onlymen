/**
 * Plain-text tables for dev startup banners (orchestrator, Vite, API, Electrobun).
 * Narrow layout uses Unicode box drawing (no ANSI here). Use `dev-settings-banner-style`
 * when printing to a TTY for cyan emphasis.
 *
 * Why: Multi-process desktop dev prints four overlapping env snapshots; a framed
 * table makes effective ports and sources scannable in the terminal (developer
 * observability, not end-user product UI).
 */
export type DevSettingsRow = {
    setting: string;
    effective: string;
    source: string;
    change: string;
};
declare const DEFAULT_CAPS: {
    readonly setting: 44;
    readonly effective: 16;
    readonly source: 52;
    readonly change: 64;
};
export type DevSettingsTableOptions = {
    caps?: Partial<typeof DEFAULT_CAPS>;
    /** Multiline ~80 cols by default; set `wide` for legacy single-line table. */
    layout?: "wide" | "narrow";
    /** Max line length for `layout: "narrow"` (default 80). */
    narrowWidth?: number;
    /**
     * When `layout` is `narrow`, draw a Unicode frame (default true).
     * Set false for plain `=== title ===` blocks (e.g. tests or log capture).
     */
    narrowFrame?: boolean;
};
/** Word-wrap to at most `width` columns; breaks on spaces, then hard-breaks long tokens. */
export declare function wrapToWidth(text: string, width: number): string[];
/**
 * Multiline block per row; each output line ≤ outerWidth (default 80).
 * When `frame` is true, draws a light Unicode border; inner text wraps to fit.
 */
export declare function formatDevSettingsTableNarrow(title: string, rows: DevSettingsRow[], outerWidth?: number, frame?: boolean): string;
/**
 * Format a titled dev settings banner. Default is multiline (~80 cols); pass
 * `layout: "wide"` for the legacy four-column table with Setting/Effective/Source/Change header.
 */
export declare function formatDevSettingsTable(title: string, rows: DevSettingsRow[], options?: DevSettingsTableOptions): string;
export {};
//# sourceMappingURL=dev-settings-table.d.ts.map