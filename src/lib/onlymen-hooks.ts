import { useEffect, useState } from "react";
import type { CityId } from "@/lib/models";

export const AGE_KEY = "onlymen-age-ok-v1";
export const AGE_COOKIE = "onlymen_age_ok";
/** Runs inline in <head> before paint: marks <html> when the visitor already confirmed 18+. */
export const AGE_OK_SCRIPT = `try{if(localStorage.getItem("${AGE_KEY}")==="1"||/(?:^|; )${AGE_COOKIE}=1(?:;|$)/.test(document.cookie))document.documentElement.classList.add("om-age-ok")}catch(e){}`;

function ageConfirmed() {
  try {
    if (window.localStorage.getItem(AGE_KEY) === "1") return true;
  } catch {
    /* storage blocked: fall back to the cookie */
  }
  return new RegExp(`(?:^|; )${AGE_COOKIE}=1(?:;|$)`).test(document.cookie);
}
const CITY_KEY = "onlymen-city-v1";

export function useAgeGate() {
  const [gate, setGate] = useState<"unknown" | "show" | "ok">("unknown");
  useEffect(() => {
    const ok = ageConfirmed();
    if (!ok) document.documentElement.classList.remove("om-age-ok");
    setGate(ok ? "ok" : "show");
  }, []);
  const enter = () => {
    try {
      window.localStorage.setItem(AGE_KEY, "1");
    } catch {
      /* storage blocked: the cookie below still remembers the choice */
    }
    document.cookie = `${AGE_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.documentElement.classList.add("om-age-ok");
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

