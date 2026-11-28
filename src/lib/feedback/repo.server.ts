import type { Sql } from "../db";

export class FeedbackError extends Error {}

export type FeedbackItem = { id: string; body: string; createdAt: string };
export type AdminFeedbackUser = {
  userId: string;
  username: string;
  displayName: string;
  joinedAt: string;
  items: FeedbackItem[];
};

export function cleanBody(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (t.length < 1) throw new FeedbackError("Write a short note so we can improve the app.");
  return t.slice(0, 2000);
}

export async function submit(db: Sql, userId: string, raw: string): Promise<FeedbackItem> {
  const body = cleanBody(raw);
  const recent = await db<{ n: string }>`select count(*)::text as n from om_feedback where user_id = ${userId} and created_at > now() - interval '1 hour'`;
  if (Number(recent[0]?.n ?? 0) >= 8) throw new FeedbackError("You've sent quite a bit recently. Try again in a little while.");
  const rows = await db<{ id: string; body: string; created_at: string }>`
    insert into om_feedback (user_id, body) values (${userId}, ${body})
    returning id::text, body, created_at`;
  const r = rows[0];
  return { id: r.id, body: r.body, createdAt: r.created_at };
}

export async function mine(db: Sql, userId: string): Promise<FeedbackItem[]> {
  const rows = await db<{ id: string; body: string; created_at: string }>`
    select id::text, body, created_at from om_feedback where user_id = ${userId} order by created_at desc`;
  return rows.map((r) => ({ id: r.id, body: r.body, createdAt: r.created_at }));
}

export async function listByUser(db: Sql): Promise<AdminFeedbackUser[]> {
  const accounts = await db<{ user_id: string; username: string; display_name: string | null; created_at: string }>`
    select user_id, username, profile->>'displayName' as display_name, created_at::text
    from om_account order by created_at`;
  const notes = await db<{ user_id: string; id: string; body: string; created_at: string }>`
    select user_id, id::text, body, created_at from om_feedback order by created_at`;
  const map = new Map<string, FeedbackItem[]>();
  for (const n of notes) {
    const list = map.get(n.user_id) ?? [];
    list.push({ id: n.id, body: n.body, createdAt: n.created_at });
    map.set(n.user_id, list);
  }
  return accounts.map((a) => ({
    userId: a.user_id,
    username: a.username,
    displayName: String(a.display_name || a.username).slice(0, 60),
    joinedAt: a.created_at,
    items: map.get(a.user_id) ?? [],
  })).sort((a, b) => a.items.length - b.items.length || a.username.localeCompare(b.username));
}
