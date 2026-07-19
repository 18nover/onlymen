/**
 * Check Secret Handler
 *
 * Atomic handler: report which of a list of secret keys exist. Returns
 * parallel arrays — never returns values. Invoked by the `SECRETS` umbrella
 * when `action=check`.
 */
import type { HandlerCallback, HandlerOptions, IAgentRuntime, Memory, State } from "../../../types/index.js";
export declare function checkSecretHandler(runtime: IAgentRuntime, message: Memory, _state?: State, options?: HandlerOptions, callback?: HandlerCallback): Promise<{
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        present?: undefined;
        missing?: undefined;
    };
} | {
    success: boolean;
    text: string;
    data: {
        actionName: string;
        action: string;
        present: boolean[];
        missing: string[];
    };
}>;
//# sourceMappingURL=check-secret.d.ts.map