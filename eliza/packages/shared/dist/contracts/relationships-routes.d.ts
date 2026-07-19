/**
 * Zod schema for the relationships HTTP write surface.
 *
 * Routes covered:
 *   POST /api/relationships/people/:id/link
 *     { targetEntityId, evidence? }
 *
 * The accept/reject endpoints (`/candidates/:id/accept|reject`) take
 * no body — the action is encoded in the path.
 */
import z from "zod";
export declare const PostRelationshipLinkRequestSchema: z.ZodPipe<z.ZodObject<{
    targetEntityId: z.ZodString;
    evidence: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodTransform<{
    evidence?: Record<string, unknown> | undefined;
    targetEntityId: string;
}, {
    targetEntityId: string;
    evidence?: Record<string, unknown> | undefined;
}>>;
export type PostRelationshipLinkRequest = z.infer<typeof PostRelationshipLinkRequestSchema>;
//# sourceMappingURL=relationships-routes.d.ts.map