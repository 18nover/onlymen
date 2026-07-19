/**
 * Owner-candidate inference for voice (#8785).
 *
 * "How does the agent know which speaker is the device OWNER?" Today the owner
 * entity must be enrolled explicitly (the first-run voice flow). But when no
 * owner is set, the agent should still be able to FORM a hypothesis from what it
 * hears — the person who speaks to it most, most confidently, and clearly more
 * than anyone else is the likely owner. This is the pure decision logic a
 * provider/evaluator runs when the owner is unknown: it accumulates recognized
 * voice turns and proposes a candidate only when the evidence is both sufficient
 * (enough confident observations) and unambiguous (a clear lead over the
 * runner-up). Otherwise it stays UNDECIDED — it never guesses an owner from one
 * stray turn, because a wrong owner is a security and personalization hazard.
 *
 * Pure (no I/O, no models); the runtime feeds it the diarized/recognized
 * observations and acts on a decided candidate (e.g. prompt to confirm, or set
 * the owner setting). The Voice Workbench exercises the SAME function so the
 * inference is benchmarked, not just shipped.
 */
/** One recognized voice turn: which enrolled/clustered speaker, how confident. */
export interface OwnerObservation {
    /** The entity/cluster the recognized voice resolved to (null = unrecognized). */
    entityId: string | null;
    /** Recognition confidence 0..1 (cosine-rescaled by the attribution pipeline). */
    confidence: number;
}
export interface OwnerInferenceOptions {
    /** Minimum qualifying observations before any candidate is proposed. */
    minObservations?: number;
    /** Confidence floor; observations below it don't count toward a candidate. */
    minConfidence?: number;
    /**
     * Minimum lead (in confidence-weighted score) the top speaker must hold over
     * the runner-up to be unambiguous. Prevents naming an owner in a two-equals
     * household.
     */
    minMargin?: number;
}
export interface OwnerInferenceResult {
    /** The proposed owner entity, or null when the evidence is insufficient. */
    ownerEntityId: string | null;
    /** Confidence-weighted share of the proposed owner (0..1), 0 when undecided. */
    share: number;
    /** Number of qualifying (confident, recognized) observations considered. */
    qualifyingObservations: number;
    /** Why the function decided / declined — surfaced for the provider's logs. */
    reason: string;
}
/**
 * Propose the most likely owner from recognized voice observations, or stay
 * undecided. A candidate is returned only when there are at least
 * `minObservations` confident, recognized turns AND the top speaker leads the
 * runner-up by at least `minMargin` (confidence-weighted). Ties and thin
 * evidence yield `ownerEntityId: null`.
 */
export declare function resolveOwnerCandidate(observations: ReadonlyArray<OwnerObservation>, options?: OwnerInferenceOptions): OwnerInferenceResult;
//# sourceMappingURL=owner-inference.d.ts.map