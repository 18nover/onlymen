import type { ResolvedSection } from "../../types/prompt-batcher.js";
import type { IAgentRuntime } from "../../types/runtime.js";
import { type DispatchOutcome, type PromptDispatcherSettings } from "./shared.js";
export declare class PromptDispatcher {
    private readonly settings;
    constructor(settings: PromptDispatcherSettings);
    dispatch(resolved: ResolvedSection[], runtime: IAgentRuntime): Promise<DispatchOutcome>;
    private _buildCallPlans;
    private _splitByModelPreference;
    private _packingTokenLimit;
    private _priorityRank;
    private _buildPrompt;
    private _mergeExecOptions;
}
//# sourceMappingURL=dispatcher.d.ts.map