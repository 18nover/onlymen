/**
 * Built-in `ResponseHandlerFieldEvaluator`s — the canonical core fields the
 * Stage-1 response handler extracts from every turn.
 *
 * The model-facing schema is a flat list of typed fields. Each field is an
 * independent registered evaluator with:
 *
 *   - description: verbatim in the system prompt
 *   - schema:      JSON schema slice (parameter descriptions also visible
 *                  to the LLM in strict mode)
 *   - parse:       validate / normalize the LLM's value
 *   - handle:      optional pipeline step (most core fields don't have one
 *                  — the parsed value flows through to downstream consumers)
 *
 * Per the contract:
 *   - Flat: no `plan.*` wrapper
 *   - All required: empty array / empty string for N/A
 *   - `simple` is a context name, not a flag (contexts: ["simple"])
 *   - `STOP` remains a first-class terminal response for explicit stop requests
 *   - No `thought` / `requiresTool` / `contextSlices` / `parentActionHints`
 *     (derivable, redundant, or prompt theater)
 *   - New `intents` field for short verb phrases (routing-friendly)
 *
 * Register via `runtime.registerResponseHandlerFieldEvaluator(...)`. The
 * canonical set is exported as `BUILTIN_RESPONSE_HANDLER_FIELD_EVALUATORS`
 * for runtime init to consume.
 */
import type { ResponseHandlerFieldEvaluator } from "./response-handler-field-evaluator.js";
/**
 * Stage-1 envelope `emotion` enum value set — kept in lock-step with
 * `EXPRESSIVE_EMOTION_ENUM` exported from
 * `plugins/plugin-local-inference/src/services/voice/expressive-tags.ts`.
 *
 * It is **redeclared here** instead of imported because `@elizaos/core` may not
 * depend on `@elizaos/plugin-local-inference` (dependency direction is inward
 * per AGENTS.md "10 Clean Architecture Commandments" §1). A vitest in the
 * plugin verifies the two arrays stay byte-equal; if you change one, update
 * the other.
 */
declare const EXPRESSIVE_EMOTION_ENUM_VALUES: readonly ["none", "happy", "sad", "angry", "nervous", "calm", "excited", "whisper"];
type ExpressiveEmotionEnumValue = (typeof EXPRESSIVE_EMOTION_ENUM_VALUES)[number];
export declare const shouldRespondFieldEvaluator: ResponseHandlerFieldEvaluator<"RESPOND" | "IGNORE" | "STOP">;
export declare const contextsFieldEvaluator: ResponseHandlerFieldEvaluator<string[]>;
export declare const intentsFieldEvaluator: ResponseHandlerFieldEvaluator<string[]>;
export declare const candidateActionNamesFieldEvaluator: ResponseHandlerFieldEvaluator<string[]>;
export declare const replyTextFieldEvaluator: ResponseHandlerFieldEvaluator<string>;
export declare const factsFieldEvaluator: ResponseHandlerFieldEvaluator<string[]>;
interface RelationshipTriple {
    subject: string;
    predicate: string;
    object: string;
}
export declare const relationshipsFieldEvaluator: ResponseHandlerFieldEvaluator<RelationshipTriple[]>;
/** Max topic labels kept per turn. */
export declare const MAX_MESSAGE_TOPICS = 5;
/** Drop topic labels longer than this (a topic label, not a sentence). */
export declare const MAX_TOPIC_LABEL_LENGTH = 40;
/**
 * Normalize a raw list of topic candidates into 1-5 SHORT labels: lowercase,
 * trimmed, deduped, empties/overlong dropped, capped at {@link MAX_MESSAGE_TOPICS}.
 * Shared by the field evaluator and the message-handler parse path so both
 * apply identical rules.
 */
export declare function normalizeTopics(value: unknown): string[];
export declare const topicsFieldEvaluator: ResponseHandlerFieldEvaluator<string[]>;
export declare const addressedToFieldEvaluator: ResponseHandlerFieldEvaluator<string[]>;
export declare const emotionFieldEvaluator: ResponseHandlerFieldEvaluator<ExpressiveEmotionEnumValue>;
/**
 * Canonical core field evaluators. Registered automatically by the runtime
 * during init (before any plugin registration), so plugin-contributed
 * evaluators see them as siblings.
 */
export declare const BUILTIN_RESPONSE_HANDLER_FIELD_EVALUATORS: ReadonlyArray<ResponseHandlerFieldEvaluator>;
export {};
//# sourceMappingURL=builtin-field-evaluators.d.ts.map