export type SensitiveRequestKind = "secret" | "payment" | "oauth" | "private_info";
export type SensitiveRequestStatus = "pending" | "fulfilled" | "failed" | "canceled" | "expired";
export type SensitiveRequestPaymentContext = "verified_payer" | "any_payer";
export type SensitiveRequestActorPolicy = "owner_only" | "owner_or_linked_identity" | "organization_admin" | "verified_payer" | "any_payer";
export type SensitiveRequestSourceContext = "owner_app_private" | "dm" | "public" | "api" | "unknown";
export type SensitiveRequestDeliveryMode = "inline_owner_app" | "private_dm" | "cloud_authenticated_link" | "tunnel_authenticated_link" | "public_link" | "dm_or_owner_app_instruction";
export interface SensitiveRequestEnvironment {
    cloud?: {
        available: boolean;
        baseUrl?: string;
    };
    tunnel?: {
        available: boolean;
        url?: string;
        /**
         * Tunnel reachability is not an auth boundary. This must be true only when
         * the tunneled sensitive-request route enforces owner/session auth.
         */
        authenticated: boolean;
    };
    dm?: {
        available: boolean;
    };
    ownerApp?: {
        privateChat: boolean;
    };
}
export interface SensitiveRequestPolicyInput {
    kind: SensitiveRequestKind;
    channelType?: string;
    source?: SensitiveRequestSourceContext;
    paymentContext?: SensitiveRequestPaymentContext;
    environment?: SensitiveRequestEnvironment;
}
export interface SensitiveRequestPolicy {
    actor: SensitiveRequestActorPolicy;
    requirePrivateDelivery: boolean;
    requireAuthenticatedLink: boolean;
    allowInlineOwnerAppEntry: boolean;
    allowPublicLink: boolean;
    allowDmFallback: boolean;
    allowTunnelLink: boolean;
    allowCloudLink: boolean;
}
export interface SensitiveRequestSecretTarget {
    kind: "secret";
    key: string;
    scope?: "organization" | "app" | "agent" | "global" | (string & {});
    appId?: string;
    validation?: Record<string, unknown>;
    /**
     * How the value should be collected. Defaults to `secret` (masked text).
     * `image`/`file` let a secret be captured as an upload — e.g. photograph a
     * 2FA seed or scan a recovery QR — delivered as a base64 data URL through the
     * same submit path. Additive; omit for a normal typed secret. (#8910)
     */
    input?: "secret" | "text" | "image" | "file";
    /** For `input: "image" | "file"` — accepted MIME types (maps to the file input `accept`). */
    mimeTypes?: string[];
    /** For `input: "image" | "file"` — max upload size in bytes. */
    maxBytes?: number;
}
export interface SensitiveRequestPrivateInfoField {
    name: string;
    label?: string;
    required?: boolean;
    classification?: string;
}
export interface SensitiveRequestPrivateInfoTarget {
    kind: "private_info";
    fields: SensitiveRequestPrivateInfoField[];
    storage?: {
        kind: string;
        key?: string;
    };
}
export interface SensitiveRequestPaymentTarget {
    kind: "payment";
    [key: string]: unknown;
}
export interface SensitiveRequestOauthTarget {
    kind: "oauth";
    [key: string]: unknown;
}
/**
 * Tightened OAuth target shape used by the owner-app OAuth inline adapter
 * and the chat OAuthRequestPanel widget. Carries the canonical fields the
 * widget needs to render the "Connect <provider>" button and open the
 * consent URL in a popup. The legacy {@link SensitiveRequestOauthTarget}
 * (lowercase `a`) stays around as a permissive umbrella for callers that
 * pre-date this shape; new code should prefer this interface.
 */
export interface SensitiveRequestOAuthTarget {
    kind: "oauth";
    /** Canonical provider id, e.g. "github", "google". */
    provider: string;
    /** OAuth scopes the consent screen will request. */
    scopes?: string[];
    /** The consent URL the widget opens in a popup. */
    authorizationUrl: string;
    /** Human-readable provider label shown in the "Connect <label>" button. */
    label?: string;
}
export type SensitiveRequestTarget = SensitiveRequestSecretTarget | SensitiveRequestPrivateInfoTarget | SensitiveRequestPaymentTarget | SensitiveRequestOauthTarget | SensitiveRequestOAuthTarget;
export interface SensitiveRequestCallback {
    kind?: string;
    url?: string;
    roomId?: string;
    channelId?: string;
    [key: string]: unknown;
}
export interface SensitiveRequest {
    id: string;
    kind: SensitiveRequestKind;
    status: SensitiveRequestStatus;
    agentId: string;
    organizationId?: string | null;
    ownerEntityId?: string | null;
    requesterEntityId?: string | null;
    sourceRoomId?: string | null;
    sourceChannelType?: string | null;
    sourcePlatform?: string | null;
    target: SensitiveRequestTarget;
    policy: SensitiveRequestPolicy;
    delivery: SensitiveRequestDeliveryPlan;
    callback?: SensitiveRequestCallback;
    expiresAt: string;
    fulfilledAt?: string | null;
    canceledAt?: string | null;
    expiredAt?: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface SensitiveRequestEvent {
    kind: string;
    requestId: string;
    [key: string]: unknown;
}
export interface SensitiveRequestTunnelRouting {
    credentialScopeId: string;
    childSessionId: string;
    /** Credential keys covered by this tunnel-routed request. Never includes values or scoped tokens. */
    keys?: readonly string[];
}
export interface SensitiveRequestDeliveryPlan {
    kind: SensitiveRequestKind;
    source: SensitiveRequestSourceContext;
    mode: SensitiveRequestDeliveryMode;
    policy: SensitiveRequestPolicy;
    privateRouteRequired: boolean;
    publicLinkAllowed: boolean;
    authenticated: boolean;
    canCollectValueInCurrentChannel: boolean;
    linkBaseUrl?: string;
    /** One-shot sub-agent credential tunnel routing. Scoped tokens and values never transit chat. */
    tunnel?: SensitiveRequestTunnelRouting;
    reason: string;
    instruction: string;
}
export declare function redactSensitiveRequestMetadata(value: unknown): unknown;
export declare function classifySensitiveRequestSource(input: {
    channelType?: string;
    source?: SensitiveRequestSourceContext;
    ownerAppPrivateChat?: boolean;
}): SensitiveRequestSourceContext;
export declare function defaultSensitiveRequestPolicy(kind: SensitiveRequestKind, paymentContext?: SensitiveRequestPaymentContext): SensitiveRequestPolicy;
export declare function resolveSensitiveRequestDelivery(input: SensitiveRequestPolicyInput): SensitiveRequestDeliveryPlan;
export declare function sensitiveRequestEnvironmentFromSettings(settings: {
    cloudApiKey?: unknown;
    cloudEnabled?: unknown;
    cloudBaseUrl?: unknown;
    tunnelUrl?: unknown;
    tunnelActive?: unknown;
    tunnelAuthenticated?: unknown;
    dmAvailable?: unknown;
    ownerAppPrivateChat?: unknown;
}): SensitiveRequestEnvironment;
//# sourceMappingURL=sensitive-request-policy.d.ts.map