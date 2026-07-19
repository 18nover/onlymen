/**
 * Action search keywords for tool retrieval.
 *
 * The backing data is generated from packages/shared/src/i18n/keywords/*.json.
 * These helpers deliberately support retrieval/ranking only. They must not be
 * used as hard action availability checks.
 */
export type ActionSearchKeywordSource = {
    key: string;
    terms: string[];
};
export declare function actionNameToKeywordStem(actionName: string): string;
export declare function getActionSearchKeywordSources(input: {
    name: string;
    contexts?: unknown;
    includeAllLocales?: boolean;
}): ActionSearchKeywordSource[];
export declare function getActionSearchKeywordTerms(input: {
    name: string;
    contexts?: unknown;
    includeAllLocales?: boolean;
}): string[];
export declare function countActionSearchKeywordMatches(texts: readonly string[], terms: readonly string[]): number;
//# sourceMappingURL=action-search-keywords.d.ts.map