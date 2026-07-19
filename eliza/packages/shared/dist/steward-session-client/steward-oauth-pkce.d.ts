/**
 * Steward OAuth PKCE helpers (RFC 7636).
 *
 * Steward's `/auth/oauth/:provider/authorize` requires a S256 `code_challenge`
 * when `response_type=code`. Mint a verifier/challenge pair, send the challenge
 * at /authorize, stash the verifier in browser storage, and replay it at
 * /exchange via {@link exchangeStewardCode}.
 */
export type StewardOAuthProvider = "google" | "discord" | "github" | "twitter";
export declare function generateStewardPkceVerifier(): string;
export declare function createStewardPkceChallenge(verifier: string): Promise<string>;
export interface StewardPkcePair {
    verifier: string;
    challenge: string;
}
export declare function createStewardPkcePair(): Promise<StewardPkcePair>;
export declare function storeStewardPkceVerifier(verifier: string): boolean;
export declare function consumeStewardPkceVerifier(): string | null;
export declare function buildStewardOAuthAuthorizeUrl(provider: StewardOAuthProvider, redirectUri: string, options: {
    stewardApiUrl: string;
    stewardTenantId?: string;
    codeChallenge?: string;
}): string;
//# sourceMappingURL=steward-oauth-pkce.d.ts.map