/**
 * Zod schemas for connector + provider-switch HTTP routes.
 *
 * connector-account-routes.ts already validates body inputs through
 * its own (file-local) zod schemas; those stay in place and aren't
 * re-exported here.
 *
 * Routes covered:
 *   POST /api/connectors           { name: string, config: object }
 *   POST /api/provider/switch
 *     { provider: string, apiKey?, primaryModel? }
 */
import z from "zod";
export declare const PostConnectorRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    config: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strict>, z.ZodTransform<{
    name: string;
    config: Record<string, unknown>;
}, {
    name: string;
    config: Record<string, unknown>;
}>>;
export declare const PostProviderSwitchRequestSchema: z.ZodPipe<z.ZodObject<{
    provider: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    primaryModel: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    primaryModel?: string | undefined;
    apiKey?: string | undefined;
    provider: string;
}, {
    provider: string;
    apiKey?: string | undefined;
    primaryModel?: string | undefined;
}>>;
export type PostConnectorRequest = z.infer<typeof PostConnectorRequestSchema>;
export type PostProviderSwitchRequest = z.infer<typeof PostProviderSwitchRequestSchema>;
//# sourceMappingURL=connector-routes.d.ts.map