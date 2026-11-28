import { createServerFn } from "@tanstack/react-start";
import type { ChatMessage, InboxRow } from "./repo.server";

export type CResult<T> = { ok: true; value: T } | { ok: false; error: string };
const OUT = { ok: false as const, error: "You're signed out." };
const obj = (input: unknown) => (input && typeof input === "object" ? (input as Record<string, unknown>) : {});
const s = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");

async function ctx(write = false) {
  const [{ getRequest }, priv, repo, dbm, iso] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("../private/allowlist.server"),
    import("./repo.server"),
    import("../db"),
    import("../auth/isolation.server"),
  ]);
  if (write) iso.assertSameSiteRequest();
  const uid = await priv.allowedSessionUserId(getRequest().headers);
  return { uid, repo, db: uid ? await dbm.getSql() : null };
}

export const inboxFn = createServerFn({ method: "POST" }).handler(async (): Promise<CResult<InboxRow[]>> => {
  const c = await ctx();
  if (!c.uid || !c.db) return OUT;
  return { ok: true, value: await c.repo.inbox(c.db, c.uid) };
});

export const threadFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ username: s(obj(input).username, 40), afterId: s(obj(input).afterId, 20) || null }))
  .handler(async ({ data }): Promise<CResult<{ username: string; displayName: string; messages: ChatMessage[] }>> => {
    const c = await ctx();
    if (!c.uid || !c.db) return OUT;
    const peer = await c.repo.userIdFor(c.db, data.username);
    if (!peer || peer === c.uid) return { ok: false, error: "That member wasn't found." };
    if (await c.repo.isBlocked(c.db, c.uid, peer)) return { ok: false, error: "You can't message this member." };
    const acc = (await c.db<{ username: string; display_name: string | null }>`select username, profile->>'displayName' as display_name from om_account where user_id = ${peer}`)[0];
    return { ok: true, value: { username: acc?.username ?? data.username, displayName: String(acc?.display_name || acc?.username || data.username).slice(0, 60), messages: await c.repo.thread(c.db, c.uid, peer, data.afterId) } };
  });

export const sendMessageFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ username: s(obj(input).username, 40), body: s(obj(input).body, 2000) }))
  .handler(async ({ data }): Promise<CResult<ChatMessage>> => {
    const c = await ctx(true);
    if (!c.uid || !c.db) return OUT;
    const peer = await c.repo.userIdFor(c.db, data.username);
    if (!peer) return { ok: false, error: "That member wasn't found." };
    try {
      return { ok: true, value: await c.repo.send(c.db, c.uid, peer, data.body) };
    } catch (e) {
      if (e instanceof c.repo.ChatError) return { ok: false, error: e.message };
      console.error("[chat] send failed:", (e as Error)?.message);
      return { ok: false, error: "We couldn't send that. Try again." };
    }
  });

export const blockedListFn = createServerFn({ method: "POST" }).handler(async (): Promise<CResult<{ username: string; displayName: string }[]>> => {
  const c = await ctx();
  if (!c.uid || !c.db) return OUT;
  return { ok: true, value: await c.repo.listBlocked(c.db, c.uid) };
});
