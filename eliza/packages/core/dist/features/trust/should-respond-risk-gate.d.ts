/**
 * Role-keyed should-respond injection / social-engineering gate (issue #9949).
 *
 * Three uncoordinated detectors existed before this: an opt-in `securityEvaluator`,
 * the advisory-only `SecurityModule`, and a write-only `promptInjectionSuspected`
 * flag. None of them gated the should-respond decision or escalated to the model.
 *
 * This module is the decision authority:
 *  1. `extractRiskFactors` — a pure, synchronous, no-I/O scorer that reuses the
 *     shared `injection-primitives` (no fourth pattern set).
 *  2. `registerCoreShouldRespondRiskHook` — runs the extractor in the
 *     `parallel_with_should_respond` phase (concurrent with the should-respond
 *     model call, zero added latency) and stamps `RiskFactors` onto the message.
 *  3. `runShouldRespondInjectionGate` — keys the score to the resolved sender
 *     role (OWNER/ADMIN bypass) and, for a borderline USER/GUEST, escalates to a
 *     single `TEXT_LARGE` adjudication. Called only when `shouldRespond === true`.
 */
import type { Memory } from "../../types/memory.js";
import type { IAgentRuntime } from "../../types/runtime.js";
/** Structured, machine-readable risk signal extracted from a single message. */
export interface RiskFactors {
    /** Zero-width / bidi / other invisible control characters. */
    hiddenCharCount: number;
    /** Non-ASCII characters (homoglyph / multilingual signal). */
    nonAsciiCount: number;
    /** Injection keywords found only after collapsing separators (`i g n o r e`). */
    letterSplitHits: number;
    /** Injection keywords found reversed (`snoitcurtsni`). */
    wordReversalHits: number;
    /** Direct `INJECTION_PATTERNS` matches against the raw text. */
    structuralInjectionHits: number;
    /** Social-engineering pressure classes present (urgency / authority / intimidation). */
    socialEngineeringClasses: string[];
    /** Aggregate risk in [0, 1]. */
    score: number;
}
/** Default score at/above which an untrusted sender's message is escalated. */
export declare const DEFAULT_RISK_VERIFY_THRESHOLD = 0.5;
/**
 * Pure, synchronous risk extractor. No I/O, no model calls. Safe to run inline
 * in the hot path.
 */
export declare function extractRiskFactors(text: string): RiskFactors;
export interface RoleKeyedRiskDecision {
    shouldVerify: boolean;
    reason: string;
    score: number;
}
/**
 * Pure role-keyed decision: trusted roles bypass; untrusted roles are escalated
 * when the score crosses the threshold.
 */
export declare function evaluateRoleKeyedRisk(role: string | undefined, factors: RiskFactors, threshold?: number): RoleKeyedRiskDecision;
/**
 * Register the deterministic extractor on the `parallel_with_should_respond`
 * phase so it runs concurrently with the should-respond model call and stamps
 * the message with `RiskFactors`. Mirrors `registerCoreIncomingMessageSecurityHook`.
 */
export declare function registerCoreShouldRespondRiskHook(runtime: IAgentRuntime): void;
export type InjectionVerdict = "allow" | "block";
/**
 * One `TEXT_LARGE` adjudication for a borderline message. Fails closed (block)
 * on error or an unparseable response — this only runs for an already-flagged
 * message from an untrusted sender, so a false block merely ignores one message.
 */
export declare function adjudicateInjectionRisk(runtime: IAgentRuntime, text: string): Promise<{
    verdict: InjectionVerdict;
    reason: string;
}>;
export interface InjectionGateResult {
    /** True when the response should be suppressed (the message is an attack). */
    blocked: boolean;
    /** True when the message was escalated to the model adjudicator. */
    verified: boolean;
    reason: string;
    score: number;
}
/**
 * The full gate, called from the message service only when `shouldRespond === true`.
 * Reads the deterministic `RiskFactors` (or computes them if the hook did not run),
 * keys them to the resolved sender role, and escalates a borderline USER/GUEST to
 * a single `TEXT_LARGE` adjudication.
 */
export declare function runShouldRespondInjectionGate(args: {
    runtime: IAgentRuntime;
    message: Memory;
    resolveSenderRole: () => Promise<string | undefined> | string | undefined;
    threshold?: number;
}): Promise<InjectionGateResult>;
//# sourceMappingURL=should-respond-risk-gate.d.ts.map