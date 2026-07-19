/**
 * Time-zone normalization helpers (runtime-level primitives).
 *
 * Pure `Intl`-backed helpers for resolving and validating IANA time zones.
 * No DB, no plugin imports. Consumed by the LifeOps normalize primitives and by
 * `@elizaos/plugin-personal-assistant` (which re-exports them from
 * `lifeops/defaults.ts` for historical import paths).
 */
export declare function resolveDefaultTimeZone(): string;
export declare function isValidTimeZone(timeZone: string): boolean;
export declare function normalizeTimeZone(timeZone?: string | null): string;
//# sourceMappingURL=time-zone.d.ts.map