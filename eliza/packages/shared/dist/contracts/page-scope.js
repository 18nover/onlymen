export const PAGE_SCOPES = [
    "page-browser",
    "page-character",
    "page-automations",
    "page-apps",
    "page-connectors",
    "page-phone",
    "page-plugins",
    "page-settings",
    "page-wallet",
];
const PAGE_SCOPE_SET = new Set(PAGE_SCOPES);
export function isPageScope(value) {
    return typeof value === "string" && PAGE_SCOPE_SET.has(value);
}
//# sourceMappingURL=page-scope.js.map