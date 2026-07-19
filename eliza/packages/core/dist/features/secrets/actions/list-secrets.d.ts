/**
 * List Secrets Handler
 *
 * Atomic handler: list secret keys + non-sensitive metadata. NEVER returns
 * secret values. Invoked by the `SECRETS` umbrella when `action=list`.
 */
import type { HandlerCallback, HandlerOptions, IAgentRuntime, Memory, State } from "../../../types/index.js";
interface ListSecretsMetadataEntry {
    setAt: number | undefined;
    lastUsedAt: number | undefined;
    ttl?: number;
}
export declare function listSecretsHandler(runtime: IAgentRuntime, message: Memory, _state?: State, options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        keys?: undefined;
        metadata?: undefined;
    };
} | {
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        keys: string[];
        metadata: Record<string, ListSecretsMetadataEntry>;
    };
}>;
export {};
//# sourceMappingURL=list-secrets.d.ts.map