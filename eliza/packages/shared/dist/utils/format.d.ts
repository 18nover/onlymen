/**
 * Shared formatting helpers for Eliza app views.
 */
/**
 * Format an uptime duration in seconds into a compact human string.
 *
 * When `verbose` is true the output uses every non-zero unit (e.g. "2d 3h 15m").
 * Otherwise the two most-significant units are returned (e.g. "2d 3h").
 */
export declare function formatUptime(seconds?: number, verbose?: boolean): string;
type ByteSizeFormatterOptions = {
    /**
     * Fallback string for invalid or negative byte values.
     */
    unknownLabel?: string;
    /**
     * Uniform precision applied to all of KB / MB / GB / TB. Individual
     * per-unit overrides below take precedence when supplied.
     */
    precision?: number;
    /**
     * Precision for KB / MB / GB / TB values.
     */
    kbPrecision?: number;
    mbPrecision?: number;
    gbPrecision?: number;
    tbPrecision?: number;
};
type DateFormatOptions = {
    /**
     * Fallback string for empty/invalid dates.
     */
    fallback?: string;
    /**
     * Optional locale override.
     */
    locale?: string;
};
type DurationFormatOptions = {
    /**
     * Fallback string for non-positive/invalid durations.
     */
    fallback?: string;
    /**
     * Optional translation function for localized duration labels.
     * When provided, uses i18n keys like "format.duration.seconds" etc.
     */
    t?: (key: string, vars?: Record<string, string | number>) => string;
};
/**
 * Format a byte count in human-readable units.
 */
export declare function formatByteSize(bytes: number | null | undefined, options?: ByteSizeFormatterOptions): string;
type UsdFormatOptions = {
    /**
     * Fallback string for null / undefined / non-numeric input.
     */
    fallback?: string;
};
/**
 * Format a numeric amount as a USD currency string (`$1,234.56`).
 *
 * Accepts numbers or numeric strings; non-numeric input yields `fallback`.
 * Uses the en-US `Intl.NumberFormat` currency style (grouped, 2 fraction
 * digits) — the canonical money display for dashboard views.
 */
export declare function formatUsd(value: number | string | null | undefined, options?: UsdFormatOptions): string;
/**
 * Format timestamp / date for locale display (`toLocaleString`).
 */
export declare function formatDateTime(value: number | string | Date | null | undefined, options?: DateFormatOptions): string;
/**
 * Format timestamp / date as locale time only (`toLocaleTimeString`).
 */
export declare function formatTime(value: number | string | Date | null | undefined, options?: DateFormatOptions): string;
/**
 * Format timestamp / date as locale date only (`toLocaleDateString`).
 */
export declare function formatShortDate(value: number | string | Date | null | undefined, options?: DateFormatOptions): string;
/**
 * Format an elapsed duration in milliseconds into a compact human string.
 */
export declare function formatDurationMs(ms?: number | null, options?: DurationFormatOptions): string;
export {};
//# sourceMappingURL=format.d.ts.map