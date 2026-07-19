/**
 * Delete Secret Handler
 *
 * Atomic handler: remove a single secret from the store. DM-only. Invoked by
 * the `SECRETS` umbrella when `action=delete`.
 */
import { type HandlerCallback, type HandlerOptions, type IAgentRuntime, type Memory, type State } from "../../../types/index.js";
export declare function deleteSecretHandler(runtime: IAgentRuntime, message: Memory, _state?: State, options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        deleted: boolean;
    };
}>;
//# sourceMappingURL=delete-secret.d.ts.map