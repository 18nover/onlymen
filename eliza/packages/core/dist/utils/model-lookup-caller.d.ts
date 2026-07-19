/**
 * Attributes a `runtime.useModel()` call to the plugin or package that triggered
 * it by parsing the captured stack trace down to package names, skipping internal
 * runtime frames and unrelated third-party `node_modules` dependencies while
 * still crediting installed `@elizaos/*` packages. Feeds model-lookup debug
 * diagnostics.
 */
export type ModelLookupCallerTrace = {
    /** Outermost plugin or package that triggered the lookup. */
    caller?: string;
    /** Call chain as plugin/package names only, outermost first. */
    callerStack: string[];
};
/**
 * Extract a trimmed caller trace from a stack captured for `runtime.useModel()`.
 * Returns plugin or package names only: no file paths or line numbers.
 */
export declare function captureModelLookupCallerFromStack(stack: string | undefined, maxFrames?: number): ModelLookupCallerTrace | undefined;
/**
 * Capture a trimmed stack for `runtime.useModel()` calls.
 * Caller gates this behind debug logging because stack capture walks the hot
 * model path and should stay free when debug logs are disabled.
 */
export declare function captureModelLookupCaller(maxFrames?: number): ModelLookupCallerTrace | undefined;
//# sourceMappingURL=model-lookup-caller.d.ts.map