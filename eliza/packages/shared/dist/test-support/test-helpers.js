var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
/**
 * Test-support helpers for consumer suites: env-var sandboxing, plugin-module
 * shape checks, and workspace/optional-dependency import resolution (Discord,
 * Telegram, Lens, Farcaster, Nostr, …). Lets tests probe whether an optional
 * connector plugin is installed without hard-failing when it is absent.
 */
import { EventEmitter } from "node:events";
import { existsSync } from "node:fs";
import { ServerResponse } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const OPTIONAL_IMPORT_ERROR_MARKERS = [
    "Cannot find module",
    "Cannot find package",
    "ERR_MODULE_NOT_FOUND",
    "MODULE_NOT_FOUND",
    "Dynamic require of",
    "native addon module",
    "Failed to resolve entry",
    "tfjs_binding",
    "NAPI_MODULE_NOT_FOUND",
    "spec not found",
];
/** Snapshot and restore the configured environment variables around a test. */
export function createEnvSandbox(keys) {
    const backup = {};
    function clear() {
        for (const key of keys) {
            backup[key] = process.env[key];
            delete process.env[key];
        }
    }
    function restore() {
        for (const key of keys) {
            if (backup[key] === undefined) {
                delete process.env[key];
            }
            else {
                process.env[key] = backup[key];
            }
        }
    }
    return { clear, restore };
}
/** Loose plugin-shape predicate used in dynamic test imports across suites. */
export function looksLikePlugin(value) {
    return (value != null &&
        typeof value === "object" &&
        typeof value.name === "string");
}
/** Extract a plugin-like object from a dynamic module export shape. */
export function extractPlugin(mod) {
    if (looksLikePlugin(mod.default))
        return mod.default;
    if (looksLikePlugin(mod.plugin))
        return mod.plugin;
    if (looksLikePlugin(mod))
        return mod;
    for (const key of Object.keys(mod)) {
        if (key === "default" || key === "plugin")
            continue;
        if (looksLikePlugin(mod[key]))
            return mod[key];
    }
    return null;
}
export function isPackageImportResolvable(packageName) {
    const require = createRequire(import.meta.url);
    try {
        require.resolve(packageName);
        return true;
    }
    catch {
        return false;
    }
}
export function isWorkspaceDependency(version) {
    return (typeof version === "string" &&
        (version.startsWith(".") || version.startsWith("workspace:")));
}
const DISCORD_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-discord";
const DISCORD_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-discord/dist/index",
];
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
function resolveFirstExistingPath(relativeEntryPaths) {
    for (const relativeEntryPath of relativeEntryPaths) {
        const absoluteEntryPath = path.resolve(PACKAGE_ROOT, relativeEntryPath);
        if (existsSync(absoluteEntryPath)) {
            return pathToFileURL(absoluteEntryPath).href;
        }
    }
    return null;
}
function resolveNodeModulesEntry(packageName, relativeEntryPath) {
    const packageSegments = packageName.split("/");
    const entryPath = path.resolve(PACKAGE_ROOT, "node_modules", ...packageSegments, relativeEntryPath);
    return existsSync(entryPath) ? pathToFileURL(entryPath).href : null;
}
function resolvePluginImportSpecifier({ packageName, alternatePackageNames = [], nodeModulesEntries = [], localEntries = [], }) {
    for (const candidatePackageName of [packageName, ...alternatePackageNames]) {
        if (isPackageImportResolvable(candidatePackageName)) {
            return candidatePackageName;
        }
    }
    for (const entry of nodeModulesEntries) {
        const resolved = resolveNodeModulesEntry(entry.packageName, entry.relativeEntryPath);
        if (resolved)
            return resolved;
    }
    return resolveFirstExistingPath(localEntries);
}
export function resolveDiscordPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: DISCORD_PLUGIN_PACKAGE_NAME,
        localEntries: DISCORD_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const TELEGRAM_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-telegram";
const TELEGRAM_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-telegram/dist/index",
];
export function resolveTelegramPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: TELEGRAM_PLUGIN_PACKAGE_NAME,
        nodeModulesEntries: [
            {
                packageName: TELEGRAM_PLUGIN_PACKAGE_NAME,
                relativeEntryPath: "dist/index.js",
            },
        ],
        localEntries: TELEGRAM_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const LENS_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-lens";
const LENS_PLUGIN_FALLBACK_PACKAGE = "@elizaos-plugins/client-lens";
const LENS_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-lens/dist/index",
    "../../client-lens/dist/index",
    "../../client-lens/src/index",
];
export function resolveLensPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: LENS_PLUGIN_PACKAGE_NAME,
        alternatePackageNames: [LENS_PLUGIN_FALLBACK_PACKAGE],
        nodeModulesEntries: [
            {
                packageName: LENS_PLUGIN_FALLBACK_PACKAGE,
                relativeEntryPath: "src/index.ts",
            },
            {
                packageName: LENS_PLUGIN_FALLBACK_PACKAGE,
                relativeEntryPath: "dist/index.js",
            },
        ],
        localEntries: LENS_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const FARCASTER_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-farcaster";
const FARCASTER_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-farcaster/dist/node/index.node.js",
];
export function resolveFarcasterPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: FARCASTER_PLUGIN_PACKAGE_NAME,
        localEntries: FARCASTER_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const NOSTR_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-nostr";
const NOSTR_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-nostr/dist/index",
];
export function resolveNostrPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: NOSTR_PLUGIN_PACKAGE_NAME,
        localEntries: NOSTR_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const MATRIX_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-matrix";
const MATRIX_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-matrix/dist/index",
];
export function resolveMatrixPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: MATRIX_PLUGIN_PACKAGE_NAME,
        localEntries: MATRIX_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const FEISHU_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-feishu";
const FEISHU_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "../plugins/plugin-feishu/dist/index",
];
export function resolveFeishuPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: FEISHU_PLUGIN_PACKAGE_NAME,
        nodeModulesEntries: [
            {
                packageName: FEISHU_PLUGIN_PACKAGE_NAME,
                relativeEntryPath: "dist/index.js",
            },
        ],
        localEntries: FEISHU_PLUGIN_LOCAL_ENTRY_CANDIDATES,
    });
}
const WECHAT_PLUGIN_PACKAGE_NAME = "@elizaos/plugin-wechat";
const WECHAT_PLUGIN_LEGACY_PACKAGE_NAME = "@elizaai/plugin-wechat";
const WECHAT_PLUGIN_LOCAL_ENTRY_CANDIDATES = [
    "src/index.ts",
    "dist/index.js",
];
export function resolveWechatPluginImportSpecifier() {
    return resolvePluginImportSpecifier({
        packageName: WECHAT_PLUGIN_PACKAGE_NAME,
        alternatePackageNames: [WECHAT_PLUGIN_LEGACY_PACKAGE_NAME],
        nodeModulesEntries: [
            ...WECHAT_PLUGIN_LOCAL_ENTRY_CANDIDATES.map((relativeEntryPath) => ({
                packageName: WECHAT_PLUGIN_PACKAGE_NAME,
                relativeEntryPath,
            })),
            ...WECHAT_PLUGIN_LOCAL_ENTRY_CANDIDATES.map((relativeEntryPath) => ({
                packageName: WECHAT_PLUGIN_LEGACY_PACKAGE_NAME,
                relativeEntryPath,
            })),
        ],
    });
}
/** Build a mock update check result with deterministic defaults. */
export function buildMockUpdateCheckResult(overrides = {}) {
    return {
        updateAvailable: false,
        currentVersion: "2.0.0",
        latestVersion: "2.0.0",
        channel: "stable",
        distTag: "latest",
        cached: false,
        error: null,
        ...overrides,
    };
}
/** Small utility to wait for asynchronous side-effects in tests. */
export function waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/** Create a lightweight mocked HTTP response used by handler tests. */
export function createMockHttpResponse() {
    let statusCode = 200;
    let legacyStatus = 0;
    let payload = "";
    const res = Object.create(ServerResponse.prototype);
    Object.defineProperty(res, "statusCode", {
        get() {
            return statusCode;
        },
        set(value) {
            statusCode = value;
            legacyStatus = value;
        },
        configurable: true,
    });
    res._status = legacyStatus;
    res._body = payload;
    res.setHeader = () => res;
    res.writeHead = ((value) => {
        statusCode = value;
        legacyStatus = value;
        return res;
    });
    res.end = ((chunk) => {
        payload = chunk ? chunk.toString() : "";
        res._body = payload;
        legacyStatus = statusCode;
        res._status = legacyStatus;
        return res;
    });
    return {
        res,
        getStatus: () => statusCode,
        getJson: () => (payload ? JSON.parse(payload) : null),
    };
}
export function createMockHeadersRequest(headers = {}, options = {}) {
    return createMockIncomingMessage({
        ...options,
        headers,
    });
}
export function createMockIncomingMessage({ method = "GET", url = "/", headers = { host: "localhost:2138" }, body, bodyChunks, json = false, }) {
    const req = new EventEmitter();
    req.method = method;
    req.url = url;
    req.headers = headers;
    req.destroy = ((_) => req);
    const chunks = [];
    if (bodyChunks !== undefined) {
        for (const chunk of bodyChunks) {
            chunks.push(typeof chunk === "string" ? Buffer.from(chunk, "utf-8") : chunk);
        }
    }
    else if (body !== undefined) {
        const encoded = typeof body === "string"
            ? Buffer.from(body, "utf-8")
            : body instanceof Buffer
                ? body
                : json
                    ? Buffer.from(JSON.stringify(body), "utf-8")
                    : Buffer.from(String(body), "utf-8");
        chunks.push(encoded);
    }
    for (const chunk of chunks) {
        queueMicrotask(() => req.emit("data", chunk));
    }
    queueMicrotask(() => req.emit("end"));
    return req;
}
export function createMockJsonRequest(body, options = {}) {
    return createMockIncomingMessage({
        ...options,
        body,
        json: true,
    });
}
/** Return true when optional plugin imports are intentionally unavailable in this env. */
export function isOptionalImportError(error, extraMarkers = []) {
    const message = error instanceof Error ? error.message : String(error);
    return OPTIONAL_IMPORT_ERROR_MARKERS.concat(extraMarkers).some((marker) => message.includes(marker));
}
/** Safely import optional plugin modules while allowing hard failures to bubble. */
export async function tryOptionalDynamicImport(moduleName, markers) {
    try {
        return (await import(__rewriteRelativeImportExtension(/* @vite-ignore */ moduleName)));
    }
    catch (error) {
        if (isOptionalImportError(error, markers))
            return null;
        throw error;
    }
}
//# sourceMappingURL=test-helpers.js.map