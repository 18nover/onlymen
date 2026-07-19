/**
 * KMS client factory and backend resolver for memory, local desktop, and Steward-backed deployments.
 */
import { LocalKmsAdapter } from "./local-adapter.js";
import { MemoryKmsAdapter } from "./memory-adapter.js";
import { StewardKmsAdapter } from "./steward-adapter.js";
import { type KmsClient } from "./types.js";
export type KmsBackend = "memory" | "local" | "steward";
export interface KmsFactoryOptions {
    backend?: KmsBackend;
    /** Override env source (Cloudflare Workers: pass `c.env`-merged proxy). */
    env?: NodeJS.ProcessEnv;
    steward?: {
        baseUrl: string;
        tokenProvider: () => Promise<string>;
    };
    local?: {
        rootKey: Uint8Array;
    };
}
/**
 * Resolve a KMS backend from env + explicit options.
 *
 *   ELIZA_KMS_BACKEND  memory | local | steward
 *   ELIZA_LOCAL_MODE   when "1", overrides backend default to "local"
 *
 * Defaults:
 *   - NODE_ENV=test                -> memory
 *   - ELIZA_LOCAL_MODE=1           -> local
 *   - otherwise                    -> steward (production)
 */
export declare function resolveKmsBackend(opts?: KmsFactoryOptions, env?: NodeJS.ProcessEnv): KmsBackend;
export declare function createKmsClient(opts?: KmsFactoryOptions): KmsClient;
export * from "./key-namespace.js";
export * from "./types.js";
export { LocalKmsAdapter, MemoryKmsAdapter, StewardKmsAdapter };
//# sourceMappingURL=index.d.ts.map