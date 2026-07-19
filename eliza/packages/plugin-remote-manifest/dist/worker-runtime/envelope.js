/**
 * Low-level transport adapter for the remote-plugin worker runtime.
 *
 * Abstracts the message channel so the same dispatch/proxy code runs on
 * top of a Bun Worker (postMessage / `message` event), a Bun subprocess
 * (stdio newline-delimited JSON), or an HTTPS endpoint (POST /rpc). P1
 * ships the Worker adapter; P2 adds subprocess + HTTPS.
 */
/**
 * Worker-thread message-port adapter. Uses `globalThis.postMessage` /
 * `addEventListener("message")` from inside a Web Worker (the model Bun
 * Workers expose).
 */
export function createWorkerChannel() {
    const self = globalThis;
    const subscribers = new Set();
    let closed = false;
    const listener = (event) => {
        if (closed)
            return;
        const message = event.data;
        for (const subscriber of subscribers)
            subscriber(message);
    };
    self.addEventListener("message", listener);
    return {
        send(message) {
            if (closed)
                return;
            self.postMessage(message);
        },
        onMessage(handler) {
            subscribers.add(handler);
            return () => subscribers.delete(handler);
        },
        close() {
            if (closed)
                return;
            closed = true;
            subscribers.clear();
            self.removeEventListener("message", listener);
        },
    };
}
/**
 * Subprocess channel adapter for `isolation: "isolated-process"`. Uses
 * newline-delimited JSON over stdin/stdout. The host
 * (`IsolatedProcessWorkerRunner` in app-core) writes lines into the
 * subprocess's stdin and reads lines from stdout.
 *
 * Bun exposes Node-compatible globals (`process.stdin`, `process.stdout`)
 * inside subprocesses, so we adapt them with the smallest possible
 * surface and feature-detect at construction time.
 */
export function createSubprocessChannel() {
    const proc = globalThis.process;
    if (!proc?.stdin || !proc?.stdout) {
        throw new Error("createSubprocessChannel(): process.stdin / process.stdout unavailable");
    }
    const stdin = proc.stdin;
    const stdout = proc.stdout;
    stdin.setEncoding("utf8");
    const subscribers = new Set();
    let closed = false;
    let buffer = "";
    const onData = (chunk) => {
        if (closed)
            return;
        buffer += chunk;
        let newlineIndex = buffer.indexOf("\n");
        while (newlineIndex !== -1) {
            const line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.trim()) {
                try {
                    const message = JSON.parse(line);
                    for (const subscriber of subscribers)
                        subscriber(message);
                }
                catch {
                    // error-policy:J3 untrusted-input sanitizing — a malformed worker
                    // stdout line is skipped here; the failure still surfaces because the
                    // host treats malformed worker output as a hard error via the
                    // subprocess's exit-handler.
                }
            }
            newlineIndex = buffer.indexOf("\n");
        }
    };
    stdin.on("data", onData);
    return {
        send(message) {
            if (closed)
                return;
            stdout.write(`${JSON.stringify(message)}\n`);
        },
        onMessage(handler) {
            subscribers.add(handler);
            return () => subscribers.delete(handler);
        },
        close() {
            if (closed)
                return;
            closed = true;
            subscribers.clear();
            stdin.off("data", onData);
        },
    };
}
/**
 * Auto-detect the right channel based on env. Subprocess mode is
 * activated by setting `ELIZA_REMOTE_PLUGIN_CHANNEL=stdio`; otherwise
 * defaults to the Bun-Worker postMessage channel.
 */
export function createDefaultChannel() {
    const env = globalThis
        .process?.env;
    if (env?.ELIZA_REMOTE_PLUGIN_CHANNEL === "stdio") {
        return createSubprocessChannel();
    }
    return createWorkerChannel();
}
/**
 * Monotonic request-id allocator used to correlate request / response
 * envelopes. Each side (worker and host) has its own counter and never
 * looks at the other's namespace.
 */
export function createRequestIdAllocator() {
    let n = 0;
    return () => {
        n = (n + 1) >>> 0;
        return n;
    };
}
//# sourceMappingURL=envelope.js.map