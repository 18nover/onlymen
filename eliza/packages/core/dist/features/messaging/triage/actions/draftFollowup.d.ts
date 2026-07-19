/**
 * Triage action that composes a follow-up / check-in draft to one or more
 * contacts on a chosen message source. Registered under the shared `MESSAGE`
 * action name; parameters are parsed and validated by `parseDraftFollowupParams`
 * before the handler delegates to the default TriageService's `draftFollowup`,
 * which only produces a preview draft — it never sends. Sending is a separate,
 * confirmed step. ADMIN-gated.
 */
import type { Action } from "../../../../types/index.js";
export declare const draftFollowupAction: Action;
//# sourceMappingURL=draftFollowup.d.ts.map