/**
 * Nearby location math (pure, unit-tested). PRIVACY CORE — see docs/NEARBY.md.
 *
 * The server snaps a raw lat/lng to a geohash cell IMMEDIATELY and keeps only
 * the cell. Precision 6 ≈ 1.2 km × 0.6 km at the equator (≈ 1.2 km × 0.6 km
 * scaled by cos(lat) in width), larger than the 1,750 ft "precise geolocation"
 * line in the Kentucky Consumer Data Protection Act. Every distance and map pin
 * is computed from cells, never from raw coordinates, so nothing finer than
 * the cell can ever leave the server.
 */
const B32 = "0123456789bcdefghjkmnpqrstuvwxyz";
export const CELL_PRECISION = 6;
export const COARSE_PRECISION = 4; // ≈ 39 km × 19.5 km, used as an index key for range queries

export type Bounds = { latMin: number; latMax: number; lngMin: number; lngMax: number };

export function isValidCoord(lat: unknown, lng: unknown): boolean {
  return typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/** Raw → cell. The ONLY function that ever sees raw coordinates. */
export function encode(lat: number, lng: number, precision = CELL_PRECISION): string {
  let latLo = -90, latHi = 90, lngLo = -180, lngHi = 180;
  let out = "", bit = 0, ch = 0, even = true;
  while (out.length < precision) {
    if (even) {
      const mid = (lngLo + lngHi) / 2;
      if (lng >= mid) { ch = (ch << 1) | 1; lngLo = mid; } else { ch <<= 1; lngHi = mid; }
    } else {
      const mid = (latLo + latHi) / 2;
      if (lat >= mid) { ch = (ch << 1) | 1; latLo = mid; } else { ch <<= 1; latHi = mid; }
    }
    even = !even;
    if (++bit === 5) { out += B32[ch]; bit = 0; ch = 0; }
  }
  return out;
}

export function isCell(c: unknown, precision = CELL_PRECISION): c is string {
  return typeof c === "string" && c.length === precision && [...c].every((x) => B32.includes(x));
}

export function bounds(cell: string): Bounds {
  let latLo = -90, latHi = 90, lngLo = -180, lngHi = 180, even = true;
  for (const c of cell) {
    const v = B32.indexOf(c);
    if (v < 0) throw new Error("bad cell");
    for (let b = 4; b >= 0; b--) {
      const on = (v >> b) & 1;
      if (even) { const m = (lngLo + lngHi) / 2; if (on) lngLo = m; else lngHi = m; }
      else { const m = (latLo + latHi) / 2; if (on) latLo = m; else latHi = m; }
      even = !even;
    }
  }
  return { latMin: latLo, latMax: latHi, lngMin: lngLo, lngMax: lngHi };
}

export function center(cell: string): { lat: number; lng: number } {
  const b = bounds(cell);
  return { lat: (b.latMin + b.latMax) / 2, lng: (b.lngMin + b.lngMax) / 2 };
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Cell-centre to cell-centre distance. Never exposed directly; only via bucket(). */
export function cellDistanceKm(a: string, b: string): number {
  return a === b ? 0 : haversineKm(center(a), center(b));
}

/** Coarse (precision-4) cells whose area intersects a box of radiusKm around the cell. Used for the SQL `IN` list. */
export function coarseCover(cell: string, radiusKm: number): string[] {
  const c = center(cell);
  const dLat = radiusKm / 111.32;
  const dLng = radiusKm / (111.32 * Math.max(0.05, Math.cos((c.lat * Math.PI) / 180)));
  const step = bounds(cell.slice(0, COARSE_PRECISION));
  const sLat = (step.latMax - step.latMin) / 2, sLng = (step.lngMax - step.lngMin) / 2;
  const out = new Set<string>();
  for (let la = Math.max(-89.999, c.lat - dLat); la <= Math.min(89.999, c.lat + dLat) + sLat; la += sLat)
    for (let ln = c.lng - dLng; ln <= c.lng + dLng + sLng; ln += sLng) {
      const lnW = ((((Math.min(ln, c.lng + dLng) + 180) % 360) + 360) % 360) - 180;
      out.add(encode(Math.min(la, c.lat + dLat), lnW, COARSE_PRECISION));
    }
  return [...out].slice(0, 400);
}

/** The 3×3 block of precision-6 cells around a cell (home-zone check). */
export function neighborhood(cell: string): Set<string> {
  const b = bounds(cell);
  const h = b.latMax - b.latMin, w = b.lngMax - b.lngMin;
  const c = center(cell);
  const out = new Set<string>();
  for (const dy of [-1, 0, 1]) for (const dx of [-1, 0, 1]) out.add(encode(Math.max(-89.999, Math.min(89.999, c.lat + dy * h)), ((c.lng + dx * w + 540) % 360) - 180, cell.length));
  return out;
}

// ------------------------------------------------------------------ distance buckets

export const BUCKETS: readonly { max: number; label: string }[] = [
  { max: 1, label: "< 1 km" },
  { max: 2, label: "1–2 km" },
  { max: 5, label: "2–5 km" },
  { max: 10, label: "5–10 km" },
  { max: 25, label: "10–25 km" },
  { max: 50, label: "25–50 km" },
  { max: Infinity, label: "50+ km" },
];

/** Bucket index for a cell distance. Same cell and adjacent cells both read "< 1 km". */
export function bucketIndex(km: number): number {
  for (let i = 0; i < BUCKETS.length; i++) if (km < BUCKETS[i].max) return i;
  return BUCKETS.length - 1;
}

export const bucketLabel = (i: number) => BUCKETS[Math.max(0, Math.min(BUCKETS.length - 1, i))].label;

// ------------------------------------------------------------------ plans

export type Plan = "free" | "plus";
/** Radius (km) and grid size by plan. DECISION FOR JERRY: values are placeholders. */
export const PLAN_LIMITS: Record<Plan, { radiusKm: number; gridSize: number }> = {
  free: { radiusKm: 10, gridSize: 30 },
  plus: { radiusKm: 50, gridSize: 150 },
};

// ------------------------------------------------------------------ deterministic randomness

/** 32-bit FNV-1a → seeded PRNG (mulberry32). Inputs are server secrets + ids, never coordinates. */
export function seedFrom(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

export function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates with a seeded PRNG. */
export function shuffle<T>(xs: T[], rnd: () => number): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

/**
 * Map pin for a cell: the cell centre plus a STABLE per-user-per-day offset,
 * uniform over the cell grown by 50% on each side. It depends only on the cell
 * and a secret daily seed, never on the user's raw position, so averaging pins
 * over many requests or many days converges on the cell centre at best: no
 * more than the stored cell. Rounded to 4 decimals (~11 m) for output hygiene.
 */
export function pinFor(cell: string, dailySeed: string): { lat: number; lng: number } {
  const b = bounds(cell);
  const r = prng(seedFrom(dailySeed));
  const h = b.latMax - b.latMin, w = b.lngMax - b.lngMin;
  const lat = b.latMin - h / 2 + r() * h * 2;
  const lng = b.lngMin - w / 2 + r() * w * 2;
  return { lat: Math.round(lat * 1e4) / 1e4, lng: Math.round(lng * 1e4) / 1e4 };
}

// ------------------------------------------------------------------ movement limits

export const MOVE_LIMITS = { minIntervalSec: 20, maxCellChangesPerHour: 12, maxSpeedKmh: 900 } as const;

export type MoveState = { cell: string | null; updatedAt: number | null; windowStart: number | null; windowCount: number };
export type MoveDecision = { ok: true; changed: boolean; state: MoveState } | { ok: false; reason: "too_soon" | "too_many_moves" | "implausible_speed" };

/**
 * Should a new snapped cell replace the stored one? Blocks the "move the origin
 * around to trilaterate" attack: rate-limited, capped moves per hour, and no
 * jumps faster than a plane.
 */
export function decideMove(prev: MoveState, nextCell: string, nowMs: number, lim = MOVE_LIMITS): MoveDecision {
  if (prev.updatedAt !== null && nowMs - prev.updatedAt < lim.minIntervalSec * 1000) return { ok: false, reason: "too_soon" };
  if (prev.cell === nextCell) return { ok: true, changed: false, state: { ...prev, updatedAt: nowMs } };
  let windowStart = prev.windowStart ?? nowMs, windowCount = prev.windowCount;
  if (nowMs - windowStart >= 3600_000) { windowStart = nowMs; windowCount = 0; }
  if (prev.cell && windowCount >= lim.maxCellChangesPerHour) return { ok: false, reason: "too_many_moves" };
  if (prev.cell && prev.updatedAt !== null) {
    const hours = Math.max((nowMs - prev.updatedAt) / 3600_000, 1 / 3600);
    const km = cellDistanceKm(prev.cell, nextCell);
    if (km > 5 && km / hours > lim.maxSpeedKmh) return { ok: false, reason: "implausible_speed" };
  }
  return { ok: true, changed: true, state: { cell: nextCell, updatedAt: nowMs, windowStart, windowCount: prev.cell ? windowCount + 1 : windowCount } };
}

// ------------------------------------------------------------------ presence

export type Presence = "online" | "recent" | null;
export const PRESENCE = { onlineMin: 5, recentMin: 60, heartbeatSec: 60 } as const;

export function presenceOf(lastSeenMs: number | null, nowMs: number, hidden: boolean): Presence {
  if (hidden || lastSeenMs === null) return null;
  const min = (nowMs - lastSeenMs) / 60000;
  return min <= PRESENCE.onlineMin ? "online" : min <= PRESENCE.recentMin ? "recent" : null;
}

/**
 * The ONLY entry point for client coordinates: snap and return just the cell.
 * Used as the server-fn input validator, so raw lat/lng never reach a handler.
 */
export function snapInput(input: unknown): { cell: string } {
  const o = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const lat = Number(o.lat), lng = Number(o.lng);
  return { cell: isValidCoord(lat, lng) ? encode(lat, lng) : "" };
}
