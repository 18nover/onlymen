/**
 * Zod schemas for the apps-lifecycle HTTP routes
 * (launch / install / stop / relaunch / create / overlay-presence /
 * refresh). Same template as the rest: schema in shared, safeParse on
 * server, infer types on client.
 *
 * Routes covered:
 *   POST /api/apps/launch            body: { name }                  → AppLaunchResult
 *   POST /api/apps/install           body: { name, version? }        → InstallAppResponse
 *   POST /api/apps/stop              body: { name?, runId? }         → AppStopResult
 *                                     (at least one of name/runId required)
 *   POST /api/apps/relaunch          body: { name, runId?, verify? } → AppLaunchResult
 *   POST /api/apps/create            body: { intent, editTarget? }   → CreateAppResponse
 *   POST /api/apps/overlay-presence  body: { appName?: string|null } → OverlayPresenceResponse
 *   POST /api/apps/refresh           (no body)                       → RefreshAppsResponse
 *
 * Response shapes for the routes that delegate to AppLaunchResult or
 * AppStopResult (launch, stop, relaunch) are still defined by the
 * TypeScript interfaces in `./apps.ts` — those tree types have not
 * been migrated to zod yet and are out of scope for this module.
 */
import z from "zod";
export declare const PostLaunchAppRequestSchema: z.ZodPipe<z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    name: string;
}, {
    name: string;
}>>, z.ZodObject<{
    name: z.ZodString;
}, z.core.$strict>>;
export declare const PostInstallAppRequestSchema: z.ZodPipe<z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    version?: string | undefined;
    name: string;
}, {
    name: string;
    version?: string | undefined;
}>>, z.ZodObject<{
    name: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
/**
 * /stop accepts `{ name }`, `{ runId }`, or both — but at least one
 * must be a non-empty string. The `.refine()` does the cross-field
 * check the route used to do by hand.
 */
export declare const PostStopAppRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    runId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    runId?: string | undefined;
    name?: string | undefined;
}, {
    name?: string | undefined;
    runId?: string | undefined;
}>>;
/**
 * /relaunch accepts the launch fields plus optional `runId` (used to
 * stop a specific run before relaunching, instead of the broader
 * "stop everything matching `name`" behaviour) and a `verify`
 * boolean that triggers post-launch verification. The route already
 * required `name` even when `runId` was supplied — so no
 * cross-field refine like /stop has.
 */
export declare const PostRelaunchAppRequestSchema: z.ZodPipe<z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    runId: z.ZodOptional<z.ZodString>;
    verify: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    verify?: boolean | undefined;
    runId?: string | undefined;
    name: string;
}, {
    name: string;
    runId?: string | undefined;
    verify?: boolean | undefined;
}>>, z.ZodObject<{
    name: z.ZodString;
    runId: z.ZodOptional<z.ZodString>;
    verify: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>>;
/**
 * /create maps onto the unified APP action — the `intent` is the
 * natural-language prompt the orchestrator hands to the spawned coding
 * sub-agent, and `editTarget` (when present) names an existing app to
 * edit instead of scaffolding a new one. The handler used to require a
 * non-empty trimmed intent by hand; the schema now does that, plus
 * trims `editTarget` so empty strings round-trip back to "missing".
 */
export declare const PostCreateAppRequestSchema: z.ZodPipe<z.ZodPipe<z.ZodObject<{
    intent: z.ZodString;
    editTarget: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    editTarget?: string | undefined;
    intent: string;
}, {
    intent: string;
    editTarget?: string | undefined;
}>>, z.ZodObject<{
    intent: z.ZodString;
    editTarget: z.ZodOptional<z.ZodString>;
}, z.core.$strict>>;
/**
 * /overlay-presence is the UI's "which app is currently visible" ping.
 * The route accepts a string, an explicit `null`, or omission — all of
 * the latter two clear presence. Empty/whitespace strings collapse to
 * null too, matching the handler's prior `trim().length > 0 ? trim : null`
 * normalisation.
 */
export declare const PostOverlayPresenceRequestSchema: z.ZodPipe<z.ZodObject<{
    appName: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
}, z.core.$strict>, z.ZodTransform<{
    appName: string | null;
}, {
    appName?: string | null | undefined;
}>>;
/** /overlay-presence reply: `{ ok: true, appName: string | null }`. */
export declare const PostOverlayPresenceResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    appName: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strict>;
/** /create reply from the unified APP action. */
export declare const PostCreateAppResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    text: z.ZodString;
    messages: z.ZodArray<z.ZodString>;
    data: z.ZodNullable<z.ZodUnknown>;
}, z.core.$strict>;
/** /refresh reply — registry refresh count. */
export declare const PostRefreshAppsResponseSchema: z.ZodObject<{
    ok: z.ZodLiteral<true>;
    count: z.ZodNumber;
}, z.core.$strict>;
/**
 * Component schema: install-progress event the installer streams as it
 * walks through phases (download, extract, register, …). Mirrors the
 * `InstallProgressLike` interface in
 * `packages/agent/src/services/plugin-manager-types.ts`.
 */
export declare const InstallProgressEventSchema: z.ZodObject<{
    phase: z.ZodString;
    message: z.ZodString;
    pluginName: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
/**
 * /install reply, discriminated on `success`:
 *   - success: full install metadata + replayed progress events
 *   - failure: error + the progress events that were captured before
 *     the failure
 */
export declare const PostInstallAppResponseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    success: z.ZodLiteral<true>;
    pluginName: z.ZodString;
    version: z.ZodString;
    installPath: z.ZodString;
    requiresRestart: z.ZodBoolean;
    progress: z.ZodArray<z.ZodObject<{
        phase: z.ZodString;
        message: z.ZodString;
        pluginName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    error: z.ZodOptional<z.ZodString>;
    progress: z.ZodArray<z.ZodObject<{
        phase: z.ZodString;
        message: z.ZodString;
        pluginName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>], "success">;
export type PostLaunchAppRequest = z.infer<typeof PostLaunchAppRequestSchema>;
export type PostInstallAppRequest = z.infer<typeof PostInstallAppRequestSchema>;
export type PostStopAppRequest = z.infer<typeof PostStopAppRequestSchema>;
export type PostRelaunchAppRequest = z.infer<typeof PostRelaunchAppRequestSchema>;
export type PostCreateAppRequest = z.infer<typeof PostCreateAppRequestSchema>;
export type PostOverlayPresenceRequest = z.infer<typeof PostOverlayPresenceRequestSchema>;
export type PostOverlayPresenceResponse = z.infer<typeof PostOverlayPresenceResponseSchema>;
export type PostCreateAppResponse = z.infer<typeof PostCreateAppResponseSchema>;
export type PostRefreshAppsResponse = z.infer<typeof PostRefreshAppsResponseSchema>;
export type InstallProgressEvent = z.infer<typeof InstallProgressEventSchema>;
export type PostInstallAppResponse = z.infer<typeof PostInstallAppResponseSchema>;
//# sourceMappingURL=apps-lifecycle-routes.d.ts.map