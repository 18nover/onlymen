/**
 * @fileoverview elizaOS Integration Testing Infrastructure
 *
 * This module provides REAL integration testing utilities that use:
 * - Real database (PGLite by default, Postgres if configured)
 * - Real inference (Ollama by default, cloud providers if API keys are available)
 *
 * NO MOCKS. Tests must use real infrastructure to provide genuine confidence.
 *
 * @example
 * ```typescript
 * import {
 *   createIntegrationTestRuntime,
 *   withTestRuntime,
 *   requireInferenceProvider,
 * } from '@elizaos/core';
 *
 * describe('My Integration Tests', () => {
 *   it('should process a message with real inference', async () => {
 *     const { runtime, cleanup, inferenceProvider } = await createIntegrationTestRuntime({
 *       databaseAdapter: myAdapter,
 *     });
 *
 *     logger.info({ provider: inferenceProvider?.name }, "Using inference provider");
 *
 *     try {
 *       const memory = await runtime.createMemory({
 *         entityId: runtime.agentId,
 *         roomId: runtime.agentId,
 *         content: { text: 'Hello, world!' },
 *       }, 'messages');
 *
 *       expect(memory).toBeDefined();
 *     } finally {
 *       await cleanup();
 *     }
 *   });
 * });
 * ```
 */
export { createCanvas2DContext, createMemoryStorage, hasStorageApi, installCanvasShims, installMediaElementShims, suppressReactTestConsoleErrors, } from "./browser-mocks.js";
export { describeIf, itIf, testIf } from "./conditional-tests.js";
export { getAppCoreSourceRoot, getAutonomousSourceRoot, getElizaCoreEntry, getInstalledPackageEntry, getInstalledPackageNamedExport, getInstalledPackageRoot, getSharedSourceRoot, getUiSourceRoot, resolveModuleEntry, } from "./eliza-package-paths.js";
export { createConversation, type HttpRequestOptions, type HttpResponse, postConversationMessage, readConversationId, req, } from "./http.js";
export { detectInferenceProviders, hasInferenceProvider, type InferenceProviderDetectionResult, type InferenceProviderInfo, requireInferenceProvider, } from "./inference-provider.js";
export { createIntegrationTestRuntime, DEFAULT_TEST_CHARACTER, type IntegrationTestConfig, type IntegrationTestResult, withTestRuntime, } from "./integration-runtime.js";
export { availableProviderNames, CLI_SUBSCRIPTION_SENTINEL_API_KEY, cliBackendCredentialsPath, isLiveTestEnabled, type LiveProviderConfig, type LiveProviderName, requireLiveProvider, selectLiveProvider, } from "./live-provider.js";
export { canBindLoopback } from "./loopback.js";
export { createMockRuntime, MOCK_AGENT_ID } from "./mock-runtime.js";
export { createOllamaModelHandlers, isOllamaAvailable, listOllamaModels, } from "./ollama-provider.js";
export { createTestRuntime, type TestRuntimeOptions, type TestRuntimeResult, } from "./pglite-runtime.js";
export { findButtonByText, flush, text, textOf } from "./react-test.js";
export { createDiscordTestClient, createTelegramTestBot, type DiscordTestClient, sendDiscordChannelMessage, sendDiscordDM, type TelegramTestBot, waitForDiscordMessage, } from "./real-connector.js";
export { createRealTestRuntime, type RealTestRuntimeOptions, type RealTestRuntimeResult, } from "./real-runtime.js";
export { createDeferred, envSnapshot, saveEnv, sleep, withTimeout, } from "./shared-test-utils.js";
export { createTestCharacter, createTestMemory, expectRejection, generateTestId, measureTime, retry, testDataGenerators, waitFor, } from "./test-helpers.js";
//# sourceMappingURL=index.d.ts.map