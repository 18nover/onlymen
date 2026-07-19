/**
 * @elizaos/plugin-worker-runtime — worker-side bootstrap for remote-mode
 * elizaOS plugins.
 *
 * Primary entrypoint: {@link bootstrap}. See `./bootstrap.ts` for the
 * worker authoring pattern.
 *
 * Re-exports the building blocks for advanced integrations (custom
 * transports, host-side test harnesses):
 *
 * - {@link WorkerChannel} — transport adapter contract
 * - {@link createWorkerChannel} — default Worker postMessage adapter
 * - {@link RuntimeProxy} / {@link buildRuntimeProxyApi} — host-rpc client
 * - {@link buildAnnounceDescriptor} — Plugin → JSON descriptor
 * - {@link createWorkerRpcDispatcher} — worker-rpc handler
 */
export { bootstrap } from "./bootstrap.js";
export { buildAnnounceDescriptor, createHandlerRegistry, } from "./descriptor.js";
export { createWorkerRpcDispatcher, } from "./dispatch.js";
export { createDefaultChannel, createRequestIdAllocator, createSubprocessChannel, createWorkerChannel, } from "./envelope.js";
export { fromWireError, toWireError } from "./error.js";
export { buildRuntimeProxyApi, RuntimeProxy, SUPPORTED_RUNTIME_METHODS, } from "./runtime-proxy.js";
//# sourceMappingURL=index.js.map