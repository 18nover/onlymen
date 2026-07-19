/**
 * Zod schemas for the memory HTTP write surface.
 *
 * Routes covered:
 *   POST  /api/memory/remember   { text }
 *   PATCH /api/memories/:id      { text }
 *
 * The DELETE /api/memories/:id route has no body and isn't covered.
 */
import z from "zod";
export declare const PostMemoryRememberRequestSchema: z.ZodPipe<z.ZodObject<{
    text: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    text: string;
}, {
    text: string;
}>>;
export declare const PatchMemoryRequestSchema: z.ZodPipe<z.ZodObject<{
    text: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    text: string;
}, {
    text: string;
}>>;
export type PostMemoryRememberRequest = z.infer<typeof PostMemoryRememberRequestSchema>;
export type PatchMemoryRequest = z.infer<typeof PatchMemoryRequestSchema>;
//# sourceMappingURL=memory-routes.d.ts.map