/**
 * RUNTIME_MODEL_CONTEXT provider — injects the agent's live model/provider
 * configuration into the prompt so it can answer "what model are you using?"
 * from real runtime facts instead of training-data guesses. Resolves each model
 * slot (response handler, action planner, large/small text) via the runtime
 * resolver, provider-declared display-model metadata, or the configured
 * `*_MODEL` settings/env keys, and reports the provider adapter name, endpoint
 * host, and the default coding sub-agent's model. Part of the basic-capabilities
 * bundle.
 *
 * Gated: `shouldRenderRuntimeModelContext` only fires for self-directed
 * model/provider/coding-agent questions and stays silent for sub-agent
 * transcripts and unrelated turns. A slot that stays unresolvable is OMITTED
 * rather than rendering its raw slot name (e.g. "RESPONSE_HANDLER") to the user.
 */
import type { Provider } from "../../../types/index.js";
export declare const runtimeModelContextProvider: Provider;
//# sourceMappingURL=runtimeModelContext.d.ts.map