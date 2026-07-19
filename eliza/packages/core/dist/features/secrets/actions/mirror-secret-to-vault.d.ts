/**
 * Mirror Secret To Vault Handler
 *
 * Atomic handler: read a secret from the SecretsService and push a copy into
 * an external vault service (e.g. Steward). Returns `{ mirrored: false }`
 * when the vault service is not registered. Invoked by the `SECRETS` umbrella
 * when `action=mirror`.
 */
import { type HandlerCallback, type HandlerOptions, type IAgentRuntime, type Memory, type State } from "../../../types/index.js";
export declare function mirrorSecretToVaultHandler(runtime: IAgentRuntime, message: Memory, _state?: State, options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        mirrored: boolean;
    };
}>;
//# sourceMappingURL=mirror-secret-to-vault.d.ts.map