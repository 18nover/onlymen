/**
 * Autonomy Actions for elizaOS
 *
 * Actions that enable autonomous agent communication.
 */
import type { Action } from "../../types/index.js";
/**
 * Escalate Action
 *
 * Allows an autonomous agent to escalate a message to a human. The core action
 * supports the configured `admin` target; owner and third-party escalation
 * targets belong in plugin-owned actions with their own delivery contracts.
 */
export declare const escalateAction: Action;
export declare const enableAutonomousModeAction: Action;
export declare const disableAutonomousModeAction: Action;
//# sourceMappingURL=action.d.ts.map