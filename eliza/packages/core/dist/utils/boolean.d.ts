/**
 * Boolean parsing utilities.
 *
 * Provides flexible boolean parsing from string values
 * with configurable truthy/falsy representations.
 *
 * @module utils/boolean
 */
/**
 * Options for boolean parsing.
 */
export type BooleanParseOptions = {
    /** Values that should parse as true */
    truthy?: string[];
    /** Values that should parse as false */
    falsy?: string[];
};
/**
 * Parse a value as a boolean.
 *
 * Handles:
 * - Boolean values (passed through)
 * - String values ("true", "1", "yes", "on" => true; "false", "0", "no", "off" => false)
 * - Custom truthy/falsy values via options
 *
 * @param value - Value to parse
 * @param options - Parsing options
 * @returns Boolean value or undefined if not parseable
 *
 * @example
 * ```ts
 * parseBooleanValue(true) // => true
 * parseBooleanValue("yes") // => true
 * parseBooleanValue("1") // => true
 * parseBooleanValue("false") // => false
 * parseBooleanValue("no") // => false
 * parseBooleanValue("maybe") // => undefined
 * parseBooleanValue("enabled", { truthy: ["enabled"] }) // => true
 * ```
 */
export declare function parseBooleanValue(value: unknown, options?: BooleanParseOptions): boolean | undefined;
/**
 * Parse user/config text as a boolean, defaulting invalid values to false.
 *
 * WHY: A few older call sites intentionally treat unknown text as "off" rather
 * than propagating `undefined`. This preserves that behavior while still routing
 * through the shared boolean parser.
 */
export declare function parseBooleanText(value: string | boolean | undefined | null): boolean;
//# sourceMappingURL=boolean.d.ts.map