import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { accountStore } from "./store.ts";
import type { PublicAccount } from "./types.ts";

const subscribe = (fn: () => void) => accountStore.subscribe(fn);
const getSnapshot = () => accountStore.current();
const getServerSnapshot = () => null;

/** Current account (null when signed out). `ready` is false during SSR/hydration. */
export function useAccount() {
  const account = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const update = useCallback((patch: (a: PublicAccount) => PublicAccount) => accountStore.update(patch), []);
  return { account, ready, update };
}
