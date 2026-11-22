// All profiles below are invented demo data. Portraits are AI-generated placeholders.

export type Build = "Slim" | "Athletic" | "Muscular" | "Average" | "Stocky" | "Big & tall";
export type Style = "Classic" | "Jock" | "Daddy" | "Bear" | "Artsy" | "Alt" | "Preppy";

export type Model = {
  id: string;
  handle: string;
  name: string;
  age: number;
  km: number;
  city: string; // neighborhood
  metro: CityId;
  photo: string;
  /** Cover image URL for real profiles; unset on demo placeholders. */
  banner?: string;
  online: boolean;
  live: boolean;
  isNew: boolean;
  verified: boolean;
  /** Editorial pick for the Featured row (demo data only; not paid placement). */
  featured: boolean;
  lastActiveMin: number; // minutes since last active
  tagline: string;
  tags: string[];
  viewers?: number;
  // profile
  heightCm: number;
  build: Build;
  style: Style;
  ethnicity: string;
  hair: string;
  eyes: string;
  tattoos: boolean;
  zodiac: string;
  languages: string[];
  interests: string[];
  about: string;
  memberSince: string;
  focal: string[]; // object-position crops used for the demo gallery
  /** "real" = a database account; unset or "demo" = invented placeholder. */
  source?: "demo" | "real";
  /** For real profiles: false when city could not be mapped to a metro. */
  metroKnown?: boolean;
};

export const cities = [
  { id: "nyc", label: "New York", region: "NY" },
  { id: "la", label: "Los Angeles", region: "CA" },
  { id: "mia", label: "Miami", region: "FL" },
  { id: "chi", label: "Chicago", region: "IL" },
  { id: "sf", label: "San Francisco", region: "CA" },
] as const;
export type CityId = (typeof cities)[number]["id"];
export const cityLabel = (id: CityId | "all") =>
  id === "all" ? "All cities" : (() => { const c = cities.find((x) => x.id === id)!; return `${c.label}, ${c.region}`; })();

const p = (n: number) => `/models/m${String(n).padStart(2, "0")}.webp`;

type Seed = Pick<Model, "handle" | "name" | "age" | "km" | "city" | "metro" | "online" | "live" | "isNew" | "verified" | "featured" | "tagline" | "tags"> &
  Partial<Model>;

const seeds: Seed[] = [
  { handle: "marco.noir", name: "Marco", age: 31, km: 0.8, city: "Chelsea", metro: "nyc", online: true, live: true, isNew: false, verified: true, featured: true, tagline: "Late-night streams, good wine, better stories.", tags: ["Live shows", "Travel"], viewers: 214, heightCm: 183, build: "Athletic", style: "Classic", ethnicity: "Mediterranean", hair: "Black", eyes: "Brown", languages: ["English", "Italian"], zodiac: "Scorpio" },
  { handle: "dre.gold", name: "Andre", age: 28, km: 1.2, city: "Harlem", metro: "nyc", online: true, live: false, isNew: true, verified: true, featured: true, tagline: "Athlete by day. Live by night.", tags: ["Fitness", "Jazz bars"], heightCm: 188, build: "Muscular", style: "Jock", ethnicity: "Black", hair: "Black", eyes: "Brown", languages: ["English", "French"], zodiac: "Leo" },
  { handle: "rafa.velvet", name: "Rafael", age: 33, km: 2.4, city: "Hell's Kitchen", metro: "nyc", online: true, live: true, isNew: false, verified: true, featured: true, tagline: "Velvet jackets and red-lit rooms.", tags: ["Nightlife", "Dancing"], viewers: 389, heightCm: 178, build: "Athletic", style: "Classic", ethnicity: "Latino", hair: "Dark brown", eyes: "Hazel", languages: ["English", "Spanish", "Portuguese"], zodiac: "Libra" },
  { handle: "silverfox.j", name: "James", age: 41, km: 3.1, city: "West Village", metro: "nyc", online: false, live: false, isNew: false, verified: true, featured: true, tagline: "Old soul, warm hands, long stories.", tags: ["Mature", "Whiskey"], heightCm: 185, build: "Average", style: "Daddy", ethnicity: "White", hair: "Silver", eyes: "Blue", languages: ["English"], zodiac: "Capricorn", lastActiveMin: 180 },
  { handle: "kenji.k", name: "Kenji", age: 29, km: 1.7, city: "SoHo", metro: "nyc", online: true, live: false, isNew: true, verified: false, featured: false, tagline: "Soft sweaters, sharp mind.", tags: ["Art", "Coffee"], heightCm: 175, build: "Slim", style: "Artsy", ethnicity: "East Asian", hair: "Black", eyes: "Brown", languages: ["English", "Japanese"], zodiac: "Pisces" },
  { handle: "tank.after.dark", name: "Luca", age: 32, km: 4.5, city: "Bushwick", metro: "nyc", online: true, live: true, isNew: false, verified: true, featured: false, tagline: "Gym, music, and the after-party.", tags: ["Muscle", "DJ sets"], viewers: 156, heightCm: 180, build: "Muscular", style: "Jock", ethnicity: "White", hair: "Brown", eyes: "Green", languages: ["English", "German"], zodiac: "Aries" },
  { handle: "omar.lounge", name: "Omar", age: 35, km: 2.9, city: "Midtown", metro: "nyc", online: false, live: false, isNew: false, verified: true, featured: true, tagline: "Suit on. Camera on. Tailored content.", tags: ["Black tie", "Fashion"], heightCm: 186, build: "Athletic", style: "Preppy", ethnicity: "Middle Eastern", hair: "Black", eyes: "Brown", languages: ["English", "Arabic", "French"], zodiac: "Virgo", lastActiveMin: 45 },
  { handle: "noah.sun", name: "Noah", age: 27, km: 5.2, city: "South Beach", metro: "mia", online: true, live: false, isNew: true, verified: false, featured: false, tagline: "Golden hour, every hour.", tags: ["Beach", "Travel"], heightCm: 181, build: "Athletic", style: "Jock", ethnicity: "White", hair: "Blond", eyes: "Blue", languages: ["English"], zodiac: "Gemini" },
  { handle: "dev.emerald", name: "Dev", age: 30, km: 3.6, city: "Mission", metro: "sf", online: true, live: true, isNew: true, verified: true, featured: true, tagline: "Silk, candlelight, slow evenings.", tags: ["Romance", "Poetry"], viewers: 98, heightCm: 177, build: "Slim", style: "Artsy", ethnicity: "South Asian", hair: "Black", eyes: "Brown", languages: ["English", "Hindi"], zodiac: "Taurus" },
  { handle: "vince.ink", name: "Vince", age: 33, km: 6.8, city: "Silver Lake", metro: "la", online: false, live: false, isNew: false, verified: true, featured: false, tagline: "Ink, leather, and city lights.", tags: ["Tattoos", "Bikes"], heightCm: 182, build: "Stocky", style: "Alt", ethnicity: "White", hair: "Dark brown", eyes: "Brown", tattoos: true, languages: ["English"], zodiac: "Sagittarius", lastActiveMin: 1440 * 2 },
  { handle: "big.smile.k", name: "Kwame", age: 36, km: 2.0, city: "Fort Greene", metro: "nyc", online: true, live: false, isNew: false, verified: true, featured: true, tagline: "Big laugh. Bigger heart.", tags: ["Bear", "Foodie"], heightCm: 190, build: "Big & tall", style: "Bear", ethnicity: "Black", hair: "Black", eyes: "Brown", languages: ["English", "Twi"], zodiac: "Cancer" },
  { handle: "finn.copper", name: "Finn", age: 28, km: 7.4, city: "Wicker Park", metro: "chi", online: true, live: false, isNew: true, verified: false, featured: false, tagline: "Freckles and quiet confidence.", tags: ["Ginger", "Books"], heightCm: 179, build: "Slim", style: "Preppy", ethnicity: "White", hair: "Red", eyes: "Green", languages: ["English"], zodiac: "Aquarius" },
  { handle: "prof.beard", name: "Daniel", age: 38, km: 4.1, city: "West Hollywood", metro: "la", online: false, live: false, isNew: false, verified: true, featured: false, tagline: "Library voice, bar-stool charm.", tags: ["Daddy", "Wine"], heightCm: 184, build: "Average", style: "Daddy", ethnicity: "White", hair: "Brown", eyes: "Blue", languages: ["English", "Spanish"], zodiac: "Virgo", lastActiveMin: 600 },
  { handle: "julian.spot", name: "Julian", age: 29, km: 1.4, city: "Wynwood", metro: "mia", online: true, live: true, isNew: false, verified: true, featured: true, tagline: "Center stage, golden light.", tags: ["Performer", "Fashion"], viewers: 502, heightCm: 180, build: "Athletic", style: "Classic", ethnicity: "Latino", hair: "Black", eyes: "Brown", languages: ["English", "Spanish"], zodiac: "Leo" },
];

// deterministic pseudo-random so SSR and client agree
function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

const interestPool = ["Fine dining", "Cocktail bars", "Museums", "Live jazz", "Gym partner", "Hiking", "Theatre", "Travel", "Wine tasting", "Vinyl", "Cooking", "Fashion week", "Beach days", "Gaming", "Photography", "Brunch"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function build(s: Seed, i: number): Model {
  const r = rand(i + 7);
  const pick = <T,>(arr: readonly T[], n: number) => {
    const copy = [...arr];
    const out: T[] = [];
    while (out.length < n && copy.length) out.push(copy.splice(Math.floor(r() * copy.length), 1)[0]);
    return out;
  };
  return {
    id: String(i + 1),
    photo: p(i + 1),
    lastActiveMin: s.online || s.live ? 0 : (s.lastActiveMin ?? 120),
    heightCm: 180,
    build: "Athletic",
    style: "Classic",
    ethnicity: "—",
    hair: "Brown",
    eyes: "Brown",
    tattoos: r() > 0.7,
    zodiac: "Leo",
    languages: ["English"],
    interests: [...s.tags, ...pick(interestPool, 4)],
    about: `${s.tagline} I'm ${s.name}, ${s.age}, based in ${s.city}. I love ${s.tags.join(" and ").toLowerCase()}, and I go live most weeks. Say hi in chat, or catch my next stream.`,
    memberSince: `${months[i % months.length]} ${2024 + (i % 3)}`,
    focal: ["50% 30%", "50% 15%", "50% 70%", "30% 40%"],
    ...s,
    source: "demo",
  };
}

export const models: Model[] = seeds.map(build);
export const findModel = (handle: string) => models.find((m) => m.handle === handle);

export const filters = [
  { id: "all", label: "Everyone" },
  { id: "online", label: "Online" },
  { id: "live", label: "Live now" },
  { id: "new", label: "New" },
  { id: "nearby", label: "Nearby" },
  { id: "verified", label: "Verified" },
] as const;

export type FilterId = (typeof filters)[number]["id"];

export function applyFilter(list: Model[], f: FilterId): Model[] {
  switch (f) {
    case "online":
      return list.filter((m) => m.online || m.live);
    case "live":
      return list.filter((m) => m.live);
    case "new":
      return list.filter((m) => m.isNew);
    case "nearby":
      return list.filter((m) => m.km < 3);
    case "verified":
      return list.filter((m) => m.verified);
    default:
      return list;
  }
}

// ---- advanced search -------------------------------------------------------

export const builds: Build[] = ["Slim", "Athletic", "Muscular", "Average", "Stocky", "Big & tall"];
export const styles: Style[] = ["Classic", "Jock", "Daddy", "Bear", "Artsy", "Alt", "Preppy"];
export const ethnicities = ["Black", "East Asian", "Latino", "Mediterranean", "Middle Eastern", "South Asian", "White"];
export const allLanguages = Array.from(new Set(seeds.flatMap((s) => s.languages ?? []))).sort();

export type Search = {
  q: string;
  verifiedOnly: boolean;
  age: [number, number];
  heightCm: [number, number];
  builds: Build[];
  styles: Style[];
  ethnicities: string[];
  languages: string[];
};

export const defaultSearch: Search = {
  q: "",
  verifiedOnly: false,
  age: [18, 60],
  heightCm: [155, 205],
  builds: [],
  styles: [],
  ethnicities: [],
  languages: [],
};

export function activeFilterCount(s: Search) {
  const d = defaultSearch;
  return [
    s.q.trim() !== "",
    s.verifiedOnly,
    s.age[0] !== d.age[0] || s.age[1] !== d.age[1],
    s.heightCm[0] !== d.heightCm[0] || s.heightCm[1] !== d.heightCm[1],
    s.builds.length > 0,
    s.styles.length > 0,
    s.ethnicities.length > 0,
    s.languages.length > 0,
  ].filter(Boolean).length;
}

export function applySearch(list: Model[], s: Search): Model[] {
  const q = s.q.trim().toLowerCase().replace(/^#/, "");
  return list.filter((m) => {
    if (q && ![m.name, m.handle, m.city, m.tagline, ...m.tags, ...m.interests].join(" ").toLowerCase().includes(q)) return false;
    if (s.verifiedOnly && !m.verified) return false;
    if (m.age < s.age[0] || m.age > s.age[1]) return false;
    if (m.heightCm < s.heightCm[0] || m.heightCm > s.heightCm[1]) return false;
    if (s.builds.length && !s.builds.includes(m.build)) return false;
    if (s.styles.length && !s.styles.includes(m.style)) return false;
    if (s.ethnicities.length && !s.ethnicities.includes(m.ethnicity)) return false;
    if (s.languages.length && !s.languages.some((l) => m.languages.includes(l))) return false;
    return true;
  });
}

export const sorts = [
  { id: "recommended", label: "Recommended" },
  { id: "nearest", label: "Nearest" },
  { id: "active", label: "Recently active" },
  { id: "newest", label: "New faces first" },
] as const;
export type SortId = (typeof sorts)[number]["id"];

export function applySort(list: Model[], sort: SortId): Model[] {
  const l = [...list];
  switch (sort) {
    case "nearest":
      return l.sort((a, b) => a.km - b.km);
    case "active":
      return l.sort((a, b) => a.lastActiveMin - b.lastActiveMin || Number(b.live) - Number(a.live));
    case "newest":
      return l.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.km - b.km);
    default:
      return l.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.live) - Number(a.live) ||
          Number(b.online) - Number(a.online) ||
          a.km - b.km,
      );
  }
}

// ---- formatting ------------------------------------------------------------

export function fmtHeight(cm: number) {
  const inches = Math.round(cm / 2.54);
  return `${Math.floor(inches / 12)}'${inches % 12}" · ${cm} cm`;
}
export function fmtDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
export function fmtActive(m: Pick<Model, "live" | "online" | "lastActiveMin">) {
  if (m.live) return "Live now";
  if (m.online) return "Online now";
  const min = m.lastActiveMin;
  if (min < 60) return `Active ${min} min ago`;
  if (min < 1440) return `Active ${Math.round(min / 60)}h ago`;
  return `Active ${Math.round(min / 1440)}d ago`;
}
