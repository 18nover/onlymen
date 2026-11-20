import { useEffect, useState } from "react";
import type { CityId } from "@/lib/models";

export const AGE_KEY = "onlymen-age-ok-v1";
const CITY_KEY = "onlymen-city-v1";

export function useAgeGate() {
  const [gate, setGate] = useState<"unknown" | "show" | "ok">("unknown");
  useEffect(() => {
    setGate(window.localStorage.getItem(AGE_KEY) === "1" ? "ok" : "show");
  }, []);
  const enter = () => {
    window.localStorage.setItem(AGE_KEY, "1");
    setGate("ok");
  };
  return { gate, enter };
}

export function useCity() {
  const [city, setCityState] = useState<CityId | "all">("all");
  useEffect(() => {
    const read = () => setCityState((window.localStorage.getItem(CITY_KEY) as CityId | "all" | null) ?? "all");
    read();
    window.addEventListener("onlymen-city", read);
    return () => window.removeEventListener("onlymen-city", read);
  }, []);
  const setCity = (c: CityId | "all") => {
    window.localStorage.setItem(CITY_KEY, c);
    setCityState(c);
    window.dispatchEvent(new Event("onlymen-city"));
  };
  return [city, setCity] as const;
}

