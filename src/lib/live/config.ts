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

export type PublicRoom = { platform: string; url: string };

/** http(s) rooms only; platform label falls back to the recognised host. Query strings (affiliate params) are kept. */
export function publicRooms(rooms: { platform?: string; url?: string }[] | undefined | null): PublicRoom[] {
  const out: PublicRoom[] = [];
  const seen = new Set<string>();
  for (const r of rooms ?? []) {
    const url = safeExternalUrl(r.url);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const platform = (r.platform ?? "").trim() || hostLabel(url);
    out.push({ platform, url });
    if (out.length >= 10) break;
  }
  return out;
}

/** Official Chaturbate embed src, preserving affiliate query params so referrals still credit the creator. */
export function chaturbateEmbedSrc(url: string | undefined | null): string | null {
  const safe = safeExternalUrl(url);
  if (!safe) return null;
  try {
    const u = new URL(safe);
    const host = u.hostname.replace(/^www\./, "");
    if (host !== "chaturbate.com" && host !== "cbxyz.com") return null;
    if (!u.pathname.startsWith("/in/")) return null;
    // Keep the exact query string (tour, campaign, track, room, …).
    return `https://cbxyz.com${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

export const LIVE_PLATFORMS = [
  { id: "onlymen-live", label: "OnlyMen Live (coming soon)", hosts: [liveHost()], example: `${LIVE_BASE_URL}/yourname` },
  { id: "cam4", label: "CAM4", hosts: ["cam4.com"], example: "https://www.cam4.com/yourname" },
  { id: "chaturbate", label: "Chaturbate", hosts: ["chaturbate.com", "cbxyz.com"], example: "https://chaturbate.com/yourname/" },
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
