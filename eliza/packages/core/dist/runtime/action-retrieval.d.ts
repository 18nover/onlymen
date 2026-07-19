import type { ActionCatalog, ActionCatalogParent } from "./action-catalog.js";
export type RetrievalStageName = "exact" | "regex" | "keyword" | "bm25" | "embedding" | "contextMatch";
export type ActionEmbeddingTieBreaker = {
    enabled?: boolean;
    scoresByParentName?: Record<string, number>;
};
export type RetrieveActionsInput = {
    catalog: ActionCatalog;
    messageText?: string;
    recentConversationText?: string | readonly string[];
    candidateActions?: string[];
    parentActionHints?: string[];
    embedding?: ActionEmbeddingTieBreaker;
    limit?: number;
    /**
     * The messageHandler-selected contexts for this turn. Used as a *weight*
     * (boost actions whose declared `contexts` intersect this set) — never
     * as a filter. Filtering by context masked OWNER_TODOS/CALENDAR/etc. when the
     * messageHandler routed to "general"; weighting keeps them retrievable
     * while still preferring on-context candidates when scores are close.
     */
    selectedContexts?: readonly string[];
    /**
     * When `true`, capture each stage's full pre-fusion output and emit it
     * in `response.measurement`. Default `false` — no allocation cost in
     * production. Toggle via the `ELIZA_RETRIEVAL_MEASUREMENT=1` env var
     * on the caller side.
     */
    measurementMode?: boolean;
    /**
     * Optional per-tier overrides for retrieval. When provided, the call
     * uses these instead of the in-file constants. Wired by the benchmark
     * harness from `RETRIEVAL_DEFAULTS_BY_TIER`.
     */
    tierOverrides?: {
        topK?: number;
        stageWeights?: Partial<Record<RetrievalStageName, number>>;
    };
};
export type RetrievalStageEntry = {
    actionName: string;
    score: number;
    rank: number;
};
export type RetrievalPerStageScores = {
    exact: RetrievalStageEntry[];
    regex: RetrievalStageEntry[];
    keyword: RetrievalStageEntry[];
    bm25: RetrievalStageEntry[];
    embedding: RetrievalStageEntry[];
    contextMatch: RetrievalStageEntry[];
};
export type RetrievalMeasurement = {
    perStageScores: RetrievalPerStageScores;
    fusedTopK: Array<{
        actionName: string;
        rrfScore: number;
        rank: number;
    }>;
};
export type ActionRetrievalResult = {
    parent: ActionCatalogParent;
    name: string;
    normalizedName: string;
    score: number;
    rank: number;
    rrfScore: number;
    stageScores: Partial<Record<RetrievalStageName, number>>;
    matchedBy: RetrievalStageName[];
};
export type ActionRetrievalResponse = {
    results: ActionRetrievalResult[];
    warnings: ActionCatalog["warnings"];
    query: {
        text: string;
        tokens: string[];
        candidateActions: string[];
        parentActionHints: string[];
    };
    /**
     * Per-stage retrieval funnel. Populated only when
     * `input.measurementMode === true`. The benchmark harness consumes
     * this to compute stage-by-stage recall.
     */
    measurement?: RetrievalMeasurement;
};
export declare function retrieveActions(input: RetrieveActionsInput): ActionRetrievalResponse;
export declare function tokenizeActionSearchText(text: string): string[];
export declare function parentAliasesForCandidateAction(actionName: string): string[];
export declare function candidateNamespaceParentExists(parents: readonly Pick<ActionCatalogParent, "normalizedName">[], actionName: string): boolean;
//# sourceMappingURL=action-retrieval.d.ts.map