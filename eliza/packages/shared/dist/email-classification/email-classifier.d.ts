/**
 * Lightweight email classifier used during Gmail ingest. Two-stage:
 *
 *   1. Cheap rule pass over headers + sender + subject. Most marketing /
 *      transactional / billing mail is unambiguous and never needs an LLM.
 *   2. LLM fallback only when rules are silent or low-confidence. Model is
 *      configurable via the runtime setting `lifeops.emailClassifier.model`
 *      (defaults to TEXT_SMALL). If the runtime can't run a model, the rule
 *      result is returned unchanged.
 *
 * The classifier is intentionally fail-soft: any error is logged by the
 * caller and the message defaults to "personal" so ingest is never blocked.
 */
import type { IAgentRuntime } from "@elizaos/core";
export type EmailCategory = "promotional" | "bill" | "transactional" | "personal";
export interface EmailClassification {
    category: EmailCategory;
    confidence: number;
    signals: string[];
}
export interface EmailLikeMessage {
    /** Stable id used as a cache key. */
    id?: string | null;
    externalId?: string | null;
    subject?: string | null;
    from?: string | null;
    fromEmail?: string | null;
    snippet?: string | null;
    /** Raw header → value map. Optional but used to detect List-Unsubscribe. */
    headers?: Record<string, string | undefined> | null;
    /** Optional pre-parsed plaintext body. snippet is used when body is absent. */
    bodyText?: string | null;
    /** Raw Gmail labels — used as a cheap supplementary signal. */
    labels?: readonly string[] | null;
}
export interface ClassifyEmailOptions {
    /**
     * Optional set of known-personal addresses (e.g. real contacts). When the
     * sender matches we short-circuit straight to "personal".
     */
    knownContacts?: ReadonlySet<string> | null;
    /** Override the runtime setting for the LLM model. */
    modelOverride?: string | null;
    /** Override classifier-enabled flag (defaults to runtime setting / true). */
    enabledOverride?: boolean | null;
}
export declare function isEmailClassifierEnabled(runtime: IAgentRuntime): boolean;
export declare function getConfiguredEmailClassifierModel(runtime: IAgentRuntime): string;
/**
 * Apply the rule layer. Returns null when no rule matched at all so the
 * caller can decide whether to invoke the LLM.
 */
export declare function classifyEmailByRules(message: EmailLikeMessage, opts?: ClassifyEmailOptions): EmailClassification | null;
export declare function classifyEmail(runtime: IAgentRuntime, message: EmailLikeMessage, opts?: ClassifyEmailOptions): Promise<EmailClassification>;
/** Test hook: clear the in-memory cache. */
export declare function _resetEmailClassifierCache(): void;
//# sourceMappingURL=email-classifier.d.ts.map