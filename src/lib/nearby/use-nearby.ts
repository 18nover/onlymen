import { useEffect, useState } from "react";
import { nearbyConfigFn } from "./api";

let cached: Promise<boolean> | null = null;

/** Is ONLYMEN_NEARBY on for this deployment? (One request per page load, cached.) */
export function useNearbyEnabled(initial = false): boolean {
  const [on, setOn] = useState(initial);
  useEffect(() => {
    cached ??= nearbyConfigFn().then((r) => r.enabled).catch(() => false);
    let live = true;
    void cached.then((v) => live && setOn(v));
    return () => {
      live = false;
    };
  }, []);
  return on;
}
