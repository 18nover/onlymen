/**
 * Accessors for the `window`-scoped elizaOS globals (`__ELIZAOS_API_BASE__`, API
 * token) that the injected renderer environment sets. Resolves the API base/token
 * from the window or the boot-config store, returning null when off-browser.
 */
import { getBootConfig, setBootConfig } from "../config/boot-config-store.js";
function getElizaWindow() {
    return typeof window === "undefined" ? null : window;
}
function readTrimmedString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
// The boot config is the single source of truth for the API base (see
// boot-config-store.ts). Reading it here — rather than a bespoke API-base window
// global — gives every transport and web shim one accessor with one precedence
// rule. The agent static-file server and the Electrobun renderer seed the
// boot-config `apiBase` into the HTML before any app JS runs.
export function getElizaApiBase() {
    return readTrimmedString(getBootConfig().apiBase);
}
export function getElizaApiToken() {
    return readTrimmedString(getBootConfig().apiToken);
}
export function setElizaApiBase(value) {
    const apiBase = readTrimmedString(value);
    setBootConfig({ ...getBootConfig(), apiBase });
    const elizaWindow = getElizaWindow();
    if (elizaWindow) {
        if (apiBase) {
            elizaWindow.__ELIZAOS_API_BASE__ = apiBase;
        }
        else {
            Reflect.deleteProperty(elizaWindow, "__ELIZAOS_API_BASE__");
        }
    }
}
export function clearElizaApiBase() {
    const { apiBase: _apiBase, ...config } = getBootConfig();
    setBootConfig(config);
    const elizaWindow = getElizaWindow();
    if (elizaWindow) {
        Reflect.deleteProperty(elizaWindow, "__ELIZAOS_API_BASE__");
    }
}
export function setElizaApiToken(value) {
    setBootConfig({ ...getBootConfig(), apiToken: readTrimmedString(value) });
}
export function clearElizaApiToken() {
    const { apiToken: _apiToken, ...config } = getBootConfig();
    setBootConfig(config);
}
//# sourceMappingURL=eliza-globals.js.map