/**
 * Service contract and accessors for the network tunnel that exposes a local
 * agent port over the public internet (tailscale / headscale / ngrok). Defines
 * {@link ITunnelService} plus its status and provider types, and resolver
 * helpers that fetch the registered {@link ServiceType.TUNNEL} service off a
 * runtime (validating it exposes the expected shape) or report whether the
 * tunnel slot is still unclaimed. Concrete implementations live in a tunnel
 * plugin.
 */
import type { IAgentRuntime } from "./types/runtime.js";
type TunnelRuntime = Pick<IAgentRuntime, "getService">;
export type TunnelProvider = "tailscale" | "headscale" | "ngrok";
export interface TunnelStatus {
    active: boolean;
    url: string | null;
    port: number | null;
    startedAt: Date | null;
    provider: TunnelProvider;
    /** Optional human label distinguishing backend variants, e.g. "local-cli". */
    backend?: string;
}
export interface ITunnelService {
    startTunnel(port?: number): Promise<string | undefined>;
    stopTunnel(): Promise<void>;
    getUrl(): string | null;
    isActive(): boolean;
    getStatus(): TunnelStatus;
}
export declare function getTunnelService(runtime: TunnelRuntime): ITunnelService | null;
export declare function tunnelSlotIsFree(runtime: TunnelRuntime): boolean;
export {};
//# sourceMappingURL=tunnel-service.d.ts.map