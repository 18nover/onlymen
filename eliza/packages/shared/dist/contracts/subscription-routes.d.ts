/**
 * Zod schemas for the subscription (Anthropic / OpenAI Codex) login
 * routes.
 *
 * Routes covered:
 *   POST /api/subscription/anthropic/exchange     { code }
 *   POST /api/subscription/anthropic/setup-token  { token: 'sk-ant-...' }
 *   POST /api/subscription/openai/exchange        { code?, waitForCallback? }
 *
 * The /start endpoints don't read a body. DELETE /api/subscription/:provider
 * has no body either (provider is in the path).
 */
import z from "zod";
export declare const PostSubscriptionAnthropicExchangeRequestSchema: z.ZodPipe<z.ZodObject<{
    code: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    code: string;
}, {
    code: string;
}>>;
export declare const PostSubscriptionAnthropicSetupTokenRequestSchema: z.ZodPipe<z.ZodObject<{
    token: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    token: string;
}, {
    token: string;
}>>;
/**
 * OpenAI Codex exchange — caller must provide `code` OR set
 * `waitForCallback: true`. The handler still rejects the
 * neither-supplied case explicitly with a tailored message; the
 * schema only enforces type correctness on each field.
 */
export declare const PostSubscriptionOpenAIExchangeRequestSchema: z.ZodPipe<z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    waitForCallback: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    waitForCallback?: boolean | undefined;
    code?: string | undefined;
}, {
    code?: string | undefined;
    waitForCallback?: boolean | undefined;
}>>;
export type PostSubscriptionAnthropicExchangeRequest = z.infer<typeof PostSubscriptionAnthropicExchangeRequestSchema>;
export type PostSubscriptionAnthropicSetupTokenRequest = z.infer<typeof PostSubscriptionAnthropicSetupTokenRequestSchema>;
export type PostSubscriptionOpenAIExchangeRequest = z.infer<typeof PostSubscriptionOpenAIExchangeRequestSchema>;
//# sourceMappingURL=subscription-routes.d.ts.map