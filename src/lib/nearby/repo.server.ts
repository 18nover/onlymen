/**
 * Nearby data access (server-only). Takes the db handle as a parameter so the
 * privacy tests can run it against an in-memory Postgres.
 *
 * NEVER accepts or stores raw coordinates: callers pass an already-snapped
 * cell (see api.ts, which snaps inside the input validator). NEVER returns a
 * cell, a raw distance or a raw coordinate: only bucket labels and jittered
 * map pins (geo.ts pinFor).
 */
import { createHmac, randomBytes } from "node:crypto";
import type { Sql } from "../db";
import {
  bucketIndex, bucketLabel, cellDistanceKm, center, coarseCover, dayKey, decideMove, isCell, neighborhood, pinFor,
  PLAN_LIMITS, presenceOf, prng, seedFrom, shuffle, type Plan, type Presence,
} from "./geo.ts";
import { REPORT_REASONS, type ReportReason } from "./reasons.ts";

export { REPORT_REASONS, type ReportReason } from "./reasons.ts";

export class NearbyError extends Error {}

export type Allow = { all: boolean; invites: boolean; ids: string[]; usernames: string[] };
export type Settings = { sharing: boolean; sharePin: boolean; hideDistance: boolean; incognito: boolean; appearOffline: boolean; homeZone: boolean; plan: Plan };

export type Card = {
  username: string; displayName: string; age: number | null; photoId: string | null; verified: boolean; creator: boolean;
  distance: string | null; presence: Presence; tapped: boolean; saved: boolean;
};
export type Pin = { username: string; displayName: string; photoId: string | null; lat: number; lng: number };

const iso = (v: unknown) => (v ? new Date(v as string).getTime() : null);

function hmac(key: string, msg: string): string {
  return createHmac("sha256", key).update(msg).digest("hex");
}

export async function planOf(db: Sql, userId: string): Promise<Plan> {
  return (await db`select 1 from om_plus where user_id = ${userId}`).length ? "plus" : "free";
}

type LocRow = { user_id: string; cell: string | null; jitter_seed: string; share_pin: boolean; hide_distance: boolean; incognito: boolean; appear_offline: boolean; home_cell: string | null; updated_at: string | null; window_start: string | null; window_count: number };

async function loc(db: Sql, userId: string): Promise<LocRow | null> {
  return (await db<LocRow>`select * from om_location where user_id = ${userId}`)[0] ?? null;
}

export async function settings(db: Sql, userId: string): Promise<Settings> {
  const l = await loc(db, userId);
  return {
    sharing: Boolean(l?.cell), sharePin: Boolean(l?.share_pin), hideDistance: Boolean(l?.hide_distance), incognito: Boolean(l?.incognito),
    appearOffline: Boolean(l?.appear_offline), homeZone: Boolean(l?.home_cell), plan: await planOf(db, userId),
  };
}

/** Store the caller's NEW snapped cell (in place). Returns why it was refused, if it was. */
export async function updateCell(db: Sql, userId: string, cell: string, nowMs = Date.now()): Promise<{ ok: true; changed: boolean } | { ok: false; reason: string }> {
  if (!isCell(cell)) throw new NearbyError("Bad location.");
  let l = await loc(db, userId);
  if (!l) {
    await db`insert into om_location (user_id, jitter_seed, consent_at) values (${userId}, ${randomBytes(16).toString("hex")}, now()) on conflict (user_id) do nothing`;
    l = (await loc(db, userId))!;
  }
  const d = decideMove({ cell: l.cell, updatedAt: iso(l.updated_at), windowStart: iso(l.window_start), windowCount: Number(l.window_count) }, cell, nowMs);
  if (!d.ok) return { ok: false, reason: d.reason };
  const at = new Date(nowMs).toISOString();
  await db`update om_location set cell = ${d.state.cell}, updated_at = ${at},
    window_start = ${d.state.windowStart ? new Date(d.state.windowStart).toISOString() : null}, window_count = ${d.state.windowCount},
    consent_at = coalesce(consent_at, now()) where user_id = ${userId}`;
  return { ok: true, changed: d.changed };
}

export async function saveSettings(db: Sql, userId: string, s: Partial<Pick<Settings, "sharePin" | "hideDistance" | "incognito" | "appearOffline">> & { homeZone?: "here" | "clear" }): Promise<void> {
  const l = await loc(db, userId);
  if (!l) {
    await db`insert into om_location (user_id, jitter_seed) values (${userId}, ${randomBytes(16).toString("hex")}) on conflict (user_id) do nothing`;
  }
  const cur = (await loc(db, userId))!;
  const home = s.homeZone === "clear" ? null : s.homeZone === "here" ? cur.cell : cur.home_cell;
  if (s.homeZone === "here" && !cur.cell) throw new NearbyError("Share your location first, then set your home zone.");
  await db`update om_location set
      share_pin = ${s.sharePin ?? cur.share_pin}, hide_distance = ${s.hideDistance ?? cur.hide_distance},
      incognito = ${s.incognito ?? cur.incognito}, appear_offline = ${s.appearOffline ?? cur.appear_offline}, home_cell = ${home}
    where user_id = ${userId}`;
}

/** "Stop sharing and delete": removes the row entirely (cell, home zone, settings) and presence. */
export async function deleteLocation(db: Sql, userId: string): Promise<void> {
  await db`delete from om_location where user_id = ${userId}`;
  await db`delete from om_presence where user_id = ${userId}`;
}

export async function heartbeat(db: Sql, userId: string): Promise<void> {
  await db`insert into om_presence (user_id, last_seen) values (${userId}, now()) on conflict (user_id) do update set last_seen = now()`;
}

type Cand = {
  user_id: string; cell: string; hide_distance: boolean; appear_offline: boolean; share_pin: boolean; home_cell: string | null; jitter_seed: string;
  username: string; display_name: string | null; dob: string | null; verification_status: string; account_type: string;
  last_seen: string | null; photo_id: string | null; tapped: boolean; saved: boolean;
};

async function candidates(db: Sql, viewerId: string, originCell: string, radiusKm: number, allow: Allow, pinsOnly: boolean): Promise<(Cand & { km: number })[]> {
  const cover = coarseCover(originCell, radiusKm);
  const rows = await db<Cand>`
    select l.user_id, l.cell, l.hide_distance, l.appear_offline, l.share_pin, l.home_cell, l.jitter_seed,
      a.username, a.profile->>'displayName' as display_name, a.dob::text as dob, a.verification_status, a.account_type,
      p.last_seen,
      (select ph.id from om_photo ph where ph.user_id = l.user_id and ph.attached and not ph.explicit order by ph.is_primary desc, ph.position limit 1) as photo_id,
      exists (select 1 from om_tap t where t.from_id = ${viewerId} and t.to_id = l.user_id) as tapped,
      exists (select 1 from om_save s where s.user_id = ${viewerId} and s.saved_id = l.user_id) as saved
    from om_location l
    join om_account a on a.user_id = l.user_id
    left join om_presence p on p.user_id = l.user_id
    where l.cell4 = any(${cover}::text[]) and l.cell is not null and not l.incognito
      and l.user_id <> ${viewerId}
      and l.updated_at > now() - interval '30 days'
      and (${pinsOnly}::boolean = false or (l.share_pin and not l.appear_offline and not l.hide_distance))
      and not exists (select 1 from om_block b where (b.blocker_id = ${viewerId} and b.blocked_id = l.user_id) or (b.blocker_id = l.user_id and b.blocked_id = ${viewerId}))
      and (${allow.all}::boolean or a.user_id = any(${allow.ids}::text[]) or lower(a.username) = any(${allow.usernames}::text[])
           or (${allow.invites}::boolean and (a.role in ('admin', 'owner') or exists (select 1 from invite_redemptions r where r.user_id = a.user_id))))
    limit 2000`;
  return rows.map((r) => ({ ...r, km: cellDistanceKm(originCell, r.cell) })).filter((r) => r.km <= radiusKm);
}

const ageFrom = (dob: string | null, now: Date) => {
  if (!dob) return null;
  const [y, m, d] = dob.split("-").map(Number);
  let a = now.getUTCFullYear() - y;
  if (now.getUTCMonth() + 1 < m || (now.getUTCMonth() + 1 === m && now.getUTCDate() < d)) a--;
  return a;
};

export type GridResult = { origin: "mine" | "approx" | null; plan: Plan; radiusKm: number; items: Card[] };

/**
 * The nearby grid. The origin is ALWAYS the viewer's own stored cell (or, if
 * they haven't shared, a coarse per-request cell from Cloudflare's IP geo that
 * is never stored). Clients can't pick an origin.
 */
export async function grid(db: Sql, viewerId: string, opts: { approxCell: string | null; allow: Allow; secret: string; now?: Date }): Promise<GridResult> {
  const now = opts.now ?? new Date();
  const plan = await planOf(db, viewerId);
  const lim = PLAN_LIMITS[plan];
  const mine = await loc(db, viewerId);
  const origin = mine?.cell ?? (isCell(opts.approxCell) ? opts.approxCell : null);
  if (!origin) return { origin: null, plan, radiusKm: lim.radiusKm, items: [] };
  const rows = await candidates(db, viewerId, origin, lim.radiusKm, opts.allow, false);
  const rnd = prng(seedFrom(hmac(opts.secret, `grid:${viewerId}:${dayKey(now)}`)));
  const byBucket = new Map<number, typeof rows>();
  for (const r of rows) {
    const b = bucketIndex(r.km);
    byBucket.set(b, [...(byBucket.get(b) ?? []), r]);
  }
  const ordered = [...byBucket.keys()].sort((a, b) => a - b).flatMap((b) => shuffle(byBucket.get(b)!, rnd).map((r) => ({ r, b })));
  const nowMs = now.getTime();
  const items: Card[] = ordered.slice(0, lim.gridSize).map(({ r, b }) => ({
    username: String(r.username),
    displayName: String(r.display_name || r.username).slice(0, 60),
    age: ageFrom(r.dob, now),
    photoId: r.photo_id ? String(r.photo_id) : null,
    verified: r.verification_status === "approved",
    creator: r.account_type === "creator",
    distance: r.hide_distance ? null : bucketLabel(b),
    presence: presenceOf(r.last_seen ? new Date(r.last_seen).getTime() : null, nowMs, r.appear_offline),
    tapped: Boolean(r.tapped),
    saved: Boolean(r.saved),
  }));
  return { origin: mine?.cell ? "mine" : "approx", plan, radiusKm: lim.radiusKm, items };
}

/** Stable per-user-per-day pin seed (secret, so pins can't be reproduced or reversed). Same for every viewer. */
export const dailyPinSeed = (secret: string, jitterSeed: string, day: string) => hmac(secret, `pin:${jitterSeed}:${day}`);

export type MapResult = { center: { lat: number; lng: number } | null; pins: Pin[] };

/** Opt-in pins only. No pin inside a user's home zone, when incognito, offline-mode or distance-hidden. */
export async function mapPins(db: Sql, viewerId: string, opts: { approxCell: string | null; allow: Allow; secret: string; now?: Date }): Promise<MapResult> {
  const now = opts.now ?? new Date();
  const plan = await planOf(db, viewerId);
  const mine = await loc(db, viewerId);
  const origin = mine?.cell ?? (isCell(opts.approxCell) ? opts.approxCell : null);
  if (!origin) return { center: null, pins: [] };
  const rows = await candidates(db, viewerId, origin, PLAN_LIMITS[plan].radiusKm, opts.allow, true);
  const day = dayKey(now);
  const pins = rows
    .filter((r) => !(r.home_cell && neighborhood(r.home_cell).has(r.cell)))
    .slice(0, PLAN_LIMITS[plan].gridSize)
    .map((r) => ({ username: String(r.username), displayName: String(r.display_name || r.username).slice(0, 60), photoId: r.photo_id ? String(r.photo_id) : null, ...pinFor(r.cell, dailyPinSeed(opts.secret, r.jitter_seed, day)) }));
  const c = center(origin);
  return { center: { lat: Math.round(c.lat * 100) / 100, lng: Math.round(c.lng * 100) / 100 }, pins };
}

// ------------------------------------------------------------------ actions

export async function userIdFor(db: Sql, username: string): Promise<string | null> {
  const r = await db<{ user_id: string }>`select user_id from om_account where lower(username) = ${username.toLowerCase().replace(/^@/, "")}`;
  return r[0]?.user_id ?? null;
}

async function isBlockedEitherWay(db: Sql, a: string, b: string) {
  return (await db`select 1 from om_block where (blocker_id = ${a} and blocked_id = ${b}) or (blocker_id = ${b} and blocked_id = ${a})`).length > 0;
}

export async function tap(db: Sql, from: string, to: string): Promise<void> {
  if (from === to) throw new NearbyError("That's you.");
  if (await isBlockedEitherWay(db, from, to)) throw new NearbyError("Not available.");
  await db`insert into om_tap (from_id, to_id, at) values (${from}, ${to}, now()) on conflict (from_id, to_id) do update set at = now()`;
}

export async function setSaved(db: Sql, userId: string, target: string, saved: boolean): Promise<void> {
  if (userId === target) throw new NearbyError("That's you.");
  if (saved) {
    if (await isBlockedEitherWay(db, userId, target)) throw new NearbyError("Not available.");
    await db`insert into om_save (user_id, saved_id) values (${userId}, ${target}) on conflict do nothing`;
  } else await db`delete from om_save where user_id = ${userId} and saved_id = ${target}`;
}

export async function block(db: Sql, blocker: string, blocked: string): Promise<void> {
  if (blocker === blocked) throw new NearbyError("That's you.");
  await db`insert into om_block (blocker_id, blocked_id) values (${blocker}, ${blocked}) on conflict do nothing`;
  // Blocking severs taps and saves both ways.
  await db`delete from om_tap where (from_id = ${blocker} and to_id = ${blocked}) or (from_id = ${blocked} and to_id = ${blocker})`;
  await db`delete from om_save where (user_id = ${blocker} and saved_id = ${blocked}) or (user_id = ${blocked} and saved_id = ${blocker})`;
}

export async function unblock(db: Sql, blocker: string, blocked: string): Promise<void> {
  await db`delete from om_block where blocker_id = ${blocker} and blocked_id = ${blocked}`;
}

export async function reportAudit(db: Sql, actor: string | null, action: string, reportId: string | null, note: string | null = null) {
  await db`insert into om_report_audit (actor_id, action, report_id, note) values (${actor}, ${action}, ${reportId}, ${note ? note.slice(0, 200) : null})`;
}

export async function report(db: Sql, reporter: string, target: string, reason: ReportReason, details: string, alsoBlock: boolean): Promise<string> {
  if (reporter === target) throw new NearbyError("That's you.");
  if (!REPORT_REASONS.includes(reason)) throw new NearbyError("Pick a reason.");
  const recent = await db<{ n: number }>`select count(*)::int as n from om_report where reporter_id = ${reporter} and created_at > now() - interval '1 hour'`;
  if (Number(recent[0]?.n ?? 0) >= 20) throw new NearbyError("Too many reports in a short time. Try again later.");
  const id = `rep_${randomBytes(10).toString("hex")}`;
  await db`insert into om_report (id, reporter_id, target_id, reason, details) values (${id}, ${reporter}, ${target}, ${reason}, ${details.trim().slice(0, 1000) || null})`;
  await reportAudit(db, reporter, "reported", id, reason);
  if (alsoBlock) await block(db, reporter, target);
  return id;
}

// ------------------------------------------------------------------ admin

export type ReportRow = { id: string; reporter: string; target: string; reason: string; details: string | null; status: string; createdAt: string; decidedAt: string | null; resolution: string | null; targetOpenReports: number; targetPlus: boolean };

export async function adminReports(db: Sql, status: "open" | "resolved" | "dismissed" | "all"): Promise<ReportRow[]> {
  const rows = await db<Record<string, unknown>>`
    select r.id, coalesce(ra.username, '(deleted)') as reporter, coalesce(ta.username, '(deleted)') as target, r.reason, r.details, r.status,
      r.created_at, r.decided_at, r.resolution,
      (select count(*)::int from om_report x where x.target_id = r.target_id and x.status = 'open') as target_open,
      exists (select 1 from om_plus p where p.user_id = r.target_id) as target_plus
    from om_report r left join om_account ra on ra.user_id = r.reporter_id left join om_account ta on ta.user_id = r.target_id
    where (${status} = 'all' or r.status = ${status})
    order by (r.status = 'open') desc, (r.reason in ('underage', 'non_consensual', 'selling_sex')) desc, r.created_at asc limit 300`;
  return rows.map((r) => ({
    id: String(r.id), reporter: String(r.reporter), target: String(r.target), reason: String(r.reason), details: (r.details as string) ?? null, status: String(r.status),
    createdAt: new Date(r.created_at as string).toISOString(), decidedAt: r.decided_at ? new Date(r.decided_at as string).toISOString() : null,
    resolution: (r.resolution as string) ?? null, targetOpenReports: Number(r.target_open), targetPlus: Boolean(r.target_plus),
  }));
}

export async function decideReport(db: Sql, actor: string, id: string, decision: "resolved" | "dismissed", note: string): Promise<void> {
  const done = await db`update om_report set status = ${decision}, decided_at = now(), decided_by = ${actor}, resolution = ${note.trim().slice(0, 300) || null}
    where id = ${id} and status = 'open' returning id`;
  if (!done.length) throw new NearbyError("Already decided, or unknown report.");
  await reportAudit(db, actor, decision, id, note.trim() || null);
}

export async function reportLog(db: Sql, id: string) {
  const rows = await db<{ at: string; actor: string | null; action: string; note: string | null }>`
    select l.at, coalesce(a.username, l.actor_id) as actor, l.action, l.note from om_report_audit l left join om_account a on a.user_id = l.actor_id
    where l.report_id = ${id} order by l.at desc limit 100`;
  return rows.map((r) => ({ at: new Date(r.at).toISOString(), actor: r.actor ?? "system", action: r.action, note: r.note }));
}

export async function setPlus(db: Sql, actor: string, target: string, on: boolean): Promise<void> {
  if (on) await db`insert into om_plus (user_id, granted_by) values (${target}, ${actor}) on conflict (user_id) do nothing`;
  else await db`delete from om_plus where user_id = ${target}`;
  await reportAudit(db, actor, on ? "plus_granted" : "plus_revoked", null, `user:${target}`);
}
