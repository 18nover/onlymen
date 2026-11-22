/**
 * Directory merge: real creator profiles from the database replace demo
 * placeholders one-for-one. Demo data lives in models.ts (AI portraits,
 * invented names). Real rows are opted in explicitly — today that means
 * om_account.role = 'owner' (Jerry's @admin). Verified-creator + 2257
 * gating is documented below but not turned on, because no KYC vendor or
 * 2257 record capture is wired yet.
 */
import { cities, type Build, type CityId, type Model } from "./models.ts";

export type DirectoryProfile = {
  username: string;
  displayName: string;
  headline: string;
  bio: string;
  city: string;
  age: number | null;
  verified: boolean;
  heightCm?: number;
  bodyType?: string;
  tribes: string[];
  interests: string[];
  lookingFor: string[];
  languages: string[];
  photos: { id: string; primary: boolean; explicit: boolean }[];
  bannerPhotoId?: string | null;
  live: null | { title: string; tags: string[] };
  joinedAt: string;
};

export type DirectoryPayload = { showDemo: boolean; profiles: DirectoryProfile[] };

/** Default ON. Only the explicit value "off" (or "false" / "0") hides placeholders. */
export function demoProfilesEnabled(raw: string | undefined | null): boolean {
  const v = (raw ?? "").trim().toLowerCase();
  if (v === "off" || v === "false" || v === "0") return false;
  return true;
}

export type DirectoryEligibility = {
  role: string;
  accountType: string;
  verificationStatus: string;
  discoverable: boolean;
  hasAttachedPhoto: boolean;
  /** True when 2257 + model-release consents are on file. Not required for owner yet. */
  has2257Records?: boolean;
};

/**
 * Who may appear in the public directory as a *real* profile.
 * Owner is the only current allow: there is no age-verification or 2257
 * capture yet, so regular creator accounts must not be listed.
 * Later: also allow accountType === "creator" && verificationStatus ===
 * "approved" && has2257Records && hasAttachedPhoto && discoverable.
 */
export function isDirectoryEligible(a: DirectoryEligibility): boolean {
  if (!a.hasAttachedPhoto) return false;
  if (a.discoverable === false) return false;
  if (a.role === "owner") return true;
  return false;
}

const METRO_HINTS: [RegExp, CityId][] = [
  [/\b(new york|nyc|manhattan|brooklyn|queens|bronx|staten|chelsea|harlem|soho|williamsburg|bushwick|midtown|west village|hell'?s kitchen|fort greene)\b/i, "nyc"],
  [/\b(los angeles|\bla\b|hollywood|silver lake|weho|west hollywood)\b/i, "la"],
  [/\b(miami|south beach|wynwood)\b/i, "mia"],
  [/\b(chicago|wicker park)\b/i, "chi"],
  [/\b(san francisco|\bsf\b|mission district|the mission)\b/i, "sf"],
];

export function inferMetro(city: string): CityId | undefined {
  const s = city.trim();
  if (!s) return undefined;
  const exact = cities.find((c) => c.id === s.toLowerCase() || c.label.toLowerCase() === s.toLowerCase());
  if (exact) return exact.id;
  for (const [re, id] of METRO_HINTS) if (re.test(s)) return id;
  return undefined;
}

const BUILDS: Build[] = ["Slim", "Athletic", "Muscular", "Average", "Stocky", "Big & tall"];

function inferBuild(bodyType?: string): Build {
  if (!bodyType) return "Average";
  const hit = BUILDS.find((b) => b.toLowerCase() === bodyType.toLowerCase());
  if (hit) return hit;
  const t = bodyType.toLowerCase();
  if (t.includes("bear") || t.includes("tall")) return "Big & tall";
  if (t.includes("muscle")) return "Muscular";
  if (t.includes("toned") || t.includes("fit")) return "Athletic";
  return "Average";
}

function primaryPhotoId(photos: DirectoryProfile["photos"]): string | undefined {
  const usable = photos.filter((p) => !p.explicit);
  return (usable.find((p) => p.primary) ?? usable[0] ?? photos.find((p) => p.primary) ?? photos[0])?.id;
}

function isNew(joinedAt: string, now = Date.now()): boolean {
  const t = new Date(joinedAt).getTime();
  return Number.isFinite(t) && now - t < 14 * 24 * 3600_000;
}

/** Map a real public profile to the directory Model shape. Never invents live/online/verified/tier. */
export function toDirectoryModel(p: DirectoryProfile, now = Date.now()): Model | null {
  const photoId = primaryPhotoId(p.photos);
  if (!photoId) return null;
  const metro = inferMetro(p.city);
  const tags = [...p.interests, ...p.tribes, ...p.lookingFor].filter(Boolean);
  const tagline = (p.headline || p.bio).trim().split(/\n/)[0]?.slice(0, 160) || "";
  const languages = p.languages.length ? p.languages : ["English"];
  const joined = p.joinedAt ? new Date(p.joinedAt) : new Date(now);
  const memberSince = Number.isFinite(joined.getTime())
    ? joined.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";
  return {
    id: `real:${p.username}`,
    handle: p.username,
    name: p.displayName || p.username,
    age: p.age ?? 0,
    km: 99,
    city: p.city || "",
    metro: metro ?? "nyc",
    photo: `/api/photo/${photoId}`,
    ...(p.bannerPhotoId ? { banner: `/api/photo/${p.bannerPhotoId}` } : {}),
    online: false,
    live: Boolean(p.live),
    isNew: isNew(p.joinedAt, now),
    verified: Boolean(p.verified),
    tier: null,
    availableNow: false,
    lastActiveMin: 120,
    tagline,
    tags: tags.slice(0, 8),
    heightCm: p.heightCm ?? 0,
    build: inferBuild(p.bodyType),
    style: "Classic",
    ethnicity: "—",
    hair: "",
    eyes: "",
    tattoos: false,
    zodiac: "",
    languages,
    interests: p.interests.slice(0, 16),
    goodCompanyFor: p.lookingFor.slice(0, 8),
    about: p.bio || tagline,
    availability: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    travels: false,
    rating: 0,
    reviews: [],
    profileViews: 0,
    memberSince,
    focal: ["50% 30%", "50% 15%", "50% 70%", "30% 40%"],
    source: "real",
    metroKnown: Boolean(metro),
  };
}

/**
 * Real profiles first, then remaining demos so the total stays at the demo
 * catalog size (one real replaces one placeholder). When showDemo is false,
 * only real profiles are returned — the site is never padded with invented people.
 */
export function mergeDirectory(demos: Model[], real: Model[], showDemo: boolean): Model[] {
  const seen = new Set(real.map((r) => r.handle.toLowerCase()));
  if (!showDemo) return real;
  const leftover = demos.filter((d) => !seen.has(d.handle.toLowerCase()));
  const keep = Math.max(0, demos.length - real.length);
  return [...real, ...leftover.slice(0, keep)];
}

/** City filter: real profiles with an unknown city only appear in "All cities". */
export function inCity(list: Model[], city: CityId | "all"): Model[] {
  if (city === "all") return list;
  return list.filter((m) => (m.source === "real" ? m.metroKnown !== false && m.metro === city : m.metro === city));
}

/** Keep real profiles pinned at the front; sort/filter only the demo remainder. */
export function arrangeDirectory(list: Model[], demoTransform: (demos: Model[]) => Model[]): Model[] {
  const real = list.filter((m) => m.source === "real");
  const demos = list.filter((m) => m.source !== "real");
  return [...real.filter((m) => demoTransform([m]).length > 0), ...demoTransform(demos)];
}
