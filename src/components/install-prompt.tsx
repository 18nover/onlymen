/**
 * PWA bits on the client: registers the app-shell service worker (production only)
 * and shows a small, dismissible "Add to Home Screen" card.
 *  - Android / Chrome: uses the browser's beforeinstallprompt.
 *  - iPhone / iPad Safari: a hint (Share → Add to Home Screen), since iOS has no prompt API.
 * Never shown when already installed, over the 18+ gate, before the account exists (signed in), or for 30 days after "Not now".
 * Installing before sign-up/verification loses the invite and the in-progress check, so we wait for a signed-in account.
 */
import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";
import { useAccount } from "@/lib/account/use-account";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = "om-install-dismissed";
const QUIET_MS = 30 * 24 * 3600 * 1000;

function standalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
function dismissedRecently() {
  try {
    return Date.now() - Number(localStorage.getItem(KEY) || 0) < QUIET_MS;
  } catch {
    return false;
  }
}
function gateShowing() {
  return [...document.querySelectorAll("[data-age-gate]")].some((g) => getComputedStyle(g).display !== "none");
}

export function InstallPrompt() {
  const [mode, setMode] = useState<"android" | "ios" | null>(null);
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const { account } = useAccount();
  const signedIn = Boolean(account);

  useEffect(() => {
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
    if (standalone() || dismissedRecently()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const showSoon = (m: "android" | "ios") => {
      clearTimeout(timer);
      const tryShow = () => (gateShowing() ? (timer = setTimeout(tryShow, 2000)) : setMode(m));
      timer = setTimeout(tryShow, 2500);
    };
    const onBip = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
      showSoon("android");
    };
    const onInstalled = () => setMode(null);
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    const ua = navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    if (ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)) showSoon("ios");
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!mode || !signedIn) return null;
  const dismiss = () => {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setMode(null);
  };
  const install = async () => {
    if (!evt) return;
    await evt.prompt();
    const choice = await evt.userChoice.catch(() => ({ outcome: "dismissed" }));
    if (choice.outcome !== "accepted") dismiss();
    setEvt(null);
    setMode(null);
  };
  return (
    <div className="om-install" role="dialog" aria-label="Install OnlyMen">
      <img src="/icons/icon-192.png" alt="" className="size-11 shrink-0 rounded-xl ring-1 ring-gold/40" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ivory">Add OnlyMen to your home screen</p>
        {mode === "android" ? (
          <p className="text-xs text-muted">Opens full screen, like an app. Free.</p>
        ) : (
          <p className="text-xs text-muted">
            Tap <Share className="inline size-3.5 -translate-y-px text-gold-hi" aria-label="Share" /> then <b className="text-ivory">Add to Home Screen</b>.
          </p>
        )}
      </div>
      {mode === "android" && (
        <button onClick={() => void install()} className="h-10 shrink-0 rounded-full bg-gold px-4 text-sm font-bold text-ink">Install</button>
      )}
      <button onClick={dismiss} aria-label="Not now" className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:text-ivory">
        <X className="size-4" />
      </button>
    </div>
  );
}
