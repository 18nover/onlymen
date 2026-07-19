/**
 * Zod schema for the POST /api/first-run endpoint.
 *
 * The first-run payload is large (~30 optional fields) and many
 * deeply-nested sections (`deploymentTarget`, `linkedAccounts`,
 * `serviceRouting`, `credentialInputs`, `connectors`, `features`,
 * `inventoryProviders`) are post-processed by dedicated normalization
 * helpers (`normalizeDeploymentTargetConfig`, etc.). The schema
 * therefore:
 *   1. Enforces the only hard required field (`name`)
 *   2. Rejects the documented legacy field set with one tailored error
 *   3. Type-checks each known top-level optional field
 *   4. Lets the existing normalization helpers handle the deep shape
 *      via `passthrough()` for the structured sections
 *
 * That keeps validation honest at the boundary without duplicating
 * the normalization helpers.
 */
import z from "zod";
export declare const FIRST_RUN_DEPRECATED_FIELD_KEYS: readonly ["connection", "runMode", "cloudProvider", "provider", "providerApiKey", "primaryModel", "nanoModel", "smallModel", "mediumModel", "largeModel", "megaModel"];
declare const FirstRunThemeSchema: z.ZodEnum<{
    eliza: "eliza";
    qt314: "qt314";
    web2000: "web2000";
    programmer: "programmer";
    haxor: "haxor";
    psycho: "psycho";
}>;
declare const FirstRunStyleSchema: z.ZodObject<{
    all: z.ZodOptional<z.ZodArray<z.ZodString>>;
    chat: z.ZodOptional<z.ZodArray<z.ZodString>>;
    post: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
declare const InventoryProviderEntrySchema: z.ZodObject<{
    chain: z.ZodString;
    rpcProvider: z.ZodString;
    rpcApiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PostFirstRunRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    bio: z.ZodOptional<z.ZodArray<z.ZodString>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    style: z.ZodOptional<z.ZodObject<{
        all: z.ZodOptional<z.ZodArray<z.ZodString>>;
        chat: z.ZodOptional<z.ZodArray<z.ZodString>>;
        post: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    adjectives: z.ZodOptional<z.ZodArray<z.ZodString>>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    postExamples: z.ZodOptional<z.ZodArray<z.ZodString>>;
    messageExamples: z.ZodOptional<z.ZodArray<z.ZodUnknown>>;
    avatarIndex: z.ZodOptional<z.ZodNumber>;
    presetId: z.ZodOptional<z.ZodString>;
    language: z.ZodOptional<z.ZodString>;
    theme: z.ZodOptional<z.ZodEnum<{
        eliza: "eliza";
        qt314: "qt314";
        web2000: "web2000";
        programmer: "programmer";
        haxor: "haxor";
        psycho: "psycho";
    }>>;
    sandboxMode: z.ZodOptional<z.ZodString>;
    githubToken: z.ZodOptional<z.ZodString>;
    telegramToken: z.ZodOptional<z.ZodString>;
    discordToken: z.ZodOptional<z.ZodString>;
    whatsappSessionPath: z.ZodOptional<z.ZodString>;
    twilioAccountSid: z.ZodOptional<z.ZodString>;
    twilioAuthToken: z.ZodOptional<z.ZodString>;
    twilioPhoneNumber: z.ZodOptional<z.ZodString>;
    blooioApiKey: z.ZodOptional<z.ZodString>;
    blooioPhoneNumber: z.ZodOptional<z.ZodString>;
    inventoryProviders: z.ZodOptional<z.ZodArray<z.ZodObject<{
        chain: z.ZodString;
        rpcProvider: z.ZodString;
        rpcApiKey: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>>;
    deploymentTarget: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    linkedAccounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    serviceRouting: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    credentialInputs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    connectors: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    features: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$loose>, z.ZodTransform<{
    name: string;
    bio?: string[] | undefined;
    systemPrompt?: string | undefined;
    style?: {
        all?: string[] | undefined;
        chat?: string[] | undefined;
        post?: string[] | undefined;
    } | undefined;
    adjectives?: string[] | undefined;
    topics?: string[] | undefined;
    postExamples?: string[] | undefined;
    messageExamples?: unknown[] | undefined;
    avatarIndex?: number | undefined;
    presetId?: string | undefined;
    language?: string | undefined;
    theme?: "eliza" | "qt314" | "web2000" | "programmer" | "haxor" | "psycho" | undefined;
    sandboxMode?: string | undefined;
    githubToken?: string | undefined;
    telegramToken?: string | undefined;
    discordToken?: string | undefined;
    whatsappSessionPath?: string | undefined;
    twilioAccountSid?: string | undefined;
    twilioAuthToken?: string | undefined;
    twilioPhoneNumber?: string | undefined;
    blooioApiKey?: string | undefined;
    blooioPhoneNumber?: string | undefined;
    inventoryProviders?: {
        chain: string;
        rpcProvider: string;
        rpcApiKey?: string | undefined;
    }[] | undefined;
    deploymentTarget?: Record<string, unknown> | undefined;
    linkedAccounts?: Record<string, unknown> | undefined;
    serviceRouting?: Record<string, unknown> | undefined;
    credentialInputs?: Record<string, unknown> | undefined;
    connectors?: Record<string, unknown> | undefined;
    features?: Record<string, unknown> | undefined;
}, {
    [x: string]: unknown;
    name: string;
    bio?: string[] | undefined;
    systemPrompt?: string | undefined;
    style?: {
        all?: string[] | undefined;
        chat?: string[] | undefined;
        post?: string[] | undefined;
    } | undefined;
    adjectives?: string[] | undefined;
    topics?: string[] | undefined;
    postExamples?: string[] | undefined;
    messageExamples?: unknown[] | undefined;
    avatarIndex?: number | undefined;
    presetId?: string | undefined;
    language?: string | undefined;
    theme?: "eliza" | "qt314" | "web2000" | "programmer" | "haxor" | "psycho" | undefined;
    sandboxMode?: string | undefined;
    githubToken?: string | undefined;
    telegramToken?: string | undefined;
    discordToken?: string | undefined;
    whatsappSessionPath?: string | undefined;
    twilioAccountSid?: string | undefined;
    twilioAuthToken?: string | undefined;
    twilioPhoneNumber?: string | undefined;
    blooioApiKey?: string | undefined;
    blooioPhoneNumber?: string | undefined;
    inventoryProviders?: {
        chain: string;
        rpcProvider: string;
        rpcApiKey?: string | undefined;
    }[] | undefined;
    deploymentTarget?: Record<string, unknown> | undefined;
    linkedAccounts?: Record<string, unknown> | undefined;
    serviceRouting?: Record<string, unknown> | undefined;
    credentialInputs?: Record<string, unknown> | undefined;
    connectors?: Record<string, unknown> | undefined;
    features?: Record<string, unknown> | undefined;
}>>;
export type PostFirstRunRequest = z.infer<typeof PostFirstRunRequestSchema>;
export type FirstRunTheme = z.infer<typeof FirstRunThemeSchema>;
export type FirstRunStyle = z.infer<typeof FirstRunStyleSchema>;
export type InventoryProviderEntry = z.infer<typeof InventoryProviderEntrySchema>;
export {};
//# sourceMappingURL=first-run-routes.d.ts.map