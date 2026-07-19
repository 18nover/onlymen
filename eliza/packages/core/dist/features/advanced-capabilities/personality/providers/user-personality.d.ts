import type { Provider } from "../../../../types/index.js";
/**
 * Injects per-user interaction preferences (structured slot + legacy free-text)
 * so the agent adapts its style for each individual user without changing the
 * global character definition.
 *
 * Resolution rule: GLOBAL slot is rendered first (lower precedence in the
 * model's eye), then USER slot. When both set the same trait, the user's
 * value wins because it appears later in the prompt and is labeled as
 * applying to THIS user.
 */
export declare const userPersonalityProvider: Provider;
//# sourceMappingURL=user-personality.d.ts.map