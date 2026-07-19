/**
 * SendPolicy hook — lets a host runtime gate outbound sends behind owner
 * approval (or any other policy). Triage's MESSAGE consults the registered
 * policy before invoking the adapter.
 *
 * Registration uses a module-scoped WeakMap keyed by runtime instance so the
 * hook lifetime tracks the runtime and we don't leak across tests. We do not
 * use runtime.registerService here because SendPolicy is not a long-lived
 * background Service — it's a per-runtime hook with two methods.
 */
import type { IAgentRuntime } from "../../../types/index.js";
import type { DraftRequest } from "./types.js";
export interface SendPolicy {
    /** Decide whether this draft requires explicit owner approval before sending. */
    shouldRequireApproval(runtime: IAgentRuntime, draft: DraftRequest): Promise<boolean>;
    /** Enqueue an approval request that will execute `executor` once approved. */
    enqueueApproval(runtime: IAgentRuntime, draft: DraftRequest, executor: () => Promise<{
        externalId: string;
    }>): Promise<{
        requestId: string;
        preview: string;
    }>;
}
export declare function registerSendPolicy(runtime: IAgentRuntime, policy: SendPolicy): void;
export declare function getSendPolicy(runtime: IAgentRuntime): SendPolicy | null;
export declare function __resetSendPolicyForTests(runtime: IAgentRuntime): void;
//# sourceMappingURL=send-policy.d.ts.map