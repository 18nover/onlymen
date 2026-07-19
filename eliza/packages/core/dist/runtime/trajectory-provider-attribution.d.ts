import type { ChatMessage } from "../types/model.js";
import type { State } from "../types/state.js";
export interface TrajectoryProviderAttribution {
    providerName: string;
    sha256: string;
    tokenCount: number;
    position: number;
    spanStart?: number;
    spanEnd?: number;
}
export declare function sha256Text(text: string): string;
export declare function estimateTrajectoryTextTokens(text: string): number;
export declare function flattenTrajectoryMessages(messages: readonly ChatMessage[] | readonly unknown[] | undefined): string;
export declare function buildProviderAttributionsFromState(args: {
    state?: State;
    prompt?: string;
}): {
    providerOrder: string[];
    providerAttributions: TrajectoryProviderAttribution[];
};
//# sourceMappingURL=trajectory-provider-attribution.d.ts.map