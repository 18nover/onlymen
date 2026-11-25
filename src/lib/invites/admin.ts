/**
 * Admin-only invite management (server functions). Every handler resolves the
 * caller from the session and requires an admin/owner account (om_account.role)
 * that is also allowed in by private mode. Non-admins get a generic refusal.
 */
import { createServerFn } from "@tanstack/react-start";
import type { InviteRow } from "./invites.server";

export type AdminResult<T> = { ok: true; value: T } | { ok: false; error: string };
const DENIED = { ok: false as const, error: "Not found." };

async function adminCtx() {
  const [{ getRequest }, priv, inv, dbm, iso] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("../private/allowlist.server"),
    import("./invites.server"),
    import("../db"),
    import("../auth/isolation.server"),
  ]);
  if (!inv.invitesEnabled()) return null;
  const uid = await priv.allowedSessionUserId(getRequest().headers);
  if (!uid) return null;
  const db = await dbm.getSql();
  if (!(await inv.isAdminUser(db, uid))) return null;
  return { uid, db, inv, dbm, assertSameSite: iso.assertSameSiteRequest };
}

const obj = (input: unknown) => (input && typeof input === "object" ? (input as Record<string, unknown>) : {});

export const listInvitesFn = createServerFn({ method: "GET" }).handler(async (): Promise<AdminResult<InviteRow[]>> => {
  const c = await adminCtx();
  if (!c) return DENIED;
  const audit = await import("../admin/audit.server");
  await audit.writeAdminAudit(c.db, c.uid, "invites.list", "invite_code");
  return { ok: true, value: await c.inv.listInvites(c.db) };
});

export const createInvitesFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { count: Number(o.count) || 1, maxUses: Number(o.maxUses) || 1, note: typeof o.note === "string" ? o.note.slice(0, 120) : "" };
  })
  .handler(async ({ data }): Promise<AdminResult<string[]>> => {
    const c = await adminCtx();
    if (!c) return DENIED;
    c.assertSameSite();
    const audit = await import("../admin/audit.server");
    const codes = await c.dbm.withTransaction(async (tx) => {
      const created = await c.inv.createInvites(tx, { count: data.count, maxUses: data.maxUses, note: data.note || null, createdBy: c.uid });
      await audit.writeAdminAudit(tx, c.uid, "invites.create", "invite_code_batch");
      return created;
    });
    console.info(`[invites] admin created ${codes.length} code(s)`);
    return { ok: true, value: codes };
  });

export const setInviteRevokedFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { id: Math.floor(Number(o.id)), revoked: o.revoked !== false };
  })
  .handler(async ({ data }): Promise<AdminResult<boolean>> => {
    const c = await adminCtx();
    if (!c) return DENIED;
    c.assertSameSite();
    if (!Number.isFinite(data.id) || data.id <= 0) return { ok: false, error: "Unknown code." };
    const audit = await import("../admin/audit.server");
    const done = await c.dbm.withTransaction(async (tx) => {
      const updated = await c.inv.setRevoked(tx, data.id, data.revoked);
      if (updated) await audit.writeAdminAudit(tx, c.uid, data.revoked ? "invites.revoke" : "invites.restore", "invite_code", String(data.id));
      return updated;
    });
    return done ? { ok: true, value: true } : { ok: false, error: "Unknown code." };
  });
