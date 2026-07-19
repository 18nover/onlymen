/**
 * Get Secret Handler
 *
 * Atomic handler: read a single secret value. Returns the value (optionally
 * masked) without exposing additional metadata. Invoked by the `SECRETS`
 * umbrella when `action=get`.
 */
import type { HandlerCallback, HandlerOptions, IAgentRuntime, Memory, State } from "../../../types/index.js";
export declare function getSecretHandler(runtime: IAgentRuntime, message: Memory, _state?: State, options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        value?: undefined;
        masked?: undefined;
    };
} | {
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        value: string | null;
        masked: boolean;
    };
}>;
//# sourceMappingURL=get-secret.d.ts.map