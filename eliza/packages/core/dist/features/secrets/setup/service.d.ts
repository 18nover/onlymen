/**
 * Setup Service
 *
 * Manages the secrets first-run setup across platforms (Discord, Telegram, etc.)
 * Supports both conversational and form-based collection modes.
 *
 * Integrates with the SetupStateMachine for
 * consistent state management across CLI and conversational interfaces.
 */
import { SetupStateMachine } from "../../../services/setup-state.js";
import type { IAgentRuntime, Memory, ServiceTypeName, SetupContext, SetupStep, UUID, World } from "../../../types/index.js";
import { Service } from "../../../types/index.js";
import { type SetupConfig } from "./config.js";
export declare const SETUP_SERVICE_TYPE: ServiceTypeName;
/**
 * Setup session state.
 */
interface SetupSession {
    worldId: UUID;
    userId: UUID;
    roomId: UUID;
    config: SetupConfig;
    currentSettingKey: string | null;
    startedAt: number;
    lastActivityAt: number;
    platform: "discord" | "telegram" | "other";
    mode: "conversational" | "form" | "hybrid";
    /** state machine instance */
    stateMachine?: SetupStateMachine;
}
/**
 * Setup Service for secrets collection.
 */
export declare class SetupService extends Service {
    static serviceType: ServiceTypeName;
    capabilityDescription: string;
    private secretsService;
    private sessions;
    /** State machine instances keyed by worldId */
    private stateMachines;
    /**
     * Start the service
     */
    static start(runtime: IAgentRuntime): Promise<SetupService>;
    /**
     * Initialize the service
     */
    private initialize;
    stop(): Promise<void>;
    /**
     * Get or create a state machine for a specific world.
     * This ensures state is persisted per world and can resume across restarts.
     */
    getOrCreateStateMachine(worldId: UUID, userId?: UUID, platform?: "discord" | "telegram" | "other"): Promise<SetupStateMachine>;
    /**
     * Persist the state machine state to world metadata.
     */
    private persistStateMachine;
    /**
     * Get the current setup step from the state machine.
     */
    getSetupStep(worldId: UUID): SetupStep | null;
    /**
     * Get the full setup context from the state machine.
     */
    getSetupContext(worldId: UUID): SetupContext | null;
    /**
     * Check if setup is complete via the state machine.
     */
    isStateMachineComplete(worldId: UUID): boolean;
    /**
     * Register platform-specific event handlers.
     */
    private registerEvents;
    /**
     * Initialize setup for a world with the given config.
     */
    initializeSetup(world: World, config: SetupConfig): Promise<void>;
    /**
     * Start setup via DM (Discord).
     */
    startDiscordSetupDM(serverId: string, ownerId: string, worldId: UUID, config: SetupConfig): Promise<void>;
    /**
     * Start setup via deep link (Telegram).
     */
    startTelegramSetup(_world: World, chat: {
        id: string | number;
    }, entities: Array<{
        metadata?: {
            telegram?: {
                id: string;
                username: string;
                adminTitle?: string;
            };
        };
    }>, botUsername: string): Promise<void>;
    /**
     * Start a new setup session.
     */
    startSession(worldId: UUID, userId: UUID, roomId: UUID, config: SetupConfig, platform?: "discord" | "telegram" | "other", mode?: "conversational" | "form" | "hybrid"): Promise<SetupSession>;
    /**
     * Get an active session by room ID.
     */
    getSession(roomId: UUID): SetupSession | null;
    /**
     * Process a user message during setup.
     */
    processMessage(roomId: UUID, message: Memory): Promise<{
        shouldRespond: boolean;
        response?: string;
        updatedKey?: string;
        complete?: boolean;
    }>;
    /**
     * End an setup session.
     */
    endSession(roomId: UUID): void;
    /**
     * Get the first-run status for a world.
     */
    getFirstRunStatus(worldId: UUID): Promise<{
        initialized: boolean;
        complete: boolean;
        configuredCount: number;
        requiredCount: number;
        missingRequired: string[];
    }>;
    /**
     * Generate the SETTINGS provider context for LLM.
     */
    generateSettingsContext(config: SetupConfig, isSetup: boolean, agentName: string): string;
}
export {};
//# sourceMappingURL=service.d.ts.map