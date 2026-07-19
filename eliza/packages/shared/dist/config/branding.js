/**
 * Per-distribution branding tokens and the first-run setup provider options.
 * White-label apps read these to name the product and inject custom model/API
 * providers into onboarding without being limited to the built-in provider union.
 */
import { EXTERNAL_URLS } from "../brand/index.js";
/** Default for i18n copy that uses `{{appName}}` (e.g. "Where should {{appName}} run?"). */
export const DEFAULT_APP_DISPLAY_NAME = "Eliza";
export const DEFAULT_BRANDING = {
    appName: DEFAULT_APP_DISPLAY_NAME,
    orgName: "elizaos",
    repoName: "eliza",
    docsUrl: EXTERNAL_URLS.docs,
    appUrl: EXTERNAL_URLS.app,
    bugReportUrl: "https://github.com/elizaos/eliza/issues/new?template=bug_report.yml",
    hashtag: "#ElizaAgent",
    fileExtension: ".eliza-agent",
    packageScope: "elizaos",
};
// React-bound BrandingContext + useBranding live in
// `./branding-react.tsx` so `@elizaos/shared` can be imported from
// node-side benchmark / agent code without dragging React into the
// runtime closure (the bench server fails to boot otherwise).
/** Pass to `t(key, appNameInterpolationVars(branding))` when the string contains `{{appName}}`. */
export function appNameInterpolationVars(branding) {
    const name = branding.appName.trim();
    return { appName: name || DEFAULT_APP_DISPLAY_NAME };
}
//# sourceMappingURL=branding.js.map