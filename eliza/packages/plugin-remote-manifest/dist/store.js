/**
 * On-disk install store for remote plugins: reads/writes the install registry,
 * installs and uninstalls plugin artifacts, and loads/bootstraps installed
 * plugins for the host runtime. Owns the atomic staging (mkdtemp + rename)
 * install layout under the state dir.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync, } from "node:fs";
import { join, parse, resolve, sep } from "node:path";
import { isJsonObject } from "./json.js";
import { flattenRemotePluginPermissions, isRemotePluginIsolation, normalizeRemotePluginPermissions, } from "./permissions.js";
import { BUN_PERMISSIONS, HOST_PERMISSIONS } from "./types.js";
import { isValidRemotePluginId, validateRemotePluginManifest, } from "./validation.js";
const REGISTRY_FILE_NAME = "registry.json";
const INSTALL_FILE_NAME = "install.json";
const REGISTRY_VERSION = 1;
/**
 * SOC2 A-1: callers fetching an artifact source MUST invoke
 * `verifyPluginArtifact` BEFORE calling `installPrebuiltRemotePlugin`.
 * The store layer is kept sync + KMS-free; verification belongs in the
 * caller (agent download / install orchestrator) where the audit
 * dispatcher and KMS client already exist.
 */
export class RemotePluginStoreError extends Error {
    constructor(message) {
        super(message);
        this.name = "RemotePluginStoreError";
    }
}
function parseJsonFile(filePath) {
    return JSON.parse(readFileSync(filePath, "utf8"));
}
function ensureStoreRoot(storeRoot) {
    mkdirSync(storeRoot, { recursive: true });
}
function removePathRecursive(targetPath) {
    if (targetPath.length === 0) {
        throw new RemotePluginStoreError("Refusing to remove an empty store path.");
    }
    const resolvedTarget = resolve(targetPath);
    if (resolvedTarget === resolve(".")) {
        throw new RemotePluginStoreError(`Refusing to remove the current working directory: ${targetPath}`);
    }
    if (resolvedTarget === parse(resolvedTarget).root) {
        throw new RemotePluginStoreError(`Refusing to remove a filesystem root: ${targetPath}`);
    }
    rmSync(resolvedTarget, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
    });
}
function stringField(object, key, path) {
    const value = object[key];
    if (typeof value !== "string" || value.length === 0) {
        throw new RemotePluginStoreError(`Invalid ${path}.${key}: expected string.`);
    }
    return value;
}
function numberField(object, key, path) {
    const value = object[key];
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new RemotePluginStoreError(`Invalid ${path}.${key}: expected number.`);
    }
    return value;
}
function optionalBooleanField(object, key, path) {
    const value = object[key];
    if (value === undefined)
        return undefined;
    if (typeof value !== "boolean") {
        throw new RemotePluginStoreError(`Invalid ${path}.${key}: expected boolean.`);
    }
    return value;
}
function nullableStringField(object, key, path) {
    const value = object[key];
    if (value === undefined || value === null)
        return null;
    if (typeof value !== "string") {
        throw new RemotePluginStoreError(`Invalid ${path}.${key}: expected string or null.`);
    }
    return value;
}
function optionalNullableStringField(object, key, path) {
    const value = object[key];
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    if (typeof value !== "string") {
        throw new RemotePluginStoreError(`Invalid ${path}.${key}: expected string or null.`);
    }
    return value;
}
function parseOptionalNumberOrNull(value, path) {
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new RemotePluginStoreError(`Invalid ${path}: expected number or null.`);
    }
    return value;
}
function parseBooleanRecord(value, path, allowed) {
    if (value === undefined)
        return undefined;
    if (!isJsonObject(value)) {
        throw new RemotePluginStoreError(`Invalid ${path}: expected object.`);
    }
    const output = {};
    for (const [key, entry] of Object.entries(value)) {
        const permission = allowed.find((allowedKey) => allowedKey === key);
        if (!permission) {
            throw new RemotePluginStoreError(`Invalid ${path}.${key}: unknown permission.`);
        }
        if (typeof entry !== "boolean") {
            throw new RemotePluginStoreError(`Invalid ${path}.${key}: expected boolean.`);
        }
        output[permission] = entry;
    }
    return output;
}
function parsePermissionGrant(value, path) {
    if (!isJsonObject(value)) {
        throw new RemotePluginStoreError(`Invalid ${path}: expected object.`);
    }
    const grant = {};
    const host = parseBooleanRecord(value.host, `${path}.host`, HOST_PERMISSIONS);
    const bun = parseBooleanRecord(value.bun, `${path}.bun`, BUN_PERMISSIONS);
    if (host)
        grant.host = host;
    if (bun)
        grant.bun = bun;
    const isolation = value.isolation;
    if (isolation === undefined) {
        grant.isolation = "shared-worker";
    }
    else if (typeof isolation === "string" &&
        isRemotePluginIsolation(isolation)) {
        grant.isolation = isolation;
    }
    else {
        throw new RemotePluginStoreError(`Invalid ${path}.isolation: expected shared-worker or isolated-process.`);
    }
    return grant;
}
function parseInstallSource(value, path, fallbackHashValue) {
    if (!isJsonObject(value)) {
        throw new RemotePluginStoreError(`Invalid ${path}: expected object.`);
    }
    const kind = value.kind;
    if (kind === "prototype") {
        return {
            kind,
            prototypeId: stringField(value, "prototypeId", path),
            bundledViewFolder: stringField(value, "bundledViewFolder", path),
        };
    }
    if (kind === "local") {
        return {
            kind,
            path: stringField(value, "path", path),
        };
    }
    if (kind === "artifact") {
        const fallbackHash = typeof fallbackHashValue === "string" ? fallbackHashValue : null;
        return {
            kind,
            location: stringField(value, "location", path),
            updateLocation: nullableStringField(value, "updateLocation", path),
            tarballLocation: nullableStringField(value, "tarballLocation", path),
            currentHash: nullableStringField(value, "currentHash", path) ?? fallbackHash,
            baseUrl: nullableStringField(value, "baseUrl", path),
        };
    }
    throw new RemotePluginStoreError(`Invalid ${path}.kind.`);
}
function registryPath(storeRoot) {
    return join(storeRoot, REGISTRY_FILE_NAME);
}
function normalizeInstallSource(source, fallbackHash) {
    if (source.kind !== "artifact")
        return source;
    return {
        kind: "artifact",
        location: source.location,
        updateLocation: source.updateLocation ?? null,
        tarballLocation: source.tarballLocation ?? null,
        currentHash: source.currentHash ?? fallbackHash,
        baseUrl: source.baseUrl ?? null,
    };
}
function normalizeInstallRecord(record) {
    return {
        ...record,
        source: normalizeInstallSource(record.source, record.currentHash),
        permissionsGranted: normalizeRemotePluginPermissions(record.permissionsGranted),
        devMode: record.devMode ?? false,
        lastBuildAt: record.lastBuildAt ?? null,
        lastBuildError: record.lastBuildError ?? null,
    };
}
function parseInstallRecord(value, filePath) {
    if (!isJsonObject(value)) {
        throw new RemotePluginStoreError(`Invalid install record at ${filePath}: expected object.`);
    }
    const status = value.status;
    if (status !== "installed" && status !== "broken") {
        throw new RemotePluginStoreError(`Invalid install record at ${filePath}: bad status.`);
    }
    return normalizeInstallRecord({
        id: stringField(value, "id", "install"),
        name: stringField(value, "name", "install"),
        version: stringField(value, "version", "install"),
        currentHash: nullableStringField(value, "currentHash", "install"),
        installedAt: numberField(value, "installedAt", "install"),
        updatedAt: numberField(value, "updatedAt", "install"),
        permissionsGranted: parsePermissionGrant(value.permissionsGranted, "install.permissionsGranted"),
        devMode: optionalBooleanField(value, "devMode", "install") ?? false,
        lastBuildAt: parseOptionalNumberOrNull(value.lastBuildAt, "install.lastBuildAt") ??
            null,
        lastBuildError: optionalNullableStringField(value, "lastBuildError", "install") ?? null,
        status,
        source: parseInstallSource(value.source, "install.source", value.currentHash),
    });
}
function parseRegistry(value) {
    if (!isJsonObject(value)) {
        throw new RemotePluginStoreError("Invalid remote plugin registry: expected object.");
    }
    if (value.version !== REGISTRY_VERSION ||
        !isJsonObject(value.remotePlugins)) {
        throw new RemotePluginStoreError("Invalid remote plugin registry.");
    }
    const remotePlugins = {};
    for (const [id, record] of Object.entries(value.remotePlugins)) {
        remotePlugins[id] = parseInstallRecord(record, `registry.remotePlugins.${id}`);
    }
    return { version: REGISTRY_VERSION, remotePlugins };
}
export function getRemotePluginStorePaths(storeRoot, id) {
    if (!isValidRemotePluginId(id)) {
        throw new RemotePluginStoreError(`Invalid remote plugin id: ${id}`);
    }
    const rootDir = resolve(storeRoot, id);
    const normalizedStoreRoot = resolve(storeRoot);
    if (rootDir !== normalizedStoreRoot &&
        !rootDir.startsWith(`${normalizedStoreRoot}${sep}`)) {
        throw new RemotePluginStoreError(`Remote plugin id escapes store root: ${id}`);
    }
    return {
        rootDir,
        currentDir: join(rootDir, "current"),
        stateDir: join(rootDir, "data"),
        extractionDir: join(rootDir, "self-extraction"),
        installPath: join(rootDir, INSTALL_FILE_NAME),
    };
}
export function resolveRemotePluginPathInside(rootDir, relativePath) {
    const safeRelativePath = normalizeRemotePluginRelativePath(relativePath);
    const normalizedRoot = resolve(rootDir);
    const resolvedPath = resolve(rootDir, safeRelativePath);
    if (resolvedPath !== normalizedRoot &&
        !resolvedPath.startsWith(`${normalizedRoot}${sep}`)) {
        throw new RemotePluginStoreError(`Path escapes remote plugin root: ${relativePath}`);
    }
    return resolvedPath;
}
function normalizeRemotePluginRelativePath(relativePath) {
    const normalized = relativePath.replace(/\\/g, "/");
    if (!normalized ||
        normalized.startsWith("/") ||
        /^[A-Za-z]:/.test(normalized)) {
        throw new RemotePluginStoreError(`Path escapes remote plugin root: ${relativePath || "<empty>"}`);
    }
    const segments = normalized.split("/");
    if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
        throw new RemotePluginStoreError(`Path escapes remote plugin root: ${relativePath}`);
    }
    return segments.join("/");
}
export function toRemotePluginViewUrl(relativePath) {
    return `views://${normalizeRemotePluginRelativePath(relativePath)}`;
}
export function readRemotePluginManifestAt(manifestPath) {
    const parsed = parseJsonFile(manifestPath);
    const result = validateRemotePluginManifest(parsed);
    if (!result.ok) {
        const details = result.issues
            .map((issue) => `${issue.path}: ${issue.message}`)
            .join("; ");
        throw new RemotePluginStoreError(`Invalid plugin.json manifest at ${manifestPath}: ${details}`);
    }
    return result.manifest;
}
export function assertRemotePluginPayload(payloadDir) {
    const manifestPath = join(payloadDir, "plugin.json");
    if (!existsSync(manifestPath)) {
        throw new RemotePluginStoreError(`Missing plugin.json in ${payloadDir}`);
    }
    const manifest = readRemotePluginManifestAt(manifestPath);
    const workerPath = resolveRemotePluginPathInside(payloadDir, manifest.worker.relativePath);
    if (!existsSync(workerPath)) {
        throw new RemotePluginStoreError(`Missing worker for ${manifest.id}: ${workerPath}`);
    }
    const viewPath = resolveRemotePluginPathInside(payloadDir, manifest.view.relativePath);
    if (!existsSync(viewPath)) {
        throw new RemotePluginStoreError(`Missing view entry for ${manifest.id}: ${viewPath}`);
    }
    for (const [remoteUiId, remoteUi] of Object.entries(manifest.remoteUIs ?? {})) {
        const remoteUiPath = resolveRemotePluginPathInside(payloadDir, remoteUi.path);
        if (!existsSync(remoteUiPath)) {
            throw new RemotePluginStoreError(`Missing remote UI ${remoteUiId} for ${manifest.id}: ${remoteUiPath}`);
        }
    }
    return manifest;
}
export function readRemotePluginRegistry(storeRoot) {
    ensureStoreRoot(storeRoot);
    const filePath = registryPath(storeRoot);
    if (!existsSync(filePath)) {
        return { version: REGISTRY_VERSION, remotePlugins: {} };
    }
    return parseRegistry(parseJsonFile(filePath));
}
export function writeRemotePluginRegistry(storeRoot, registry) {
    ensureStoreRoot(storeRoot);
    const normalized = {
        version: REGISTRY_VERSION,
        remotePlugins: {},
    };
    for (const record of Object.values(registry.remotePlugins)) {
        normalized.remotePlugins[record.id] = normalizeInstallRecord(record);
    }
    writeFileSync(registryPath(storeRoot), `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
    return normalized;
}
export function listInstalledRemotePluginDirectories(storeRoot) {
    ensureStoreRoot(storeRoot);
    return readdirSync(storeRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
}
export function readRemotePluginInstallRecord(storeRoot, id) {
    const installPath = getRemotePluginStorePaths(storeRoot, id).installPath;
    if (!existsSync(installPath))
        return null;
    return parseInstallRecord(parseJsonFile(installPath), installPath);
}
export function writeRemotePluginInstallRecord(storeRoot, record) {
    const normalized = normalizeInstallRecord(record);
    const paths = getRemotePluginStorePaths(storeRoot, normalized.id);
    mkdirSync(paths.rootDir, { recursive: true });
    writeFileSync(paths.installPath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
    syncRemotePluginRegistry(storeRoot);
    return normalized;
}
export function buildRemotePluginRuntimeContext(currentDir, stateDir, remotePluginId, permissionsGranted, authToken = null) {
    const grantedPermissions = normalizeRemotePluginPermissions(permissionsGranted);
    return {
        currentDir,
        statePath: join(stateDir, "state.json"),
        logsPath: join(stateDir, "logs.txt"),
        permissions: flattenRemotePluginPermissions(grantedPermissions),
        grantedPermissions,
        authToken,
        channel: `remote-plugin:${remotePluginId}`,
    };
}
export function writeRemotePluginWorkerBootstrap(currentDir, manifest, install, bundleWorkerPath, stateDir) {
    const bootstrapDir = join(currentDir, ".bunny");
    const bootstrapPath = join(bootstrapDir, "plugin-bun-entrypoint.mjs");
    const workerRelativePath = bundleWorkerPath
        .slice(currentDir.length + 1)
        .replaceAll(sep, "/");
    const workerImportPath = workerRelativePath.startsWith(".")
        ? workerRelativePath
        : `../${workerRelativePath}`;
    mkdirSync(bootstrapDir, { recursive: true });
    writeFileSync(bootstrapPath, [
        `globalThis.__remotePluginBootstrap = ${JSON.stringify({
            manifest,
            context: buildRemotePluginRuntimeContext(currentDir, stateDir, manifest.id, install.permissionsGranted),
        })};`,
        `await import(${JSON.stringify(workerImportPath)});`,
        "",
    ].join("\n"), "utf8");
    return bootstrapPath;
}
function loadInstalledRemotePluginRecord(storeRoot, record) {
    const paths = getRemotePluginStorePaths(storeRoot, record.id);
    const manifest = readRemotePluginManifestAt(join(paths.currentDir, "plugin.json"));
    const bundleWorkerPath = resolveRemotePluginPathInside(paths.currentDir, manifest.worker.relativePath);
    const viewPath = resolveRemotePluginPathInside(paths.currentDir, manifest.view.relativePath);
    if (!existsSync(bundleWorkerPath)) {
        throw new RemotePluginStoreError(`Missing worker for ${record.id}: ${bundleWorkerPath}`);
    }
    if (!existsSync(viewPath)) {
        throw new RemotePluginStoreError(`Missing view entry for ${record.id}: ${viewPath}`);
    }
    mkdirSync(paths.stateDir, { recursive: true });
    mkdirSync(paths.extractionDir, { recursive: true });
    const workerPath = writeRemotePluginWorkerBootstrap(paths.currentDir, manifest, record, bundleWorkerPath, paths.stateDir);
    return {
        install: record,
        manifest,
        ...paths,
        bundleWorkerPath,
        workerPath,
        viewPath,
        viewUrl: toRemotePluginViewUrl(manifest.view.relativePath),
    };
}
export function loadInstalledRemotePlugin(storeRoot, id) {
    const record = readRemotePluginInstallRecord(storeRoot, id);
    return record ? loadInstalledRemotePluginRecord(storeRoot, record) : null;
}
export function syncRemotePluginRegistry(storeRoot) {
    const records = new Map();
    for (const directory of listInstalledRemotePluginDirectories(storeRoot)) {
        const record = readRemotePluginInstallRecord(storeRoot, directory);
        if (record) {
            records.set(record.id, record);
        }
    }
    const sortedRecords = Array.from(records.values()).sort((left, right) => left.name.localeCompare(right.name));
    return writeRemotePluginRegistry(storeRoot, {
        version: REGISTRY_VERSION,
        remotePlugins: Object.fromEntries(sortedRecords.map((record) => [record.id, record])),
    });
}
export function loadInstalledRemotePlugins(storeRoot) {
    const registry = syncRemotePluginRegistry(storeRoot);
    return Object.values(registry.remotePlugins)
        .map((record) => loadInstalledRemotePluginRecord(storeRoot, record))
        .sort((left, right) => left.manifest.name.localeCompare(right.manifest.name));
}
export function toInstalledRemotePluginSnapshot(remotePlugin) {
    const { install, manifest } = remotePlugin;
    return {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        mode: manifest.mode,
        status: install.status,
        sourceKind: install.source.kind,
        currentHash: install.currentHash,
        installedAt: install.installedAt,
        updatedAt: install.updatedAt,
        devMode: install.devMode ?? false,
        lastBuildAt: install.lastBuildAt ?? null,
        lastBuildError: install.lastBuildError ?? null,
        requestedPermissions: normalizeRemotePluginPermissions(manifest.permissions),
        grantedPermissions: normalizeRemotePluginPermissions(install.permissionsGranted),
        view: {
            ...manifest.view,
            viewUrl: remotePlugin.viewUrl,
        },
        worker: manifest.worker,
        ...(manifest.remoteUIs ? { remoteUIs: manifest.remoteUIs } : {}),
    };
}
export function toRemotePluginListEntry(remotePlugin) {
    const { install, manifest } = remotePlugin;
    return {
        id: manifest.id,
        name: manifest.name,
        description: manifest.description,
        version: manifest.version,
        mode: manifest.mode,
        permissions: flattenRemotePluginPermissions(install.permissionsGranted),
        status: install.status,
        devMode: install.devMode ?? false,
    };
}
export function loadRemotePluginStoreSnapshot(storeRoot) {
    return {
        version: REGISTRY_VERSION,
        remotePlugins: loadInstalledRemotePlugins(storeRoot).map(toInstalledRemotePluginSnapshot),
    };
}
export function loadRemotePluginListEntries(storeRoot) {
    return loadInstalledRemotePlugins(storeRoot).map(toRemotePluginListEntry);
}
export function installPrebuiltRemotePlugin(storeRoot, payloadDir, options = {}) {
    const manifest = assertRemotePluginPayload(payloadDir);
    const previousInstall = readRemotePluginInstallRecord(storeRoot, manifest.id);
    const paths = getRemotePluginStorePaths(storeRoot, manifest.id);
    const now = options.now?.() ?? Date.now();
    mkdirSync(paths.rootDir, { recursive: true });
    mkdirSync(paths.stateDir, { recursive: true });
    mkdirSync(paths.extractionDir, { recursive: true });
    const tempRootDir = mkdtempSync(join(paths.rootDir, "incoming-"));
    const tempCurrentDir = join(tempRootDir, "current");
    try {
        cpSync(payloadDir, tempCurrentDir, { recursive: true, force: true });
        removePathRecursive(paths.currentDir);
        renameSync(tempCurrentDir, paths.currentDir);
    }
    finally {
        removePathRecursive(tempRootDir);
    }
    const installRecord = writeRemotePluginInstallRecord(storeRoot, {
        id: manifest.id,
        name: manifest.name,
        version: manifest.version,
        currentHash: options.currentHash ?? previousInstall?.currentHash ?? null,
        installedAt: previousInstall?.installedAt ?? now,
        updatedAt: now,
        permissionsGranted: normalizeRemotePluginPermissions(options.permissionsGranted ??
            previousInstall?.permissionsGranted ??
            manifest.permissions),
        devMode: options.devMode ?? previousInstall?.devMode ?? false,
        lastBuildAt: options.lastBuildAt ?? previousInstall?.lastBuildAt ?? null,
        lastBuildError: null,
        status: "installed",
        source: options.source ??
            previousInstall?.source ?? { kind: "artifact", location: payloadDir },
    });
    return loadInstalledRemotePluginRecord(storeRoot, installRecord);
}
export function uninstallInstalledRemotePlugin(storeRoot, id) {
    const record = readRemotePluginInstallRecord(storeRoot, id);
    if (!record)
        return null;
    removePathRecursive(getRemotePluginStorePaths(storeRoot, id).rootDir);
    syncRemotePluginRegistry(storeRoot);
    return record;
}
export function isRemotePluginSourceDirectory(directory) {
    return (existsSync(join(directory, "electrobun.config.ts")) ||
        existsSync(join(directory, "plugin.json")) ||
        existsSync(join(directory, "web")) ||
        existsSync(join(directory, "build.ts")) ||
        existsSync(join(directory, "worker.ts")) ||
        existsSync(join(directory, "src", "bun", "worker.ts")));
}
export function ensureRemotePluginSourceDirectory(directory) {
    const normalized = resolve(directory);
    if (!existsSync(normalized) || !statSync(normalized).isDirectory()) {
        throw new RemotePluginStoreError(`Remote plugin source folder not found: ${normalized}`);
    }
    if (!isRemotePluginSourceDirectory(normalized)) {
        throw new RemotePluginStoreError(`Selected folder does not look like a remote plugin source tree: ${normalized}`);
    }
    return normalized;
}
//# sourceMappingURL=store.js.map