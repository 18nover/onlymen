/**
 * Tips, payouts, and any purchase UI. Off unless ONLYMEN_PAYMENTS=on.
 * There is no billing provider wired up; this only shows or hides the UI.
 */
import { platformEnv } from "./platform/runtime.ts";

export function paymentsEnabled(): boolean {
  return platformEnv("ONLYMEN_PAYMENTS") === "on";
}
