/**
 * Zod schemas for the inbox HTTP routes.
 *
 * Routes covered:
 *   POST /api/inbox/messages   body: { roomId, source, text, replyToMessageId? }
 *
 * `source` is normalised to lowercase before validation so the schema
 * only needs to check for non-empty. The handler still runs its own
 * post-validation checks against the runtime (`runtimeHasSendHandler`,
 * `getRoom`) — the schema only ensures the wire shape is well-formed.
 *
 * Response shape (`{ ok: true, message?: InboxMessage }`) is
 * intentionally NOT modelled here: `InboxMessage` is a large
 * runtime-internal type and the inbox surface is mid-refactor.
 * Adding the response schema will be a follow-up after the
 * inbox-messages tree stabilises (mirrors the pattern from PR #7561 /
 * #7565 for apps-routes).
 */
import z from "zod";
export declare const PostInboxMessageRequestSchema: z.ZodPipe<z.ZodObject<{
    roomId: z.ZodString;
    source: z.ZodString;
    text: z.ZodString;
    replyToMessageId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    replyToMessageId?: string | undefined;
    roomId: string;
    source: string;
    text: string;
}, {
    roomId: string;
    source: string;
    text: string;
    replyToMessageId?: string | undefined;
}>>;
export type PostInboxMessageRequest = z.infer<typeof PostInboxMessageRequestSchema>;
//# sourceMappingURL=inbox-routes.d.ts.map