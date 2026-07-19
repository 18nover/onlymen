/**
 * Zod schemas for the App Permissions HTTP routes.
 *
 * **Pilot for the typed-routes initiative.** Replaces hand-rolled
 * `if (typeof body.x !== 'string')` validation in
 * `packages/agent/src/api/apps-routes.ts` and the parallel client-side
 * type re-declarations in `packages/ui/src/api/client-skills.ts` with a
 * single source of truth: zod schemas defined here, parsed on the
 * server, and used to derive the client's request/response types.
 *
 * The pattern that lands here is the template for migrating other
 * routes off the manual-validation pattern — keep schemas alongside
 * their domain types, expose `.parse()` for the server, expose
 * inferred TS types via `z.infer<typeof schema>` for the client.
 *
 * Routes covered (from PR #7554):
 *   GET  /api/apps/permissions
 *   GET  /api/apps/permissions/:slug
 *   PUT  /api/apps/permissions/:slug   { namespaces: string[] }
 *
 * The `AppPermissionsView` shape itself is hand-typed in
 * `./app-permissions.ts` (slice 1) and re-derived as a zod schema here.
 * The two are kept in sync by a compile-time `satisfies` check at the
 * bottom of this module — if either drifts, typecheck fails.
 */
import z from "zod";
/**
 * Wire shape for `AppPermissionsView`. Mirrors the hand-typed
 * interface in `./app-permissions.ts`. Drift between the two is
 * caught at the bottom of this module via a `satisfies` cross-check.
 */
export declare const AppPermissionsViewSchema: z.ZodObject<{
    slug: z.ZodString;
    trust: z.ZodEnum<{
        external: "external";
        "first-party": "first-party";
    }>;
    isolation: z.ZodEnum<{
        none: "none";
        worker: "worker";
    }>;
    requestedPermissions: z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodNull]>;
    recognisedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strict>;
/** GET /api/apps/permissions response. */
export declare const ListAppPermissionsResponseSchema: z.ZodArray<z.ZodObject<{
    slug: z.ZodString;
    trust: z.ZodEnum<{
        external: "external";
        "first-party": "first-party";
    }>;
    isolation: z.ZodEnum<{
        none: "none";
        worker: "worker";
    }>;
    requestedPermissions: z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodNull]>;
    recognisedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strict>>;
/** GET /api/apps/permissions/:slug response (404 → no body). */
export declare const GetAppPermissionsResponseSchema: z.ZodObject<{
    slug: z.ZodString;
    trust: z.ZodEnum<{
        external: "external";
        "first-party": "first-party";
    }>;
    isolation: z.ZodEnum<{
        none: "none";
        worker: "worker";
    }>;
    requestedPermissions: z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodNull]>;
    recognisedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strict>;
/**
 * PUT /api/apps/permissions/:slug request body.
 *
 * `namespaces` is validated as a string array at the schema layer;
 * the further check that each namespace is recognised AND was
 * declared in the app's manifest happens server-side in
 * `setGrantedNamespaces` (which has access to the registry entry).
 * Doing the recognised-namespace check here too would force every namespace
 * addition to ship a zod-schema bump *and* a parser bump in lockstep, which
 * is friction we don't need.
 */
export declare const PutAppPermissionsRequestSchema: z.ZodObject<{
    namespaces: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
/** PUT /api/apps/permissions/:slug response (200 success body). */
export declare const PutAppPermissionsResponseSchema: z.ZodObject<{
    slug: z.ZodString;
    trust: z.ZodEnum<{
        external: "external";
        "first-party": "first-party";
    }>;
    isolation: z.ZodEnum<{
        none: "none";
        worker: "worker";
    }>;
    requestedPermissions: z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodNull]>;
    recognisedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedNamespaces: z.ZodArray<z.ZodEnum<{
        fs: "fs";
        net: "net";
    }>>;
    grantedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strict>;
export type AppPermissionsViewWire = z.infer<typeof AppPermissionsViewSchema>;
export type ListAppPermissionsResponse = z.infer<typeof ListAppPermissionsResponseSchema>;
export type GetAppPermissionsResponse = z.infer<typeof GetAppPermissionsResponseSchema>;
export type PutAppPermissionsRequest = z.infer<typeof PutAppPermissionsRequestSchema>;
export type PutAppPermissionsResponse = z.infer<typeof PutAppPermissionsResponseSchema>;
/**
 * Tagged constants the client can send to surface where a malformed
 * request originated. The agent's HTTP error path includes the path
 * in the JSON error body so client-side surfaces can localise.
 */
export declare const APP_PERMISSIONS_ROUTE_PATHS: {
    readonly list: "/api/apps/permissions";
    readonly get: (slug: string) => string;
    readonly put: (slug: string) => string;
};
//# sourceMappingURL=app-permissions-routes.d.ts.map