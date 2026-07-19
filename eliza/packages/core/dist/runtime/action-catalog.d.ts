/**
 * Assembles the planner's action catalog: normalizes runtime actions into
 * sorted parent/child entries with deduped keyword and search text, resolves
 * declared sub-actions, applies locale-aware example swapping, and collects
 * structural warnings (duplicate, missing, or invalid sub-actions).
 */
import { type ActionSearchKeywordSource } from "../i18n/action-search-keywords.js";
import type { ActionExample } from "../types/components.js";
/**
 * Localized `[user, agent]` pair returned by a
 * {@link LocalizedActionExampleResolver}. The shape mirrors a single entry of
 * an action's `examples: ActionExample[][]` array — `[user, agent]`.
 */
export type LocalizedActionExamplePair = readonly [
    ActionExample,
    ActionExample
];
/**
 * Callback the catalog uses to swap English `ActionExample` pairs for a
 * localized version when a translation is registered (typically by a
 * `MultilingualPromptRegistry`). Returning `null` keeps the English original.
 *
 * The resolver is index-based so callers (the planner, app-lifeops) can map
 * the pair back to its source row in `action.examples` without re-parsing the
 * registry's composite key shape (`<actionName>.example.<index>`).
 */
export type LocalizedActionExampleResolver = (params: {
    actionName: string;
    exampleIndex: number;
}) => LocalizedActionExamplePair | null;
export type RuntimeActionLike = {
    name: string;
    description?: string;
    descriptionCompressed?: string;
    similes?: string[];
    tags?: string[];
    examples?: unknown;
    parameters?: unknown;
    contexts?: unknown;
    subActions?: Array<string | RuntimeActionLike>;
    cacheStable?: boolean;
    cacheScope?: string;
    routingHint?: string;
};
export type ActionCatalogWarningCode = "INVALID_ACTION" | "DUPLICATE_ACTION" | "DUPLICATE_SUB_ACTION" | "MISSING_SUB_ACTION";
export type ActionCatalogWarning = {
    code: ActionCatalogWarningCode;
    actionName?: string;
    parentName?: string;
    subActionName?: string;
    message: string;
};
export type ActionCatalogEntry = {
    name: string;
    normalizedName: string;
    description: string;
    descriptionCompressed?: string;
    similes: string[];
    tags: string[];
    examples?: unknown;
    parameters?: unknown;
    contexts?: unknown;
    cacheStable?: boolean;
    cacheScope?: string;
    /** One-line routing hint for the planner. See Action.routingHint. */
    routingHint?: string;
    keywordKeys: string[];
    keywordText: string;
    keywordSources: ActionSearchKeywordSource[];
    searchText: string;
    source: RuntimeActionLike;
};
export type ActionCatalogChild = ActionCatalogEntry & {
    kind: "child";
    parentName: string;
    parentNormalizedName: string;
};
export type ActionCatalogParent = ActionCatalogEntry & {
    kind: "parent";
    children: ActionCatalogChild[];
    childNames: string[];
    childNormalizedNames: string[];
};
export type ActionCatalog = {
    parents: ActionCatalogParent[];
    parentByName: Map<string, ActionCatalogParent>;
    children: ActionCatalogChild[];
    childByName: Map<string, ActionCatalogChild>;
    warnings: ActionCatalogWarning[];
};
export type BuildActionCatalogOptions = {
    includeReferencedChildrenAsParents?: boolean;
    /**
     * Optional locale-aware example swapper. When provided, every
     * `ActionExample[][]` row on a source action is run through this resolver
     * by `(actionName, exampleIndex)` and replaced with the returned localized
     * pair if one exists. Rows the resolver does not recognize fall through
     * to the English original. The resolver is invoked once per pair at
     * catalog-build time, never at planner-render time.
     */
    localizedExamples?: LocalizedActionExampleResolver;
};
export declare function normalizeActionName(name: string): string;
export declare function buildActionCatalog(actions: RuntimeActionLike[], options?: BuildActionCatalogOptions): ActionCatalog;
export declare function actionEntrySearchText(action: RuntimeActionLike, children?: ActionCatalogEntry[]): string;
export declare function actionEntryKeywordText(action: RuntimeActionLike, children?: ActionCatalogEntry[]): string;
//# sourceMappingURL=action-catalog.d.ts.map