/**
 * Zod schemas for the plugin HTTP routes — config + install / update /
 * uninstall surface plus secrets and core-plugin toggle.
 *
 * Routes covered (body-bearing only — eject/sync/reinject/test take
 * no body):
 *
 *   PUT  /api/plugins/:id
 *     body: { enabled?: boolean, config?: Record<string, string> }
 *   PUT  /api/secrets
 *     body: { secrets: Record<string, string> }
 *   POST /api/plugins/install
 *     body: { name, autoRestart?, stream?: 'latest'|'beta', version? }
 *   POST /api/plugins/update
 *     body: same as install
 *   POST /api/plugins/uninstall
 *     body: { name, autoRestart? }
 *   POST /api/plugins/core/toggle
 *     body: { npmName, enabled }
 *   PUT  /api/skills/curated/:name/source
 *     body: { content: string }
 */
import z from "zod";
export declare const PutPluginRequestSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>;
export declare const PutSecretsRequestSchema: z.ZodObject<{
    secrets: z.ZodRecord<z.ZodString, z.ZodString>;
}, z.core.$strict>;
declare const PluginInstallStreamSchema: z.ZodEnum<{
    latest: "latest";
    beta: "beta";
}>;
export declare const PostPluginInstallRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    autoRestart: z.ZodOptional<z.ZodBoolean>;
    stream: z.ZodOptional<z.ZodEnum<{
        latest: "latest";
        beta: "beta";
    }>>;
    version: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    version?: string | undefined;
    stream?: "latest" | "beta" | undefined;
    autoRestart?: boolean | undefined;
    name: string;
}, {
    name: string;
    autoRestart?: boolean | undefined;
    stream?: "latest" | "beta" | undefined;
    version?: string | undefined;
}>>;
export declare const PostPluginUpdateRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    autoRestart: z.ZodOptional<z.ZodBoolean>;
    stream: z.ZodOptional<z.ZodEnum<{
        latest: "latest";
        beta: "beta";
    }>>;
    version: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    version?: string | undefined;
    stream?: "latest" | "beta" | undefined;
    autoRestart?: boolean | undefined;
    name: string;
}, {
    name: string;
    autoRestart?: boolean | undefined;
    stream?: "latest" | "beta" | undefined;
    version?: string | undefined;
}>>;
export declare const PostPluginUninstallRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    autoRestart: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    autoRestart?: boolean | undefined;
    name: string;
}, {
    name: string;
    autoRestart?: boolean | undefined;
}>>;
export declare const PostPluginCoreToggleRequestSchema: z.ZodPipe<z.ZodObject<{
    npmName: z.ZodString;
    enabled: z.ZodBoolean;
}, z.core.$strict>, z.ZodTransform<{
    npmName: string;
    enabled: boolean;
}, {
    npmName: string;
    enabled: boolean;
}>>;
export declare const PutCuratedSkillSourceRequestSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strict>;
export type PutPluginRequest = z.infer<typeof PutPluginRequestSchema>;
export type PutSecretsRequest = z.infer<typeof PutSecretsRequestSchema>;
export type PostPluginInstallRequest = z.infer<typeof PostPluginInstallRequestSchema>;
export type PostPluginUpdateRequest = z.infer<typeof PostPluginUpdateRequestSchema>;
export type PostPluginUninstallRequest = z.infer<typeof PostPluginUninstallRequestSchema>;
export type PostPluginCoreToggleRequest = z.infer<typeof PostPluginCoreToggleRequestSchema>;
export type PutCuratedSkillSourceRequest = z.infer<typeof PutCuratedSkillSourceRequestSchema>;
export type PluginInstallStream = z.infer<typeof PluginInstallStreamSchema>;
export {};
//# sourceMappingURL=plugin-routes.d.ts.map