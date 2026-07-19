/**
 * Zod schemas for the unified fact extractor.
 *
 * One LLM call per message produces a list of operations that mutate the
 * fact store: insert a new durable/current fact, strengthen or decay an
 * existing one, or queue a contradiction for review. The schema is
 * discriminated on the `op` field so a single `safeParse` validates every
 * variant in one pass.
 *
 * Reflection items own the prompt and processors that consume this parse shape.
 */
import z from "zod";
/**
 * Categories that durable facts can belong to. Closed set — the extractor
 * must pick exactly one. Mirrors {@link DurableFactCategory} in
 * `types/memory.ts`.
 */
export declare const DurableCategoryEnum: z.ZodEnum<{
    identity: "identity";
    health: "health";
    relationship: "relationship";
    life_event: "life_event";
    business_role: "business_role";
    preference: "preference";
    goal: "goal";
}>;
export type DurableCategory = z.infer<typeof DurableCategoryEnum>;
/**
 * Categories that current (time-bound) facts can belong to. Closed set.
 * Mirrors {@link CurrentFactCategory} in `types/memory.ts`.
 */
export declare const CurrentCategoryEnum: z.ZodEnum<{
    feeling: "feeling";
    physical_state: "physical_state";
    working_on: "working_on";
    going_through: "going_through";
    schedule_context: "schedule_context";
}>;
export type CurrentCategory = z.infer<typeof CurrentCategoryEnum>;
/**
 * Verification provenance for a newly extracted fact. Defaults to
 * `self_reported`; the model only emits `confirmed` when the message itself
 * cites external corroboration (a lab result, a calendar entry, etc.).
 */
export declare const VerificationStatusEnum: z.ZodEnum<{
    self_reported: "self_reported";
    confirmed: "confirmed";
    contradicted: "contradicted";
}>;
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>;
declare const AddDurableOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"add_durable">;
    claim: z.ZodString;
    category: z.ZodEnum<{
        identity: "identity";
        health: "health";
        relationship: "relationship";
        life_event: "life_event";
        business_role: "business_role";
        preference: "preference";
        goal: "goal";
    }>;
    structured_fields: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    verification_status: z.ZodOptional<z.ZodEnum<{
        self_reported: "self_reported";
        confirmed: "confirmed";
        contradicted: "contradicted";
    }>>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const AddCurrentOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"add_current">;
    claim: z.ZodString;
    category: z.ZodEnum<{
        feeling: "feeling";
        physical_state: "physical_state";
        working_on: "working_on";
        going_through: "going_through";
        schedule_context: "schedule_context";
    }>;
    structured_fields: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    valid_at: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const StrengthenOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"strengthen">;
    factId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const DecayOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"decay">;
    factId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ContradictOpSchema: z.ZodObject<{
    op: z.ZodLiteral<"contradict">;
    factId: z.ZodString;
    proposedText: z.ZodOptional<z.ZodString>;
    reason: z.ZodString;
}, z.core.$strip>;
/**
 * Discriminated union of every op the extractor may emit, keyed on `op`.
 */
export declare const OpSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    op: z.ZodLiteral<"add_durable">;
    claim: z.ZodString;
    category: z.ZodEnum<{
        identity: "identity";
        health: "health";
        relationship: "relationship";
        life_event: "life_event";
        business_role: "business_role";
        preference: "preference";
        goal: "goal";
    }>;
    structured_fields: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    verification_status: z.ZodOptional<z.ZodEnum<{
        self_reported: "self_reported";
        confirmed: "confirmed";
        contradicted: "contradicted";
    }>>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"add_current">;
    claim: z.ZodString;
    category: z.ZodEnum<{
        feeling: "feeling";
        physical_state: "physical_state";
        working_on: "working_on";
        going_through: "going_through";
        schedule_context: "schedule_context";
    }>;
    structured_fields: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
    valid_at: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"strengthen">;
    factId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"decay">;
    factId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    op: z.ZodLiteral<"contradict">;
    factId: z.ZodString;
    proposedText: z.ZodOptional<z.ZodString>;
    reason: z.ZodString;
}, z.core.$strip>], "op">;
export type AddDurableOp = z.infer<typeof AddDurableOpSchema>;
export type AddCurrentOp = z.infer<typeof AddCurrentOpSchema>;
export type StrengthenOp = z.infer<typeof StrengthenOpSchema>;
export type DecayOp = z.infer<typeof DecayOpSchema>;
export type ContradictOp = z.infer<typeof ContradictOpSchema>;
export type ExtractorOp = z.infer<typeof OpSchema>;
/**
 * Top-level shape the extractor LLM must return: one structured object with
 * a single `ops` field.
 */
export declare const ExtractorOutputSchema: z.ZodObject<{
    ops: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        op: z.ZodLiteral<"add_durable">;
        claim: z.ZodString;
        category: z.ZodEnum<{
            identity: "identity";
            health: "health";
            relationship: "relationship";
            life_event: "life_event";
            business_role: "business_role";
            preference: "preference";
            goal: "goal";
        }>;
        structured_fields: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
        verification_status: z.ZodOptional<z.ZodEnum<{
            self_reported: "self_reported";
            confirmed: "confirmed";
            contradicted: "contradicted";
        }>>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"add_current">;
        claim: z.ZodString;
        category: z.ZodEnum<{
            feeling: "feeling";
            physical_state: "physical_state";
            working_on: "working_on";
            going_through: "going_through";
            schedule_context: "schedule_context";
        }>;
        structured_fields: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        keywords: z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodString>, z.ZodTransform<string[], string[]>>>;
        valid_at: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"strengthen">;
        factId: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"decay">;
        factId: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        op: z.ZodLiteral<"contradict">;
        factId: z.ZodString;
        proposedText: z.ZodOptional<z.ZodString>;
        reason: z.ZodString;
    }, z.core.$strip>], "op">>;
}, z.core.$strip>;
export type ExtractorOutput = z.infer<typeof ExtractorOutputSchema>;
/**
 * Parse the extractor envelope tolerantly, op-by-op.
 *
 * `ExtractorOutputSchema` parses the whole `ops` array atomically, so a single
 * malformed op (the model occasionally hallucinates one bad entry among good
 * ones — a missing `factId` on a strengthen, a `contradict` with no `reason`)
 * fails `safeParse` and silently discards EVERY fact op for the turn. That is
 * real, launch-critical memory loss.
 *
 * This validates the envelope leniently (`{ ops: [...] }`), then validates each
 * op independently, keeping only the ones that pass. Drops are logged HERE
 * (one aggregate warn with per-op issues) — the only production caller is an
 * evaluator `parse` hook (`parse?(output): TOutput | null`,
 * `types/evaluator.ts`) which has no runtime/logger in scope, so a returned
 * drop count could never be reported and per-op loss stayed silent in prod.
 * Returns null only when the envelope itself is not `{ ops: array }` (a
 * genuinely malformed section).
 */
export declare function parseExtractorOutputTolerant(output: unknown): ExtractorOutput | null;
export {};
//# sourceMappingURL=factExtractor.schema.d.ts.map