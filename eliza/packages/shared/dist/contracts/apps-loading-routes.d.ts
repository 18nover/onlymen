/**
 * Zod schemas for the apps-loading HTTP routes (the
 * directory-load surface that produced the App Permissions PR's
 * registry entries).
 *
 * Second migration in the typed-routes initiative — the App Permissions
 * routes were the pilot in `./app-permissions-routes.ts`. The pattern
 * (schema in shared, safeParse on server, infer types on client) is
 * the same here; the only new wrinkle is `.refine()` for the
 * absolute-path check that previously lived as a hand-rolled `if
 * (!path.isAbsolute(directory))` guard in the route handler.
 *
 * Routes covered:
 *   POST /api/apps/load-from-directory
 *     body:    { directory: string }   (must be absolute)
 *     200:     { ok: true, directory, registered: number,
 *                items: [{slug, canonicalName}],
 *                rejectedManifests: [{directory, packageName,
 *                                      reason, path}] }
 *     400:     directory missing / not absolute / not a string
 *     503:     AppRegistryService not on runtime
 *     500:     filesystem failure during scan
 */
import z from "zod";
/**
 * `path.isAbsolute` is platform-aware (POSIX vs Windows). Using it
 * inside `.refine()` keeps the schema honest on whichever runtime
 * the agent is on; declaring "must start with /" would silently miss
 * on Windows.
 */
export declare const PostLoadFromDirectoryRequestSchema: z.ZodObject<{
    directory: z.ZodString;
}, z.core.$strict>;
declare const RegisteredItemSchema: z.ZodObject<{
    slug: z.ZodString;
    canonicalName: z.ZodString;
}, z.core.$strict>;
declare const RejectedManifestSchema: z.ZodObject<{
    directory: z.ZodString;
    packageName: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    reason: z.ZodString;
    path: z.ZodString;
}, z.core.$strict>;
export declare const PostLoadFromDirectoryResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    directory: z.ZodString;
    registered: z.ZodNumber;
    items: z.ZodArray<z.ZodObject<{
        slug: z.ZodString;
        canonicalName: z.ZodString;
    }, z.core.$strict>>;
    rejectedManifests: z.ZodArray<z.ZodObject<{
        directory: z.ZodString;
        packageName: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        reason: z.ZodString;
        path: z.ZodString;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type PostLoadFromDirectoryRequest = z.infer<typeof PostLoadFromDirectoryRequestSchema>;
export type PostLoadFromDirectoryResponse = z.infer<typeof PostLoadFromDirectoryResponseSchema>;
export type LoadFromDirectoryRegisteredItem = z.infer<typeof RegisteredItemSchema>;
export type LoadFromDirectoryRejectedManifest = z.infer<typeof RejectedManifestSchema>;
export {};
//# sourceMappingURL=apps-loading-routes.d.ts.map