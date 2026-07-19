/**
 * Provider-registry **data-only** contracts shared between the agent
 * server and UI clients. Everything in this file must remain free of
 * runtime-only capabilities (no methods, no callables) so the same types
 * can be referenced by mobile/browser UI bundles without implying Node.js
 * I/O.
 *
 * The runtime-side `ProviderDefinition` (which adds a callable
 * `getEnableState()` reading env vars / fs / device-bridge sockets)
 * extends `ProviderMeta` and lives in
 * `@elizaos/app-core/src/services/local-inference/providers.ts` — it is
 * the authoritative source for `/api/local-inference/providers`.
 *
 * UI consumers (`client-local-inference.ts`, `ios-local-agent-kernel.ts`)
 * only see `ProviderStatus` (the response shape) and `ProviderMeta` /
 * `ProviderEnableState` / `ProviderId` — never the runtime definition.
 */
export {};
//# sourceMappingURL=providers-types.js.map