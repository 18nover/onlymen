/**
 * RuntimeProxy — what a remote-mode plugin's handlers see in lieu of the
 * real {@link IAgentRuntime}. Every method call serialises as a
 * `host-rpc` message back to the host, where the real runtime resolves
 * the call and the result returns as a `host-rpc-result`.
 *
 * P1 ships the methods required by action / provider / event / model
 * handlers (`getService`, `useModel`, `getMemory`, `createMemory`,
 * `emitEvent`, `getSetting`, `setSetting`, `composeState`) plus action
 * callback marshalling. The remainder of the
 * runtime surface (database, routes, advanced event APIs) is added
 * incrementally as plugin authors reach for it; an `unknown method`
 * host-rpc returns a typed error rather than silently dropping the call.
 */
import { fromWireError } from "./error.js";
/** Subset of host-rpc methods supported in P1. */
export const SUPPORTED_RUNTIME_METHODS = [
    "getService",
    "useModel",
    "getMemory",
    "createMemory",
    "updateMemory",
    "emitEvent",
    "getSetting",
    "setSetting",
    "composeState",
    "actionCallback",
];
/**
 * The RuntimeProxy itself. Exposes a `call` method that handlers reach
 * for via {@link buildRuntimeProxyApi} (which materialises a typed
 * `runtime.getService(...)`-style surface from the bare `call`).
 */
export class RuntimeProxy {
    channel;
    allocRequestId;
    defaultTimeoutMs;
    pending = new Map();
    unsubscribe;
    constructor(options) {
        this.channel = options.channel;
        this.allocRequestId = options.allocRequestId;
        this.defaultTimeoutMs = options.defaultTimeoutMs;
    }
    /** Wire up the proxy's response handler on the channel. */
    attach() {
        if (this.unsubscribe)
            return;
        this.unsubscribe = this.channel.onMessage((message) => {
            this.onHostMessage(message);
        });
    }
    /** Tear down the response handler. */
    detach() {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        const error = new Error("RuntimeProxy detached before request resolved.");
        for (const [, slot] of this.pending)
            slot.reject(error);
        this.pending.clear();
    }
    /** Issue a host-rpc call and await the result. */
    async call(method, args) {
        const requestId = this.allocRequestId();
        const promise = new Promise((resolve, reject) => {
            this.pending.set(requestId, { resolve, reject });
            if (this.defaultTimeoutMs !== undefined) {
                setTimeout(() => {
                    if (this.pending.delete(requestId)) {
                        reject(new Error(`host-rpc ${method} timed out after ${this.defaultTimeoutMs}ms`));
                    }
                }, this.defaultTimeoutMs);
            }
        });
        const envelope = {
            type: "host-rpc",
            requestId,
            api: "runtime",
            method,
            args,
        };
        this.channel.send(envelope);
        return (await promise);
    }
    onHostMessage(message) {
        if (message.type !== "host-rpc-result")
            return;
        const result = message;
        const slot = this.pending.get(result.requestId);
        if (!slot)
            return;
        this.pending.delete(result.requestId);
        if (result.ok) {
            slot.resolve((result.payload ?? null));
        }
        else {
            slot.reject(fromWireError(result.error ?? {
                name: "Error",
                message: "Unknown host-rpc failure",
            }, "remote worker"));
        }
    }
}
export function buildRuntimeProxyApi(proxy, options) {
    return {
        getService: (serviceType) => proxy.call("getService", { serviceType }),
        useModel: (modelType, params) => proxy.call("useModel", { modelType, params }),
        getMemory: (memoryId) => proxy.call("getMemory", { memoryId }),
        createMemory: (memory, tableName) => proxy.call("createMemory", {
            memory,
            tableName: tableName ?? null,
        }),
        updateMemory: async (memory) => {
            await proxy.call("updateMemory", { memory });
        },
        emitEvent: async (name, payload) => {
            await proxy.call("emitEvent", { name, payload });
        },
        registerEvent: async (name, handler) => {
            const register = options?.registerDynamicEventHandler;
            if (!register) {
                throw new Error("runtime.registerEvent inside a remote-mode plugin cannot serialize callbacks; declare events via Plugin.events instead.");
            }
            register(name, handler);
        },
        getSetting: (key) => proxy.call("getSetting", { key }),
        setSetting: async (key, value) => {
            await proxy.call("setSetting", { key, value });
        },
        composeState: (message, options) => proxy.call("composeState", { message, options: options ?? null }),
        actionCallback: (callbackId, response, actionName) => proxy.call("actionCallback", {
            callbackId,
            response,
            actionName: actionName ?? null,
        }),
    };
}
//# sourceMappingURL=runtime-proxy.js.map