/** Normalizes a user-supplied owner name: trims and caps at `OWNER_NAME_MAX_LENGTH`, coercing non-strings to empty. */
export const OWNER_NAME_MAX_LENGTH = 60;
export function normalizeOwnerName(value) {
    if (typeof value !== "string") {
        return "";
    }
    return value.trim().slice(0, OWNER_NAME_MAX_LENGTH);
}
//# sourceMappingURL=owner-name.js.map