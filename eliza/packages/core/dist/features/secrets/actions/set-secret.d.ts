/**
 * Set Secret Handler
 *
 * Atomic handler: store one or more secrets. Extracts key-value pairs from
 * structured parameters or the user message via LLM. Invoked by the `SECRETS`
 * umbrella when `action=set`.
 */
import { type HandlerCallback, type HandlerOptions, type IAgentRuntime, type Memory, type State } from "../../../types/index.js";
export declare function setSecretHandler(runtime: IAgentRuntime, message: Memory, state?: State, _options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        results?: undefined;
    };
} | {
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        results: {
            key: string;
            success: boolean;
            error?: string;
        }[];
    };
}>;
//# sourceMappingURL=set-secret.d.ts.map