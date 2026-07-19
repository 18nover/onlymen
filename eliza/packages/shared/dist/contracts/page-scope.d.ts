/**
 * The `PageScope` union and its value list — the canonical set of dashboard page
 * identifiers (browser, character, apps, connectors, settings, wallet, …) used to
 * scope permissions and navigation to a specific page.
 */
export type PageScope = "page-browser" | "page-character" | "page-automations" | "page-apps" | "page-connectors" | "page-phone" | "page-plugins" | "page-settings" | "page-wallet";
export declare const PAGE_SCOPES: readonly PageScope[];
export declare function isPageScope(value: unknown): value is PageScope;
//# sourceMappingURL=page-scope.d.ts.map