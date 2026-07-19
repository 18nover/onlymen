/**
 * Request Secret Handler
 *
 * Atomic handler: request a missing secret from the user/administrator,
 * routing the collection through the resolved sensitive-request delivery
 * channel. Invoked by the `SECRETS` umbrella when `action=request`.
 */
import { type HandlerCallback, type HandlerOptions, type IAgentRuntime, type Memory, type State } from "../../../types/index.js";
export declare function requestSecretHandler(runtime: IAgentRuntime, message: Memory, state?: State, _options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        key?: undefined;
        exists?: undefined;
    };
    error?: undefined;
} | {
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        key: string;
        exists: boolean;
    };
    error?: undefined;
} | {
    success: boolean;
    text: string;
    error: string;
    data: {
        actionName: string;
        action: string;
        key?: undefined;
        exists?: undefined;
    };
}>;
//# sourceMappingURL=request-secret.d.ts.map