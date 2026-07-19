/**
 * Setup State Machine
 *
 * A state machine for setup that can be driven by CLI prompts
 * OR chat messages. Handles step transitions, validation, and persistence.
 */
import type { UUID } from "../types/primitives.js";
import { type SerializedSetupState, type SetupContext, type SetupInput, type SetupProgress, type SetupResult, type SetupSettings, SetupStep, type SetupStepError } from "../types/setup.js";
/**
 * Step handler function type.
 */
type StepHandler<T> = (data: T, context: SetupContext) => Promise<SetupResult>;
/**
 * Configuration options for the state machine.
 */
export interface SetupStateMachineConfig {
    /** Platform identifier (cli, discord, telegram, etc.) */
    platform: string;
    /** Setup mode */
    mode: "cli" | "conversational" | "setup";
    /** World ID for persistence */
    worldId?: UUID;
    /** User ID being onboarded */
    userId?: UUID;
    /** Optional existing context to restore from */
    existingContext?: SetupContext;
    /** Callback when step changes */
    onStepChange?: (oldStep: SetupStep, newStep: SetupStep, context: SetupContext) => void | Promise<void>;
    /** Callback when setup completes */
    onComplete?: (context: SetupContext) => void | Promise<void>;
    /** Callback when an error occurs */
    onError?: (error: SetupStepError, context: SetupContext) => void;
}
/**
 * Setup State Machine.
 *
 * Manages the setup flow across CLI and conversational interfaces.
 * Supports step progression, validation, persistence, and event callbacks.
 *
 * @example
 * ```typescript
 * const machine = new SetupStateMachine({
 *   platform: 'cli',
 *   mode: 'cli',
 *   onComplete: (ctx) => console.log('Setup complete!')
 * });
 *
 * // Advance through steps
 * await machine.advanceStep({ step: SetupStep.WELCOME, data: { acknowledged: true } });
 * await machine.advanceStep({ step: SetupStep.RISK_ACK, data: { accepted: true } });
 * // ...
 * ```
 */
export declare class SetupStateMachine {
    private context;
    private config;
    private stepHandlers;
    constructor(config: SetupStateMachineConfig);
    /**
     * Create the initial context for a new setup session.
     */
    private createInitialContext;
    /**
     * Register the default step handlers.
     */
    private registerDefaultHandlers;
    /**
     * Get the current setup step.
     */
    getCurrentStep(): SetupStep;
    /**
     * Get the full setup context.
     */
    getContext(): SetupContext;
    /**
     * Get the current settings.
     */
    getSettings(): SetupSettings;
    /**
     * Check if we can advance from the current step.
     */
    canAdvance(): boolean;
    /**
     * Get the completion progress.
     */
    getProgress(): SetupProgress;
    /**
     * Process input and advance to the next step.
     */
    advanceStep(input: SetupInput): Promise<SetupResult>;
    /**
     * Skip the current step (if allowed).
     */
    skipStep(): Promise<SetupResult>;
    /**
     * Go back to a previous step.
     */
    goBack(targetStep?: SetupStep): SetupResult;
    /**
     * Serialize the current state for persistence.
     */
    toJSON(): SerializedSetupState;
    /**
     * Restore state from a serialized representation.
     */
    static fromJSON(serialized: SerializedSetupState, config: Omit<SetupStateMachineConfig, "existingContext">): SetupStateMachine;
    /**
     * Reset the state machine to the beginning.
     */
    reset(): void;
    /**
     * Register a custom handler for a step.
     */
    registerHandler<T>(step: SetupStep, handler: StepHandler<T>): void;
    /**
     * Handle the WELCOME step.
     */
    private handleWelcome;
    /**
     * Handle the RISK_ACK step.
     */
    private handleRiskAck;
    /**
     * Handle the AUTH step.
     */
    private handleAuth;
    /**
     * Validate auth input.
     */
    private validateAuthInput;
    /**
     * Handle the CHANNELS step.
     */
    private handleChannels;
    /**
     * Handle the SKILLS step.
     */
    private handleSkills;
}
/**
 * Create a new setup state machine with default configuration.
 */
export declare function createSetupStateMachine(config: Partial<SetupStateMachineConfig> & {
    platform: string;
}): SetupStateMachine;
/**
 * Check if an setup context is complete.
 */
export declare function isSetupComplete(context: SetupContext): boolean;
/**
 * Get a summary of the setup context for display.
 */
export declare function getSetupSummary(context: SetupContext): string;
export {};
//# sourceMappingURL=setup-state.d.ts.map