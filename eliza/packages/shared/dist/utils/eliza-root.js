/**
 * Locates the elizaOS package root on disk by walking up from a start directory
 * until it finds the `eliza` package.json. Node-only (uses `node:fs`); async and
 * sync variants exist for boot paths that cannot await. Not barrel-safe for browser.
 */
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const CORE_PACKAGE_NAME = "eliza";
async function readPackageName(dir) {
    try {
        const raw = await fs.readFile(path.join(dir, "package.json"), "utf-8");
        const parsed = JSON.parse(raw);
        return typeof parsed.name === "string" ? parsed.name : null;
    }
    catch {
        // error-policy:J3 absent/invalid package.json
        return null;
    }
}
function readPackageNameSync(dir) {
    try {
        const raw = fsSync.readFileSync(path.join(dir, "package.json"), "utf-8");
        const parsed = JSON.parse(raw);
        return typeof parsed.name === "string" ? parsed.name : null;
    }
    catch {
        // error-policy:J3 absent/invalid package.json
        return null;
    }
}
function listAncestorDirs(startDir, maxDepth = 12) {
    const dirs = [];
    let current = path.resolve(startDir);
    for (let i = 0; i < maxDepth; i += 1) {
        dirs.push(current);
        const parent = path.dirname(current);
        if (parent === current) {
            break;
        }
        current = parent;
    }
    return dirs;
}
async function findPackageRoot(startDir, maxDepth = 12) {
    for (const candidate of listAncestorDirs(startDir, maxDepth)) {
        const name = await readPackageName(candidate);
        if (name === CORE_PACKAGE_NAME) {
            return candidate;
        }
    }
    return null;
}
function findPackageRootSync(startDir, maxDepth = 12) {
    for (const candidate of listAncestorDirs(startDir, maxDepth)) {
        const name = readPackageNameSync(candidate);
        if (name === CORE_PACKAGE_NAME) {
            return candidate;
        }
    }
    return null;
}
function candidateDirsFromArgv1(argv1) {
    const normalized = path.resolve(argv1);
    const candidates = [path.dirname(normalized)];
    const parts = normalized.split(path.sep);
    const binIndex = parts.lastIndexOf(".bin");
    if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
        const binName = path.basename(normalized);
        const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
        candidates.push(path.join(nodeModulesDir, binName));
    }
    return candidates;
}
function candidateDirsFromOptions(opts) {
    const candidates = [];
    if (opts.moduleUrl) {
        candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
    }
    if (opts.argv1) {
        candidates.push(...candidateDirsFromArgv1(opts.argv1));
    }
    if (opts.cwd) {
        candidates.push(opts.cwd);
    }
    return candidates;
}
export async function resolveElizaPackageRoot(opts) {
    const candidates = candidateDirsFromOptions(opts);
    for (const candidate of candidates) {
        const found = await findPackageRoot(candidate);
        if (found) {
            return found;
        }
    }
    return null;
}
export function resolveElizaPackageRootSync(opts) {
    const candidates = candidateDirsFromOptions(opts);
    for (const candidate of candidates) {
        const found = findPackageRootSync(candidate);
        if (found) {
            return found;
        }
    }
    return null;
}
//# sourceMappingURL=eliza-root.js.map