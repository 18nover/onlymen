import type { Provider } from "../../../types/index.js";
/**
 * Benchmark context provider.
 *
 * If a benchmark harness attaches context to the inbound message metadata (as `benchmarkContext`),
 * this provider surfaces it to the model and sets `benchmark_has_context=true` in state.values.
 *
 * Python's message service uses `benchmark_has_context` to force REPLY/action execution so the
 * full Provider -> Model -> Action -> Evaluator loop is exercised during benchmarks.
 */
export declare const contextBenchProvider: Provider;
//# sourceMappingURL=contextBench.d.ts.map