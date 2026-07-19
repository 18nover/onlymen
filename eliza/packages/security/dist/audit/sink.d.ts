/**
 * Audit sink implementations for in-memory tests, structured logs, files, and HTTP collectors.
 */
import type { AuditEvent } from "./types.js";
export interface AuditSink {
    readonly name: string;
    emit(event: AuditEvent): Promise<void>;
}
export declare class InMemorySink implements AuditSink {
    readonly name = "memory";
    private readonly events;
    emit(event: AuditEvent): Promise<void>;
    snapshot(): AuditEvent[];
    clear(): void;
}
export declare class ConsoleSink implements AuditSink {
    readonly name = "console";
    emit(event: AuditEvent): Promise<void>;
}
export declare class FileSink implements AuditSink {
    private readonly path;
    readonly name = "file";
    constructor(path: string);
    emit(event: AuditEvent): Promise<void>;
}
export interface HttpSinkOptions {
    endpoint: string;
    fetch?: typeof fetch;
    headers?: Record<string, string>;
}
/**
 * Production HTTP sink. Posts one validated audit event per request to the
 * configured append-only audit endpoint.
 */
export declare class HttpSink implements AuditSink {
    readonly name = "http";
    private readonly endpoint;
    private readonly fetchImpl;
    private readonly headers;
    constructor(endpointOrOptions: string | HttpSinkOptions);
    emit(event: AuditEvent): Promise<void>;
}
//# sourceMappingURL=sink.d.ts.map