/**
 * Zod schemas for the remaining "tail" HTTP routes.
 *
 * Routes covered:
 *   POST /api/bug-report           (BugReportBody — large optional shape)
 *   PUT  /api/update/channel       { channel: 'stable'|'beta'|'nightly' }
 *
 * Routes intentionally NOT migrated in this batch:
 *   - avatar-routes.ts     (binary buffers via readRequestBodyBuffer)
 *   - config-routes.ts     (PUT /api/config — partial deep merge with
 *                            its own safeMerge / isBlockedObjectKey
 *                            protections; PUT body shape is the full
 *                            ElizaConfig)
 *   - travel-provider-relay-routes.ts, x-relay-routes.ts (proxy
 *                            passthroughs — body shape belongs to the
 *                            upstream provider, not this server)
 *   - registry-routes.ts   (POST /api/registry/refresh takes no body)
 *   - mobile-optional-routes.ts (POST /api/stream/settings already
 *                            uses validateStreamSettings exported from
 *                            plugin-streaming; migrating would require
 *                            re-deriving the StreamSettings shape here)
 */
import z from "zod";
declare const BugReportCategorySchema: z.ZodEnum<{
    general: "general";
    "startup-failure": "startup-failure";
}>;
declare const BugReportStartupSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
    phase: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    detail: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNumber>;
    path: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PostBugReportRequestSchema: z.ZodObject<{
    description: z.ZodString;
    stepsToReproduce: z.ZodString;
    expectedBehavior: z.ZodOptional<z.ZodString>;
    actualBehavior: z.ZodOptional<z.ZodString>;
    environment: z.ZodOptional<z.ZodString>;
    nodeVersion: z.ZodOptional<z.ZodString>;
    modelProvider: z.ZodOptional<z.ZodString>;
    logs: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<{
        general: "general";
        "startup-failure": "startup-failure";
    }>>;
    appVersion: z.ZodOptional<z.ZodString>;
    releaseChannel: z.ZodOptional<z.ZodString>;
    startup: z.ZodOptional<z.ZodObject<{
        reason: z.ZodOptional<z.ZodString>;
        phase: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
        detail: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodNumber>;
        path: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
declare const UpdateChannelSchema: z.ZodEnum<{
    beta: "beta";
    stable: "stable";
    nightly: "nightly";
}>;
export declare const PutUpdateChannelRequestSchema: z.ZodObject<{
    channel: z.ZodEnum<{
        beta: "beta";
        stable: "stable";
        nightly: "nightly";
    }>;
}, z.core.$strict>;
export type PostBugReportRequest = z.infer<typeof PostBugReportRequestSchema>;
export type PutUpdateChannelRequest = z.infer<typeof PutUpdateChannelRequestSchema>;
export type BugReportCategory = z.infer<typeof BugReportCategorySchema>;
export type BugReportStartup = z.infer<typeof BugReportStartupSchema>;
export type UpdateChannel = z.infer<typeof UpdateChannelSchema>;
export {};
//# sourceMappingURL=tail-routes.d.ts.map