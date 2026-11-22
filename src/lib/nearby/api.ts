/**
 * Nearby server functions (ONLYMEN_NEARBY=on; off on Vercel). All POST, so
 * nothing location-related ever appears in a URL or the request log line.
 * The location validator SNAPS lat/lng to a cell and returns only the cell:
 * raw coordinates never reach the handler, the database or any log.
 */
import { createServerFn } from "@tanstack/react-start";
import { snapInput } from "./geo.ts";
import type { Card, GridResult, MapResult, ReportReason, ReportRow, Settings } from "./repo.server";

export type NResult<T> = { ok: true; value: T } | { ok: false; error: string };
const OFF = { ok: false as const, error: "Nearby isn't turned on here." };
const OUT = { ok: false as const, error: "You're signed out." };
const DENIED = { ok: false as const, error: "Not found." };
const obj = (input: unknown) => (input && typeof input === "object" ? (input as Record<string, unknown>) : {});
const s = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");

async function base() {
  const [{ getRequest }, priv, repo, dbm, iso, inv, rt, geo] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("../private/allowlist.server"),
    import("./repo.server"),
    import("../db"),
    import("../auth/isolation.server"),
    import("../invites/invites.server"),
    import("../platform/runtime.ts"),
    import("./geo.ts"),
  ]);
  const enabled = rt.platformEnv("ONLYMEN_NEARBY") === "on";
  const request = getRequest();
  const uid = enabled ? await priv.allowedSessionUserId(request.headers) : null;
  const { parseList } = await import("../private/policy.ts");
  const allow = {
    all: priv.privateModeOff(),
    invites: inv.invitesEnabled(),
    ids: [...parseList(rt.platformEnv("ONLYMEN_ALLOWED_USER_IDS"))],
    usernames: [...parseList(rt.platformEnv("ONLYMEN_ALLOWED_USERNAMES"), true)],
  };
  const { createHmac } = await import("node:crypto");
  const secret = createHmac("sha256", rt.platformEnv("BETTER_AUTH_SECRET") ?? "onlymen-dev-nearby").update("onlymen-nearby-v1").digest("hex");
  // Coarse IP-geo fallback origin (Cloudflare city-level), snapped and never stored.
  const cf = (request as Request & { cf?: { latitude?: unknown; longitude?: unknown } }).cf;
  const la = Number(cf?.latitude), ln = Number(cf?.longitude);
  const approxCell = geo.isValidCoord(la, ln) ? geo.encode(la, ln) : null;
  return { enabled, uid, repo, db: uid ? await dbm.getSql() : null, allow, secret, approxCell, assertSameSite: iso.assertSameSiteRequest, isAdmin: inv.isAdminUser };
}

const fail = (e: unknown, repo: { NearbyError: new (...a: never[]) => Error }) => {
  if (e instanceof repo.NearbyError) return { ok: false as const, error: e.message };
  console.error("[nearby] request failed:", (e as { code?: string })?.code ?? "error");
  return { ok: false as const, error: "Something went wrong. Try again." };
};

type Ctx = Awaited<ReturnType<typeof base>> & { uid: string; db: NonNullable<Awaited<ReturnType<typeof base>>["db"]> };
async function member(write = false): Promise<Ctx | typeof OFF | typeof OUT> {
  const c = await base();
  if (!c.enabled) return OFF;
  if (write) c.assertSameSite();
  if (!c.uid || !c.db) return OUT;
  return c as Ctx;
}
const isCtx = (c: unknown): c is Ctx => Boolean((c as Ctx).repo);

export const nearbyConfigFn = createServerFn({ method: "POST" }).handler(async (): Promise<{ enabled: boolean; signedIn: boolean; showDemo: boolean; isAdmin: boolean; settings: Settings | null }> => {
  const c = await base();
  const [{ platformEnv }, { demoProfilesEnabled }] = await Promise.all([import("../platform/runtime.ts"), import("../directory.ts")]);
  const showDemo = demoProfilesEnabled(platformEnv("ONLYMEN_DEMO_PROFILES"));
  if (!c.enabled || !c.uid || !c.db) return { enabled: c.enabled, signedIn: false, showDemo, isAdmin: false, settings: null };
  return { enabled: true, signedIn: true, showDemo, isAdmin: await c.isAdmin(c.db, c.uid), settings: await c.repo.settings(c.db, c.uid) };
});

export const updateLocationFn = createServerFn({ method: "POST" })
  // SNAP HERE. Only the cell survives the validator; lat/lng are dropped.
  .validator((input: unknown) => snapInput(input))
  .handler(async ({ data }): Promise<NResult<{ changed: boolean; refused?: string }>> => {
    const c = await member(true);
    if (!isCtx(c)) return c;
    if (!data.cell) return { ok: false, error: "That location didn't look right." };
    try {
      const r = await c.repo.updateCell(c.db, c.uid, data.cell);
      if (!r.ok) return { ok: true, value: { changed: false, refused: r.reason } };
      return { ok: true, value: { changed: r.changed } };
    } catch (e) {
      return fail(e, c.repo);
    }
  });

export const saveNearbySettingsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    const b = (k: string) => (typeof o[k] === "boolean" ? (o[k] as boolean) : undefined);
    const h = s(o.homeZone, 5);
    return { sharePin: b("sharePin"), hideDistance: b("hideDistance"), incognito: b("incognito"), appearOffline: b("appearOffline"), homeZone: h === "here" || h === "clear" ? (h as "here" | "clear") : undefined };
  })
  .handler(async ({ data }): Promise<NResult<Settings>> => {
    const c = await member(true);
    if (!isCtx(c)) return c;
    try {
      await c.repo.saveSettings(c.db, c.uid, data);
      return { ok: true, value: await c.repo.settings(c.db, c.uid) };
    } catch (e) {
      return fail(e, c.repo);
    }
  });

export const deleteLocationFn = createServerFn({ method: "POST" }).handler(async (): Promise<NResult<true>> => {
  const c = await member(true);
  if (!isCtx(c)) return c;
  await c.repo.deleteLocation(c.db, c.uid);
  return { ok: true, value: true };
});

export const heartbeatFn = createServerFn({ method: "POST" }).handler(async (): Promise<NResult<true>> => {
  const c = await member(true);
  if (!isCtx(c)) return c;
  await c.repo.heartbeat(c.db, c.uid);
  return { ok: true, value: true };
});

export const nearbyGridFn = createServerFn({ method: "POST" }).handler(async (): Promise<NResult<GridResult>> => {
  const c = await member();
  if (!isCtx(c)) return c;
  return { ok: true, value: await c.repo.grid(c.db, c.uid, { approxCell: c.approxCell, allow: c.allow, secret: c.secret }) };
});

export const nearbyMapFn = createServerFn({ method: "POST" }).handler(async (): Promise<NResult<MapResult>> => {
  const c = await member();
  if (!isCtx(c)) return c;
  return { ok: true, value: await c.repo.mapPins(c.db, c.uid, { approxCell: c.approxCell, allow: c.allow, secret: c.secret }) };
});

export const nearbyActionFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    const a = s(o.action, 10);
    return {
      action: (["tap", "save", "unsave", "block", "unblock", "report"].includes(a) ? a : "") as "tap" | "save" | "unsave" | "block" | "unblock" | "report" | "",
      username: s(o.username, 40),
      reason: s(o.reason, 20) as ReportReason,
      details: s(o.details, 1000),
      alsoBlock: o.alsoBlock === true,
    };
  })
  .handler(async ({ data }): Promise<NResult<true>> => {
    const c = await member(true);
    if (!isCtx(c)) return c;
    if (!data.action) return { ok: false, error: "Unknown action." };
    try {
      const target = await c.repo.userIdFor(c.db, data.username);
      if (!target) return { ok: false, error: "Not available." };
      if (data.action === "tap") await c.repo.tap(c.db, c.uid, target);
      else if (data.action === "save" || data.action === "unsave") await c.repo.setSaved(c.db, c.uid, target, data.action === "save");
      else if (data.action === "block") await c.repo.block(c.db, c.uid, target);
      else if (data.action === "unblock") await c.repo.unblock(c.db, c.uid, target);
      else await c.repo.report(c.db, c.uid, target, data.reason, data.details, data.alsoBlock);
      return { ok: true, value: true };
    } catch (e) {
      return fail(e, c.repo);
    }
  });

// ------------------------------------------------------------------ admin (owner/admin only)

async function admin(write = false) {
  const c = await member(write);
  if (!isCtx(c)) return null;
  if (!(await c.isAdmin(c.db, c.uid))) return null;
  return c;
}

export const adminReportsFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const v = s(obj(input).status, 12);
    return { status: (["open", "resolved", "dismissed", "all"].includes(v) ? v : "open") as "open" | "resolved" | "dismissed" | "all" };
  })
  .handler(async ({ data }): Promise<NResult<ReportRow[]>> => {
    const c = await admin();
    if (!c) return DENIED;
    return { ok: true, value: await c.repo.adminReports(c.db, data.status) };
  });

export const adminReportLogFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => s(obj(input).id, 40))
  .handler(async ({ data }) => {
    const c = await admin();
    if (!c) return DENIED;
    await c.repo.reportAudit(c.db, c.uid, "viewed", data);
    return { ok: true as const, value: await c.repo.reportLog(c.db, data) };
  });

export const adminDecideReportFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    const d = s(o.decision, 10);
    return { id: s(o.id, 40), decision: (d === "resolved" || d === "dismissed" ? d : "") as "resolved" | "dismissed" | "", note: s(o.note, 300) };
  })
  .handler(async ({ data }): Promise<NResult<true>> => {
    const c = await admin(true);
    if (!c) return DENIED;
    if (!data.decision) return { ok: false, error: "Unknown decision." };
    try {
      await c.repo.decideReport(c.db, c.uid, data.id, data.decision, data.note);
      return { ok: true, value: true };
    } catch (e) {
      return fail(e, c.repo);
    }
  });

export const adminSetPlusFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { username: s(o.username, 40), on: o.on === true };
  })
  .handler(async ({ data }): Promise<NResult<true>> => {
    const c = await admin(true);
    if (!c) return DENIED;
    const target = await c.repo.userIdFor(c.db, data.username);
    if (!target) return { ok: false, error: "No account with that username." };
    await c.repo.setPlus(c.db, c.uid, target, data.on);
    return { ok: true, value: true };
  });

export type { Card };
