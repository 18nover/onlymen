import { useCallback, useEffect, useState } from "react";
import { myVerificationFn } from "./api";
import type { MyVerification } from "./repo.server";

/** Is ID verification on for this deployment, and the signed-in creator's state. */
export function useIdVerification() {
  const [state, setState] = useState<{ ready: boolean; enabled: boolean; me: MyVerification | null }>({ ready: false, enabled: false, me: null });
  const reload = useCallback(async () => {
    try {
      const r = await myVerificationFn();
      setState({ ready: true, enabled: r.enabled, me: r.me });
    } catch {
      setState((s) => ({ ...s, ready: true }));
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { ...state, reload };
}
