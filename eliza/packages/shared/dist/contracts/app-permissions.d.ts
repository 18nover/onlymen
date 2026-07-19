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
export declare const MAX_PATTERN_LENGTH = 256;
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
export declare const RECOGNISED_PERMISSION_NAMESPACES: readonly ["fs", "net"];
export type RecognisedPermissionNamespace = (typeof RECOGNISED_PERMISSION_NAMESPACES)[number];
/**
 * Returns the recognised namespaces actually declared by a parsed
 * manifest. This is what a consent UI should render as toggleable rows.
 */
export declare function recognisedNamespacesFor(manifest: AppPermissionsManifest): RecognisedPermissionNamespace[];
/**
 * Returns the recognised namespaces actually declared by a raw
 * `requestedPermissions` object as persisted on `AppRegistryEntry`.
 * Equivalent to `recognisedNamespacesFor(parseAppPermissions(raw))`
 * when the raw shape is well-formed, but tolerant of malformed
 * persisted state (returns `[]` rather than throwing).
 */
export declare function recognisedNamespacesForRaw(raw: Record<string, unknown> | null | undefined): RecognisedPermissionNamespace[];
export interface FsPermissions {
    read?: string[];
    write?: string[];
}
export interface NetPermissions {
    outbound?: string[];
}
/**
 * Source classification computed by the loader at register time. NOT
 * declared by the app — the loader assigns this based on where the
 * directory came from (in-tree first-party dir vs. external load).
 */
export type AppTrust = "first-party" | "external";
/**
 * Execution-isolation mode an app can request in `elizaos.app.isolation`.
 *
 * - `"none"` (default): app runs in-process with the agent runtime, with
 *   full access. Fast path; intended for first-party and trusted apps.
 * - `"worker"`: app runs in an isolated Bun worker. FS and network calls
 *   are gated against the app's declared + granted permissions at the
 *   bridge boundary. Phase 2 enforcement.
 *
 * Apps can request *more* isolation than the loader's policy ("worker"
 * is always honoured if declared) but never *less* — Phase 3 may force
 * `"worker"` for `trust: "external"` apps regardless of what they
 * declared.
 */
export type AppIsolation = "none" | "worker";
/**
 * Parses a raw `isolation` field from `elizaos.app.isolation` into the
 * typed enum, defaulting to `"none"` when absent. Unknown values
 * (including modes a later Eliza version might add) are
 * coerced to `"none"` to keep the parser forward-compatible.
 */
export declare function parseAppIsolation(value: unknown): AppIsolation;
/**
 * Merged view of declared + recognised + granted permission state for one
 * app. Returned by the registry service and the
 * `GET/PUT /api/apps/permissions/:slug` HTTP routes.
 */
export interface AppPermissionsView {
    slug: string;
    trust: AppTrust;
    /** Effective execution isolation mode after loader policy is applied. */
    isolation: AppIsolation;
    /** Raw `elizaos.app.permissions` block from the app's package.json. */
    requestedPermissions: Record<string, unknown> | null;
    /** Intersection of declared namespaces with what this Eliza recognises. */
    recognisedNamespaces: RecognisedPermissionNamespace[];
    /** Subset of `recognisedNamespaces` the user / loader has granted. */
    grantedNamespaces: RecognisedPermissionNamespace[];
    /** ISO timestamp of the first grant, or null if never granted. */
    grantedAt: string | null;
}
export interface AppPermissionsManifest {
    /**
     * Raw declared object as it appears under `elizaos.app.permissions`,
     * or `null` when no `permissions` block was declared. This is what
     * persists into `app-registry.json` and the audit log so later
     * Eliza versions can read namespaces this version did not validate.
     */
    raw: Record<string, unknown> | null;
    fs?: FsPermissions;
    net?: NetPermissions;
}
export interface ParseAppPermissionsError {
    ok: false;
    reason: string;
    path: string;
}
export type ParseAppPermissionsResult = {
    ok: true;
    manifest: AppPermissionsManifest;
} | ParseAppPermissionsError;
export declare function parseAppPermissions(value: unknown): ParseAppPermissionsResult;
//# sourceMappingURL=app-permissions.d.ts.map