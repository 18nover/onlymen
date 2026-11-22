/**
 * End-to-end privacy tests for Nearby against an in-memory Postgres (PGLite)
 * with the real migrations 0001–0007 applied.
 */
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db";
import * as repo from "./repo.server.ts";
import { bounds, center, encode, snapInput, PLAN_LIMITS } from "./geo.ts";

const SECRET = "test-secret-not-real";
// Made-up test points (not anyone's real location).
const TRUE = { lat: 39.08367, lng: -84.50855 };
const TRUE_STR = ["39.08367", "84.50855", "39.0836", "84.5085"];

let pg: PGlite;
let db: Sql;
const logs: string[] = [];

function makeSql(p: PGlite): Sql {
  const run = async (text: string, values: unknown[]) => (await p.query(text, values)).rows;
  const fn = ((strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i++) text += `$${i + 1}${strings[i + 1]}`;
    return run(text, values);
  }) as unknown as Sql;
  return fn;
}

const users: Record<string, string> = {};
async function mkUser(name: string, opts: { creator?: boolean; role?: string } = {}) {
  const id = `u_${name}`;
  users[name] = id;
  await pg.query(`insert into "user" (id, name, email, "emailVerified") values ($1, $2, $3, true)`, [id, name, `${name}@example.test`]);
  await pg.query(`insert into om_account (user_id, username, account_type, dob, profile, role) values ($1, $2, $3, '1990-01-01', $4, $5)`,
    [id, name, opts.creator ? "creator" : "member", JSON.stringify({ displayName: name.toUpperCase() }), opts.role ?? "user"]);
  return id;
}
const allowAll = () => ({ all: false, invites: false, ids: Object.entries(users).filter(([n]) => n !== "outsider").map(([, id]) => id), usernames: [] as string[] });

let clock = Date.now() - 3600_000 * 24; // move-limit clock (strictly increasing)
const tick = (ms = 30 * 60_000) => (clock += ms);
async function placeAt(name: string, lat: number, lng: number) {
  const { cell } = snapInput({ lat, lng });
  const r = await repo.updateCell(db, users[name], cell, tick());
  assert.ok(r.ok, `placeAt ${name}: ${JSON.stringify(r)}`);
}
/** Offset a point by km north/east. */
const off = (p: { lat: number; lng: number }, north: number, east: number) => ({
  lat: p.lat + north / 111.2, lng: p.lng + east / (111.2 * Math.cos((p.lat * Math.PI) / 180)),
});

before(async () => {
  pg = new PGlite();
  const dir = new URL("../../../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((x) => /^\d{4}_.*\.sql$/.test(x)).sort()) await pg.exec(readFileSync(new URL(f, dir), "utf8"));
  db = makeSql(pg);
  for (const k of ["log", "info", "warn", "error", "debug"] as const) {
    const orig = console[k].bind(console);
    console[k] = (...a: unknown[]) => {
      logs.push(a.map(String).join(" "));
      orig(...a);
    };
  }
  await mkUser("viewer");
  await mkUser("target", { creator: true });
  await mkUser("twin");
  await mkUser("blocker");
  await mkUser("ghost");
  await mkUser("farguy");
  await mkUser("admin", { role: "owner" });
  await mkUser("outsider"); // never in the allowlist
});

test("schema: no coordinate columns anywhere and no location history table", async () => {
  const cols = (await pg.query<{ table_name: string; column_name: string; data_type: string }>(
    `select table_name, column_name, data_type from information_schema.columns where table_schema = 'public'`)).rows;
  for (const c of cols) {
    assert.ok(!/(^|_)(lat|lng|lon|latitude|longitude|coord|coords|geo|point|position_x)($|_)/i.test(c.column_name) || c.column_name === "position",
      `suspicious column ${c.table_name}.${c.column_name}`);
    assert.ok(!["point", "geometry", "geography", "double precision", "real"].includes(c.data_type) || c.table_name !== "om_location",
      `numeric location column ${c.table_name}.${c.column_name}`);
  }
  const loc = cols.filter((c) => c.table_name === "om_location").map((c) => c.column_name).sort();
  assert.deepEqual(loc, ["appear_offline", "cell", "cell4", "consent_at", "created_at", "hide_distance", "home_cell", "incognito", "jitter_seed", "share_pin", "updated_at", "user_id", "window_count", "window_start"].sort());
  const tables = new Set(cols.map((c) => c.table_name));
  for (const t of tables) assert.ok(!/history|trail|track/i.test(t), `history-like table ${t}`);
  // A raw coordinate cannot even be written: the cell column only accepts a 6-char geohash.
  await assert.rejects(pg.query(`insert into om_location (user_id, jitter_seed, cell) values ('x', 'x', '39.08367,-84.50855')`));
});

test("validator snaps immediately and returns ONLY the cell", () => {
  const out = snapInput({ lat: TRUE.lat, lng: TRUE.lng, accuracy: 3, extra: "x" });
  assert.deepEqual(Object.keys(out), ["cell"]);
  assert.equal(out.cell, encode(TRUE.lat, TRUE.lng));
  for (const s of TRUE_STR) assert.ok(!JSON.stringify(out).includes(s));
  assert.deepEqual(snapInput({ lat: 200, lng: 0 }), { cell: "" });
  assert.deepEqual(snapInput(null), { cell: "" });
});

test("location is stored in place: one row per user, no history", async () => {
  await placeAt("viewer", ...(Object.values(off(TRUE, 0, 3)) as [number, number]));
  await placeAt("viewer", ...(Object.values(off(TRUE, 0.8, 3)) as [number, number]));
  await placeAt("viewer", ...(Object.values(off(TRUE, 0, 3)) as [number, number]));
  const n = (await pg.query<{ n: number }>(`select count(*)::int as n from om_location where user_id = $1`, [users.viewer])).rows[0].n;
  assert.equal(n, 1);
  await placeAt("target", TRUE.lat, TRUE.lng);
  await repo.saveSettings(db, users.target, { sharePin: true });
});

test("rate limit: a second update within 20 s is refused", async () => {
  const c = encode(TRUE.lat + 0.01, TRUE.lng);
  const r1 = await repo.updateCell(db, users.ghost, c, tick());
  assert.ok(r1.ok);
  const r2 = await repo.updateCell(db, users.ghost, encode(TRUE.lat + 0.02, TRUE.lng), clock + 5_000);
  assert.deepEqual(r2, { ok: false, reason: "too_soon" });
});

test("grid: distance buckets only, allowlist respected, origin is the viewer's own stored cell", async () => {
  await mkUser("ally");
  await placeAt("outsider", TRUE.lat, TRUE.lng);
  const g = await repo.grid(db, users.viewer, { approxCell: "zzzzzz", allow: allowAll(), secret: SECRET });
  assert.equal(g.origin, "mine");
  const names = g.items.map((i) => i.username);
  assert.ok(names.includes("target"));
  assert.ok(!names.includes("outsider"), "non-allowed accounts never appear");
  assert.ok(!names.includes("viewer"), "you don't see yourself");
  const t = g.items.find((i) => i.username === "target")!;
  assert.equal(t.distance, "2–5 km");
  assert.deepEqual(Object.keys(t).sort(), ["age", "creator", "displayName", "distance", "photoId", "presence", "saved", "tapped", "username", "verified"]);
});

test("NO LEAK: grid, map, settings responses, the database and logs never contain the exact position", async () => {
  const bag: string[] = [];
  const allow = allowAll();
  // Attacker spoofs his own location across a 9×9 lattice of cells and collects everything, over many days.
  for (let dn = -4; dn <= 4; dn++)
    for (let de = -4; de <= 4; de++) {
      const p = off(TRUE, dn * 0.9, de * 0.9);
      await placeAt("viewer", p.lat, p.lng);
      for (const day of [0, 1, 2, 30]) {
        const now = new Date(Date.now() + day * 86400_000);
        bag.push(JSON.stringify(await repo.grid(db, users.viewer, { approxCell: null, allow, secret: SECRET, now })));
        bag.push(JSON.stringify(await repo.mapPins(db, users.viewer, { approxCell: null, allow, secret: SECRET, now })));
      }
    }
  bag.push(JSON.stringify(await repo.settings(db, users.target)));
  const all = bag.join("\n");
  for (const s of TRUE_STR) assert.ok(!all.includes(s), `response leaked ${s}`);
  assert.ok(!all.includes(encode(TRUE.lat, TRUE.lng)), "responses never include a cell id");
  assert.ok(!/"(cell|lat_raw|latitude|longitude|km|distanceKm)"/.test(all));

  const tables = (await pg.query<{ t: string }>(`select table_name as t from information_schema.tables where table_schema = 'public'`)).rows.map((r) => r.t);
  let dump = "";
  for (const t of tables) dump += JSON.stringify((await pg.query(`select * from "${t}"`)).rows);
  for (const s of TRUE_STR) assert.ok(!dump.includes(s), `database contains ${s}`);
  for (const s of TRUE_STR) assert.ok(!logs.join("\n").includes(s), `logs contain ${s}`);
});

test("trilateration: two different true points in one cell are indistinguishable to every attacker", async () => {
  const cell = encode(TRUE.lat, TRUE.lng);
  const b = bounds(cell);
  const A = { lat: b.latMin + (b.latMax - b.latMin) * 0.1, lng: b.lngMin + (b.lngMax - b.lngMin) * 0.1 };
  const B = { lat: b.latMin + (b.latMax - b.latMin) * 0.9, lng: b.lngMin + (b.lngMax - b.lngMin) * 0.9 };
  assert.equal(encode(A.lat, A.lng), encode(B.lat, B.lng));
  const allow = allowAll();
  const observe = async () => {
    const out: string[] = [];
    for (let dn = -3; dn <= 3; dn++)
      for (let de = -3; de <= 3; de++) {
        const p = off(center(cell), dn * 1.3 + 0.2, de * 1.7 + 0.1);
        await repo.updateCell(db, users.blocker, encode(p.lat, p.lng), tick());
        const now = new Date("2026-11-22T12:00:00Z");
        const g = await repo.grid(db, users.blocker, { approxCell: null, allow, secret: SECRET, now });
        const m = await repo.mapPins(db, users.blocker, { approxCell: null, allow, secret: SECRET, now });
        out.push(JSON.stringify([g.items.find((i) => i.username === "twin")?.distance, m.pins.find((x) => x.username === "twin")]));
      }
    return out;
  };
  await repo.saveSettings(db, users.twin, {});
  await repo.updateCell(db, users.twin, snapInput(A).cell, tick());
  await repo.saveSettings(db, users.twin, { sharePin: true });
  const seenA = await observe();
  await repo.updateCell(db, users.twin, snapInput(B).cell, tick());
  const seenB = await observe();
  assert.deepEqual(seenA, seenB, "observations depend only on the cell, never the true point");
  assert.ok(seenA.some((s) => s.includes("km")), "sanity: the attacker did see the user");
});

test("pins: identical for every viewer and every request on a day (nothing to average), new spot the next day", async () => {
  const allow = allowAll();
  const now = new Date("2026-11-22T12:00:00Z");
  const p1 = (await repo.mapPins(db, users.viewer, { approxCell: null, allow, secret: SECRET, now })).pins.find((p) => p.username === "target");
  const p2 = (await repo.mapPins(db, users.farguy, { approxCell: encode(TRUE.lat, TRUE.lng), allow, secret: SECRET, now })).pins.find((p) => p.username === "target");
  assert.ok(p1 && p2);
  assert.deepEqual(p1, p2);
  const p3 = (await repo.mapPins(db, users.viewer, { approxCell: null, allow, secret: SECRET, now: new Date("2026-11-23T12:00:00Z") })).pins.find((p) => p.username === "target");
  assert.notDeepEqual(p1, p3);
});

test("privacy settings: hide distance, incognito, map pin opt-in, home zone", async () => {
  const allow = allowAll();
  const look = async () => ({
    g: (await repo.grid(db, users.viewer, { approxCell: null, allow, secret: SECRET })).items.find((i) => i.username === "target"),
    m: (await repo.mapPins(db, users.viewer, { approxCell: null, allow, secret: SECRET })).pins.find((p) => p.username === "target"),
  });
  assert.ok((await look()).m, "pin shown when opted in");
  await repo.saveSettings(db, users.target, { hideDistance: true });
  let r = await look();
  assert.equal(r.g?.distance, null);
  assert.equal(r.m, undefined);
  await repo.saveSettings(db, users.target, { hideDistance: false, homeZone: "here" });
  assert.equal((await look()).m, undefined, "no pin inside home zone");
  assert.ok((await look()).g, "still in the grid inside home zone");
  await repo.saveSettings(db, users.target, { homeZone: "clear", sharePin: false });
  assert.equal((await look()).m, undefined, "no pin when not opted in");
  await repo.saveSettings(db, users.target, { incognito: true });
  r = await look();
  assert.equal(r.g, undefined);
  await repo.saveSettings(db, users.target, { incognito: false, sharePin: true });
});

test("blocks hide both ways and sever taps/saves", async () => {
  const allow = allowAll();
  await placeAt("blocker", TRUE.lat + 0.005, TRUE.lng);
  await repo.tap(db, users.blocker, users.target);
  await repo.setSaved(db, users.target, users.blocker, true);
  await repo.block(db, users.blocker, users.target);
  const seenBy = async (who: string) => (await repo.grid(db, users[who], { approxCell: null, allow, secret: SECRET })).items.map((i) => i.username);
  assert.ok(!(await seenBy("blocker")).includes("target"));
  assert.ok(!(await seenBy("target")).includes("blocker"));
  const pins = (await repo.mapPins(db, users.blocker, { approxCell: null, allow, secret: SECRET })).pins.map((p) => p.username);
  assert.ok(!pins.includes("target"));
  await assert.rejects(repo.tap(db, users.target, users.blocker), repo.NearbyError);
  await assert.rejects(repo.setSaved(db, users.blocker, users.target, true), repo.NearbyError);
  const left = (await pg.query(`select 1 from om_tap where from_id = $1 union all select 1 from om_save where user_id = $2`, [users.blocker, users.target])).rows;
  assert.equal(left.length, 0);
  await repo.unblock(db, users.blocker, users.target);
  assert.ok((await seenBy("target")).includes("blocker"));
});

test("free vs Plus radius (admin-set Plus, no billing)", async () => {
  const allow = allowAll();
  const far = off(TRUE, 0, PLAN_LIMITS.free.radiusKm + 8);
  await placeAt("farguy", far.lat, far.lng);
  const sees = async () => (await repo.grid(db, users.target, { approxCell: null, allow, secret: SECRET })).items.map((i) => i.username);
  assert.ok(!(await sees()).includes("farguy"));
  await repo.setPlus(db, users.admin, users.target, true);
  const g = await repo.grid(db, users.target, { approxCell: null, allow, secret: SECRET });
  assert.equal(g.plan, "plus");
  assert.ok(g.items.map((i) => i.username).includes("farguy"));
  await repo.setPlus(db, users.admin, users.target, false);
  assert.ok(!(await sees()).includes("farguy"));
});

test("approximate origin is used per request and never stored", async () => {
  await mkUser("newbie");
  const g = await repo.grid(db, users.newbie, { approxCell: encode(TRUE.lat, TRUE.lng), allow: allowAll(), secret: SECRET });
  assert.equal(g.origin, "approx");
  assert.ok(g.items.length > 0);
  assert.equal((await pg.query(`select 1 from om_location where user_id = $1`, [users.newbie])).rows.length, 0);
});

test("delete my location removes the row", async () => {
  await repo.deleteLocation(db, users.ghost);
  assert.equal((await pg.query(`select 1 from om_location where user_id = $1`, [users.ghost])).rows.length, 0);
  assert.equal((await repo.settings(db, users.ghost)).sharing, false);
});

test("reports: filed, queued, decided once, audited append-only", async () => {
  const id = await repo.report(db, users.viewer, users.target, "selling_sex", "offered paid meetups", true);
  const q = await repo.adminReports(db, "open");
  const r = q.find((x) => x.id === id)!;
  assert.equal(r.reporter, "viewer");
  assert.equal(r.target, "target");
  await repo.decideReport(db, users.admin, id, "resolved", "banned account");
  await assert.rejects(repo.decideReport(db, users.admin, id, "dismissed", ""), repo.NearbyError);
  const log = await repo.reportLog(db, id);
  assert.deepEqual(log.map((l) => l.action).sort(), ["reported", "resolved"]);
  await assert.rejects(pg.query(`delete from om_report_audit`));
  await assert.rejects(pg.query(`update om_report_audit set note = 'x'`));
  await assert.rejects(repo.report(db, users.viewer, users.target, "bogus" as repo.ReportReason, "", false), repo.NearbyError);
  await repo.unblock(db, users.viewer, users.target);
});
