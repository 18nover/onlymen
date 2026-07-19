/**
 * Read-only triage action that returns unread messages across every connected
 * platform as one recency-sorted feed with structural signals attached; the
 * model reading the result judges urgency (#14716). Registered under the
 * shared `MESSAGE` action name; serves cached refs from the TriageService
 * store when present (re-ranked via `rankScored`) and otherwise triggers a
 * live `triage()` pull, then filters to unread and trims to the requested
 * limit. ADMIN-gated and side-effect free — it never drafts or mutates.
 */
import type { Action } from "../../../../types/index.js";
export declare const listInboxAction: Action;
//# sourceMappingURL=listInbox.d.ts.map