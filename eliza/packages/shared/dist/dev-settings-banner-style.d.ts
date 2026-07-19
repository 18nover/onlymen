/**
 * Optional ANSI styling for dev settings banners (orchestrator, Vite, API, Electrobun).
 * Plain tables live in `dev-settings-table.ts`; this only wraps box lines for terminals.
 * Figlet headings use a separate color; use `colorizeDevSettingsStartupBanner` when a
 * heading is prepended above the framed table.
 */
/** Add cyan emphasis to Unicode box lines; returns input unchanged when color is disabled. */
export declare function colorizeDevSettingsBanner(text: string): string;
/**
 * Colorize a block that may start with a figlet heading, then a framed table (and optional
 * plain footer after the box). Figlet lines are magenta; box lines stay cyan.
 */
export declare function colorizeDevSettingsStartupBanner(text: string): string;
//# sourceMappingURL=dev-settings-banner-style.d.ts.map