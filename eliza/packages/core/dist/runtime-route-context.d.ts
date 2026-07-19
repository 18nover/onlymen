/**
 * Per-runtime "host context" for plugin route handlers: the config load/save,
 * runtime-restart, and telemetry-span hooks the host process exposes to routes
 * without those routes importing the host. The context is stashed on the runtime
 * object under a non-enumerable, `Symbol.for`-keyed holder so it survives across
 * module instances. `setRuntimeRouteHostContext` returns a restore closure, so a
 * caller can install a context for the span of a request and roll it back after.
 */
export interface RuntimeRouteTelemetrySpan {
    success: (meta?: Record<string, unknown>) => void;
    failure: (meta?: Record<string, unknown>) => void;
}
export interface RuntimeRouteTelemetryMeta {
    boundary: string;
    operation: string;
    timeoutMs?: number;
}
export interface RuntimeRouteHostContext<TConfig extends Record<string, unknown> = Record<string, unknown>> {
    config?: TConfig;
    saveConfig?: (config: TConfig) => void;
    restartRuntime?: (reason: string) => Promise<boolean> | boolean;
    createTelemetrySpan?: (meta: RuntimeRouteTelemetryMeta) => RuntimeRouteTelemetrySpan | null | undefined;
}
export declare function getRuntimeRouteHostContext<TConfig extends Record<string, unknown> = Record<string, unknown>>(runtime: object | null | undefined): RuntimeRouteHostContext<TConfig> | null;
export declare function setRuntimeRouteHostContext(runtime: object, context: RuntimeRouteHostContext | null): () => void;
//# sourceMappingURL=runtime-route-context.d.ts.map