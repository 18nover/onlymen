/**
 * Pre-message security gate for the trust feature, implemented as an
 * `ALWAYS_BEFORE` action (despite the `evaluators/` location) so it runs ahead
 * of the planner. Blocks messages carrying invisible-character obfuscation
 * (zero-width / bidi / other control chars) or structural chat-template-token
 * injection (`<|im_start|>`, `[INST]`, `"role":"system"`, END/NEW SYSTEM PROMPT,
 * …) via pure heuristics — no keyword matching and no model call. Skips the
 * agent's own messages and OWNER/ADMIN senders; on a hit returns a failing
 * `ActionResult` naming the detected signals, otherwise passes through
 * (`undefined`).
 */
import type { Action } from "../../../types/index.js";
export declare const securityEvaluator: Action;
//# sourceMappingURL=securityEvaluator.d.ts.map