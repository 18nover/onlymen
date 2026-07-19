/**
 * Contract and safe accessor for the cloud-auth service that a plugin registers
 * in the runtime's `ServiceType.CLOUD_AUTH` slot. `getCloudAuthService` resolves
 * that slot and duck-types the result, so core-side callers can read the current
 * API key / user / organization without importing the plugin that provides it.
 * A slot holding a service that does not implement the interface resolves to
 * null rather than throwing.
 */
import type { IAgentRuntime } from "./types/runtime.js";
import type { Service } from "./types/service.js";
type CloudAuthRuntime = Pick<IAgentRuntime, "getService">;
export declare const CLOUD_AUTH_SERVICE_TYPE: "CLOUD_AUTH";
export interface CloudAuthCredentials {
    apiKey: string;
    userId?: string;
    organizationId?: string;
    authenticatedAt?: number;
}
export interface ICloudAuthService {
    isAuthenticated(): boolean;
    getCredentials(): CloudAuthCredentials | null;
    getApiKey(): string | undefined;
    getUserId(): string | undefined;
    getOrganizationId(): string | undefined;
}
export declare function getCloudAuthService(runtime: CloudAuthRuntime): (Service & ICloudAuthService) | null;
export {};
//# sourceMappingURL=cloud-auth-service.d.ts.map