/**
 * Invite-code sign-up (server-only). Turned on per deployment with
 * ONLYMEN_INVITES=on (the Cloudflare Worker sets it in wrangler.jsonc); when it
 * is off — e.g. Vercel production today — none of this runs and the private
 * "owner only" mode behaves exactly as before.
 *
 * Tables: invite_codes, invite_redemptions, invite_attempts
 * (migrations/0004_invite_codes.sql). Plain codes are never stored or logged.
 */
import { createHash, createHmac } from "node:crypto";
import { platformEnv } from "../platform/runtime.ts";
import type { Sql } from "../db";
import { codeHint, generateCodes, INVITE_ERRORS, inviteStatus, normalizeCode, type InviteStatus } from "./codes.ts";

export function invitesEnabled(): boolean {
  return platformEnv("ONLYMEN_INVITES") === "on";
}

/** Lowercase hex SHA-256 of the canonical code (same as SQL `encode(sha256(convert_to(code,'UTF8')),'hex')`). */
export function hashCode(canonical: string): string {
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

// ---------------------------------------------------------------- rate limiting

/** Failed code attempts allowed per client per window, and across everyone (env-overridable). */
export const RATE = { windowMin: 15, perIp: 10, global: 300 } as const;

function limits() {
  const n = (k: string, d: number) => {
    const v = Number(platformEnv(k));
    return Number.isFinite(v) && v >= 1 ? Math.floor(v) : d;
  };
  return { perIp: n("ONLYMEN_INVITE_RATE_PER_IP", RATE.perIp), global: n("ONLYMEN_INVITE_RATE_GLOBAL", RATE.global) };
}

export function clientIp(headers: Headers): string {
  return headers.get("cf-connecting-ip") || headers.get("x-real-ip") || (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

/** Rate-limit key: the IPv4 address, or the /64 prefix of an IPv6 address (one home/device network). */
export function rateKey(ip: string): string {
  return ip.includes(":") ? ipv6Prefix64(ip) : ip;
}

export function ipv6Prefix64(ip: string): string {
  const addr = ip.split("%")[0].toLowerCase();
  const [head, tail = ""] = addr.split("::");
  const h = head ? head.split(":") : [];
  const t = addr.includes("::") ? (tail ? tail.split(":") : []) : [];
  const full = addr.includes("::") ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill("0"), ...t] : h;
  return full.slice(0, 4).map((x) => (x || "0").replace(/^0+(?=.)/, "")).join(":") + "::/64";
}

/** Keyed hash of the client network — the raw IP is never stored. */
export function ipHash(headers: Headers): string {
  const key = platformEnv("BETTER_AUTH_SECRET") ?? "onlymen-dev-invite-rate";
  return createHmac("sha256", key).update(rateKey(clientIp(headers))).digest("hex").slice(0, 32);
}

export function overLimit(counts: { mine: number; total: number }, lim: { perIp: number; global: number } = { perIp: RATE.perIp, global: RATE.global }): boolean {
  return counts.mine >= lim.perIp || counts.total >= lim.global;
}

export async function isRateLimited(db: Sql, ip: string): Promise<boolean> {
  const rows = await db<{ mine: number; total: number }>`select
      count(*) filter (where ip_hash = ${ip}) as mine,
      count(*) as total
    from invite_attempts where at > now() - make_interval(mins => ${RATE.windowMin})`;
  return overLimit({ mine: Number(rows[0]?.mine ?? 0), total: Number(rows[0]?.total ?? 0) }, limits());
}

export async function recordFailedAttempt(db: Sql, ip: string): Promise<void> {
  await db`insert into invite_attempts (ip_hash) values (${ip})`;
  // Cheap housekeeping: ~1 in 20 failures prunes rows older than a day.
  if (Math.random() < 0.05) await db`delete from invite_attempts where at < now() - interval '1 day'`;
}

// ---------------------------------------------------------------- checking & claiming

export type CodeCheck = { ok: true; hash: string } | { ok: false; reason: keyof typeof INVITE_ERRORS };

/** Read-only pre-check for a friendly message. The real gate is `claimCode` inside the transaction. */
export async function checkCode(db: Sql, input: string): Promise<CodeCheck> {
  if (!String(input ?? "").trim()) return { ok: false, reason: "missing" };
  const code = normalizeCode(input);
  if (!code) return { ok: false, reason: "invalid" };
  const hash = hashCode(code);
  const rows = await db<{ revoked_at: string | null; use_count: number; max_uses: number }>`select revoked_at, use_count, max_uses from invite_codes where code_hash = ${hash}`;
  const r = rows[0];
  if (!r) return { ok: false, reason: "invalid" };
  const st = inviteStatus(r);
  if (st === "revoked") return { ok: false, reason: "revoked" };
  if (st === "used") return { ok: false, reason: "used" };
  return { ok: true, hash };
}

export class InviteClaimError extends Error {
  constructor() {
    super("INVITE_CLAIM_FAILED");
  }
}

/**
 * Atomically claim one use of a code for `userId`. MUST run inside the same
 * transaction that creates the account: the conditional UPDATE row-locks the
 * code, so two concurrent sign-ups can never both take the last use. Throws
 * InviteClaimError (→ rollback) when the code is unknown, revoked or used up.
 */
export async function claimCode(tx: Sql, hash: string, userId: string): Promise<number> {
  const rows = await tx<{ id: number }>`update invite_codes
       set use_count = use_count + 1,
           redeemed_by = coalesce(redeemed_by, ${userId}),
           redeemed_at = coalesce(redeemed_at, now())
     where code_hash = ${hash} and revoked_at is null and use_count < max_uses
     returning id`;
  const id = rows[0]?.id;
  if (id == null) throw new InviteClaimError();
  await tx`insert into invite_redemptions (code_id, user_id) values (${id}, ${userId})`;
  return Number(id);
}

/** Did this account join with an invite code? */
export async function hasRedeemedInvite(db: Sql, userId: string): Promise<boolean> {
  const rows = await db`select 1 from invite_redemptions where user_id = ${userId} limit 1`;
  return rows.length > 0;
}

// ---------------------------------------------------------------- admin

export async function isAdminUser(db: Sql, userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const rows = await db<{ role: string }>`select role from om_account where user_id = ${userId}`;
  return rows[0]?.role === "admin" || rows[0]?.role === "owner";
}

export type InviteRow = {
  id: number;
  hint: string;
  note: string | null;
  maxUses: number;
  useCount: number;
  status: InviteStatus;
  createdAt: string;
  redeemedAt: string | null;
  revokedAt: string | null;
  redeemedBy: string[];
};

const isoOrNull = (v: unknown) => (v == null ? null : v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString());

export async function listInvites(db: Sql): Promise<InviteRow[]> {
  const rows = await db<Record<string, unknown>>`select c.id, c.code_hint, c.note, c.max_uses, c.use_count, c.created_at, c.redeemed_at, c.revoked_at,
      coalesce((select json_agg(coalesce(a.username, '(deleted)') order by r.redeemed_at)
                  from invite_redemptions r left join om_account a on a.user_id = r.user_id where r.code_id = c.id), '[]'::json) as redeemed_by
    from invite_codes c order by c.created_at desc, c.id desc`;
  return rows.map((r) => {
    const useCount = Number(r.use_count);
    const maxUses = Number(r.max_uses);
    const by = typeof r.redeemed_by === "string" ? JSON.parse(r.redeemed_by) : r.redeemed_by;
    return {
      id: Number(r.id),
      hint: String(r.code_hint ?? ""),
      note: (r.note as string | null) ?? null,
      maxUses,
      useCount,
      status: inviteStatus({ revoked_at: r.revoked_at, use_count: useCount, max_uses: maxUses }),
      createdAt: isoOrNull(r.created_at)!,
      redeemedAt: isoOrNull(r.redeemed_at),
      revokedAt: isoOrNull(r.revoked_at),
      redeemedBy: Array.isArray(by) ? by.map(String) : [],
    };
  });
}

/** Create `count` codes. Returns the plain codes ONCE (never stored). */
export async function createInvites(db: Sql, opts: { count: number; note: string | null; maxUses: number; createdBy: string | null }): Promise<string[]> {
  const count = Math.max(1, Math.min(100, Math.floor(opts.count)));
  const maxUses = Math.max(1, Math.min(1000, Math.floor(opts.maxUses)));
  const note = opts.note?.trim().slice(0, 120) || null;
  const codes = generateCodes(count);
  for (const code of codes) {
    await db`insert into invite_codes (code_hash, code_hint, note, max_uses, created_by) values (${hashCode(code)}, ${codeHint(code)}, ${note}, ${maxUses}, ${opts.createdBy})`;
  }
  return codes;
}

export async function setRevoked(db: Sql, id: number, revoked: boolean): Promise<boolean> {
  const rows = revoked
    ? await db`update invite_codes set revoked_at = coalesce(revoked_at, now()) where id = ${id} returning id`
    : await db`update invite_codes set revoked_at = null where id = ${id} returning id`;
  return rows.length > 0;
}
