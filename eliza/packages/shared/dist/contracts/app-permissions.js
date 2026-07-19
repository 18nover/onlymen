/**
 * Parser and types for the `elizaos.app.permissions` manifest block declared
 * by third-party apps in their `package.json`. Spec lives at
 * `eliza/packages/docs/architecture/app-permissions-manifest.md` and is the
 * source of truth — this module implements the validation rules described
 * there. The manifest is advisory in this slice (no enforcement).
 *
 * Forward compatibility: only the recognised namespaces (`fs`, `net`) are
 * validated and surfaced as typed slices. Unrecognised keys inside the
 * `permissions` object are preserved verbatim under `raw` so a later
 * Eliza version that recognises them can read them out of the persisted
 * registry without re-parsing the source manifest.
 *
 * NOTE: this module is distinct from `./permissions.ts`, which describes
 * OS-level system permissions (camera, microphone, accessibility). App
 * permissions are an in-runtime sandbox concept declared by an app's
 * package.json; system permissions are an OS concept granted to the
 * Eliza binary itself.
 */
export const MAX_PATTERN_LENGTH = 256;
/**
 * Namespaces this Eliza version recognises in `elizaos.app.permissions`.
 * The parser surfaces only these as typed slices; other namespace keys
 * declared by an app are preserved verbatim under `raw` for forward
 * compatibility but cannot be granted (a later Eliza version that
 * recognises them adds them here).
 *
 * Source of truth for the granted-permission store's namespace
 * intersection — see
 * `eliza/packages/docs/architecture/app-permissions-granted-store.md`.
 */
export const RECOGNISED_PERMISSION_NAMESPACES = ["fs", "net"];
/**
 * Returns the recognised namespaces actually declared by a parsed
 * manifest. This is what a consent UI should render as toggleable rows.
 */
export function recognisedNamespacesFor(manifest) {
    const out = [];
    if (manifest.fs !== undefined)
        out.push("fs");
    if (manifest.net !== undefined)
        out.push("net");
    return out;
}
/**
 * Returns the recognised namespaces actually declared by a raw
 * `requestedPermissions` object as persisted on `AppRegistryEntry`.
 * Equivalent to `recognisedNamespacesFor(parseAppPermissions(raw))`
 * when the raw shape is well-formed, but tolerant of malformed
 * persisted state (returns `[]` rather than throwing).
 */
export function recognisedNamespacesForRaw(raw) {
    if (!raw)
        return [];
    const result = parseAppPermissions(raw);
    if (result.ok === false)
        return [];
    return recognisedNamespacesFor(result.manifest);
}
/**
 * Parses a raw `isolation` field from `elizaos.app.isolation` into the
 * typed enum, defaulting to `"none"` when absent. Unknown values
 * (including modes a later Eliza version might add) are
 * coerced to `"none"` to keep the parser forward-compatible.
 */
export function parseAppIsolation(value) {
    if (value === "worker")
        return "worker";
    return "none";
}
export function parseAppPermissions(value) {
    if (value === undefined || value === null) {
        return { ok: true, manifest: { raw: null } };
    }
    if (typeof value !== "object" || Array.isArray(value)) {
        return {
            ok: false,
            reason: "permissions must be an object",
            path: "permissions",
        };
    }
    const raw = value;
    const manifest = { raw };
    if ("fs" in raw) {
        const fsResult = parseFs(raw.fs, "permissions.fs");
        if (fsResult.ok === false)
            return fsResult;
        if (fsResult.value !== null)
            manifest.fs = fsResult.value;
    }
    if ("net" in raw) {
        const netResult = parseNet(raw.net, "permissions.net");
        if (netResult.ok === false)
            return netResult;
        if (netResult.value !== null)
            manifest.net = netResult.value;
    }
    return { ok: true, manifest };
}
function parseFs(value, basePath) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return { ok: false, reason: "fs must be an object", path: basePath };
    }
    const obj = value;
    const out = {};
    if ("read" in obj) {
        const readResult = parseStringArray(obj.read, `${basePath}.read`, "fs.read must be an array of glob strings");
        if (readResult.ok === false)
            return readResult;
        if (readResult.value !== null)
            out.read = readResult.value;
    }
    if ("write" in obj) {
        const writeResult = parseStringArray(obj.write, `${basePath}.write`, "fs.write must be an array of glob strings");
        if (writeResult.ok === false)
            return writeResult;
        if (writeResult.value !== null)
            out.write = writeResult.value;
    }
    return { ok: true, value: hasOwnKeys(out) ? out : null };
}
function parseNet(value, basePath) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return { ok: false, reason: "net must be an object", path: basePath };
    }
    const obj = value;
    const out = {};
    if ("outbound" in obj) {
        const outboundResult = parseStringArray(obj.outbound, `${basePath}.outbound`, "net.outbound must be an array of host pattern strings");
        if (outboundResult.ok === false)
            return outboundResult;
        if (outboundResult.value !== null)
            out.outbound = outboundResult.value;
    }
    return { ok: true, value: hasOwnKeys(out) ? out : null };
}
function parseStringArray(value, basePath, shapeError) {
    if (value === undefined)
        return { ok: true, value: null };
    if (!Array.isArray(value)) {
        return { ok: false, reason: shapeError, path: basePath };
    }
    for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (typeof item !== "string") {
            return { ok: false, reason: shapeError, path: `${basePath}[${i}]` };
        }
        if (item.length > MAX_PATTERN_LENGTH) {
            return {
                ok: false,
                reason: `${basePath}[${i}] exceeds ${MAX_PATTERN_LENGTH} characters`,
                path: `${basePath}[${i}]`,
            };
        }
    }
    return { ok: true, value: value };
}
function hasOwnKeys(obj) {
    for (const _ in obj)
        return true;
    return false;
}
//# sourceMappingURL=app-permissions.js.map