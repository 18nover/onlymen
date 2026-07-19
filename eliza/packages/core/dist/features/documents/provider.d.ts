/**
 * The `DOCUMENTS` dynamic provider: injects the agent's relevant and recent
 * documents into the prompt for the `documents` context. It pulls the top
 * relevant fragments (via `DocumentService.searchDocuments`) plus a bounded list
 * of available/recent documents (via `listDocuments`), rendering snippets and
 * document IDs the agent can cite or follow up to read. Returns an
 * empty/unavailable payload when no `DocumentService` is registered. Gated to the
 * `documents` context and a minimum `USER` role, with per-turn cache scope.
 */
import { type Provider } from "../../types/index.js";
export declare const documentsProvider: Provider;
//# sourceMappingURL=provider.d.ts.map