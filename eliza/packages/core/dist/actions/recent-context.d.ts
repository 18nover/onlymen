import type { IAgentRuntime, Memory, State } from "../types/index.js";
export declare function recentConversationTextsFromState(state: State | undefined, limit: number): string[];
export declare function recentConversationTexts(args: {
    runtime: IAgentRuntime;
    message?: Memory;
    state: State | undefined;
    limit: number;
}): Promise<string[]>;
//# sourceMappingURL=recent-context.d.ts.map