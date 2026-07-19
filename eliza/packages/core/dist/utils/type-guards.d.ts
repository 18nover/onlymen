/**
 * Runtime type guards that narrow `unknown` to record-shaped values.
 * `isPlainObject` accepts only object-literal / null-prototype objects,
 * rejecting built-ins (Date, Map, typed arrays, Error, Promise, …) and class
 * instances; `isObjectRecord` is the looser any-non-null-non-array-object check;
 * `asRecord` / `asRecordOrUndefined` narrow-or-nullify for safe property access.
 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function isObjectRecord(value: unknown): value is Record<string, unknown>;
export declare function asRecord(value: unknown): Record<string, unknown> | null;
export declare function asRecordOrUndefined(value: unknown): Record<string, unknown> | undefined;
//# sourceMappingURL=type-guards.d.ts.map