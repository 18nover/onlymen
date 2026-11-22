/**
 * Server function the root route calls (during SSR and on client navigation)
 * to decide whether to render the app or the coming-soon gate.
 */
import { createServerFn } from "@tanstack/react-start";

/** ownerSignup: /join is open to signed-out visitors (owner bootstrap or invite codes). invites: sign-up needs a code. */
export type PrivateAccess = { allowed: boolean; ownerSignup: boolean; invites: boolean; ageGate?: boolean };

export const privateAccessFn = createServerFn({ method: "GET" }).handler(async (): Promise<PrivateAccess> => {
  const [{ getRequest }, mod, inv] = await Promise.all([import("@tanstack/react-start/server"), import("./allowlist.server"), import("../invites/invites.server")]);
  const ownerSignup = mod.signUpPageOpen();
  const invites = inv.invitesEnabled();
  const { platformEnv } = await import("../platform/runtime.ts");
  const ageGate = platformEnv("ONLYMEN_AGE_GATE") === "on";
  if (mod.privateModeOff()) return { allowed: true, ownerSignup, invites, ageGate };
  const uid = await mod.allowedSessionUserId(getRequest().headers);
  return { allowed: Boolean(uid), ownerSignup, invites, ageGate };
});
