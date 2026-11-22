/**
 * Server function the root route calls (during SSR and on client navigation)
 * to decide whether to render the app or the coming-soon gate.
 */
import { createServerFn } from "@tanstack/react-start";

export type PrivateAccess = { allowed: boolean; ownerSignup: boolean };

export const privateAccessFn = createServerFn({ method: "GET" }).handler(async (): Promise<PrivateAccess> => {
  const [{ getRequest }, mod, rt] = await Promise.all([import("@tanstack/react-start/server"), import("./allowlist.server"), import("../platform/runtime.ts")]);
  const ownerSignup = Boolean(rt.platformEnv("ONLYMEN_OWNER_SIGNUP_EMAIL"));
  if (mod.privateModeOff()) return { allowed: true, ownerSignup };
  const uid = await mod.allowedSessionUserId(getRequest().headers);
  return { allowed: Boolean(uid), ownerSignup };
});
