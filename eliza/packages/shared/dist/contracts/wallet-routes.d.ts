/**
 * Zod schemas for the wallet HTTP routes — local key management
 * and primary-wallet selection.
 *
 * Routes covered:
 *   POST /api/wallet/import   { privateKey, chain?: 'evm'|'solana' }
 *   POST /api/wallet/generate { chain?: 'evm'|'solana'|'both',
 *                                source?: 'local'|'steward' }
 *   POST /api/wallet/primary  { chain: 'evm'|'solana',
 *                                source: 'local'|'cloud' }
 *
 * Browser-signing routes (`/api/wallet/browser-*`) keep their own
 * field-level coercion helpers (`normalizeBrowserString`, etc.) — they
 * accept partial unions of legacy shapes that don't model cleanly as
 * a single zod schema, so they're intentionally not migrated here.
 *
 * `PUT /api/wallet/config` is also intentionally left as-is: it uses
 * the dedicated `resolveWalletConfigUpdateRequest` validator that
 * walks the legacy + current update shapes, and consolidating it
 * would require porting a non-trivial helper.
 */
import z from "zod";
declare const WalletChainSchema: z.ZodEnum<{
    evm: "evm";
    solana: "solana";
}>;
declare const WalletGenerateChainSchema: z.ZodEnum<{
    evm: "evm";
    solana: "solana";
    both: "both";
}>;
declare const WalletGenerateSourceSchema: z.ZodEnum<{
    local: "local";
    steward: "steward";
}>;
declare const WalletPrimarySourceSchema: z.ZodEnum<{
    cloud: "cloud";
    local: "local";
}>;
export declare const PostWalletImportRequestSchema: z.ZodPipe<z.ZodObject<{
    chain: z.ZodOptional<z.ZodEnum<{
        evm: "evm";
        solana: "solana";
    }>>;
    privateKey: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    privateKey: string;
    chain?: "evm" | "solana" | undefined;
}, {
    privateKey: string;
    chain?: "evm" | "solana" | undefined;
}>>;
export declare const PostWalletGenerateRequestSchema: z.ZodObject<{
    chain: z.ZodOptional<z.ZodEnum<{
        evm: "evm";
        solana: "solana";
        both: "both";
    }>>;
    source: z.ZodOptional<z.ZodEnum<{
        local: "local";
        steward: "steward";
    }>>;
}, z.core.$strict>;
export declare const PostWalletPrimaryRequestSchema: z.ZodObject<{
    chain: z.ZodEnum<{
        evm: "evm";
        solana: "solana";
    }>;
    source: z.ZodEnum<{
        cloud: "cloud";
        local: "local";
    }>;
}, z.core.$strict>;
export type PostWalletImportRequest = z.infer<typeof PostWalletImportRequestSchema>;
export type PostWalletGenerateRequest = z.infer<typeof PostWalletGenerateRequestSchema>;
export type PostWalletPrimaryRequest = z.infer<typeof PostWalletPrimaryRequestSchema>;
export type WalletChainInput = z.infer<typeof WalletChainSchema>;
export type WalletGenerateChain = z.infer<typeof WalletGenerateChainSchema>;
export type WalletGenerateSource = z.infer<typeof WalletGenerateSourceSchema>;
export type WalletPrimarySource = z.infer<typeof WalletPrimarySourceSchema>;
export {};
//# sourceMappingURL=wallet-routes.d.ts.map