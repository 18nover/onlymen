export type Model = {
  id: string;
  handle: string;
  name: string;
  age: number;
  km: number;
  city: string;
  photo: string;
  online: boolean;
  live: boolean;
  isNew: boolean;
  verified: boolean;
  tagline: string;
  tags: string[];
  viewers?: number;
};

const p = (n: number) => `/models/m${String(n).padStart(2, "0")}.webp`;

export const models: Model[] = [
  { id: "1", handle: "marco.noir", name: "Marco", age: 31, km: 0.8, city: "Chelsea", photo: p(1), online: true, live: true, isNew: false, verified: true, tagline: "Late-night conversation, good wine, better company.", tags: ["Dinner dates", "Travel"], viewers: 214 },
  { id: "2", handle: "dre.gold", name: "Andre", age: 28, km: 1.2, city: "Harlem", photo: p(2), online: true, live: false, isNew: true, verified: true, tagline: "Athlete by day. Gentleman by night.", tags: ["Fitness", "Jazz bars"] },
  { id: "3", handle: "rafa.velvet", name: "Rafael", age: 33, km: 2.4, city: "Hell's Kitchen", photo: p(3), online: true, live: true, isNew: false, verified: true, tagline: "Velvet jackets and red-lit rooms.", tags: ["Nightlife", "Dancing"], viewers: 389 },
  { id: "4", handle: "silverfox.j", name: "James", age: 41, km: 3.1, city: "West Village", photo: p(4), online: false, live: false, isNew: false, verified: true, tagline: "Old soul, warm hands, long stories.", tags: ["Mature", "Whiskey"] },
  { id: "5", handle: "kenji.k", name: "Kenji", age: 29, km: 1.7, city: "SoHo", photo: p(5), online: true, live: false, isNew: true, verified: false, tagline: "Soft sweaters, sharp mind.", tags: ["Art", "Coffee"] },
  { id: "6", handle: "tank.after.dark", name: "Luca", age: 32, km: 4.5, city: "Bushwick", photo: p(6), online: true, live: true, isNew: false, verified: true, tagline: "Gym, music, and the after-party.", tags: ["Muscle", "DJ sets"], viewers: 156 },
  { id: "7", handle: "omar.lounge", name: "Omar", age: 35, km: 2.9, city: "Midtown", photo: p(7), online: false, live: false, isNew: false, verified: true, tagline: "Suit on. Phone off. Your evening.", tags: ["Black tie", "Hotels"] },
  { id: "8", handle: "noah.sun", name: "Noah", age: 27, km: 5.2, city: "Williamsburg", photo: p(8), online: true, live: false, isNew: true, verified: false, tagline: "Golden hour, every hour.", tags: ["Beach", "Travel"] },
  { id: "9", handle: "dev.emerald", name: "Dev", age: 30, km: 3.6, city: "Murray Hill", photo: p(9), online: true, live: true, isNew: true, verified: true, tagline: "Silk, candlelight, slow evenings.", tags: ["Romance", "Poetry"], viewers: 98 },
  { id: "10", handle: "vince.ink", name: "Vince", age: 33, km: 6.8, city: "LES", photo: p(10), online: false, live: false, isNew: false, verified: true, tagline: "Ink, leather, and city lights.", tags: ["Tattoos", "Bikes"] },
  { id: "11", handle: "big.smile.k", name: "Kwame", age: 36, km: 2.0, city: "Fort Greene", photo: p(11), online: true, live: false, isNew: false, verified: true, tagline: "Big laugh. Bigger heart.", tags: ["Bear", "Foodie"] },
  { id: "12", handle: "finn.copper", name: "Finn", age: 28, km: 7.4, city: "Astoria", photo: p(12), online: true, live: false, isNew: true, verified: false, tagline: "Freckles and quiet confidence.", tags: ["Ginger", "Books"] },
  { id: "13", handle: "prof.beard", name: "Daniel", age: 38, km: 4.1, city: "Upper West", photo: p(13), online: false, live: false, isNew: false, verified: true, tagline: "Library voice, bar-stool charm.", tags: ["Daddy", "Wine"] },
  { id: "14", handle: "julian.spot", name: "Julian", age: 29, km: 1.4, city: "NoMad", photo: p(14), online: true, live: true, isNew: false, verified: true, tagline: "Center stage, golden light.", tags: ["Performer", "Fashion"], viewers: 502 },
];

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
      return [...list].sort((a, b) => a.km - b.km).filter((m) => m.km < 3);
    case "verified":
      return list.filter((m) => m.verified);
    default:
      return list;
  }
}
