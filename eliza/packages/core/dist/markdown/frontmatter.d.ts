/**
 * YAML frontmatter parsing for markdown files.
 *
 * Supports both YAML and simple line-based key: value formats.
 *
 * @module markdown/frontmatter
 */
/**
 * Parsed frontmatter as key-value pairs.
 * Values are always coerced to strings.
 */
export type ParsedFrontmatter = Record<string, string>;
/**
 * Parse frontmatter from markdown content.
 *
 * Extracts the YAML frontmatter block between --- delimiters.
 * Falls back to line-based parsing if YAML parsing fails.
 * Merges both results, preferring JSON-like values from line parsing.
 *
 * @param content - The markdown content
 * @returns Parsed frontmatter as key-value pairs
 */
export declare function parseFrontmatterBlock(content: string): ParsedFrontmatter;
//# sourceMappingURL=frontmatter.d.ts.map