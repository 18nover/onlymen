/**
 * @fileoverview Typed mock runtime for **unit** tests.
 *
 * This is the unit-test counterpart to {@link ./integration-runtime}. Integration
 * tests use a real {@link AgentRuntime} backed by real infrastructure (the
 * "NO MOCKS" rule in `./index.ts`); unit tests that exercise a single
 * action/provider/service in isolation legitimately need a lightweight stand-in
 * runtime instead.
 *
 * Before this helper, ~200 unit tests each hand-rolled
 * `{ getSetting: () => …, useModel: vi.fn() } as unknown as IAgentRuntime`.
 * Every one of those was an `as unknown as` escape with zero type-checking on the
 * mocked surface. `createMockRuntime` replaces them with a single, typed factory:
 *
 * - The `overrides` parameter is `Partial<IAgentRuntime>`, so the fields a test
 *   supplies are now **type-checked** against the real runtime contract.
 * - The unavoidable partial→full cast lives in exactly one audited place here
 *   (a plain `as`, since `IAgentRuntime` is assignable to `Partial<IAgentRuntime>`),
 *   instead of being copy-pasted as `as unknown as` across the suite.
 *
 * @example
 * ```ts
 * import { createMockRuntime } from "@elizaos/core/testing";
 *
 * const runtime = createMockRuntime({
 *   getSetting: (key) => (key === "MODE" ? "chatty" : undefined),
 *   useModel: vi.fn(async () => "ok"),
 * });
 * ```
 */
import type { IAgentRuntime, UUID } from "../types/index.js";
/** Stable zero-UUID used as the default agent/entity id in unit tests. */
export declare const MOCK_AGENT_ID: UUID;
/**
 * Build a typed mock {@link IAgentRuntime} for a unit test. Only the structural
 * required properties (`agentId`, `character`, the registry arrays/maps) are
 * defaulted; methods are intentionally left unset so the factory is a
 * behavior-preserving drop-in for the minimal cast-mocks it replaces. Pass the
 * methods (and any other fields) a test needs via `overrides` — now type-checked
 * against `IAgentRuntime`, unlike the `as unknown as` casts.
 */
export declare function createMockRuntime(overrides?: Partial<IAgentRuntime>): IAgentRuntime;
//# sourceMappingURL=mock-runtime.d.ts.map