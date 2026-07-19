/**
 * Connector-account service: the runtime-side registry and policy engine for
 * external-account connectors (chat/social/OAuth providers). The
 * `ConnectorAccountManager` Service holds registered `ConnectorAccountProvider`s,
 * brokers their OAuth start/complete flows, and persists accounts + flow state
 * through a `ConnectorAccountStorage` backend — the in-memory fallback, or the
 * `DatabaseConnectorAccountStorage` bridge when a compatible database adapter is
 * installed on the runtime.
 *
 * `evaluateConnectorAccountPolicies` gates actions that carry a
 * `connectorAccountPolicy`: an action runs only when a stored or
 * provider-listed account satisfies the required status, role, purpose, and
 * access-gate. Role strings collapse to the canonical OWNER / AGENT / TEAM
 * triad (`types/connector-account-policy`); privacy levels live alongside in
 * `privacy.ts`.
 *
 * OAuth PKCE code verifiers are never persisted — they are held in a
 * process-local map and referenced by an opaque `codeVerifierRef` written to
 * flow metadata, so stored rows never carry the raw secret.
 */
import type { Action, ActionParameters } from "../types/components.js";
import type { ConnectorAccountAccessGate, ConnectorAccountPolicy, ConnectorAccountPurpose, ConnectorAccountRole, ConnectorAccountStatus } from "../types/connector-account-policy.js";
import type { Memory } from "../types/memory.js";
import type { Metadata } from "../types/primitives.js";
import type { IAgentRuntime, MessageConnectorRegistration, PostConnectorRegistration } from "../types/runtime.js";
import { Service } from "../types/service.js";
export type { ConnectorAccountAccessGate, ConnectorAccountPolicy, ConnectorAccountPurpose, ConnectorAccountRole, ConnectorAccountStatus, } from "../types/connector-account-policy.js";
export declare const CONNECTOR_ACCOUNT_SERVICE_TYPE = "connector_account";
export declare const CONNECTOR_ACCOUNT_STORAGE_SERVICE_TYPE = "connector_account_storage";
export type ConnectorOAuthFlowStatus = "pending" | "completed" | "failed" | "cancelled";
export interface ConnectorAccount {
    id: string;
    provider: string;
    label?: string;
    role: ConnectorAccountRole;
    purpose: ConnectorAccountPurpose[];
    accessGate: ConnectorAccountAccessGate;
    status: ConnectorAccountStatus;
    externalId?: string;
    displayHandle?: string;
    ownerBindingId?: string;
    ownerIdentityId?: string;
    createdAt: number;
    updatedAt: number;
    metadata?: Metadata;
}
export interface ConnectorAccountPatch {
    label?: string;
    role?: ConnectorAccountRole;
    purpose?: ConnectorAccountPurpose | ConnectorAccountPurpose[];
    accessGate?: ConnectorAccountAccessGate;
    status?: ConnectorAccountStatus;
    externalId?: string | null;
    displayHandle?: string | null;
    ownerBindingId?: string | null;
    ownerIdentityId?: string | null;
    metadata?: Metadata;
}
export interface ConnectorOAuthFlow {
    id: string;
    provider: string;
    state: string;
    status: ConnectorOAuthFlowStatus;
    accountId?: string;
    authUrl?: string;
    error?: string;
    redirectUri?: string;
    codeVerifier?: string;
    createdAt: number;
    updatedAt: number;
    expiresAt?: number;
    metadata?: Metadata;
}
export interface ConnectorOAuthStartRequest {
    provider: string;
    flow: ConnectorOAuthFlow;
    redirectUri?: string;
    accountId?: string;
    label?: string;
    scopes?: string[];
    metadata?: Metadata;
}
export interface ConnectorOAuthStartResult {
    authUrl: string;
    expiresAt?: number;
    codeVerifier?: string;
    metadata?: Metadata;
}
export interface ConnectorOAuthCallbackRequest {
    provider: string;
    flow: ConnectorOAuthFlow;
    code?: string;
    error?: string;
    errorDescription?: string;
    query: Record<string, string>;
    body?: Record<string, unknown>;
}
export interface ConnectorOAuthCallbackResult {
    account?: ConnectorAccount | ConnectorAccountPatch;
    flow?: Partial<ConnectorOAuthFlow>;
    redirectUrl?: string;
    metadata?: Metadata;
}
export interface ConnectorAccountProvider {
    provider: string;
    label?: string;
    messageConnector?: MessageConnectorRegistration;
    postConnector?: PostConnectorRegistration;
    listAccounts?: (manager: ConnectorAccountManager) => Promise<ConnectorAccount[]> | ConnectorAccount[];
    createAccount?: (input: ConnectorAccountPatch, manager: ConnectorAccountManager) => Promise<ConnectorAccount | ConnectorAccountPatch>;
    patchAccount?: (accountId: string, patch: ConnectorAccountPatch, manager: ConnectorAccountManager) => Promise<ConnectorAccount | ConnectorAccountPatch>;
    deleteAccount?: (accountId: string, manager: ConnectorAccountManager) => Promise<void>;
    startOAuth?: (request: ConnectorOAuthStartRequest, manager: ConnectorAccountManager) => Promise<ConnectorOAuthStartResult>;
    completeOAuth?: (request: ConnectorOAuthCallbackRequest, manager: ConnectorAccountManager) => Promise<ConnectorOAuthCallbackResult>;
}
export interface ConnectorAccountProviderRegistrationResult {
    provider: string;
    messageConnectorRegistered: boolean;
    messageConnectorSkipped: boolean;
    postConnectorRegistered: boolean;
    postConnectorSkipped: boolean;
}
export interface ConnectorOwnerBindingLookup {
    connector: string;
    externalId: string;
    instanceId?: string;
}
export interface ConnectorOwnerBindingRecord {
    id: string;
    identityId: string;
    connector: string;
    externalId: string;
    displayHandle: string;
    instanceId: string;
    verifiedAt: number;
}
export interface ConnectorAccountStorage {
    listAccounts(provider?: string): Promise<ConnectorAccount[]>;
    getAccount(provider: string, accountId: string): Promise<ConnectorAccount | null>;
    upsertAccount(account: ConnectorAccount): Promise<ConnectorAccount>;
    deleteAccount(provider: string, accountId: string): Promise<boolean>;
    createOAuthFlow(flow: ConnectorOAuthFlow): Promise<ConnectorOAuthFlow>;
    getOAuthFlow(provider: string, flowIdOrState: string): Promise<ConnectorOAuthFlow | null>;
    consumeOAuthFlow(provider: string, state: string, consumedBy?: string): Promise<ConnectorOAuthFlow | null>;
    updateOAuthFlow(provider: string, flowIdOrState: string, patch: Partial<ConnectorOAuthFlow>): Promise<ConnectorOAuthFlow | null>;
    deleteOAuthFlow(provider: string, flowIdOrState: string): Promise<boolean>;
    findOwnerBinding?(lookup: ConnectorOwnerBindingLookup): Promise<ConnectorOwnerBindingRecord | null>;
}
export interface ConnectorAccountPolicyContext {
    message?: Memory;
    parameters?: ActionParameters | Record<string, unknown>;
    accountId?: string;
    purpose?: ConnectorAccountPurpose;
}
export interface ConnectorAccountPolicyEvaluation {
    allowed: boolean;
    reason?: string;
    provider?: string;
    account?: ConnectorAccount;
    policy?: ConnectorAccountPolicy;
}
export declare function isConnectorAccountStorage(value: unknown): value is ConnectorAccountStorage;
/**
 * In-memory fallback for tests and hosts without a durable connector-account
 * storage service. Production runtimes resolve durable storage through an
 * installed ConnectorAccountStorage service or the database adapter bridge.
 */
export declare class InMemoryConnectorAccountStorage implements ConnectorAccountStorage {
    private accounts;
    private flows;
    private consumedFlows;
    private ownerBindings;
    listAccounts(provider?: string): Promise<ConnectorAccount[]>;
    getAccount(provider: string, accountId: string): Promise<ConnectorAccount | null>;
    upsertAccount(account: ConnectorAccount): Promise<ConnectorAccount>;
    deleteAccount(provider: string, accountId: string): Promise<boolean>;
    createOAuthFlow(flow: ConnectorOAuthFlow): Promise<ConnectorOAuthFlow>;
    getOAuthFlow(provider: string, flowIdOrState: string): Promise<ConnectorOAuthFlow | null>;
    updateOAuthFlow(provider: string, flowIdOrState: string, patch: Partial<ConnectorOAuthFlow>): Promise<ConnectorOAuthFlow | null>;
    consumeOAuthFlow(provider: string, state: string, _consumedBy?: string): Promise<ConnectorOAuthFlow | null>;
    deleteOAuthFlow(provider: string, flowIdOrState: string): Promise<boolean>;
    findOwnerBinding(lookup: ConnectorOwnerBindingLookup): Promise<ConnectorOwnerBindingRecord | null>;
    upsertOwnerBindingForTest(binding: ConnectorOwnerBindingRecord): void;
}
export declare class ConnectorAccountManager extends Service {
    static serviceType: string;
    capabilityDescription: string;
    private providers;
    private storage;
    constructor(runtime?: IAgentRuntime, storage?: ConnectorAccountStorage);
    static start(runtime: IAgentRuntime): Promise<ConnectorAccountManager>;
    stop(): Promise<void>;
    getStorage(): ConnectorAccountStorage;
    setStorage(storage: ConnectorAccountStorage): void;
    registerProvider(provider: ConnectorAccountProvider): ConnectorAccountProviderRegistrationResult;
    unregisterProvider(provider: string): boolean;
    getProvider(provider: string): ConnectorAccountProvider | undefined;
    listProviders(): ConnectorAccountProvider[];
    listAccounts(provider: string): Promise<ConnectorAccount[]>;
    getAccount(provider: string, accountId: string): Promise<ConnectorAccount | null>;
    upsertAccount(provider: string, input: ConnectorAccount | ConnectorAccountPatch, accountId?: string): Promise<ConnectorAccount>;
    createAccount(provider: string, input: ConnectorAccountPatch): Promise<ConnectorAccount>;
    patchAccount(provider: string, accountId: string, patch: ConnectorAccountPatch): Promise<ConnectorAccount | null>;
    deleteAccount(provider: string, accountId: string): Promise<boolean>;
    startOAuth(provider: string, input?: {
        redirectUri?: string;
        accountId?: string;
        label?: string;
        scopes?: string[];
        metadata?: Metadata;
    }): Promise<ConnectorOAuthFlow>;
    getOAuthFlow(provider: string, flowIdOrState: string): Promise<ConnectorOAuthFlow | null>;
    completeOAuth(provider: string, input: {
        state: string;
        code?: string;
        error?: string;
        errorDescription?: string;
        query?: Record<string, string>;
        body?: Record<string, unknown>;
    }): Promise<{
        flow: ConnectorOAuthFlow;
        account?: ConnectorAccount;
        redirectUrl?: string;
    }>;
    evaluatePolicy(policy: ConnectorAccountPolicy, context?: ConnectorAccountPolicyContext): Promise<ConnectorAccountPolicyEvaluation>;
    private accountPolicyFailure;
    private resolveOwnerBindingForAccount;
}
export declare function getConnectorAccountManager(runtime?: IAgentRuntime | null, storage?: ConnectorAccountStorage): ConnectorAccountManager;
export declare function evaluateConnectorAccountPolicies(runtime: IAgentRuntime, action: Action, context?: ConnectorAccountPolicyContext): Promise<ConnectorAccountPolicyEvaluation>;
export declare function getActionConnectorAccountPolicies(action: Action): ConnectorAccountPolicy[];
export declare function getUntrustedMessageMetadataAccountId(message: Memory | undefined): string | undefined;
//# sourceMappingURL=account-manager.d.ts.map