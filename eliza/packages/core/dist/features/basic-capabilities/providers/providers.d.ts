/**
 * Legacy provider-catalog renderer for composeState callers that explicitly ask
 * for `PROVIDERS`. The v5 chat planner does not use a model-emitted
 * request-by-name loop; it selects provider text before the model call through
 * context gates plus `alwaysInResponseState`. This catalog stays out of v5
 * planner composition so provider descriptions do not become prompt-stuffing.
 */
import type { Provider } from "../../../types/index.js";
export declare const providersProvider: Provider;
//# sourceMappingURL=providers.d.ts.map