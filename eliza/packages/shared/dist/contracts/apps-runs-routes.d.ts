/**
 * Zod schemas for the per-run steering HTTP routes:
 *
 *   POST /api/apps/runs/:runId/message   body: { content | message }
 *   POST /api/apps/runs/:runId/control   body: { action: 'pause'|'resume' }
 *
 * The message route historically accepted either `content` or `message`
 * as the field name (clients drifted, the handler tolerated both).
 * The schema preserves that compatibility and normalises down to a
 * single `content` field so the rest of the pipeline only sees one
 * shape.
 */
import z from "zod";
export declare const PostRunMessageRequestSchema: z.ZodPipe<z.ZodPipe<z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    content: string;
}, {
    content?: string | undefined;
    message?: string | undefined;
}>>, z.ZodObject<{
    content: z.ZodString;
}, z.core.$strict>>;
export declare const PostRunControlRequestSchema: z.ZodObject<{
    action: z.ZodEnum<{
        pause: "pause";
        resume: "resume";
    }>;
}, z.core.$strict>;
export type PostRunMessageRequest = z.infer<typeof PostRunMessageRequestSchema>;
export type PostRunControlRequest = z.infer<typeof PostRunControlRequestSchema>;
//# sourceMappingURL=apps-runs-routes.d.ts.map