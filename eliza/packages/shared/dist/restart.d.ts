/**
 * Special exit code that tells the CLI runner to restart the process.
 */
export declare const RESTART_EXIT_CODE: number;
/**
 * A function invoked when a restart is requested.
 */
export type RestartHandler = (reason?: string) => void | Promise<void>;
/**
 * Replace the active restart handler.
 */
export declare function setRestartHandler(handler: RestartHandler): void;
/**
 * Trigger a restart. Delegates to whatever handler is currently registered.
 */
export declare function requestRestart(reason?: string): void | Promise<void>;
//# sourceMappingURL=restart.d.ts.map