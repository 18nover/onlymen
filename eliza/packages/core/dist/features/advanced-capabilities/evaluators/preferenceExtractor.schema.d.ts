/**
 * Zod schemas and tolerant parser for the passive preference extractor
 * (preference-items.ts). One post-turn LLM call emits ops that route a user's
 * conversationally expressed preferences to the store that can act on them:
 * closed-enum reply-style traits go to the PersonalityStore slot (`set_trait` /
 * `retract_trait`), standing style rules with no trait mapping become custom
 * directives (`add_directive`), and domain/view/interaction-pattern preferences
 * land in the facts table as durable `preference` facts (`add_preference_fact`).
 *
 * `reply_gate` is deliberately unrepresentable here: silencing the agent must
 * never be inferred from conversation (#14675) — it stays PERSONALITY-action-
 * only. Global scope is equally absent; every op targets the speaking user.
 */
import z from "zod";
/** Traits inference may write. Closed set — `reply_gate` is excluded by design. */
export declare const PreferenceTraitEnum: z.ZodEnum<{
    tone: "tone";
    verbosity: "verbosity";
    formality: "formality";
}>;
declare const SetTraitOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"set_trait">;
    trait: z.ZodEnum<{
        tone: "tone";
        verbosity: "verbosity";
        formality: "formality";
    }>;
    value: z.ZodString;
    confidence: z.ZodNumber;
    evidence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const AddDirectiveOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"add_directive">;
    text: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    confidence: z.ZodNumber;
    evidence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const AddPreferenceFactOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"add_preference_fact">;
    claim: z.ZodString;
    keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    confidence: z.ZodOptional<z.ZodNumber>;
    evidence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const RetractTraitOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"retract_trait">;
    trait: z.ZodEnum<{
        tone: "tone";
        verbosity: "verbosity";
        formality: "formality";
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** Discriminated union of every op the preference extractor may emit. */
export declare const PreferenceOpSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"set_trait">;
    trait: z.ZodEnum<{
        tone: "tone";
        verbosity: "verbosity";
        formality: "formality";
    }>;
    value: z.ZodString;
    confidence: z.ZodNumber;
    evidence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add_directive">;
    text: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    confidence: z.ZodNumber;
    evidence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add_preference_fact">;
    claim: z.ZodString;
    keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    confidence: z.ZodOptional<z.ZodNumber>;
    evidence: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"retract_trait">;
    trait: z.ZodEnum<{
        tone: "tone";
        verbosity: "verbosity";
        formality: "formality";
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>], "op">;
export type SetTraitOp = z.infer<typeof SetTraitOpSchema>;
export type AddDirectiveOp = z.infer<typeof AddDirectiveOpSchema>;
export type AddPreferenceFactOp = z.infer<typeof AddPreferenceFactOpSchema>;
export type RetractTraitOp = z.infer<typeof RetractTraitOpSchema>;
export type PreferenceOp = z.infer<typeof PreferenceOpSchema>;
/** Top-level extractor envelope: one object with a single `ops` field. */
export interface PreferenceExtractorOutput {
    ops: PreferenceOp[];
}
/**
 * Parse the extractor envelope tolerantly, op-by-op — same contract as
 * `parseExtractorOutputTolerant` in factExtractor.schema.ts: one malformed op
 * must not discard the rest of the turn's valid ops, and drops are logged HERE
 * because the evaluator `parse` hook has no runtime/logger in scope.
 *
 * Trait/value pairing is validated here rather than in the union: the wire
 * schema advertises one flat `value` enum across all three traits (a per-trait
 * union is not expressible under the strict structured-output invariants), so
 * the model can emit e.g. `trait: "verbosity", value: "warm"` — that op drops
 * with a logged issue instead of silently writing a nonsense trait.
 *
 * Returns null only when the envelope itself is not `{ ops: array }`.
 */
export declare function parsePreferenceOutputTolerant(output: unknown): PreferenceExtractorOutput | null;
export {};
//# sourceMappingURL=preferenceExtractor.schema.d.ts.map