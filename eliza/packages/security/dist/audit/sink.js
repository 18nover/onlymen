/**
 * Audit sink implementations for in-memory tests, structured logs, files, and HTTP collectors.
 */
import { appendFile } from "node:fs/promises";
export class InMemorySink {
    name = "memory";
    events = [];
    async emit(event) {
        this.events.push(event);
    }
    snapshot() {
        return [...this.events];
    }
    clear() {
        this.events.length = 0;
    }
}
export class ConsoleSink {
    name = "console";
    async emit(event) {
        // structured single-line JSON; downstream log shippers can parse.
        process.stdout.write(`[audit] ${JSON.stringify(event)}\n`);
    }
}
export class FileSink {
    path;
    name = "file";
    constructor(path) {
        this.path = path;
    }
    async emit(event) {
        await appendFile(this.path, `${JSON.stringify(event)}\n`, "utf8");
    }
}
/**
 * Production HTTP sink. Posts one validated audit event per request to the
 * configured append-only audit endpoint.
 */
export class HttpSink {
    name = "http";
    endpoint;
    fetchImpl;
    headers;
    constructor(endpointOrOptions) {
        const options = typeof endpointOrOptions === "string"
            ? { endpoint: endpointOrOptions }
            : endpointOrOptions;
        this.endpoint = options.endpoint;
        this.fetchImpl = options.fetch ?? globalThis.fetch;
        this.headers = options.headers ?? {};
    }
    async emit(event) {
        if (!this.fetchImpl) {
            throw new Error("HttpSink requires a fetch implementation");
        }
        const response = await this.fetchImpl(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...this.headers,
            },
            body: JSON.stringify(event),
        });
        if (!response.ok) {
            throw new Error(`HttpSink failed: ${response.status} ${response.statusText}`.trim());
        }
    }
}
//# sourceMappingURL=sink.js.map