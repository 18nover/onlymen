/**
 * Zod schemas for the agent-lifecycle, agent-transfer, and registry
 * write routes. agent-admin (restart / reset) takes no body and is
 * not covered here.
 *
 * Routes covered:
 *   POST /api/agent/autonomy       { enabled: boolean }
 *   POST /api/agent/export         { password, includeLogs? }
 *   POST /api/registry/register    { name?, endpoint?, tokenURI? }
 *   POST /api/registry/update-uri  { tokenURI }
 *   POST /api/registry/sync        { name?, endpoint?, tokenURI? }
 *
 * `POST /api/agent/import` reads a binary multipart-style body via
 * `readRequestBodyBuffer` (not `readJsonBody`) so it's not migrated.
 */
import z from "zod";
export declare const AGENT_TRANSFER_MIN_PASSWORD_LENGTH = 4;
export declare const PostAgentAutonomyRequestSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
}, z.core.$strict>;
export declare const PostAgentExportRequestSchema: z.ZodObject<{
    password: z.ZodString;
    includeLogs: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const PostRegistryRegisterRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    endpoint: z.ZodOptional<z.ZodString>;
    tokenURI: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    tokenURI?: string | undefined;
    endpoint?: string | undefined;
    name?: string | undefined;
}, {
    name?: string | undefined;
    endpoint?: string | undefined;
    tokenURI?: string | undefined;
}>>;
export declare const PostRegistryUpdateUriRequestSchema: z.ZodPipe<z.ZodObject<{
    tokenURI: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    tokenURI: string;
}, {
    tokenURI: string;
}>>;
export declare const PostRegistrySyncRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    endpoint: z.ZodOptional<z.ZodString>;
    tokenURI: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    tokenURI?: string | undefined;
    endpoint?: string | undefined;
    name?: string | undefined;
}, {
    name?: string | undefined;
    endpoint?: string | undefined;
    tokenURI?: string | undefined;
}>>;
export type PostAgentAutonomyRequest = z.infer<typeof PostAgentAutonomyRequestSchema>;
export type PostAgentExportRequest = z.infer<typeof PostAgentExportRequestSchema>;
export type PostRegistryRegisterRequest = z.infer<typeof PostRegistryRegisterRequestSchema>;
export type PostRegistryUpdateUriRequest = z.infer<typeof PostRegistryUpdateUriRequestSchema>;
export type PostRegistrySyncRequest = z.infer<typeof PostRegistrySyncRequestSchema>;
//# sourceMappingURL=agent-routes.d.ts.map