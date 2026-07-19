/**
 * CLI Setup Adapter
 *
 * Wraps the SetupStateMachine with CLI-specific logic for terminal prompts.
 * Provides formatted prompts, input parsing, and step-specific CLI flows.
 */
import { type SetupContext, type SetupInput, type SetupProgress, type SetupResult, SetupStep } from "../types/setup.js";
import { SetupStateMachine, type SetupStateMachineConfig } from "./setup-state.js";
/**
 * Prompt configuration for CLI display.
 */
export interface CliPromptConfig {
    /** Title for the prompt */
    title: string;
    /** Description or instruction text */
    description: string;
    /** Type of prompt (confirm, text, select, multiselect, password) */
    type: "confirm" | "text" | "select" | "multiselect" | "password";
    /** Options for select/multiselect prompts */
    options?: Array<{
        value: string;
        label: string;
        hint?: string;
    }>;
    /** Default value */
    defaultValue?: string | boolean | string[];
    /** Placeholder text for input */
    placeholder?: string;
    /** Validation function */
    validate?: (value: string) => string | undefined;
    /** Whether the input is required */
    required?: boolean;
}
/**
 * Result of parsing CLI input.
 */
export interface ParsedCliInput {
    /** Whether parsing was successful */
    success: boolean;
    /** The parsed input ready for the state machine */
    input?: SetupInput;
    /** Error message if parsing failed */
    error?: string;
}
/**
 * Risk acknowledgement text for display.
 */
export declare const RISK_ACKNOWLEDGEMENT_TEXT = "\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n                          IMPORTANT SECURITY INFORMATION\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n\nBy proceeding with this setup, you acknowledge and accept the following:\n\n1. API KEY SECURITY\n   Your API keys provide access to paid services. Keep them secure and never\n   share them publicly. Leaked keys can result in unauthorized charges.\n\n2. EXECUTION CAPABILITIES\n   This agent can execute commands and code on your system. Always review\n   actions before approving them, especially commands that modify files or\n   access sensitive data.\n\n3. NETWORK ACCESS\n   The agent connects to external services (AI providers, messaging platforms).\n   Ensure you trust all configured services and review their privacy policies.\n\n4. DATA HANDLING\n   Messages and data may be sent to external AI providers for processing.\n   Do not share sensitive personal information through the agent.\n\n5. YOUR RESPONSIBILITY\n   You are responsible for:\n   - Monitoring agent activities\n   - Reviewing execution requests\n   - Keeping your system and credentials secure\n   - Complying with terms of service for all connected platforms\n\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n";
/**
 * Supported model providers.
 */
export declare const MODEL_PROVIDERS: readonly [{
    readonly value: "anthropic";
    readonly label: "Anthropic (Claude)";
    readonly hint: "Recommended";
}, {
    readonly value: "openai";
    readonly label: "OpenAI (GPT)";
    readonly hint: "";
}, {
    readonly value: "google";
    readonly label: "Google (Gemini)";
    readonly hint: "";
}, {
    readonly value: "groq";
    readonly label: "Groq";
    readonly hint: "Fast inference";
}, {
    readonly value: "xai";
    readonly label: "xAI (Grok)";
    readonly hint: "";
}, {
    readonly value: "openrouter";
    readonly label: "OpenRouter";
    readonly hint: "Multi-provider";
}, {
    readonly value: "ollama";
    readonly label: "Ollama";
    readonly hint: "Local models";
}];
/**
 * Supported channels.
 */
export declare const CHANNELS: readonly [{
    readonly value: "discord";
    readonly label: "Discord";
    readonly hint: "Bot token required";
}, {
    readonly value: "telegram";
    readonly label: "Telegram";
    readonly hint: "Bot token required";
}, {
    readonly value: "twitter";
    readonly label: "Twitter/X";
    readonly hint: "Credentials required";
}, {
    readonly value: "slack";
    readonly label: "Slack";
    readonly hint: "Bot token required";
}, {
    readonly value: "web";
    readonly label: "Web Interface";
    readonly hint: "Built-in";
}];
/**
 * Authentication methods.
 */
export declare const AUTH_METHODS: readonly [{
    readonly value: "api_key";
    readonly label: "API Key";
    readonly hint: "Enter your API key directly";
}, {
    readonly value: "oauth";
    readonly label: "OAuth";
    readonly hint: "Sign in with your provider account";
}, {
    readonly value: "setup_token";
    readonly label: "Setup Token";
    readonly hint: "Paste token from CLI command";
}];
/**
 * CLI Setup Adapter
 *
 * Provides CLI-specific functionality on top of the SetupStateMachine.
 */
export declare class CLISetupAdapter {
    private stateMachine;
    constructor(config?: Partial<Omit<SetupStateMachineConfig, "platform" | "mode">>);
    /**
     * Get the underlying state machine.
     */
    getStateMachine(): SetupStateMachine;
    /**
     * Get the current context.
     */
    getContext(): SetupContext;
    /**
     * Get the current step.
     */
    getCurrentStep(): SetupStep;
    /**
     * Get progress information.
     */
    getProgress(): SetupProgress;
    /**
     * Generate appropriate CLI prompt(s) for the current step.
     */
    promptForStep(step?: SetupStep): CliPromptConfig[];
    /**
     * Parse CLI input for a specific step.
     */
    parseCliInput(input: Record<string, unknown>, step?: SetupStep): ParsedCliInput;
    /**
     * Process input and advance the state machine.
     */
    advanceStep(input: SetupInput): Promise<SetupResult>;
    /**
     * Skip the current step.
     */
    skipStep(): Promise<SetupResult>;
    /**
     * Go back to a previous step.
     */
    goBack(targetStep?: SetupStep): SetupResult;
    /**
     * Reset the setup flow.
     */
    reset(): void;
    /**
     * Get prompts for WELCOME step.
     */
    private getWelcomePrompts;
    /**
     * Get prompts for RISK_ACK step.
     */
    private getRiskAckPrompts;
    /**
     * Get prompts for AUTH step.
     */
    private getAuthPrompts;
    /**
     * Get prompts for CHANNELS step.
     */
    private getChannelPrompts;
    /**
     * Get prompts for SKILLS step.
     */
    private getSkillsPrompts;
    /**
     * Get prompts for COMPLETE step.
     */
    private getCompletePrompts;
    /**
     * Parse WELCOME step input.
     */
    private parseWelcomeInput;
    /**
     * Parse RISK_ACK step input.
     */
    private parseRiskAckInput;
    /**
     * Parse AUTH step input.
     */
    private parseAuthInput;
    /**
     * Parse CHANNELS step input.
     */
    private parseChannelsInput;
    /**
     * Parse SKILLS step input.
     */
    private parseSkillsInput;
    /**
     * Generate a completion summary.
     */
    private generateCompletionSummary;
    /**
     * Format a progress bar for CLI display.
     */
    formatProgressBar(width?: number): string;
    /**
     * Get step-specific help text.
     */
    getStepHelp(step?: SetupStep): string;
}
/**
 * Create a new CLI setup adapter.
 */
export declare function createCLISetupAdapter(config?: Partial<Omit<SetupStateMachineConfig, "platform" | "mode">>): CLISetupAdapter;
/**
 * Run through CLI setup with provided answers (for testing/automation).
 */
export declare function runNonInteractiveSetup(adapter: CLISetupAdapter, answers: {
    provider?: string;
    apiKey?: string;
    channels?: string[];
    skills?: string[];
    nodeManager?: "npm" | "bun";
}): Promise<SetupResult>;
//# sourceMappingURL=setup-cli.d.ts.map