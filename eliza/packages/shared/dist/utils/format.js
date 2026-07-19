/**
 * Shared formatting helpers for Eliza app views.
 */
/**
 * Format an uptime duration in seconds into a compact human string.
 *
 * When `verbose` is true the output uses every non-zero unit (e.g. "2d 3h 15m").
 * Otherwise the two most-significant units are returned (e.g. "2d 3h").
 */
export function formatUptime(seconds, verbose) {
    if (seconds == null || seconds < 0)
        return "—";
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (verbose) {
        const parts = [];
        if (d > 0)
            parts.push(`${d}d`);
        if (h > 0)
            parts.push(`${h}h`);
        if (m > 0)
            parts.push(`${m}m`);
        if (parts.length === 0)
            parts.push(`${s}s`);
        return parts.join(" ");
    }
    if (d > 0)
        return `${d}d ${h}h`;
    if (h > 0)
        return `${h}h ${m}m`;
    if (m > 0)
        return `${m}m`;
    return `${s}s`;
}
/**
 * Format a byte count in human-readable units.
 */
export function formatByteSize(bytes, options = {}) {
    const { unknownLabel = "unknown", precision, kbPrecision = precision ?? 1, mbPrecision = precision ?? 1, gbPrecision = precision ?? 1, tbPrecision = precision ?? 1, } = options;
    if (bytes == null || !Number.isFinite(bytes) || bytes < 0) {
        return unknownLabel;
    }
    if (bytes >= 1024 ** 4) {
        return `${(bytes / 1024 ** 4).toFixed(tbPrecision)} TB`;
    }
    if (bytes >= 1024 ** 3) {
        return `${(bytes / 1024 ** 3).toFixed(gbPrecision)} GB`;
    }
    if (bytes >= 1024 ** 2) {
        return `${(bytes / 1024 ** 2).toFixed(mbPrecision)} MB`;
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(kbPrecision)} KB`;
    }
    return `${bytes} B`;
}
/**
 * Format a numeric amount as a USD currency string (`$1,234.56`).
 *
 * Accepts numbers or numeric strings; non-numeric input yields `fallback`.
 * Uses the en-US `Intl.NumberFormat` currency style (grouped, 2 fraction
 * digits) — the canonical money display for dashboard views.
 */
export function formatUsd(value, options = {}) {
    const { fallback = "—" } = options;
    const amount = typeof value === "string" ? Number.parseFloat(value) : value;
    if (amount == null || !Number.isFinite(amount))
        return fallback;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}
/**
 * Format timestamp / date for locale display (`toLocaleString`).
 */
export function formatDateTime(value, options = {}) {
    const { fallback = "—", locale } = options;
    if (value == null || value === "")
        return fallback;
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(parsed.getTime()))
        return fallback;
    return parsed.toLocaleString(locale);
}
/**
 * Format timestamp / date as locale time only (`toLocaleTimeString`).
 */
export function formatTime(value, options = {}) {
    const { fallback = "—", locale } = options;
    if (value == null || value === "")
        return fallback;
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(parsed.getTime()))
        return fallback;
    return parsed.toLocaleTimeString(locale);
}
/**
 * Format timestamp / date as locale date only (`toLocaleDateString`).
 */
export function formatShortDate(value, options = {}) {
    const { fallback = "—", locale } = options;
    if (value == null || value === "")
        return fallback;
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(parsed.getTime()))
        return fallback;
    return parsed.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
/**
 * Format an elapsed duration in milliseconds into a compact human string.
 */
export function formatDurationMs(ms, options = {}) {
    const { fallback = "—", t } = options;
    if (ms == null || !Number.isFinite(ms) || ms < 0)
        return fallback;
    // Round within each unit FIRST, and only keep the unit when the rounded
    // value stays below the next unit's threshold — otherwise values just
    // under a boundary render as nonsense like "60s" / "60m" / "24h"
    // (e.g. 59_500 ms must be "1m", not "60s").
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) {
        return t ? t("format.duration.seconds", { value: seconds }) : `${seconds}s`;
    }
    const minutes = Math.round(ms / 60_000);
    if (minutes < 60) {
        return t ? t("format.duration.minutes", { value: minutes }) : `${minutes}m`;
    }
    const hours = ms / 3_600_000;
    const hoursValue = hours === Math.floor(hours) ? hours : Number(hours.toFixed(1));
    if (hoursValue < 24) {
        return t
            ? t("format.duration.hours", { value: hoursValue })
            : `${hoursValue}h`;
    }
    const days = ms / 86_400_000;
    const value = days === Math.floor(days) ? days : Number(days.toFixed(1));
    return t ? t("format.duration.days", { value }) : `${value}d`;
}
//# sourceMappingURL=format.js.map