/**
 * Postgres persistence for OnlyMen accounts (server-only).
 * Every query is scoped to a user id that came from a verified session.
 */
import { getSql, type Sql } from "../db";
import { CONSENT_VERSIONS, defaultPermissions, defaultPrivacy, emptyProfile } from "./constants.ts";
import type { ConsentKey, ConsentRecord, Photo, PublicAccount, VerificationStatus } from "./types.ts";
import type { CreatorLive, Reminder, ScheduledShow } from "../live/types.ts";

type Row = Record<string, unknown>;

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : typeof v === "string" ? new Date(v).toISOString() : new Date().toISOString());
const day = (v: unknown): string => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
const json = <T,>(v: unknown, fallback: T): T => (v == null ? fallback : typeof v === "string" ? (JSON.parse(v) as T) : (v as T));

export const CONSENT_KEYS = new Set(Object.keys(CONSENT_VERSIONS) as ConsentKey[]);
const STATUSES: VerificationStatus[] = ["not_started", "pending_review", "approved", "rejected"];

export async function sql(): Promise<Sql> {
  return getSql();
}

export async function emailForUsername(username: string): Promise<string | null> {
  const db = await getSql();
  const rows = await db<{ email: string }>`select u.email from om_account a join "user" u on u.id = a.user_id where a.username = ${username}`;
  return rows[0]?.email ?? null;
}

export async function usernameTaken(username: string): Promise<boolean> {
  const db = await getSql();
  const rows = await db`select 1 from om_account where username = ${username}`;
  return rows.length > 0;
}

export async function createAccountRow(input: { userId: string; username: string; dob: string; type: "member" | "creator"; displayName: string; userAgent?: string }) {
  const db = await getSql();
  const profile = { ...emptyProfile(), displayName: input.displayName };
  delete (profile as Partial<typeof profile>).photos;
  await db`insert into om_account (user_id, username, account_type, dob, profile, privacy, permissions, onboarding, creator)
    values (${input.userId}, ${input.username}, ${input.type}, ${input.dob}, ${JSON.stringify(profile)}::jsonb,
            ${JSON.stringify(defaultPrivacy())}::jsonb, ${JSON.stringify(defaultPermissions())}::jsonb,
            ${JSON.stringify({ current: "consents", completed: [], skipped: [] })}::jsonb,
            ${input.type === "creator" ? JSON.stringify({ legalName: "", idType: "", idCountry: "", payoutMethod: "", payoutEmail: "", taxForm: "", taxCountry: "" }) : null}::jsonb)`;
  // The DOB check at sign-up is itself an age attestation; recorded for audit.
  await db`insert into om_consent (user_id, key, granted, version, source, user_agent, at)
    values (${input.userId}, 'age18', true, ${CONSENT_VERSIONS.age18}, 'signup:dob', ${input.userAgent ?? null}, now())`;
}

export async function loadAccount(userId: string): Promise<PublicAccount | null> {
  const db = await getSql();
  const rows = await db<Row>`select u.email, u."emailVerified" as email_verified, u."createdAt" as user_created, a.*
    from "user" u join om_account a on a.user_id = u.id where u.id = ${userId}`;
  const r = rows[0];
  if (!r) return null;
  const [consents, photos, shows, reminders] = await Promise.all([
    db<Row>`select key, granted, version, source, user_agent, at from om_consent where user_id = ${userId} order by at, id`,
    db<Row>`select id, is_primary, explicit, added_at from om_photo where user_id = ${userId} and attached order by position, added_at`,
    db<Row>`select id, title, starts_at, duration_min, tags from om_show where user_id = ${userId} order by starts_at`,
    db<Row>`select show_id, creator, title, starts_at, created_at from om_reminder where user_id = ${userId} order by starts_at`,
  ]);
  const profile = { ...emptyProfile(), ...json<Record<string, unknown>>(r.profile, {}) };
  const liveSettings = json<Partial<CreatorLive> | null>(r.live_settings, null);
  const creator = json<Record<string, unknown> | null>(r.creator, null);
  const acc: PublicAccount = {
    id: String(r.user_id),
    email: String(r.email),
    username: String(r.username),
    dob: day(r.dob),
    type: r.account_type === "creator" ? "creator" : "member",
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
    emailVerified: Boolean(r.email_verified),
    consents: consents.map(
      (c): ConsentRecord => ({
        key: c.key as ConsentKey,
        granted: Boolean(c.granted),
        version: String(c.version),
        at: iso(c.at),
        source: String(c.source),
        ...(c.user_agent ? { userAgent: String(c.user_agent) } : {}),
      }),
    ),
    permissions: { ...defaultPermissions(), ...json(r.permissions, {}) },
    profile: {
      ...(profile as PublicAccount["profile"]),
      photos: photos.map((p): Photo => ({ id: String(p.id), primary: Boolean(p.is_primary), ...(p.explicit ? { explicit: true } : {}), addedAt: iso(p.added_at) })),
    },
    privacy: { ...defaultPrivacy(), ...json(r.privacy, {}) },
    creator: creator ? ({ ...creator, status: r.verification_status } as PublicAccount["creator"]) : undefined,
    onboarding: json(r.onboarding, { current: "consents", completed: [], skipped: [] }),
    viewer: json(r.viewer, undefined),
    reminders: reminders.map((m): Reminder => ({ showId: String(m.show_id), creator: String(m.creator), title: String(m.title), startsAt: iso(m.starts_at), createdAt: iso(m.created_at) })),
  };
  if (liveSettings || shows.length || r.live_session) {
    acc.live = {
      ...(liveSettings as CreatorLive),
      shows: shows.map((s): ScheduledShow => ({ id: String(s.id), title: String(s.title), startsAt: iso(s.starts_at), durationMin: Number(s.duration_min), tags: json<string[]>(s.tags, []) })),
      ...(r.live_session ? { session: json(r.live_session, undefined) } : {}),
      ...(r.live_last_recap ? { lastRecap: json(r.live_last_recap, undefined) } : {}),
    };
  }
  return acc;
}

const MAX_JSON = 200_000;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const validDate = (v: unknown) => typeof v === "string" && !Number.isNaN(Date.parse(v));

/**
 * Persist the editable parts of an account. Identity fields (id, email,
 * username, dob, type, createdAt) and the verification outcome are server-owned
 * and ignored here.
 */
export async function saveAccount(userId: string, next: PublicAccount): Promise<void> {
  const db = await getSql();
  const cur = (await db<Row>`select verification_status, account_type from om_account where user_id = ${userId}`)[0];
  if (!cur) throw new Error("Account not found.");

  const { photos, ...profileRest } = next.profile ?? ({} as PublicAccount["profile"]);
  // ID images never leave the device; only their local media keys are kept.
  const { status: wantedStatus, ...creatorRest } = (next.creator ?? {}) as NonNullable<PublicAccount["creator"]>;
  const { shows, session, lastRecap, ...liveRest } = (next.live ?? {}) as CreatorLive;

  const blobs = {
    profile: JSON.stringify(profileRest),
    privacy: JSON.stringify(next.privacy ?? {}),
    permissions: JSON.stringify(next.permissions ?? {}),
    onboarding: JSON.stringify(next.onboarding ?? {}),
    creator: cur.account_type === "creator" ? JSON.stringify(creatorRest) : null,
    viewer: next.viewer ? JSON.stringify(next.viewer) : null,
    live: next.live ? JSON.stringify(liveRest) : null,
    session: session ? JSON.stringify(session) : null,
    recap: lastRecap ? JSON.stringify(lastRecap) : null,
  };
  const size = Object.values(blobs).reduce((n, b) => n + (b?.length ?? 0), 0);
  if (size > MAX_JSON) throw new Error("That's too much profile data to save.");

  // Creators may submit (or resubmit) verification; only staff can approve/reject.
  let status = String(cur.verification_status) as VerificationStatus;
  if (wantedStatus === "pending_review" && (status === "not_started" || status === "rejected") && cur.account_type === "creator") status = "pending_review";
  if (!STATUSES.includes(status)) status = "not_started";

  await db`update om_account set
      profile = ${blobs.profile}::jsonb, privacy = ${blobs.privacy}::jsonb, permissions = ${blobs.permissions}::jsonb,
      onboarding = ${blobs.onboarding}::jsonb, creator = ${blobs.creator}::jsonb, verification_status = ${status},
      viewer = ${blobs.viewer}::jsonb, live_settings = ${blobs.live}::jsonb, live_session = ${blobs.session}::jsonb,
      live_last_recap = ${blobs.recap}::jsonb, updated_at = now()
    where user_id = ${userId}`;

  // Consents: append-only. New answers are inserted; nothing is ever updated or deleted.
  for (const c of (next.consents ?? []).slice(-200)) {
    if (!CONSENT_KEYS.has(c.key) || !validDate(c.at)) continue;
    await db`insert into om_consent (user_id, key, granted, version, source, user_agent, at)
      values (${userId}, ${c.key}, ${Boolean(c.granted)}, ${str(c.version, 40) || CONSENT_VERSIONS[c.key]}, ${str(c.source, 80) || "unknown"}, ${str(c.userAgent, 400) || null}, ${c.at})
      on conflict (user_id, key, at) do nothing`;
  }

  // Photos: attach/reorder the ones on the profile; drop ones removed from it.
  const keep = (photos ?? []).filter((p) => typeof p.id === "string" && p.id.startsWith("ph_")).slice(0, 12);
  const ids = keep.map((p) => p.id);
  await db`delete from om_photo where user_id = ${userId} and attached and not (id = any(${ids}::text[]))`;
  for (const [i, p] of keep.entries()) {
    await db`update om_photo set attached = true, position = ${i}, is_primary = ${Boolean(p.primary)}, explicit = ${Boolean(p.explicit)}
      where user_id = ${userId} and id = ${p.id}`;
  }

  // Schedule.
  const showList = (shows ?? []).filter((s) => typeof s.id === "string" && validDate(s.startsAt)).slice(0, 100);
  await db`delete from om_show where user_id = ${userId} and not (id = any(${showList.map((s) => s.id)}::text[]))`;
  for (const s of showList) {
    await db`insert into om_show (id, user_id, title, starts_at, duration_min, tags)
      values (${str(s.id, 40)}, ${userId}, ${str(s.title, 120) || "Live show"}, ${s.startsAt}, ${Math.max(5, Math.min(600, Number(s.durationMin) || 60))}, ${JSON.stringify((s.tags ?? []).slice(0, 8))}::jsonb)
      on conflict (id) do update set title = excluded.title, starts_at = excluded.starts_at, duration_min = excluded.duration_min, tags = excluded.tags
      where om_show.user_id = ${userId}`;
  }

  // Reminders.
  const rem = (next.reminders ?? []).filter((r) => typeof r.showId === "string" && validDate(r.startsAt)).slice(0, 200);
  await db`delete from om_reminder where user_id = ${userId} and not (show_id = any(${rem.map((r) => r.showId)}::text[]))`;
  for (const r of rem) {
    await db`insert into om_reminder (user_id, show_id, creator, title, starts_at, created_at)
      values (${userId}, ${str(r.showId, 120)}, ${str(r.creator, 60)}, ${str(r.title, 120)}, ${r.startsAt}, ${validDate(r.createdAt) ? r.createdAt : new Date().toISOString()})
      on conflict (user_id, show_id) do nothing`;
  }
}

// ------------------------------------------------------------------ photos

export const MAX_PHOTO_BYTES = 700_000;

export async function insertPhoto(userId: string, mime: string, data: Buffer): Promise<string> {
  const db = await getSql();
  await db`delete from om_photo where user_id = ${userId} and not attached and added_at < now() - interval '1 day'`;
  const [{ n }] = await db<{ n: number }>`select count(*)::int as n from om_photo where user_id = ${userId}`;
  if (n >= 15) throw new Error("You've reached the photo limit. Remove one first.");
  const id = `ph_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
  await db`insert into om_photo (id, user_id, mime, bytes, data) values (${id}, ${userId}, ${mime}, ${data.length}, ${data})`;
  return id;
}

export async function deletePhoto(userId: string, id: string) {
  const db = await getSql();
  await db`delete from om_photo where user_id = ${userId} and id = ${id}`;
}

export async function readPhoto(id: string): Promise<{ userId: string; attached: boolean; mime: string; data: Buffer } | null> {
  const db = await getSql();
  const rows = await db<Row>`select user_id, attached, mime, data from om_photo where id = ${id}`;
  const r = rows[0];
  if (!r || !r.data) return null;
  const raw = r.data as Uint8Array;
  return { userId: String(r.user_id), attached: Boolean(r.attached), mime: String(r.mime), data: Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength) };
}

// ------------------------------------------------------------------ public

export type PublicProfile = {
  username: string;
  type: "member" | "creator";
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
  social: Record<string, string>;
  photos: { id: string; primary: boolean; explicit: boolean }[];
  services: string[];
  acceptsTips: boolean;
  live: null | { title: string; tags: string[]; tipGoal: string; roomUrl: string; startedAt: string };
  categories: string[];
  tipMenu: { label: string; price: string }[];
  shows: { id: string; title: string; startsAt: string; durationMin: number; tags: string[] }[];
  joinedAt: string;
};

function ageFrom(dob: string): number {
  const d = new Date(dob + "T00:00:00Z");
  const now = new Date();
  let a = now.getUTCFullYear() - d.getUTCFullYear();
  if (now.getUTCMonth() < d.getUTCMonth() || (now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() < d.getUTCDate())) a -= 1;
  return a;
}

const toPublic = (r: Row, photos: Row[], shows: Row[]): PublicProfile => {
  const p = json<Record<string, unknown>>(r.profile, {});
  const live = json<Partial<CreatorLive>>(r.live_settings, {});
  const session = json<Record<string, unknown> | null>(r.live_session, null);
  const arr = (v: unknown) => (Array.isArray(v) ? (v as unknown[]).map(String).slice(0, 30) : []);
  return {
    username: String(r.username),
    type: r.account_type === "creator" ? "creator" : "member",
    displayName: str(p.displayName, 60) || String(r.username),
    headline: str(p.headline, 140),
    bio: str(p.bio, 2000),
    city: str(p.city, 80),
    age: p.showAge === false ? null : ageFrom(day(r.dob)),
    verified: r.verification_status === "approved",
    ...(typeof p.heightCm === "number" ? { heightCm: p.heightCm } : {}),
    ...(p.bodyType ? { bodyType: str(p.bodyType, 40) } : {}),
    tribes: arr(p.tribes),
    interests: arr(p.interests),
    lookingFor: arr(p.lookingFor),
    languages: arr(p.languages),
    social: Object.fromEntries(Object.entries(json<Record<string, unknown>>(p.social, {})).filter(([, v]) => typeof v === "string" && v).map(([k, v]) => [k, str(v, 200)])),
    photos: photos.map((x) => ({ id: String(x.id), primary: Boolean(x.is_primary), explicit: Boolean(x.explicit) })),
    services: arr(p.services),
    acceptsTips: Boolean(p.acceptsTips),
    live: session ? { title: str(session.title, 80), tags: arr(session.tags), tipGoal: str(session.tipGoal, 12), roomUrl: str(session.roomUrl, 400), startedAt: iso(session.startedAt) } : null,
    categories: arr(live.categories),
    tipMenu: (live.tipMenu ?? []).slice(0, 20).map((t) => ({ label: str(t.label, 60), price: str(t.price, 12) })),
    shows: shows.map((s) => ({ id: String(s.id), title: String(s.title), startsAt: iso(s.starts_at), durationMin: Number(s.duration_min), tags: json<string[]>(s.tags, []) })),
    joinedAt: iso(r.created_at),
  };
};

export async function publicProfile(username: string): Promise<PublicProfile | null> {
  const db = await getSql();
  const rows = await db<Row>`select * from om_account where username = ${username}`;
  const r = rows[0];
  if (!r) return null;
  const [photos, shows] = await Promise.all([
    db<Row>`select id, is_primary, explicit from om_photo where user_id = ${r.user_id} and attached order by position`,
    db<Row>`select id, title, starts_at, duration_min, tags from om_show where user_id = ${r.user_id} and starts_at > now() - interval '3 hours' order by starts_at limit 20`,
  ]);
  return toPublic(r, photos, shows);
}

/** Creators who are live right now, plus upcoming scheduled shows (for /live). */
export async function liveDirectory(): Promise<{ live: PublicProfile[]; upcoming: (PublicProfile["shows"][number] & { username: string; displayName: string; photoId: string | null })[] }> {
  const db = await getSql();
  const liveRows = await db<Row>`select * from om_account where live_session is not null and account_type = 'creator' order by updated_at desc limit 50`;
  const live: PublicProfile[] = [];
  for (const r of liveRows) {
    const photos = await db<Row>`select id, is_primary, explicit from om_photo where user_id = ${r.user_id} and attached order by position`;
    live.push(toPublic(r, photos, []));
  }
  const up = await db<Row>`select s.id, s.title, s.starts_at, s.duration_min, s.tags, a.username, a.profile,
      (select id from om_photo p where p.user_id = a.user_id and p.attached order by p.is_primary desc, p.position limit 1) as photo_id
    from om_show s join om_account a on a.user_id = s.user_id
    where s.starts_at > now() - interval '30 minutes' and s.starts_at < now() + interval '14 days'
    order by s.starts_at limit 50`;
  return {
    live,
    upcoming: up.map((s) => ({
      id: String(s.id),
      title: String(s.title),
      startsAt: iso(s.starts_at),
      durationMin: Number(s.duration_min),
      tags: json<string[]>(s.tags, []),
      username: String(s.username),
      displayName: str(json<Record<string, unknown>>(s.profile, {}).displayName, 60) || String(s.username),
      photoId: s.photo_id ? String(s.photo_id) : null,
    })),
  };
}

/** Test/admin helper: remove an account and everything attached (FK cascades). */
export async function deleteUser(userId: string) {
  const db = await getSql();
  await db`delete from "user" where id = ${userId}`;
}
