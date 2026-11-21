import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { accountStore } from "./store.ts";
import type { PublicAccount } from "./types.ts";

const subscribe = (fn: () => void) => accountStore.subscribe(fn);
const getSnapshot = () => accountStore.current();
const getServerSnapshot = () => null;
const getLoaded = () => accountStore.loaded();
const getServerLoaded = () => false;

/** Current account (null when signed out). `ready` is false during SSR/hydration and until the adapter has loaded. */
export function useAccount() {
  const account = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const loaded = useSyncExternalStore(subscribe, getLoaded, getServerLoaded);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const ready = hydrated && loaded;
  const update = useCallback((patch: (a: PublicAccount) => PublicAccount) => accountStore.update(patch), []);
  return { account, ready, update };
}
