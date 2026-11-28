/**
 * Username changes: at most 2 in any rolling 12 months (admins/owners exempt). The old name is reserved
 * for 30 days so nobody can impersonate it. History lives in om_username_history (migration 0013); until
 * it exists everything here fails safe ("not available yet") and nothing changes.
 */
import { withTransaction, type Sql } from "../db.ts";
import { normalizeUsername, validateUsername } from "./validation.ts";

export const USERNAME_LIMIT = 2;
export const RESERVE_DAYS = 30;

export type UsernameStatus = { available: boolean; exempt: boolean; left: number; limit: number; nextAt: string | null };

async function isAdmin(db: Sql, uid: string) {
  const r = await db<{ role: string }>`select role from om_account where user_id = ${uid}`;
  return r[0]?.role === "admin" || r[0]?.role === "owner";
}

export async function usernameStatus(db: Sql, uid: string): Promise<UsernameStatus> {
  const exempt = await isAdmin(db, uid);
  try {
    const rows = await db<{ at: Date | string }>`select changed_at as at from om_username_history where user_id = ${uid} and changed_at > now() - interval '12 months' order by changed_at asc`;
    const used = rows.length;
    const left = exempt ? USERNAME_LIMIT : Math.max(0, USERNAME_LIMIT - used);
    let nextAt: string | null = null;
    if (!exempt && left === 0) {
      const oldest = new Date(rows[used - USERNAME_LIMIT]!.at);
      oldest.setFullYear(oldest.getFullYear() + 1);
      nextAt = oldest.toISOString();
    }
    return { available: true, exempt, left, limit: USERNAME_LIMIT, nextAt };
  } catch {
    return { available: false, exempt, left: 0, limit: USERNAME_LIMIT, nextAt: null };
  }
}

/** Is this name held by someone else's recent change (30 days)? Fails open to "not reserved" if the table is missing. */
export async function reservedByOther(db: Sql, username: string, exceptUid?: string): Promise<boolean> {
  try {
    const r = exceptUid
      ? await db`select 1 from om_username_history where old_username = ${username} and changed_at > now() - interval '30 days' and user_id <> ${exceptUid} limit 1`
      : await db`select 1 from om_username_history where old_username = ${username} and changed_at > now() - interval '30 days' limit 1`;
    return r.length > 0;
  } catch {
    return false;
  }
}

export async function changeUsername(db: Sql, uid: string, raw: string): Promise<{ ok: true; username: string } | { ok: false; error: string }> {
  const next = normalizeUsername(raw);
  const bad = validateUsername(next);
  if (bad) return { ok: false, error: bad };
  const st = await usernameStatus(db, uid);
  if (!st.available) return { ok: false, error: "Username changes aren't available yet." };
  if (st.left <= 0) return { ok: false, error: `You've used both username changes for this year. Next change: ${new Date(st.nextAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.` };
  const cur = (await db<{ username: string }>`select username from om_account where user_id = ${uid}`)[0]?.username;
  if (!cur) return { ok: false, error: "Account not found." };
  if (cur === next) return { ok: false, error: "That's already your username." };
  if ((await db`select 1 from om_account where username = ${next}`).length || (await reservedByOther(db, next, uid))) return { ok: false, error: "That username is taken." };
  try {
    await withTransaction(async (tx) => {
      const locked = await tx<{ username: string }>`select username from om_account where user_id = ${uid} for update`;
      if (locked[0]?.username !== cur) throw new Error("changed");
      await tx`update om_account set username = ${next}, updated_at = now() where user_id = ${uid}`;
      await tx`update "user" set name = ${next}, "updatedAt" = now() where id = ${uid}`;
      await tx`insert into om_username_history (user_id, old_username, new_username) values (${uid}, ${cur}, ${next})`;
    });
  } catch (e) {
    if (/unique|duplicate/i.test(String((e as Error).message))) return { ok: false, error: "That username is taken." };
    return { ok: false, error: "Couldn't change your username. Try again." };
  }
  return { ok: true, username: next };
}
