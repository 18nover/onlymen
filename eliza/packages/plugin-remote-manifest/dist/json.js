/** Internal `isJsonObject` type guard shared by the manifest validator and store. */
export function isJsonObject(value) {
    return (value !== undefined &&
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value));
}
//# sourceMappingURL=json.js.map