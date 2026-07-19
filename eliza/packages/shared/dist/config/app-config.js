/**
 * White-label application configuration.
 *
 * This is the top-level config that a white-label app provides to customize
 * the entire elizaOS experience — branding, defaults, deployment, and cloud
 * integration. Apps provide this via `app.config.ts` in their project root.
 *
 * Usage:
 *   import { AppConfig } from "@elizaos/app-core";
 *
 *   export default {
 *     appName: "MyAgent",
 *     appId: "com.example.myagent",
 *     orgName: "example-org",
 *     // ...
 *   } satisfies AppConfig;
 */
import { EXTERNAL_URLS } from "../brand/index.js";
import { DEFAULT_BRANDING } from "./branding.js";
export const DEFAULT_APP_CONFIG = {
    appName: "Eliza",
    appId: "app.eliza",
    orgName: "elizaos",
    repoName: "eliza",
    cliName: "eliza",
    description: "Open-source AI agents for everyone",
    envPrefix: "ELIZA",
    namespace: "eliza",
    defaultApps: ["@elizaos/plugin-personal-assistant"],
    desktop: {
        bundleId: "app.eliza",
        urlScheme: "elizaos",
    },
    web: {
        shortName: "Eliza",
        themeColor: "#08080a",
        backgroundColor: "#0a0a0a",
        shareImagePath: "/brand/ogembeds/eliza_ogembed.svg",
    },
    branding: {
        appName: "Eliza",
        orgName: "elizaos",
        repoName: "eliza",
        docsUrl: EXTERNAL_URLS.docs,
        appUrl: EXTERNAL_URLS.app,
        bugReportUrl: "https://github.com/elizaOS/eliza/issues/new",
        hashtag: "#elizaOS",
        fileExtension: ".eliza-agent",
        packageScope: "elizaos",
    },
};
/**
 * Resolve a full BrandingConfig from an AppConfig.
 * Merges app-specific overrides with the framework defaults.
 */
export function resolveAppBranding(appConfig) {
    return {
        ...DEFAULT_BRANDING,
        appName: appConfig.appName,
        orgName: appConfig.orgName,
        repoName: appConfig.repoName,
        ...appConfig.branding,
    };
}
//# sourceMappingURL=app-config.js.map