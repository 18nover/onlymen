/**
 * Channel Utilities for elizaOS
 *
 * Generic cross-platform utilities for messaging channels.
 * These utilities are platform-agnostic and can be used by any channel plugin.
 *
 * @module utils/channel-utils
 */
/**
 * Normalized chat type - the canonical representation of chat types across platforms.
 */
export type NormalizedChatType = "direct" | "group" | "channel";
/**
 * Normalize a raw chat type string to a canonical form.
 * Handles various platform-specific naming conventions.
 *
 * @param raw - The raw chat type string from the platform
 * @returns Normalized chat type
 */
export declare function normalizeChatType(raw?: string): NormalizedChatType;
/**
 * Parameters for resolving mention gating.
 */
export type MentionGateParams = {
    /** Whether the agent requires an @mention to respond */
    requireMention: boolean;
    /** Whether the platform can detect mentions */
    canDetectMention: boolean;
    /** Whether the agent was explicitly mentioned */
    wasMentioned: boolean;
    /** Whether there's an implicit mention (e.g., reply to agent) */
    implicitMention?: boolean;
    /** Whether to bypass mention requirements */
    shouldBypassMention?: boolean;
};
/**
 * Result of mention gating resolution.
 */
export type MentionGateResult = {
    /** Whether the agent should consider itself mentioned */
    effectiveWasMentioned: boolean;
    /** Whether to skip processing this message */
    shouldSkip: boolean;
};
/**
 * Extended parameters for mention gating with bypass logic.
 */
export type MentionGateWithBypassParams = {
    isGroup: boolean;
    requireMention: boolean;
    canDetectMention: boolean;
    wasMentioned: boolean;
    implicitMention?: boolean;
    hasAnyMention?: boolean;
    allowTextCommands: boolean;
    hasControlCommand: boolean;
    commandAuthorized: boolean;
};
/**
 * Extended result with bypass information.
 */
export type MentionGateWithBypassResult = MentionGateResult & {
    shouldBypassMention: boolean;
};
/**
 * Resolve whether to process a message based on mention requirements.
 *
 * @param params - Mention gating parameters
 * @returns Gating result indicating if message should be processed
 */
export declare function resolveMentionGating(params: MentionGateParams): MentionGateResult;
/**
 * Resolve mention gating with command bypass logic.
 * Allows authorized control commands to bypass mention requirements.
 *
 * @param params - Extended mention gating parameters
 * @returns Extended gating result with bypass information
 */
export declare function resolveMentionGatingWithBypass(params: MentionGateWithBypassParams): MentionGateWithBypassResult;
/**
 * Callbacks for managing typing indicators.
 */
export type TypingCallbacks = {
    /** Called when a reply starts (show typing indicator) */
    onReplyStart: () => Promise<void>;
    /** Called when idle (hide typing indicator) */
    onIdle?: () => void;
};
/**
 * Parameters for creating typing callbacks.
 */
export type TypingCallbackParams = {
    /** Function to start typing indicator */
    start: () => Promise<void>;
    /** Function to stop typing indicator */
    stop?: () => Promise<void>;
    /** Error handler for start failures */
    onStartError: (err: unknown) => void;
    /** Error handler for stop failures */
    onStopError?: (err: unknown) => void;
};
/**
 * Create typing indicator callbacks with error handling.
 *
 * @param params - Typing callback parameters
 * @returns Callbacks for managing typing state
 */
export declare function createTypingCallbacks(params: TypingCallbackParams): TypingCallbacks;
/**
 * Scope for acknowledgment reactions (e.g., "👀" seen indicators).
 */
export type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
/**
 * WhatsApp-specific acknowledgment reaction mode.
 */
export type WhatsAppAckReactionMode = "always" | "mentions" | "never";
/**
 * Parameters for determining if an ack reaction should be sent.
 */
export type AckReactionGateParams = {
    scope: AckReactionScope | undefined;
    isDirect: boolean;
    isGroup: boolean;
    isMentionableGroup: boolean;
    requireMention: boolean;
    canDetectMention: boolean;
    effectiveWasMentioned: boolean;
    shouldBypassMention?: boolean;
};
/**
 * Determine if an acknowledgment reaction should be sent.
 *
 * @param params - Ack reaction parameters
 * @returns Whether to send the ack reaction
 */
export declare function shouldAckReaction(params: AckReactionGateParams): boolean;
/**
 * WhatsApp-specific ack reaction logic.
 *
 * @param params - WhatsApp ack reaction parameters
 * @returns Whether to send the ack reaction
 */
export declare function shouldAckReactionForWhatsApp(params: {
    emoji: string;
    isDirect: boolean;
    isGroup: boolean;
    directEnabled: boolean;
    groupMode: WhatsAppAckReactionMode;
    wasMentioned: boolean;
    groupActivated: boolean;
}): boolean;
/**
 * Parameters for removing ack reaction after reply.
 */
export type RemoveAckReactionParams = {
    removeAfterReply: boolean;
    ackReactionPromise: Promise<boolean> | null;
    ackReactionValue: string | null;
    remove: () => Promise<void>;
    onError?: (err: unknown) => void;
};
/**
 * Remove acknowledgment reaction after reply is sent.
 *
 * @param params - Parameters for removal
 */
export declare function removeAckReactionAfterReply(params: RemoveAckReactionParams): void;
/**
 * Parameters for resolving a sender's display label.
 */
export type SenderLabelParams = {
    name?: string;
    username?: string;
    tag?: string;
    e164?: string;
    id?: string;
};
/**
 * Resolve a display label for a message sender.
 * Prefers name, then username, then tag, with ID appended if different.
 *
 * @param params - Sender identification parameters
 * @returns Display label or null if no information available
 */
export declare function resolveSenderLabel(params: SenderLabelParams): string | null;
/**
 * List all possible sender label candidates.
 *
 * @param params - Sender identification parameters
 * @returns Array of possible labels
 */
export declare function listSenderLabelCandidates(params: SenderLabelParams): string[];
/**
 * Source type for location data.
 */
export type LocationSource = "pin" | "place" | "live";
/**
 * Normalized location data structure.
 */
export type NormalizedLocation = {
    latitude: number;
    longitude: number;
    accuracy?: number;
    name?: string;
    address?: string;
    isLive?: boolean;
    source?: LocationSource;
    caption?: string;
};
/**
 * Format a location as human-readable text with emoji indicators.
 *
 * @param location - Normalized location data
 * @returns Formatted location string
 */
export declare function formatLocationText(location: NormalizedLocation): string;
/**
 * Location context fields for message processing.
 */
export type LocationContext = {
    LocationLat: number;
    LocationLon: number;
    LocationAccuracy?: number;
    LocationName?: string;
    LocationAddress?: string;
    LocationSource: LocationSource;
    LocationIsLive: boolean;
};
/**
 * Convert a normalized location to context fields.
 *
 * @param location - Normalized location data
 * @returns Location context fields
 */
export declare function toLocationContext(location: NormalizedLocation): LocationContext;
/**
 * Log function signature.
 */
export type LogFn = (message: string) => void;
/**
 * Log when an inbound message is dropped.
 *
 * @param params - Log parameters
 */
export declare function logInboundDrop(params: {
    log: LogFn;
    channel: string;
    reason: string;
    target?: string;
}): void;
/**
 * Log a typing indicator failure.
 *
 * @param params - Log parameters
 */
export declare function logTypingFailure(params: {
    log: LogFn;
    channel: string;
    target?: string;
    action?: "start" | "stop";
    error: unknown;
}): void;
/**
 * Log an acknowledgment cleanup failure.
 *
 * @param params - Log parameters
 */
export declare function logAckFailure(params: {
    log: LogFn;
    channel: string;
    target?: string;
    error: unknown;
}): void;
//# sourceMappingURL=channel-utils.d.ts.map