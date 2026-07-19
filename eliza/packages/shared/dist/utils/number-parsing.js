function sanitizeNumericText(value) {
    return value == null ? "" : value.trim();
}
function normalizeFallback(fallback) {
    return Number.isFinite(fallback) ? fallback : undefined;
}
export function parsePositiveInteger(value, fallback) {
    const raw = sanitizeNumericText(value);
    if (!raw)
        return normalizeFallback(fallback);
    if (!/^\d+$/.test(raw)) {
        return normalizeFallback(fallback);
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isSafeInteger(parsed) && parsed > 0
        ? parsed
        : normalizeFallback(fallback);
}
export function parsePositiveFloat(value, options) {
    const raw = sanitizeNumericText(value);
    if (!raw)
        return normalizeFallback(options?.fallback);
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return normalizeFallback(options?.fallback);
    }
    return options?.floor ? Math.floor(parsed) : parsed;
}
export function parseClampedFloat(value, options = {}) {
    const raw = sanitizeNumericText(value);
    if (!raw)
        return normalizeFallback(options.fallback);
    const parsed = Number(raw);
    if (!Number.isFinite(parsed))
        return normalizeFallback(options.fallback);
    const min = options.min ?? -Infinity;
    const max = options.max ?? Infinity;
    return Math.max(min, Math.min(max, parsed));
}
export function parseClampedInteger(value, options = {}) {
    const raw = sanitizeNumericText(value);
    if (!raw)
        return normalizeFallback(options.fallback);
    if (!/^[+-]?\d+$/.test(raw)) {
        return normalizeFallback(options.fallback);
    }
    const parsed = Number(raw);
    if (!Number.isSafeInteger(parsed))
        return normalizeFallback(options.fallback);
    const { min, max } = options;
    if (min !== undefined && parsed < min)
        return min;
    if (max !== undefined && parsed > max)
        return max;
    return parsed;
}
//# sourceMappingURL=number-parsing.js.map