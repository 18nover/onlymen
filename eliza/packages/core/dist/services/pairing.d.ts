/**
 * PairingService - Manages secure DM access via pairing codes.
 *
 * This service handles the pairing workflow for messaging channels:
 * 1. Unknown users send a DM and receive a pairing code
 * 2. Bot owner approves the code via CLI or API
 * 3. User is added to the allowlist and can now send DMs
 */
import { type ApprovePairingParams, type ApprovePairingResult, type PairingAllowlistEntry, type PairingChannel, type PairingConfig, type PairingRequest, type UpsertPairingRequestParams, type UpsertPairingRequestResult } from "../types/pairing.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
/**
 * PairingService handles secure DM pairing for messaging channels.
 *
 * When a user sends a DM to a bot with dmPolicy="pairing":
 * 1. If not in allowlist, a pairing request is created with a code
 * 2. The code is sent back to the user
 * 3. The bot owner approves the code via CLI/API
 * 4. The user is added to the allowlist
 */
export declare class PairingService extends Service {
    static serviceType: "pairing";
    capabilityDescription: string;
    private pairingConfig;
    constructor(runtime: IAgentRuntime, config?: PairingConfig);
    /**
     * Start the PairingService with the given runtime.
     */
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Stop the PairingService.
     */
    stop(): Promise<void>;
    /**
     * Generate a random pairing code.
     * Uses a human-friendly alphabet that excludes ambiguous characters.
     */
    private generateCode;
    /**
     * Generate a unique code that doesn't conflict with existing codes.
     */
    private generateUniqueCode;
    /**
     * Check if a pairing request is expired.
     */
    private isExpired;
    /**
     * List all pending pairing requests for a channel.
     * Expired requests are automatically filtered out.
     */
    listPendingRequests(channel: PairingChannel): Promise<PairingRequest[]>;
    /**
     * Create or update a pairing request for a sender.
     * If the sender already has a pending request, returns the existing code.
     * If too many pending requests exist, returns empty code.
     */
    upsertRequest(params: UpsertPairingRequestParams): Promise<UpsertPairingRequestResult>;
    /**
     * Approve a pairing code and add the sender to the allowlist.
     * Returns null if the code is not found or expired.
     */
    approveCode(params: ApprovePairingParams): Promise<ApprovePairingResult | null>;
    /**
     * Get the allowlist for a channel.
     */
    getAllowlist(channel: PairingChannel): Promise<PairingAllowlistEntry[]>;
    /**
     * Check if a sender is in the allowlist.
     */
    isAllowed(channel: PairingChannel, senderId: string): Promise<boolean>;
    /**
     * Add a sender directly to the allowlist (bypass pairing).
     */
    addToAllowlist(channel: PairingChannel, senderId: string, metadata?: Record<string, string>): Promise<PairingAllowlistEntry>;
    /**
     * Remove a sender from the allowlist.
     */
    removeFromAllowlist(channel: PairingChannel, senderId: string): Promise<boolean>;
}
//# sourceMappingURL=pairing.d.ts.map