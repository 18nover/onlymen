/**
 * UI_CONTEXT provider — surfaces which Eliza UI surface (view and tab) sent the
 * current message and the capability contexts forced active for this turn, so
 * the planner prefers actions and providers matching that context first. Stays
 * silent when there is neither a UI view nor an active routing context. Part of
 * the basic-capabilities bundle.
 */
import type { Provider } from "../../../types/index.js";
export declare const uiContextProvider: Provider;
//# sourceMappingURL=uiContext.d.ts.map