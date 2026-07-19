/**
 * Deterministic post-generation verbosity enforcement for the personality
 * capability. Approximates a token count via whitespace/punctuation splitting
 * and hard-caps `terse` responses at `MAX_TERSE_TOKENS`, truncating at the
 * nearest sentence boundary (`normal` and `verbose` pass through unchanged).
 * Runs after the model returns so the truncation is observable in the
 * trajectory.
 */
import { type VerbosityLevel } from "./types.js";
/**
 * Approximate token counter. Real tokenizers depend on the model — for a
 * hard cap on output verbosity, splitting on whitespace + punctuation is
 * close enough and avoids the cost of a real tokenizer in the hot path.
 *
 * 1 word ≈ 1.3 tokens for English, so MAX_TERSE_TOKENS=60 ≈ 46 words.
 * Returning `Math.ceil(words * 1.3)` keeps callers in the same units.
 */
export declare function approximateTokenCount(text: string): number;
/**
 * Result of a verbosity enforcement pass.
 */
export interface VerbosityEnforcementResult {
    text: string;
    truncated: boolean;
    originalTokens: number;
    finalTokens: number;
}
/**
 * Apply verbosity enforcement to a generated response. For `terse` we enforce
 * a hard cap; `normal` and `verbose` are pass-through.
 *
 * This is a deterministic post-generation transform — it runs after the model
 * returns, so the truncation is observable in the trajectory.
 */
export declare function enforceVerbosity(text: string, verbosity: VerbosityLevel | null | undefined): VerbosityEnforcementResult;
//# sourceMappingURL=verbosity-enforcer.d.ts.map