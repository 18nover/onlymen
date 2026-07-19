/**
 * Process-scoped registry mapping an app's `uiExtension.detailPanelId` to the
 * React component that renders its custom detail panel. Apps self-register on
 * startup via side-effect import; the app-details UI looks up components here.
 */
import type { RegistryAppInfo } from "../contracts/apps.js";
import type { AppDetailExtensionComponent } from "./detail-extension-types.js";
/**
 * Register a detail-panel extension component for a given panel id.
 * Call this once per app at module load time (e.g. from the app's UI entry).
 *
 * @example
 *   registerDetailExtension("example-detail-panel", ExampleDetailExtension);
 */
export declare function registerDetailExtension(detailPanelId: string, component: AppDetailExtensionComponent): void;
export declare function getAppDetailExtension(app: RegistryAppInfo): AppDetailExtensionComponent | null;
//# sourceMappingURL=detail-extension-registry.d.ts.map