/**
 * Enumerates the axes along which a LifeOps connector can be degraded
 * (missing-scope, rate-limited, disconnected, auth-expired, …). Shared vocabulary
 * for reporting and reacting to connector health across the personal-assistant surface.
 */
export declare const LIFEOPS_CONNECTOR_DEGRADATION_AXES: readonly ["missing-scope", "rate-limited", "disconnected", "auth-expired", "session-revoked", "delivery-degraded", "helper-disconnected", "retry-idempotent", "hold-expired", "transport-offline", "blocked-resume"];
export type LifeOpsConnectorDegradationAxis = (typeof LIFEOPS_CONNECTOR_DEGRADATION_AXES)[number];
export interface LifeOpsConnectorDegradation {
    axis: LifeOpsConnectorDegradationAxis;
    code: string;
    message: string;
    retryable: boolean;
}
//# sourceMappingURL=lifeops-connector-degradation.d.ts.map