/**
 * Word-error-rate scoring — the single source of truth (#8785).
 *
 * Both the headless metric library (plugin-local-inference `e2e-harness.ts`) and
 * the headful self-test (ui `voice-selftest-harness.ts`) need WER; this used to
 * be implemented twice with subtly different normalization. It lives in
 * `@elizaos/shared` (which both already depend on) so there is exactly one
 * definition. Pure + browser-safe (no Node deps), so it ships in the UI bundle
 * via the `@elizaos/shared/voice-wer` subpath without pulling the whole barrel.
 */
/** Lowercase, strip punctuation (keep letters/numbers/apostrophes), collapse WS. */
export declare function normalizeWerText(text: string): string;
/**
 * Levenshtein word-error-rate of `hypothesis` against `reference`
 * (substitutions + insertions + deletions, divided by reference word count).
 * An empty reference scores 0 against an empty hypothesis, else 1.
 */
export declare function wordErrorRate(reference: string, hypothesis: string): number;
//# sourceMappingURL=voice-wer.d.ts.map