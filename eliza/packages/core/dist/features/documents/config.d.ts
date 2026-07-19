import type { IAgentRuntime } from "../../types/index.js";
import { type ModelConfig, type ProviderRateLimits } from "./types.js";
export declare function validateModelConfig(runtime?: IAgentRuntime): ModelConfig;
export declare function getProviderRateLimits(runtime?: IAgentRuntime): Promise<ProviderRateLimits>;
//# sourceMappingURL=config.d.ts.map