/**
 * Lint helper for hand-authored `descriptionCompressed` values on actions and
 * providers. The runtime auto-fills `descriptionCompressed` via
 * `compressPromptDescription`, but plugin authors often hand-author the field
 * for higher-quality routing prompts. This helper enforces the same rules the
 * compressor would have applied:
 *
 * - Non-empty, trimmed.
 * - No filler phrases that the compressor strips (`PHRASE_REPLACEMENTS`).
 * - No long-form word forms that the compressor abbreviates
 *   (`WORD_REPLACEMENTS` — `messages`, `configuration`, etc.).
 * - Starts with an imperative verb, not a stative one (`Helps`, `Allows`,
 *   `It`, `This`, `Should`).
 *
 * There is intentionally NO maximum length: the full description text reaches
 * the model (see `compressPromptDescription`, which no longer truncates), so a
 * long-but-clear description with "use when / do NOT use when" guidance is fine.
 *
 * Intended for ad-hoc tooling/tests. The helper is intentionally pure: caller
 * decides exit-code semantics.
 */
export interface LintDescriptionCompressedResult {
    readonly ok: boolean;
    readonly violations: string[];
}
/**
 * Validate a hand-authored `descriptionCompressed` value. Returns
 * `{ ok: true, violations: [] }` on a clean input, or
 * `{ ok: false, violations: [...] }` listing every rule that fired.
 *
 * The function is pure and never throws: callers can treat it as a
 * yes/no boundary check.
 */
export declare function lintDescriptionCompressed(text: string): LintDescriptionCompressedResult;
//# sourceMappingURL=description-compressed-lint.d.ts.map