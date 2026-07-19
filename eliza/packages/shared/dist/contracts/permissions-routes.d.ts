/**
 * Zod schemas for the permissions HTTP write routes.
 *
 * The accounts-routes file is already validated through its own
 * file-local schemas (apiKeyAccountSchema / strategyPatchSchema /
 * oauthStartSchema / oauthSubmitCodeSchema / oauthCancelSchema /
 * accountPatchSchema) and isn't re-exported here.
 *
 * Routes covered:
 *   PUT /api/permissions/shell   { enabled?: boolean }
 *   PUT /api/permissions/state   { permissions?: Record<string, PermissionState>,
 *                                   startup?: boolean }
 *
 * `PermissionState` is a structured object — left as `z.record(z.string(),
 * z.record(z.string(), z.unknown()))` here because the canonical type is
 * defined in the platform package and pinning it would require porting a
 * larger graph of types. The route handler doesn't read individual fields
 * of the inner `PermissionState`s — it stores the whole map and consults
 * `.status` only. The schema validates shape; the handler trusts shape.
 */
import z from "zod";
export declare const PutPermissionsShellRequestSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const PutPermissionsStateRequestSchema: z.ZodObject<{
    permissions: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    startup: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type PutPermissionsShellRequest = z.infer<typeof PutPermissionsShellRequestSchema>;
export type PutPermissionsStateRequest = z.infer<typeof PutPermissionsStateRequestSchema>;
//# sourceMappingURL=permissions-routes.d.ts.map