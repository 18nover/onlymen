/**
 * Tolerant parsers for raw model output: unwrap code fences, extract every
 * top-level `{...}` object from noisy text, repair invalid JSON string escapes,
 * and strip leaked tool-call markup / punctuation-only replies. Used wherever
 * the runtime must salvage structure from a weak model's not-quite-valid JSON.
 */
export declare function parseJsonObject<T extends object>(raw: string): T | null;
/**
 * Extract every top-level `{...}` JSON object substring from `raw`, in order.
 * Brace-depth scan that respects string literals and escapes, so braces inside
 * string values never confuse the boundaries. Weak models routinely narrate
 * multiple intents as concatenated objects (`{...}\n{...}`) rather than one
 * array — callers that took only the first silently dropped the rest.
 */
export declare function extractJsonObjects(raw: string): string[];
export declare function repairJsonStringEscapes(raw: string): string;
export declare function stringifyForModel(value: unknown): string;
/**
 * Clean a model-produced reply field before it reaches the user. Removes
 * structural junk that weak models emit as plain text but which is never
 * user-facing content:
 *   1. the model's NATIVE tool-call serialization emitted as text instead of a
 *      structured call, e.g.
 *      `<tool_call>WEB_FETCH<arg_key>url</arg_key><arg_value>...</arg_value></tool_call>`
 *      (observed on cerebras gpt-oss / zai; eliza routes real tool calls
 *      structurally, and this markup never appears in eliza's own format), and
 *   2. a reply that is ONLY JSON punctuation (braces/brackets/quotes/commas).
 *
 * Structural artifact removal - the sibling of the existing `[tool output:]`
 * markup stripping - not semantic-content matching. The truncated-open branch is
 * deliberately conservative: it only swallows to end-of-string when the markup is
 * unmistakably a serialized call (an uppercase ACTION token or the native
 * `<arg_key>`/`<arg_value>` markup follows), so a reply that merely *mentions*
 * `<tool_call>` in prose is preserved.
 */
export declare function stripJsonStructuralJunkReply(value: string): string;
//# sourceMappingURL=json-output.d.ts.map