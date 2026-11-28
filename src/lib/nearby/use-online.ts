import { useEffect, useState } from "react";
import { onlineNowFn, presencePingFn } from "./api";

/** Returns the real "online right now" count (null until known). */
export function useOnlineNow(signedIn: boolean): number | null {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    if (!signedIn) return setN(null);
    let alive = true;
    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      const r = await onlineNowFn().catch(() => null);
      if (alive && r?.ok) setN(r.value.online);
    };
    void tick();
    const t = setInterval(() => void tick(), 60_000);
    const onVis = () => document.visibilityState === "visible" && void tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [signedIn]);
  return n;
}

/** Mounted once in the root: pings presence about every 60 s while signed in and the tab is visible. */
export function usePresencePing(signedIn: boolean): void {
  useEffect(() => {
    if (!signedIn) return;
    const ping = () => document.visibilityState === "visible" && void presencePingFn().catch(() => {});
    ping();
    const t = setInterval(ping, 60_000);
    document.addEventListener("visibilitychange", ping);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", ping);
    };
  }, [signedIn]);
}
