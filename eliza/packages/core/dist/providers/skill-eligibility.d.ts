/**
 * Skill Eligibility Provider
 *
 * Provides LLM context about which skills are eligible for use,
 * which are ineligible, and why. Helps the LLM make informed
 * decisions about skill usage and suggest fixes for missing deps.
 *
 * @module providers/skill-eligibility
 */
import type { Provider } from "../types/index.js";
/**
 * Skill Eligibility Provider
 *
 * Injects information about skill eligibility into the LLM context:
 * - List of eligible skills that are ready to use
 * - List of ineligible skills with reasons and suggested fixes
 * - Summary of what's missing (binaries, env vars, config)
 */
export declare const skillEligibilityProvider: Provider;
/**
 * Compact Skill Eligibility Provider
 *
 * A more compact version that only shows ineligible skills.
 * Good for systems with many skills.
 */
export declare const skillEligibilityCompactProvider: Provider;
export default skillEligibilityProvider;
//# sourceMappingURL=skill-eligibility.d.ts.map