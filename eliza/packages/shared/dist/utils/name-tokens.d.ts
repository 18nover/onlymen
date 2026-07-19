/**
 * Character-name token helpers for the character / config surfaces.
 *
 * `replaceNameTokens` (`{{name}}` / `{{agentName}}`) and
 * `replaceIndexedNameTokens` (`{{name1}}` / `{{user1}}` example slots) are owned
 * by `@elizaos/core` — both whitespace-tolerant and `$`-sequence safe — and
 * re-exported here so existing `@elizaos/shared` / `@elizaos/ui` consumers keep
 * their import path (core exports them from both the node and browser barrels,
 * so this re-export resolves in browser bundles too). `tokenizeNameOccurrences`
 * below is the inverse: it rewrites literal name occurrences back into
 * `{{name}}` tokens so a later rename keeps propagating.
 */
export { replaceIndexedNameTokens, replaceNameTokens } from "@elizaos/core";
/**
 * Reverse of `replaceNameTokens` — rewrite whole-word occurrences of the
 * given literal character name back into `{{name}}` tokens so that a
 * later rename continues to propagate through every text field.
 *
 * Rules:
 * - Case-sensitive, whole-word match (word boundaries on both sides).
 * - Names under 2 characters are ignored; the tokenizer is not
 *   meaningful for single-letter names and risks destroying prose.
 * - Idempotent: re-running on already-tokenized text leaves it unchanged because
 *   `{{name}}` does not contain the literal name.
 * - Non-destructive on empty input or empty name.
 *
 * @param text The text to scan.
 * @param name The literal character name to tokenize (e.g. "Momo").
 * @returns The text with whole-word occurrences replaced by `{{name}}`.
 */
export declare function tokenizeNameOccurrences(text: string, name: string): string;
//# sourceMappingURL=name-tokens.d.ts.map