/**
 * Zod schema for the diagnostics HTTP write surface.
 *
 * Routes covered:
 *   POST /api/logs/export
 *     { format: 'json'|'csv', source?, level?, tags?, since?, limit? }
 *
 * `since` accepts either a number (epoch ms) or a string parseable
 * by `Number(...)` or `Date.parse(...)`. `tags` accepts either a
 * single string or a string array — the handler picks the first
 * non-empty entry. Both unions are preserved at the schema level
 * so the handler's coercion still works on validated input.
 */
import z from "zod";
declare const LogExportFormatSchema: z.ZodEnum<{
    json: "json";
    csv: "csv";
}>;
export declare const PostLogExportRequestSchema: z.ZodObject<{
    format: z.ZodEnum<{
        json: "json";
        csv: "csv";
    }>;
    source: z.ZodOptional<z.ZodString>;
    level: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    since: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type PostLogExportRequest = z.infer<typeof PostLogExportRequestSchema>;
export type LogExportFormat = z.infer<typeof LogExportFormatSchema>;
export {};
//# sourceMappingURL=diagnostics-routes.d.ts.map