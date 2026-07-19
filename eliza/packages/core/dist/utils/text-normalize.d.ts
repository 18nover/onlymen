/**
 * Text normalization helpers for prompt/context assembly.
 *
 * WHY: Several runtime paths need to turn mixed nested values into stable,
 * human-readable text blocks. Keeping this logic in one place makes prompt
 * construction more predictable and avoids each caller inventing slightly
 * different null/array/object coercion rules.
 */
/**
 * Flatten a mixed nested value into text fragments.
 *
 * - Arrays are recursively flattened
 * - Empty/nullish values are dropped
 * - Strings are trimmed
 * - Objects become `key: value` fragments
 * - Scalars are stringified
 */
export declare function flattenTextValues(value: unknown): string[];
/**
 * Convert a mixed nested value into a multi-line text block.
 */
export declare function toMultilineText(value: unknown): string;
//# sourceMappingURL=text-normalize.d.ts.map