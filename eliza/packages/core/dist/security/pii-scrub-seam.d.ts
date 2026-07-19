/**
 * The `PII_SCRUB` model-type seam (`[pii] PII_SCRUB model-type seam`, #14809).
 *
 * The corpus scrub pipeline needs LLM judgment (context-aware classification +
 * rewrite) from two interchangeable providers — an on-device privacy-filter
 * GGUF (default, data never leaves the device) and Eliza Cloud (bulk/Cerebras).
 * Call-sites (LLM-pass, audio span labeling, verify) must not know which lane
 * serves them. That indirection is `ModelType.PII_SCRUB` + `runtime.useModel`;
 * the winning lane is chosen by registration priority exactly like
 * `TEXT_EMBEDDING` (`local-inference@0 < BYO@1 < Eliza Cloud@50`).
 *
 * This module owns the two things that make the seam *safe* rather than just
 * *typed*:
 *
 *   1. **Deterministic tier-0 escalation** ({@link scrubWithEscalation}).
 *      The free, dependency-free {@link detectPii} detectors always run first.
 *      Content whose sensitive spans are *fully* covered by tier-0 makes ZERO
 *      model calls — the model is the escalation tier for the residue tier-0
 *      cannot decide, never a replacement for the deterministic floor.
 *
 *   2. **Throw-never-fabricate / fail-closed** ({@link assertValidScrubResult}).
 *      A model handler that cannot decide MUST throw (#9324; the embeddings
 *      doctrine). A model error must NEVER surface as a "clean" verdict.
 *      {@link assertValidScrubResult} rejects a structurally-invalid result
 *      (missing replacement on a `pii` verdict, wrong ruleset version, a verdict
 *      for a span not present in the input) by throwing
 *      {@link PiiScrubFabricationError} — so a handler cannot fabricate a
 *      pass by returning a malformed "all clear". The escalation orchestrator
 *      lets that throw propagate: the caller marks the item failed-for-retry and
 *      the content stays quarantined from every share/export surface.
 *
 * What this module does NOT do: it is not a job runner (that is the async rails,
 * #14808), it does not own scrub prompts/semantics (the LLM-pass issue), and it
 * does not select or train the privacy GGUF. It is purely the escalation gate +
 * failure contract that sits between the deterministic detectors and the model.
 */
import type { LocalInferencePriority, PiiPseudonymAssignment, PiiScrubResult } from "../types/model.js";
import type { IAgentRuntime } from "../types/runtime.js";
/**
 * Thrown when a {@link PiiScrubResult} is structurally invalid — the seam's
 * fail-closed tripwire. A model handler returning a malformed "clean" result
 * (or a result that does not correspond to the requested text) is a fabrication
 * attempt from the pipeline's point of view; we throw rather than trust it, so
 * unscrubbed content can never fail-open onto an export surface.
 */
export declare class PiiScrubFabricationError extends Error {
    constructor(message: string);
}
/**
 * A single tier-0 decision: the deterministic detectors matched this span, so
 * it is PII and is redacted with a deterministic placeholder — no model call.
 */
export interface Tier0Span {
    /** The matched sensitive substring. */
    readonly span: string;
    /** Detector class (`credit-card`, `email`, `ssn`, …). */
    readonly kind: string;
    /** Start offset in the source text. */
    readonly start: number;
    /** End offset in the source text. */
    readonly end: number;
}
/** Outcome of {@link scrubWithEscalation}. */
export interface ScrubEscalationResult {
    /** Deterministic tier-0 spans (redacted without any model call). */
    readonly tier0: readonly Tier0Span[];
    /**
     * The model verdicts for the escalated residue, or `null` when the model was
     * never called (tier-0 fully covered the content OR there was no residue to
     * escalate). `null` is the *positive* "no escalation needed" signal — it is
     * never used to mean "assume clean" for un-inspected text.
     */
    readonly escalation: PiiScrubResult | null;
    /** True when the model seam was invoked (residue existed and was escalated). */
    readonly escalated: boolean;
}
/**
 * Candidate residue extractor. The deterministic detectors handle *structured*
 * PII (cards, SSNs, keys, addresses). Everything the pipeline still wants a
 * model to judge (names/orgs in ambiguous context, gray-area rewrites) is
 * surfaced by the caller as `candidateSpans`. Only candidates NOT already
 * covered by a tier-0 span are escalated — so a value the deterministic layer
 * already caught never costs a model call.
 */
export interface ScrubEscalationRequest {
    /** The text being scrubbed. */
    readonly text: string;
    /**
     * Model-judgment candidates the caller mined (e.g. from the entity
     * recognizer). Spans already covered by a tier-0 detection are dropped before
     * any model call. When empty, the model is never invoked.
     */
    readonly candidateSpans: readonly string[];
    /** Active ruleset version (threaded into the model call + result check). */
    readonly rulesetVersion: string;
    /** Optional retrieval context for the model. Never the secret vault. */
    readonly contextPack?: string;
    /** Per-chunk cluster→surrogate slice (never the whole map). */
    readonly pseudonymAssignments?: readonly PiiPseudonymAssignment[];
    /**
     * Local-lane scheduling priority. Defaults to `"background"` — the scrub is
     * deferred autonomous work and must never preempt an interactive turn.
     */
    readonly priority?: LocalInferencePriority;
    /** Per-request cancellation. */
    readonly signal?: AbortSignal;
    /** Detector kinds to skip in tier-0 (forwarded to {@link detectPii}). */
    readonly disabledKinds?: ReadonlySet<string>;
}
/**
 * Run the deterministic tier-0 detectors, then escalate ONLY the residue
 * candidates to the `PII_SCRUB` model. Fail-closed throughout:
 *
 * - No `PII_SCRUB` handler registered but there IS residue to judge → throws.
 *   (We must never silently pass un-inspected candidates as clean.)
 * - The model handler throws → the error propagates (item failed-for-retry).
 * - The model returns a structurally-invalid result → {@link assertValidScrubResult}
 *   throws {@link PiiScrubFabricationError}.
 *
 * The only path that returns without a model verdict is when there is genuinely
 * nothing to escalate (`escalation: null, escalated: false`) — an explicit,
 * auditable "tier-0 covered everything", not an assumption.
 */
export declare function scrubWithEscalation(runtime: IAgentRuntime, request: ScrubEscalationRequest): Promise<ScrubEscalationResult>;
/** Options controlling {@link assertValidScrubResult}'s structural checks. */
export interface ScrubResultAssertionOptions {
    /** The ruleset version the result MUST have been produced under. */
    readonly rulesetVersion: string;
    /** The source text; every verdict span must be a substring of it. */
    readonly text: string;
    /**
     * The candidate spans that were escalated. Every one MUST receive a verdict —
     * a result that silently omits a requested span is a fail-open and is
     * rejected. Omit to skip the coverage check (e.g. handler-level unit tests).
     */
    readonly requiredSpans?: readonly string[];
}
/**
 * Structural fail-closed validator for a {@link PiiScrubResult}. Throws
 * {@link PiiScrubFabricationError} unless the result is a well-formed, auditable
 * verdict set for the requested text:
 *
 * - `modelId` is a non-empty string (audit trail).
 * - `rulesetVersion` matches the version the call was made under (a stale-ruleset
 *   verdict must not be trusted as current).
 * - `verdicts` is an array; each verdict's `span` is a non-empty substring of
 *   the source `text` (a verdict for a span not in the text is a fabrication).
 * - every `pii` verdict carries a non-empty `replacement` (a `pii` verdict with
 *   no replacement would leave the real value in place — fail-open).
 * - `safe` verdicts carry NO `replacement` (a `safe` verdict is a positive
 *   "clean" judgment, not a redaction).
 * - when `requiredSpans` is given, every required span receives a verdict (the
 *   handler cannot silently drop a candidate and have it treated as clean).
 *
 * This is the tripwire that turns "the model returned something" into "the model
 * returned something we can *prove* is a real inspection result".
 */
export declare function assertValidScrubResult(result: unknown, options: ScrubResultAssertionOptions): asserts result is PiiScrubResult;
//# sourceMappingURL=pii-scrub-seam.d.ts.map