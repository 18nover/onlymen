/**
 * Shared helpers for the connector-backed messaging actions (MESSAGE and POST).
 * Provides loose param coercion for planner-supplied input (textParam,
 * boolParam, numberParam, limitParam — which clamps to 1..100 to bound query
 * cost), connector selection and scoping by source + account
 * (selectConnector / connectorSelectionFailure), target resolution from params,
 * and the refresh* helpers that rewrite an action's description /
 * descriptionCompressed to advertise the currently registered
 * MessageConnector / PostConnector instances.
 */
import type { Action, ActionParameter, ActionResult, HandlerOptions, IAgentRuntime, Memory, MessageConnector, MessageConnectorQueryContext, MessageConnectorTarget, PostConnector, PostConnectorQueryContext, State, TargetInfo, UUID } from "../../../types/index.js";
export type ParamRecord = Record<string, unknown>;
export declare function paramsFromOptions(options: HandlerOptions | undefined): ParamRecord;
export declare function textParam(value: unknown): string | undefined;
export declare function boolParam(value: unknown): boolean | undefined;
export declare function numberParam(value: unknown, fallback?: number): number | undefined;
export declare function sourceParam(params: ParamRecord): string | undefined;
export declare function limitParam(params: ParamRecord, fallback?: number): number;
export declare function isUuidLike(value: string | undefined): value is UUID;
export declare function buildMessageQueryContext(runtime: IAgentRuntime, message: Memory, state: State | undefined, source: string | undefined, target?: TargetInfo): MessageConnectorQueryContext;
export declare function buildPostQueryContext(runtime: IAgentRuntime, message: Memory, state: State | undefined, source: string | undefined): PostConnectorQueryContext;
export declare function getMessageConnectorsWithHook<K extends keyof MessageConnector>(runtime: IAgentRuntime, hook: K): MessageConnector[];
export declare function getPostConnectorsWithHook<K extends keyof PostConnector>(runtime: IAgentRuntime, hook: K): PostConnector[];
export declare function refreshMessageConnectorActionDescription(action: Action, runtime: IAgentRuntime, options: {
    baseDescription: string;
    baseCompressed: string;
    hook?: keyof MessageConnector;
    connectorOnly?: boolean;
}): void;
export declare function refreshPostConnectorActionDescription(action: Action, runtime: IAgentRuntime, options: {
    baseDescription: string;
    baseCompressed: string;
    hook: keyof PostConnector;
    connectorOnly?: boolean;
}): void;
export declare function connectorSelectionFailure(actionName: string, connectors: Array<{
    source: string;
    label: string;
    metadata?: unknown;
}>, source: string | undefined): ActionResult | null;
type SelectableConnector = {
    source: string;
    label: string;
    accountId?: string;
    account?: {
        accountId?: string;
        label?: string;
        name?: string;
    };
    metadata?: unknown;
};
export declare function selectConnector<T extends SelectableConnector>(actionName: string, connectors: T[], source: string | undefined, currentSource?: string, accountId?: string): {
    connector: T;
} | {
    result: ActionResult;
};
export declare function targetLabel(target: TargetInfo): string;
export declare function explicitTargetFromParams(source: string, params: ParamRecord): {
    target?: TargetInfo;
    query?: string;
};
export declare function resolveTargetForConnector(connector: MessageConnector, runtime: IAgentRuntime, message: Memory, state: State | undefined, params: ParamRecord): Promise<{
    target?: TargetInfo;
    result?: ActionResult;
}>;
export declare function targetPreviews(targets: MessageConnectorTarget[]): Array<{
    label?: string;
    kind?: string;
    target: TargetInfo;
}>;
export declare const LOOSE_TARGET_PARAMETERS: ActionParameter[];
export declare const PAGINATION_PARAMETERS: ActionParameter[];
export {};
//# sourceMappingURL=connectorActionUtils.d.ts.map