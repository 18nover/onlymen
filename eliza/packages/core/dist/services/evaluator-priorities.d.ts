/**
 * Canonical evaluator + processor priorities.
 *
 * Lower runs first inside `EvaluatorService.run` after the unified LLM call
 * returns. The ordering reflects data dependencies between evaluators:
 *
 *  1. FORM        — apply form intents/extractions first; the rest of
 *                   the response shape may depend on the resulting session
 *                   state.
 *  2. REFLECTION  — facts → relationships → identity → success.
 *                   Facts are written first so identity / success can read
 *                   the freshly extracted state. Relationships reference
 *                   the entities those facts attach to.
 *  3. MEMORY      — summary then long-term. Summary is rolling text;
 *                   long-term may incorporate items the summary just merged.
 *  4. EXPERIENCE  — the agent's self-knowledge, distilled from facts and
 *                   relationships already extracted by reflection.
 *  5. SKILL       — proposal / refinement on the just-completed trajectory.
 *                   Runs last because skill files are the most expensive
 *                   side effect and the trajectory must be in stable state.
 *
 * Numbers are spaced by 10s so adjacent additions don't require a re-number.
 */
export declare const EvaluatorPriority: {
    readonly FORM: 50;
    readonly INBOUND_ATTACHMENT_IMAGE: 60;
    readonly INBOUND_LINK_EXTRACTION: 70;
    readonly REFLECTION_FACTS: 100;
    readonly REFLECTION_PREFERENCES: 105;
    readonly REFLECTION_RELATIONSHIPS: 110;
    readonly REFLECTION_IDENTITY: 120;
    readonly REFLECTION_SUCCESS: 130;
    readonly MEMORY_SUMMARY: 300;
    readonly MEMORY_LONG_TERM: 310;
    readonly EXPERIENCE: 320;
    readonly SKILL_PROPOSAL: 400;
    readonly SKILL_REFINEMENT: 410;
};
export type EvaluatorPriorityName = keyof typeof EvaluatorPriority;
//# sourceMappingURL=evaluator-priorities.d.ts.map