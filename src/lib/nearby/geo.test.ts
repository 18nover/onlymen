import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bounds, bucketIndex, bucketLabel, cellDistanceKm, center, coarseCover, dayKey, decideMove, encode, haversineKm, isCell, isValidCoord,
  neighborhood, pinFor, PLAN_LIMITS, presenceOf, prng, seedFrom, shuffle, BUCKETS,
} from "./geo.ts";

// A made-up test point (a park bench, not anyone's home). Never a real user's location.
const TRUE = { lat: 39.08367, lng: -84.50855 };

test("geohash: reference vector and precision-6 cell size (~1.2 km × 0.6 km)", () => {
  assert.equal(encode(57.64911, 10.40744, 11), "u4pruydqqvj");
  const c = encode(TRUE.lat, TRUE.lng);
  assert.ok(isCell(c));
  assert.equal(c.length, 6);
  const b = bounds(c);
  const wKm = haversineKm({ lat: b.latMin, lng: b.lngMin }, { lat: b.latMin, lng: b.lngMax });
  const hKm = haversineKm({ lat: b.latMin, lng: b.lngMin }, { lat: b.latMax, lng: b.lngMin });
  assert.ok(wKm > 0.5 && wKm < 1.2 && hKm > 0.5 && hKm < 0.7, `${wKm} × ${hKm}`);
  assert.ok(TRUE.lat >= b.latMin && TRUE.lat <= b.latMax && TRUE.lng >= b.lngMin && TRUE.lng <= b.lngMax);
});

test("input validation", () => {
  assert.equal(isValidCoord(91, 0), false);
  assert.equal(isValidCoord(0, 181), false);
  assert.equal(isValidCoord(Number.NaN, 0), false);
  assert.equal(isValidCoord("39" as unknown as number, 0), false);
  assert.equal(isCell("dngykF"), false);
  assert.equal(isCell("dngyka"), false); // 'a' isn't in the geohash alphabet
  assert.equal(isCell("dngyk"), false);
});

test("snapping is irreversible: every point inside a cell gives the same cell and centre", () => {
  const c = encode(TRUE.lat, TRUE.lng);
  const b = bounds(c);
  const r = prng(7);
  for (let i = 0; i < 2000; i++) {
    const lat = b.latMin + r() * (b.latMax - b.latMin) * 0.999999;
    const lng = b.lngMin + r() * (b.lngMax - b.lngMin) * 0.999999;
    assert.equal(encode(lat, lng), c);
  }
  // The centre is the only "location" derivable from a cell, and it is not the true point.
  assert.ok(haversineKm(center(c), TRUE) > 0.01);
});

test("coarse cover contains every cell within the radius", () => {
  const origin = encode(TRUE.lat, TRUE.lng);
  for (const radius of [PLAN_LIMITS.free.radiusKm, PLAN_LIMITS.plus.radiusKm]) {
    const cover = new Set(coarseCover(origin, radius));
    const r = prng(radius);
    for (let i = 0; i < 3000; i++) {
      const ang = r() * 2 * Math.PI, d = Math.sqrt(r()) * radius * 0.97;
      const lat = center(origin).lat + (d / 111.2) * Math.cos(ang);
      const lng = center(origin).lng + (d / (111.2 * Math.cos((center(origin).lat * Math.PI) / 180))) * Math.sin(ang);
      const cell = encode(lat, lng);
      if (cellDistanceKm(origin, cell) <= radius) assert.ok(cover.has(cell.slice(0, 4)), `missing ${cell} at ${d.toFixed(1)} km`);
    }
  }
});

test("distance buckets", () => {
  assert.equal(bucketLabel(bucketIndex(0)), BUCKETS[0].label);
  assert.equal(bucketLabel(bucketIndex(0.99)), "< 1 km");
  assert.equal(bucketLabel(bucketIndex(1.5)), "1–2 km");
  assert.equal(bucketLabel(bucketIndex(3)), "2–5 km");
  assert.equal(bucketLabel(bucketIndex(7)), "5–10 km");
  assert.equal(bucketLabel(bucketIndex(500)), BUCKETS[BUCKETS.length - 1].label);
});

test("plan limits: free is smaller than plus", () => {
  assert.ok(PLAN_LIMITS.free.radiusKm < PLAN_LIMITS.plus.radiusKm);
  assert.ok(PLAN_LIMITS.free.gridSize < PLAN_LIMITS.plus.gridSize);
});

test("shuffle is deterministic per seed and a permutation", () => {
  const xs = Array.from({ length: 20 }, (_, i) => i);
  const a = shuffle(xs, prng(seedFrom("viewer:2026-11-22")));
  const b = shuffle(xs, prng(seedFrom("viewer:2026-11-22")));
  const c = shuffle(xs, prng(seedFrom("viewer:2026-11-23")));
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.deepEqual([...a].sort((x, y) => x - y), xs);
});

test("pins: stable within a day, drift across days, never depend on the true point", () => {
  const cell = encode(TRUE.lat, TRUE.lng);
  const p1 = pinFor(cell, "seed:2026-11-22");
  for (let i = 0; i < 50; i++) assert.deepEqual(pinFor(cell, "seed:2026-11-22"), p1); // repeated requests: nothing to average
  assert.notDeepEqual(pinFor(cell, "seed:2026-11-23"), p1);
  // pinFor only receives the cell: two true points in one cell produce identical pins.
  const b = bounds(cell);
  const other = encode(b.latMin + 1e-6, b.lngMax - 1e-6);
  assert.equal(other, cell);
  assert.deepEqual(pinFor(other, "seed:x"), pinFor(cell, "seed:x"));
});

test("trilateration by averaging pins over two years converges to the CELL centre, not the true point", () => {
  const cell = encode(TRUE.lat, TRUE.lng);
  const c = center(cell);
  let sLat = 0, sLng = 0;
  const N = 730;
  const start = Date.UTC(2026, 0, 1);
  for (let i = 0; i < N; i++) {
    const p = pinFor(cell, `jitter:${dayKey(new Date(start + i * 86400_000))}`);
    sLat += p.lat;
    sLng += p.lng;
  }
  const avg = { lat: sLat / N, lng: sLng / N };
  const errToCentre = haversineKm(avg, c);
  const errToTrue = haversineKm(avg, TRUE);
  assert.ok(errToCentre < 0.08, `avg is ${errToCentre} km from cell centre`);
  // The best an attacker gets is the cell centre; the true point stays as far as it is from the centre.
  assert.ok(Math.abs(errToTrue - haversineKm(c, TRUE)) < 0.08);
});

test("pins wander across the whole cell area (≈ up to 1 km) each day", () => {
  const cell = encode(TRUE.lat, TRUE.lng);
  const c = center(cell);
  let max = 0;
  for (let i = 0; i < 200; i++) max = Math.max(max, haversineKm(pinFor(cell, `d${i}`), c));
  assert.ok(max > 0.4, `max drift ${max}`);
  assert.ok(max < 1.5);
});

test("home zone neighbourhood is the 3×3 block around a cell", () => {
  const c = encode(TRUE.lat, TRUE.lng);
  const n = neighborhood(c);
  assert.equal(n.size, 9);
  assert.ok(n.has(c));
  for (const x of n) assert.ok(cellDistanceKm(c, x) < 1.5);
});

test("move limits: too soon, too many cell changes per hour, implausible speed", () => {
  const a = encode(39.1, -84.5), b = encode(39.11, -84.5), far = encode(40.7, -74.0);
  let s = { cell: null as string | null, updatedAt: null as number | null, windowStart: null as number | null, windowCount: 0 };
  let t = 1_700_000_000_000;
  const first = decideMove(s, a, t);
  assert.ok(first.ok);
  s = first.ok ? first.state : s;
  assert.deepEqual(decideMove(s, b, t + 5_000), { ok: false, reason: "too_soon" });
  const jump = decideMove(s, far, t + 60_000);
  assert.deepEqual(jump, { ok: false, reason: "implausible_speed" });
  let refused = false;
  for (let i = 0; i < 20; i++) {
    t += 30_000;
    const d = decideMove(s, i % 2 ? a : b, t);
    if (!d.ok) { assert.equal(d.reason, "too_many_moves"); refused = true; break; }
    s = d.state;
  }
  assert.ok(refused);
  const later = decideMove(s, a === s.cell ? b : a, t + 3600_000);
  assert.ok(later.ok, "window resets after an hour");
});

test("presence: online, recently active, hidden", () => {
  const now = 1_700_000_000_000;
  assert.equal(presenceOf(now - 60_000, now, false), "online");
  assert.equal(presenceOf(now - 30 * 60_000, now, false), "recent");
  assert.equal(presenceOf(now - 3 * 3600_000, now, false), null);
  assert.equal(presenceOf(now - 60_000, now, true), null);
  assert.equal(presenceOf(null, now, false), null);
});
