/** Shared TypeScript type guards for narrowing `unknown` values at runtime boundaries (plain objects, records, …). */
export type UnknownRecord = Record<string, unknown>;
export declare function isPlainObject(value: unknown): value is UnknownRecord;
export declare function asRecord(value: unknown): UnknownRecord | null;
export declare function asRecordOrUndefined(value: unknown): UnknownRecord | undefined;
export declare function asObjectArray(value: unknown): UnknownRecord[];
export declare function asNonEmptyString(value: unknown): string | undefined;
//# sourceMappingURL=type-guards.d.ts.map