// OnlyMen Live — single source of truth for where live video happens.
//
// OnlyMen never hosts explicit video. Viewers are handed off to either the
// creator's OWN linked room (Chaturbate, Stripchat, JFF, OnlyFans live…) or a
// future white-label room on LIVE_BASE_URL (see docs/LIVE.md).

/** Base URL of the white-label live site. Override with VITE_LIVE_BASE_URL. */
export const LIVE_BASE_URL: string = (
  (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_LIVE_BASE_URL) ||
  "https://onlymen.live"
).replace(/\/+$/, "");

/**
 * Flip to true (or set VITE_LIVE_DOMAIN_READY=true) once onlymen.live is bought
 * and a white-label provider is serving it. Until then, hand-offs to the live
 * domain show a graceful "opening soon" screen instead of a dead link.
 */
export const LIVE_DOMAIN_READY: boolean =
  (typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_LIVE_DOMAIN_READY) === "true";

export const liveHost = () => LIVE_BASE_URL.replace(/^https?:\/\//, "");

/** OnlyMen Live room for a username (future white-label). */
export const onlymenLiveRoom = (username: string) => `${LIVE_BASE_URL}/${encodeURIComponent(username)}`;

export const isOnLiveDomain = (url: string) => url.startsWith(LIVE_BASE_URL);

/** Only http(s) URLs may be handed off to. */
export function safeExternalUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export type HandoffTarget = { url: string; kind: "own-room" | "onlymen-live"; available: boolean; platform: string };

export function resolveHandoff(username: string, roomUrl?: string | null, platform?: string): HandoffTarget {
  const own = safeExternalUrl(roomUrl);
  if (own && !isOnLiveDomain(own)) return { url: own, kind: "own-room", available: true, platform: platform || hostLabel(own) };
  return { url: onlymenLiveRoom(username), kind: "onlymen-live", available: LIVE_DOMAIN_READY, platform: "OnlyMen Live" };
}

export function hostLabel(url: string) {
  try {
    const h = new URL(url).hostname.replace(/^www\./, "");
    const known = LIVE_PLATFORMS.find((p) => p.hosts.some((x) => h === x || h.endsWith(`.${x}`)));
    return known?.label ?? h;
  } catch {
    return "External room";
  }
}

export const LIVE_PLATFORMS = [
  { id: "onlymen-live", label: "OnlyMen Live (coming soon)", hosts: [liveHost()], example: `${LIVE_BASE_URL}/yourname` },
  { id: "chaturbate", label: "Chaturbate", hosts: ["chaturbate.com"], example: "https://chaturbate.com/yourname/" },
  { id: "stripchat", label: "Stripchat", hosts: ["stripchat.com"], example: "https://stripchat.com/yourname" },
  { id: "jff", label: "JustFor.Fans", hosts: ["justfor.fans"], example: "https://justfor.fans/yourname" },
  { id: "onlyfans", label: "OnlyFans live", hosts: ["onlyfans.com"], example: "https://onlyfans.com/yourname" },
  { id: "fansly", label: "Fansly", hosts: ["fansly.com"], example: "https://fansly.com/yourname" },
  { id: "camsoda", label: "CamSoda", hosts: ["camsoda.com"], example: "https://www.camsoda.com/yourname" },
  { id: "flirt4free", label: "Flirt4Free", hosts: ["flirt4free.com"], example: "https://www.flirt4free.com/?model=yourname" },
  { id: "x", label: "X (non-explicit Spaces/video)", hosts: ["x.com", "twitter.com"], example: "https://x.com/yourname" },
  { id: "other", label: "Other", hosts: [], example: "https://" },
] as const;

export const LIVE_CATEGORIES = ["Chill & chat", "Workout", "Gaming", "Cooking", "Muscle", "Bear", "Daddy", "Twink", "Couples", "Fetish", "Feet", "Leather", "Roleplay", "Dance", "ASMR", "Q&A"];
