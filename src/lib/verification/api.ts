/**
 * Creator verification server functions. Every handler resolves the caller
 * from the session (never a client-supplied id) and requires the private-mode
 * allowlist. Admin handlers also require role owner/admin. Off unless
 * ONLYMEN_ID_VERIFICATION=on (the Worker sets it; Vercel doesn't).
 */
import { createServerFn } from "@tanstack/react-start";
import type { AdminDetail, MyVerification, QueueRow } from "./repo.server";
import type { FileKind, VStatus } from "./status.ts";

export type VResult<T> = { ok: true; value: T } | { ok: false; error: string };
const OFF = { ok: false as const, error: "ID verification isn't turned on here." };
const DENIED = { ok: false as const, error: "Not found." };

const obj = (input: unknown) => (input && typeof input === "object" ? (input as Record<string, unknown>) : {});
const s = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");

async function base() {
  const [{ getRequest }, priv, repo, dbm, iso, inv] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("../private/allowlist.server"),
    import("./repo.server"),
    import("../db"),
    import("../auth/isolation.server"),
    import("../invites/invites.server"),
  ]);
  const request = getRequest();
  const uid = await priv.allowedSessionUserId(request.headers);
  return { uid, repo, db: uid ? await dbm.getSql() : null, assertSameSite: iso.assertSameSiteRequest, isAdmin: inv.isAdminUser, enabled: repo.idVerificationEnabled() };
}

const fail = (e: unknown, repo: { VerificationError: new (...a: never[]) => Error }) => {
  if (e instanceof repo.VerificationError) return { ok: false as const, error: e.message };
  console.error("[kyc] request failed:", (e as { code?: string })?.code ?? "error");
  return { ok: false as const, error: "Something went wrong. Try again." };
};

/** Is the flag on, and where does this creator stand? (No legal name / DOB returned.) */
export const myVerificationFn = createServerFn({ method: "GET" }).handler(async (): Promise<{ enabled: boolean; me: MyVerification | null }> => {
  const c = await base();
  if (!c.enabled || !c.uid || !c.db) return { enabled: c.enabled, me: null };
  return { enabled: true, me: await c.repo.myVerification(c.db, c.uid) };
});

export const uploadVerificationFileFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { kind: s(o.kind, 20) as FileKind, base64: s(o.base64, 6_000_000) };
  })
  .handler(async ({ data }): Promise<VResult<true>> => {
    const c = await base();
    if (!c.enabled) return OFF;
    c.assertSameSite();
    if (!c.uid || !c.db) return { ok: false, error: "You're signed out." };
    try {
      await c.repo.putFile(c.db, c.uid, data.kind, new Uint8Array(Buffer.from(data.base64, "base64")));
      return { ok: true, value: true };
    } catch (e) {
      return fail(e, c.repo);
    }
  });

export const submitVerificationFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { legalName: s(o.legalName, 120), dob: s(o.dob, 10), idType: s(o.idType, 20), idCountry: s(o.idCountry, 60), attest: o.attest === true };
  })
  .handler(async ({ data }): Promise<VResult<true>> => {
    const c = await base();
    if (!c.enabled) return OFF;
    c.assertSameSite();
    if (!c.uid || !c.db) return { ok: false, error: "You're signed out." };
    if (!data.attest) return { ok: false, error: "Confirm the statement at the bottom first." };
    try {
      await c.repo.submit(c.db, c.uid, data);
      return { ok: true, value: true };
    } catch (e) {
      return fail(e, c.repo);
    }
  });

// ------------------------------------------------------------------ admin

async function admin() {
  const c = await base();
  if (!c.enabled || !c.uid || !c.db || !(await c.isAdmin(c.db, c.uid))) return null;
  return c as typeof c & { uid: string; db: NonNullable<typeof c.db> };
}

export const adminVerificationsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const v = s(obj(input).status, 20);
    return { status: (["not_started", "pending", "approved", "rejected", "all"].includes(v) ? v : "pending") as VStatus | "all" };
  })
  .handler(async ({ data }): Promise<VResult<{ rows: QueueRow[]; ageVerifier: { name: string; devOnly: boolean }; selfReview: boolean }>> => {
    const c = await admin();
    if (!c) return DENIED;
    const [{ activeVerifier }, { platformEnv }] = await Promise.all([import("../age-gate/verifiers.ts"), import("../platform/runtime.ts")]);
    const av = activeVerifier();
    return { ok: true, value: { rows: await c.repo.adminQueue(c.db, data.status), ageVerifier: { name: av.name, devOnly: av.devOnly }, selfReview: platformEnv("ONLYMEN_KYC_SELF_REVIEW") === "on" } };
  });

export const adminVerificationFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => s(obj(input).id, 40))
  .handler(async ({ data }): Promise<VResult<AdminDetail>> => {
    const c = await admin();
    if (!c) return DENIED;
    const d = await c.repo.adminDetail(c.db, data);
    if (!d) return { ok: false, error: "Unknown verification." };
    await c.repo.audit(c.db, c.uid, "viewed", d.id);
    return { ok: true, value: d };
  });

export const adminDecideVerificationFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    const a = s(o.action, 10);
    return { id: s(o.id, 40), action: (["approve", "reject", "revoke"].includes(a) ? a : "") as "approve" | "reject" | "revoke", reason: s(o.reason, 200) };
  })
  .handler(async ({ data }): Promise<VResult<VStatus>> => {
    const c = await admin();
    if (!c) return DENIED;
    c.assertSameSite();
    if (!data.action) return { ok: false, error: "Unknown action." };
    try {
      const to = await c.repo.decide(c.db, c.uid, data.id, data.action, data.reason);
      console.info(`[kyc] ${data.id} -> ${to}`);
      return { ok: true, value: to };
    } catch (e) {
      return fail(e, c.repo);
    }
  });
