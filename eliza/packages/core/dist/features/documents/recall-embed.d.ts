import type { IAgentRuntime } from "../../types/index.js";
/**
 * Embed the recall query, cached + deduped for the current turn ACROSS all
 * recall providers (documents, experience, relevant-conversations) sharing the
 * same runtime + `runId`.
 *
 * @param options.messageId - the turn's message id, supplied by pre-run callers
 *   (document augmentation) so the embed caches before a `runId` exists and the
 *   first in-run caller adopts it. Omit for the common in-run recall callers,
 *   which key off `runId`.
 * @returns the embedding vector, or `null` when the embed failed — in which case
 *   the caller MUST fail open to keyword/BM25 recall (or, where no keyword path
 *   exists, to empty recall context); never drop recall silently.
 */
export declare function embedRecallQuery(runtime: IAgentRuntime, queryText: string, options?: {
    messageId?: string;
}): Promise<number[] | null>;
/**
 * Declare `aliasText` equivalent to `sourceText` for this turn's recall: any
 * recall caller presenting `aliasText` resolves to `sourceText`'s vector from
 * the per-turn cache instead of issuing its own embed round-trip.
 *
 * The one producer is document augmentation: after it rewrites the turn's
 * message text into the contextual-documents envelope, the in-run recall
 * callers (TTFT prefetch, relevant-conversations, FACTS) all present the
 * envelope text. Without the alias each turn with a document match pays a
 * second serial embed for a query that is strictly WORSE (the injected
 * document snippets drown the user's request); with it, one embed of the clean
 * prompt serves the whole turn.
 *
 * The alias joins an in-flight source embed rather than waiting for it, so it
 * can be registered synchronously right after a fire-and-forget
 * `embedRecallQuery` warm of the source text. When the source was never
 * embedded (or its embed failed), this is a no-op and alias-text callers embed
 * directly — the fail-open contract is unchanged.
 */
export declare function aliasRecallQuery(runtime: IAgentRuntime, options: {
    messageId?: string;
    sourceText: string;
    aliasText: string;
}): void;
//# sourceMappingURL=recall-embed.d.ts.map