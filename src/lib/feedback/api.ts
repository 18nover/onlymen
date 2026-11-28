import { createServerFn } from "@tanstack/react-start";
import type { AdminFeedbackUser, FeedbackItem } from "./repo.server";

export type FResult<T> = { ok: true; value: T } | { ok: false; error: string };
const OUT = { ok: false as const, error: "You're signed out." };
const DENIED = { ok: false as const, error: "Not found." };
const obj = (input: unknown) => (input && typeof input === "object" ? (input as Record<string, unknown>) : {});
const s = (v: unknown, max = 2000) => (typeof v === "string" ? v.slice(0, max) : "");

async function member(write = false) {
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

async function admin() {
  const [{ getRequest }, priv, inv, repo, dbm] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("../private/allowlist.server"),
    import("../invites/invites.server"),
    import("./repo.server"),
    import("../db"),
  ]);
  const uid = await priv.allowedSessionUserId(getRequest().headers);
  if (!uid) return null;
  const db = await dbm.getSql();
  if (!(await inv.isAdminUser(db, uid))) return null;
  return { uid, db, repo };
}

export const myFeedbackFn = createServerFn({ method: "POST" }).handler(async (): Promise<FResult<FeedbackItem[]>> => {
  const c = await member();
  if (!c.uid || !c.db) return OUT;
  return { ok: true, value: await c.repo.mine(c.db, c.uid) };
});

export const sendFeedbackFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => ({ body: s(obj(input).body, 2000) }))
  .handler(async ({ data }): Promise<FResult<FeedbackItem>> => {
    const c = await member(true);
    if (!c.uid || !c.db) return OUT;
    try {
      return { ok: true, value: await c.repo.submit(c.db, c.uid, data.body) };
    } catch (e) {
      if (e instanceof c.repo.FeedbackError) return { ok: false, error: e.message };
      return { ok: false, error: "Couldn't save that. Try again." };
    }
  });

export const adminFeedbackFn = createServerFn({ method: "POST" }).handler(async (): Promise<FResult<AdminFeedbackUser[]>> => {
  const c = await admin();
  if (!c) return DENIED;
  const audit = await import("../admin/audit.server");
  await audit.writeAdminAudit(c.db, c.uid, "feedback.list", "om_feedback");
  return { ok: true, value: await c.repo.listByUser(c.db) };
});
