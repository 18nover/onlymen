/**
 * Registry of app detail extension components keyed by the app's
 * `uiExtension.detailPanelId` string.
 *
 * Apps register their detail extension on startup via side-effect import.
 */
const DETAIL_EXTENSION_COMPONENTS = new Map();
/**
 * Register a detail-panel extension component for a given panel id.
 * Call this once per app at module load time (e.g. from the app's UI entry).
 *
 * @example
 *   registerDetailExtension("example-detail-panel", ExampleDetailExtension);
 */
export function registerDetailExtension(detailPanelId, component) {
    DETAIL_EXTENSION_COMPONENTS.set(detailPanelId, component);
}
export function getAppDetailExtension(app) {
    const detailPanelId = app.uiExtension?.detailPanelId;
    if (!detailPanelId)
        return null;
    return DETAIL_EXTENSION_COMPONENTS.get(detailPanelId) ?? null;
}
//# sourceMappingURL=detail-extension-registry.js.map