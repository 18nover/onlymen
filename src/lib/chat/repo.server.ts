import type { Sql } from "../db";

export const MESSAGE_MAX = 2000;
export const MESSAGE_RATE = { windowMin: 1, max: 20 } as const;

export class ChatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatError";
  }
}

export type ChatMessage = { id: string; fromMe: boolean; body: string; createdAt: string };
export type InboxRow = { username: string; displayName: string; last: ChatMessage };

export function cleanBody(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, MESSAGE_MAX);
}

export async function userIdFor(db: Sql, username: string): Promise<string | null> {
  const r = await db<{ user_id: string }>`select user_id from om_account where lower(username) = ${username.toLowerCase().replace(/^@/, "")}`;
  return r[0]?.user_id ?? null;
}

export async function isBlocked(db: Sql, a: string, b: string): Promise<boolean> {
  return (await db`select 1 from om_block where (blocker_id = ${a} and blocked_id = ${b}) or (blocker_id = ${b} and blocked_id = ${a})`).length > 0;
}

export async function isRateLimited(db: Sql, senderId: string): Promise<boolean> {
  try {
    const rows = await db<{ n: number }>`select count(*)::int as n from om_message where sender_id = ${senderId} and created_at > now() - make_interval(mins => ${MESSAGE_RATE.windowMin})`;
    return Number(rows[0]?.n ?? 0) >= MESSAGE_RATE.max;
  } catch (e) {
    console.error("[chat] rate-limit check failed:", (e as Error)?.message);
    return false;
  }
}

export async function send(db: Sql, senderId: string, recipientId: string, raw: string): Promise<ChatMessage> {
  if (senderId === recipientId) throw new ChatError("You can't message yourself.");
  const body = cleanBody(raw);
  if (!body) throw new ChatError("Write a message first.");
  if (await isBlocked(db, senderId, recipientId)) throw new ChatError("You can't message this member.");
  if (await isRateLimited(db, senderId)) throw new ChatError("You're sending too quickly. Try again in a minute.");
  const rows = await db<{ id: string; created_at: string }>`insert into om_message (sender_id, recipient_id, body) values (${senderId}, ${recipientId}, ${body}) returning id::text, created_at`;
  const r = rows[0]!;
  return { id: r.id, fromMe: true, body, createdAt: new Date(r.created_at).toISOString() };
}

export async function thread(db: Sql, me: string, peer: string, afterId: string | null = null): Promise<ChatMessage[]> {
  if (me === peer) return [];
  if (await isBlocked(db, me, peer)) return [];
  const rows = afterId
    ? await db<{ id: string; sender_id: string; body: string; created_at: string }>`
        select id::text, sender_id, body, created_at from om_message
        where least(sender_id, recipient_id) = least(${me}::text, ${peer}::text)
          and greatest(sender_id, recipient_id) = greatest(${me}::text, ${peer}::text)
          and id > ${afterId}::bigint
        order by id asc limit 100`
    : await db<{ id: string; sender_id: string; body: string; created_at: string }>`
        select id::text, sender_id, body, created_at from om_message
        where least(sender_id, recipient_id) = least(${me}::text, ${peer}::text)
          and greatest(sender_id, recipient_id) = greatest(${me}::text, ${peer}::text)
        order by id asc limit 200`;
  return rows.map((r) => ({ id: r.id, fromMe: r.sender_id === me, body: r.body, createdAt: new Date(r.created_at).toISOString() }));
}

export async function inbox(db: Sql, me: string): Promise<InboxRow[]> {
  const rows = await db<{ peer: string; id: string; sender_id: string; body: string; created_at: string; username: string; display_name: string | null }>`
    select x.peer, x.id::text, x.sender_id, x.body, x.created_at, a.username, a.profile->>'displayName' as display_name
    from (
      select distinct on (peer) *
      from (
        select case when sender_id = ${me} then recipient_id else sender_id end as peer,
               id, sender_id, body, created_at
        from om_message
        where sender_id = ${me} or recipient_id = ${me}
      ) t
      order by peer, created_at desc, id desc
    ) x
    join om_account a on a.user_id = x.peer
    where not exists (
      select 1 from om_block b
      where (b.blocker_id = ${me} and b.blocked_id = x.peer) or (b.blocker_id = x.peer and b.blocked_id = ${me})
    )
    order by x.created_at desc`;
  return rows.map((r) => ({
    username: r.username,
    displayName: String(r.display_name || r.username).slice(0, 60),
    last: { id: r.id, fromMe: r.sender_id === me, body: r.body, createdAt: new Date(r.created_at).toISOString() },
  }));
}

export async function listBlocked(db: Sql, me: string): Promise<{ username: string; displayName: string }[]> {
  const rows = await db<{ username: string; display_name: string | null }>`
    select a.username, a.profile->>'displayName' as display_name from om_block b
    join om_account a on a.user_id = b.blocked_id
    where b.blocker_id = ${me} order by a.username`;
  return rows.map((r) => ({ username: r.username, displayName: String(r.display_name || r.username).slice(0, 60) }));
}
