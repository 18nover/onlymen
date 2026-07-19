/**
 * Zod schemas for the character HTTP write surface.
 *
 * `PUT /api/character` already uses the existing `validateCharacter`
 * zod helper (which mirrors the full character schema). Only the
 * generate endpoint is migrated here.
 *
 * The OpenAI-compat (`POST /v1/chat/completions`) and Anthropic-compat
 * (`POST /v1/messages`) endpoints are intentionally NOT migrated —
 * they are external-API surface that must mirror upstream specs and
 * accept partial / unknown extension fields without rejecting.
 *
 * Routes covered:
 *   POST /api/character/generate  { field, context, mode? }
 */
import z from "zod";
declare const CharacterGenerateFieldSchema: z.ZodEnum<{
    style: "style";
    bio: "bio";
    system: "system";
    postExamples: "postExamples";
    chatExamples: "chatExamples";
}>;
declare const CharacterGenerateModeSchema: z.ZodEnum<{
    replace: "replace";
    append: "append";
}>;
declare const CharacterGenerateContextSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    system: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    style: z.ZodOptional<z.ZodObject<{
        all: z.ZodOptional<z.ZodArray<z.ZodString>>;
        chat: z.ZodOptional<z.ZodArray<z.ZodString>>;
        post: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    postExamples: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export declare const PostCharacterGenerateRequestSchema: z.ZodObject<{
    field: z.ZodEnum<{
        style: "style";
        bio: "bio";
        system: "system";
        postExamples: "postExamples";
        chatExamples: "chatExamples";
    }>;
    context: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        system: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
        style: z.ZodOptional<z.ZodObject<{
            all: z.ZodOptional<z.ZodArray<z.ZodString>>;
            chat: z.ZodOptional<z.ZodArray<z.ZodString>>;
            post: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        postExamples: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>;
    mode: z.ZodOptional<z.ZodEnum<{
        replace: "replace";
        append: "append";
    }>>;
}, z.core.$strict>;
export type PostCharacterGenerateRequest = z.infer<typeof PostCharacterGenerateRequestSchema>;
export type CharacterGenerateField = z.infer<typeof CharacterGenerateFieldSchema>;
export type CharacterGenerateMode = z.infer<typeof CharacterGenerateModeSchema>;
export type CharacterGenerateContext = z.infer<typeof CharacterGenerateContextSchema>;
export {};
//# sourceMappingURL=character-routes.d.ts.map