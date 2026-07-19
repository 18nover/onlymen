/**
 * Parses a duration string (`500ms`, `30s`, `5m`, `2h`, `1d`) to milliseconds,
 * with a configurable default unit for bare numbers. Throws on empty or
 * unparseable input. Used by config zod schemas and CLI flag parsing.
 */
export type DurationMsParseOptions = {
    defaultUnit?: "ms" | "s" | "m" | "h" | "d";
};
export declare function parseDurationMs(raw: string, opts?: DurationMsParseOptions): number;
//# sourceMappingURL=parse-duration.d.ts.map