export function isPlainObject(value) {
    return (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === "[object Object]");
}
export function asRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }
    return value;
}
export function asRecordOrUndefined(value) {
    return asRecord(value) ?? undefined;
}
export function asObjectArray(value) {
    if (!Array.isArray(value))
        return [];
    return value.filter((item) => Boolean(item) && typeof item === "object" && !Array.isArray(item));
}
export function asNonEmptyString(value) {
    if (typeof value !== "string")
        return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
//# sourceMappingURL=type-guards.js.map