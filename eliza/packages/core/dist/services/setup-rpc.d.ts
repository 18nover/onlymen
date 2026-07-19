/**
 * Setup RPC Methods
 *
 * Provides RPC methods for native apps (macOS, iOS) to interact with
 * setup programmatically.
 *
 * Methods:
 * - setup.start: Start setup, returns initial state
 * - setup.step: Advance to next step with input
 * - setup.getState: Get current state
 * - setup.cancel: Abort setup
 */
import type { UUID } from "../types/primitives.js";
import { type SerializedSetupState, type SetupContext, type SetupInput, type SetupProgress, SetupStep } from "../types/setup.js";
/**
 * RPC method names.
 */
export declare const SETUP_RPC_METHODS: {
    readonly START: "setup.start";
    readonly STEP: "setup.step";
    readonly GET_STATE: "setup.getState";
    readonly CANCEL: "setup.cancel";
    readonly GO_BACK: "setup.goBack";
    readonly SKIP: "setup.skip";
};
/**
 * Parameters for setup.start RPC.
 */
export interface SetupStartParams {
    /** World ID for context */
    worldId?: UUID;
    /** User ID being onboarded */
    userId?: UUID;
    /** Platform identifier */
    platform?: string;
    /** Restore from existing state if available */
    restoreState?: SerializedSetupState;
}
/**
 * Result of setup.start RPC.
 */
export interface SetupStartResult {
    /** Whether start was successful */
    success: boolean;
    /** Session ID for subsequent calls */
    sessionId: string;
    /** Initial state */
    state: SetupRpcState;
    /** Error message if failed */
    error?: string;
}
/**
 * Parameters for setup.step RPC.
 */
export interface SetupStepParams {
    /** Session ID from setup.start */
    sessionId: string;
    /** Input for the current step */
    input: SetupInput;
}
/**
 * Result of setup.step RPC.
 */
export interface SetupStepResult {
    /** Whether step was successful */
    success: boolean;
    /** Updated state after step */
    state: SetupRpcState;
    /** Error if step failed */
    error?: string;
    /** Message for the user */
    message?: string;
}
/**
 * Parameters for setup.getState RPC.
 */
export interface SetupGetStateParams {
    /** Session ID from setup.start */
    sessionId: string;
}
/**
 * Result of setup.getState RPC.
 */
export interface SetupGetStateResult {
    /** Whether request was successful */
    success: boolean;
    /** Current state */
    state?: SetupRpcState;
    /** Error if request failed */
    error?: string;
}
/**
 * Parameters for setup.cancel RPC.
 */
export interface SetupCancelParams {
    /** Session ID from setup.start */
    sessionId: string;
    /** Whether to save partial progress */
    saveProgress?: boolean;
}
/**
 * Result of setup.cancel RPC.
 */
export interface SetupCancelResult {
    /** Whether cancel was successful */
    success: boolean;
    /** Serialized state if saveProgress was true */
    savedState?: SerializedSetupState;
    /** Error if cancel failed */
    error?: string;
}
/**
 * Parameters for setup.goBack RPC.
 */
export interface SetupGoBackParams {
    /** Session ID from setup.start */
    sessionId: string;
    /** Target step to go back to (optional, defaults to previous) */
    targetStep?: SetupStep;
}
/**
 * Parameters for setup.skip RPC.
 */
export interface SetupSkipParams {
    /** Session ID from setup.start */
    sessionId: string;
}
/**
 * Setup state for RPC responses.
 */
export interface SetupRpcState {
    /** Current step */
    currentStep: SetupStep;
    /** Step label for display */
    currentStepLabel: string;
    /** Step description */
    currentStepDescription: string;
    /** Progress information */
    progress: SetupProgress;
    /** Whether setup is complete */
    isComplete: boolean;
    /** Full context */
    context: SetupContext;
    /** Available actions for current step */
    availableActions: string[];
}
/**
 * Callback for setup state changes (for WebSocket events).
 */
export type SetupRpcStateChangeCallback = (sessionId: string, oldState: SetupRpcState, newState: SetupRpcState) => void;
/**
 * Setup RPC Service
 *
 * Manages setup sessions and handles RPC calls from native apps.
 */
export declare class SetupRPCService {
    /** Active setup sessions keyed by session ID */
    private sessions;
    /** State change callbacks for WebSocket notifications */
    private stateChangeCallbacks;
    /**
     * Register a callback for state changes.
     */
    onStateChange(callback: SetupRpcStateChangeCallback): () => void;
    /**
     * Notify all callbacks of a state change.
     */
    private notifyStateChange;
    /**
     * Convert context to setup state.
     */
    private toSetupRpcState;
    /**
     * Handle setup.start RPC.
     */
    start(params: SetupStartParams): Promise<SetupStartResult>;
    /**
     * Handle setup.step RPC.
     */
    step(params: SetupStepParams): Promise<SetupStepResult>;
    /**
     * Handle setup.getState RPC.
     */
    getState(params: SetupGetStateParams): SetupGetStateResult;
    /**
     * Handle setup.cancel RPC.
     */
    cancel(params: SetupCancelParams): SetupCancelResult;
    /**
     * Handle setup.goBack RPC.
     */
    goBack(params: SetupGoBackParams): SetupStepResult;
    /**
     * Handle setup.skip RPC.
     */
    skip(params: SetupSkipParams): Promise<SetupStepResult>;
    /**
     * Get all active session IDs.
     */
    getActiveSessions(): string[];
    /**
     * Check if a session exists.
     */
    hasSession(sessionId: string): boolean;
    /**
     * Clean up all sessions.
     */
    dispose(): void;
}
/**
 * Create a new SetupRPCService instance.
 */
export declare function createSetupRPCService(): SetupRPCService;
/**
 * Helper to create RPC method handlers for integration with existing RPC systems.
 */
export declare function createSetupRPCHandlers(service: SetupRPCService): {
    "setup.start": (params: SetupStartParams) => Promise<SetupStartResult>;
    "setup.step": (params: SetupStepParams) => Promise<SetupStepResult>;
    "setup.getState": (params: SetupGetStateParams) => SetupGetStateResult;
    "setup.cancel": (params: SetupCancelParams) => SetupCancelResult;
    "setup.goBack": (params: SetupGoBackParams) => SetupStepResult;
    "setup.skip": (params: SetupSkipParams) => Promise<SetupStepResult>;
};
//# sourceMappingURL=setup-rpc.d.ts.map