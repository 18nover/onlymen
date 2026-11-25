/**
 * Account server functions (the server-side storage adapter's API).
 * Handlers import server-only modules lazily so nothing server-side ships to
 * the browser. Every handler resolves the caller from the session cookie —
 * never from a client-supplied id.
 */
import { createServerFn } from "@tanstack/react-start";
import type { AccountType, PublicAccount } from "./types.ts";

export type ApiResult<T> = { ok: true; value: T } | { ok: false; error: string; field?: "email" | "username" | "password" | "token" };

async function ctx() {
  const [{ getRequest }, authMod, repo, iso] = await Promise.all([
    import("@tanstack/react-start/server"),
    import("./auth.server"),
    import("./repo.server"),
    import("../auth/isolation.server"),
  ]);
  const request = getRequest();
  return { request, headers: request.headers, auth: authMod.getAuth(), enabled: authMod.serverAccountsEnabled, repo, assertSameSite: iso.assertSameSiteRequest };
}

/** The signed-in user id — only if that account is on the private-mode allowlist. */
async function sessionUserId(c: Awaited<ReturnType<typeof ctx>>): Promise<string | null> {
  const s = await c.auth.api.getSession({ headers: c.headers });
  const uid = s?.user?.id ?? null;
  if (!uid) return null;
  const { isUserAllowed } = await import("../private/allowlist.server");
  return (await isUserAllowed(uid)) ? uid : null;
}

const CLOSED = "Sign-ups are closed. OnlyMen is private for now.";

function errCode(e: unknown): string {
  const any = e as { body?: { code?: string; message?: string }; message?: string };
  return any?.body?.code ?? any?.message ?? "UNKNOWN";
}

const obj = (input: unknown) => (input && typeof input === "object" ? (input as Record<string, unknown>) : {});
const s = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");

/** Which adapter is live, plus the signed-in account (if any). */
export const accountStatus = createServerFn({ method: "GET" }).handler(async (): Promise<{ server: boolean; account: PublicAccount | null }> => {
  const c = await ctx();
  if (!c.enabled) return { server: false, account: null };
  const uid = await sessionUserId(c);
  return { server: true, account: uid ? await c.repo.loadAccount(uid) : null };
});

export const signUpFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { email: s(o.email, 254).trim().toLowerCase(), username: s(o.username, 40), password: s(o.password, 200), dob: s(o.dob, 10), type: (o.type === "creator" ? "creator" : "member") as AccountType, inviteCode: s(o.inviteCode, 40) };
  })
  .handler(async ({ data }): Promise<ApiResult<PublicAccount>> => {
    const c = await ctx();
    c.assertSameSite();
    // INVITE MODE (ONLYMEN_INVITES=on): sign-up needs a valid invite code.
    const inv = await import("../invites/invites.server");
    if (inv.invitesEnabled()) return signUpWithInvite(c, data);
    // PRIVATE MODE: reject before touching the database (Better Auth also refuses).
    const { isSignUpAllowed } = await import("../private/allowlist.server");
    if (!isSignUpAllowed(data.email)) return { ok: false, error: CLOSED };
    const v = await import("./validation.ts");
    const username = v.normalizeUsername(data.username);
    const bad =
      (v.validateEmail(data.email) && { error: v.validateEmail(data.email)!, field: "email" as const }) ||
      (v.validateUsername(username) && { error: v.validateUsername(username)!, field: "username" as const }) ||
      (v.validatePassword(data.password) && { error: v.validatePassword(data.password)!, field: "password" as const }) ||
      (v.validateDob(data.dob) && { error: v.validateDob(data.dob)! });
    if (bad) return { ok: false, ...bad };
    if (await c.repo.usernameTaken(username)) return { ok: false, error: "That username is taken.", field: "username" };
    let userId: string;
    try {
      const res = await c.auth.api.signUpEmail({ body: { email: data.email, password: data.password, name: username }, headers: c.headers });
      userId = res.user.id;
    } catch (e) {
      const code = errCode(e);
      if (/ALREADY_EXISTS/.test(code)) return { ok: false, error: "An account with this email already exists. Log in instead.", field: "email" };
      if (/PASSWORD/.test(code)) return { ok: false, error: "Choose a password with 8–128 characters.", field: "password" };
      console.error("[accounts] sign-up failed:", code);
      return { ok: false, error: "We couldn't create your account. Please try again." };
    }
    try {
      await c.repo.createAccountRow({ userId, username, dob: data.dob, type: data.type, displayName: data.username.trim().replace(/^@/, ""), userAgent: c.headers.get("user-agent") ?? undefined });
    } catch (e) {
      // Username race (unique constraint) or DB hiccup: roll the identity back.
      await c.repo.deleteUser(userId).catch(() => {});
      await c.auth.api.signOut({ headers: c.headers }).catch(() => {});
      const taken = /unique|duplicate/i.test(String((e as Error)?.message));
      return { ok: false, error: taken ? "That username is taken." : "We couldn't create your account. Please try again.", field: taken ? "username" : undefined };
    }
    try {
      (await import("./notify.server")).notifySignup(username, data.type);
    } catch {
      /* fire-and-forget */
    }
    return { ok: true, value: (await c.repo.loadAccount(userId))! };
  });

type SignUpData = { email: string; username: string; password: string; dob: string; type: AccountType; inviteCode: string };

/**
 * Invite-code sign-up. The code is claimed in the SAME transaction that writes
 * the user, credential, om_account and consent rows, so a code can never be
 * over-used and a failed claim leaves no account behind. Better Auth's own
 * sign-up stays disabled; we hash with its scrypt and then sign in through it
 * (which runs the private-mode session hook) to set the session cookie.
 */
async function signUpWithInvite(c: Awaited<ReturnType<typeof ctx>>, data: SignUpData): Promise<ApiResult<PublicAccount>> {
  const [inv, codes, v, dbm] = await Promise.all([import("../invites/invites.server"), import("../invites/codes.ts"), import("./validation.ts"), import("../db")]);
  const db = await dbm.getSql();
  const ip = inv.ipHash(c.headers);
  const fail = (reason: keyof typeof codes.INVITE_ERRORS) => ({ ok: false as const, error: codes.INVITE_ERRORS[reason] });

  if (await inv.isRateLimited(db, ip)) return fail("rateLimited");
  const check = await inv.checkCode(db, data.inviteCode);
  if (!check.ok) {
    if (check.reason !== "missing") await inv.recordFailedAttempt(db, ip).catch(() => {});
    return fail(check.reason);
  }

  const username = v.normalizeUsername(data.username);
  const bad =
    (v.validateEmail(data.email) && { error: v.validateEmail(data.email)!, field: "email" as const }) ||
    (v.validateUsername(username) && { error: v.validateUsername(username)!, field: "username" as const }) ||
    (v.validatePassword(data.password) && { error: v.validatePassword(data.password)!, field: "password" as const }) ||
    (v.validateDob(data.dob) && { error: v.validateDob(data.dob)! });
  if (bad) return { ok: false, ...bad };
  if (await c.repo.usernameTaken(username)) return { ok: false, error: "That username is taken.", field: "username" };
  const exists = await db`select 1 from "user" where lower(email) = ${data.email}`;
  if (exists.length) return { ok: false, error: "An account with this email already exists. Log in instead.", field: "email" };

  const actx = await c.auth.$context;
  const hash = await actx.password.hash(data.password);
  const userId = (actx.generateId({ model: "user" }) || crypto.randomUUID().replace(/-/g, "")) as string;
  const accountRowId = (actx.generateId({ model: "account" }) || crypto.randomUUID().replace(/-/g, "")) as string;
  try {
    await dbm.withTransaction(async (tx) => {
      await tx`insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt") values (${userId}, ${username}, ${data.email}, false, now(), now())`;
      await tx`insert into "account" ("id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt") values (${accountRowId}, ${userId}, 'credential', ${userId}, ${hash}, now(), now())`;
      await inv.claimCode(tx, check.hash, userId);
      await c.repo.createAccountRow({ userId, username, dob: data.dob, type: data.type, displayName: data.username.trim().replace(/^@/, ""), userAgent: c.headers.get("user-agent") ?? undefined }, tx);
    });
  } catch (e) {
    if (e instanceof inv.InviteClaimError) {
      // Lost a race for the last use (or revoked meanwhile): nothing was written.
      const again = await inv.checkCode(db, data.inviteCode);
      return fail(again.ok ? "used" : again.reason);
    }
    const msg = String((e as Error)?.message);
    if (/om_account_username|username/i.test(msg) && /unique|duplicate/i.test(msg)) return { ok: false, error: "That username is taken.", field: "username" };
    if (/email/i.test(msg) && /unique|duplicate/i.test(msg)) return { ok: false, error: "An account with this email already exists. Log in instead.", field: "email" };
    console.error("[invites] sign-up transaction failed:", (e as { code?: string })?.code ?? "error");
    return { ok: false, error: "We couldn't create your account. Please try again." };
  }
  console.info(`[invites] account ${userId} joined with an invite code`);
  try {
    await c.auth.api.signInEmail({ body: { email: data.email, password: data.password, rememberMe: true }, headers: c.headers });
  } catch {
    return { ok: false, error: "Your account is ready. Log in to continue." };
  }
  try {
    (await import("./notify.server")).notifySignup(username, data.type);
  } catch {
    /* fire-and-forget */
  }
  return { ok: true, value: (await c.repo.loadAccount(userId))! };
}

export const logInFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { identifier: s(o.identifier, 254).trim().toLowerCase().replace(/^@/, ""), password: s(o.password, 200) };
  })
  .handler(async ({ data }): Promise<ApiResult<PublicAccount>> => {
    const c = await ctx();
    c.assertSameSite();
    const generic = { ok: false as const, error: "That email/username and password don't match.", field: "password" as const };
    if (!data.identifier || !data.password) return generic;
    const email = data.identifier.includes("@") ? data.identifier : await c.repo.emailForUsername(data.identifier);
    const [{ getSql }, rateLimit] = await Promise.all([import("../db"), import("./login-rate-limit.server")]);
    const db = await getSql();
    const keys = rateLimit.loginRateKeys(c.headers, email ?? data.identifier);
    if (await rateLimit.isLoginRateLimited(db, keys)) {
      return { ok: false, error: "Too many failed sign-in attempts. Try again in 15 minutes.", field: "password" };
    }
    if (!email) {
      await rateLimit.recordFailedLogin(db, keys);
      return generic;
    }
    let res: Awaited<ReturnType<typeof c.auth.api.signInEmail>>;
    try {
      res = await c.auth.api.signInEmail({ body: { email, password: data.password, rememberMe: true }, headers: c.headers });
    } catch (e) {
      const code = errCode(e);
      if (!/INVALID|NOT_FOUND|CREDENTIAL/.test(code)) console.error("[accounts] log-in failed:", code);
      await rateLimit.recordFailedLogin(db, keys);
      return generic;
    }
    const { isUserAllowed } = await import("../private/allowlist.server");
    if (!(await isUserAllowed(res.user.id))) {
      await c.auth.api.signOut({ headers: c.headers }).catch(() => {});
      await rateLimit.recordFailedLogin(db, keys);
      return generic;
    }
    const acc = await c.repo.loadAccount(res.user.id);
    if (!acc) {
      await rateLimit.recordFailedLogin(db, keys);
      return generic;
    }
    return { ok: true, value: acc };
  });

export const logOutFn = createServerFn({ method: "POST" }).handler(async () => {
  const c = await ctx();
  c.assertSameSite();
  await c.auth.api.signOut({ headers: c.headers }).catch(() => {});
  return { ok: true };
});

export const saveAccountFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => obj(input) as unknown as PublicAccount)
  .handler(async ({ data }): Promise<ApiResult<PublicAccount>> => {
    const c = await ctx();
    c.assertSameSite();
    const uid = await sessionUserId(c);
    if (!uid) return { ok: false, error: "You're signed out." };
    try {
      await c.repo.saveAccount(uid, data);
    } catch (e) {
      return { ok: false, error: (e as Error).message || "Couldn't save." };
    }
    return { ok: true, value: (await c.repo.loadAccount(uid))! };
  });

export const usernameTakenFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => s(obj(input).username, 40))
  .handler(async ({ data }) => {
    const c = await ctx();
    // Private mode: no probing. In invite mode the form can't pre-check either
    // (the server re-checks the username after the code on submit).
    if (!(await sessionUserId(c))) return !(await import("../invites/invites.server")).invitesEnabled();
    const { normalizeUsername } = await import("./validation.ts");
    return c.repo.usernameTaken(normalizeUsername(data));
  });

export const requestResetFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => s(obj(input).email, 254).trim().toLowerCase())
  .handler(async ({ data }) => {
    const c = await ctx();
    c.assertSameSite();
    // Same response whether or not the email exists (no account probing).
    await c.auth.api.requestPasswordReset({ body: { email: data, redirectTo: "/reset-password" }, headers: c.headers }).catch((e) => console.error("[accounts] reset request failed:", errCode(e)));
    return { ok: true, emailDelivery: false };
  });

export const resetPasswordFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { token: s(o.token, 200), password: s(o.password, 200) };
  })
  .handler(async ({ data }): Promise<ApiResult<{ signedIn: boolean }>> => {
    const c = await ctx();
    c.assertSameSite();
    const { validatePassword } = await import("./validation.ts");
    const bad = validatePassword(data.password);
    if (bad) return { ok: false, error: bad, field: "password" };
    // Who is this token for? (Lets us sign them straight in afterwards.)
    const db = await c.repo.sql();
    const rows = await db<{ email: string }>`select u.email from verification v join "user" u on u.id = v.value
      where v.identifier = ${"reset-password:" + data.token} and v."expiresAt" > now()`;
    try {
      await c.auth.api.resetPassword({ body: { token: data.token, newPassword: data.password }, headers: c.headers });
    } catch {
      return { ok: false, error: "This reset link has expired. Request a new one.", field: "token" };
    }
    const email = rows[0]?.email;
    if (!email) return { ok: true, value: { signedIn: false } };
    try {
      await c.auth.api.signInEmail({ body: { email, password: data.password, rememberMe: true }, headers: c.headers });
      return { ok: true, value: { signedIn: true } };
    } catch {
      return { ok: true, value: { signedIn: false } };
    }
  });

/** Public profile of a real (non-demo) account. */
export const publicProfileFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => s(obj(input).username, 40).toLowerCase())
  .handler(async ({ data }) => {
    const c = await ctx();
    if (!c.enabled || !data) return null;
    if (!(await sessionUserId(c))) return null; // private mode: members only
    return c.repo.publicProfile(data);
  });

/** Real creators live now + upcoming shows. */
export const liveDirectoryFn = createServerFn({ method: "GET" }).handler(async () => {
  const c = await ctx();
  if (!c.enabled) return { live: [], upcoming: [] };
  if (!(await sessionUserId(c))) return { live: [], upcoming: [] }; // private mode: members only
  return c.repo.liveDirectory();
});

/** Real directory profiles (owner-gated today) plus whether demo placeholders are on. */
export const directoryFn = createServerFn({ method: "GET" }).handler(async () => {
  const c = await ctx();
  const [{ platformEnv }, { demoProfilesEnabled }] = await Promise.all([import("../platform/runtime.ts"), import("../directory.ts")]);
  const showDemo = demoProfilesEnabled(platformEnv("ONLYMEN_DEMO_PROFILES"));
  if (!c.enabled || !(await sessionUserId(c))) return { showDemo, profiles: [] };
  return { showDemo, profiles: await c.repo.directoryProfiles() };
});

export const uploadPhotoFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { mime: s(o.mime, 40), base64: s(o.base64, 1_000_000) };
  })
  .handler(async ({ data }): Promise<ApiResult<string>> => {
    const c = await ctx();
    c.assertSameSite();
    const uid = await sessionUserId(c);
    if (!uid) return { ok: false, error: "You're signed out." };
    if (!/^image\/(jpeg|png|webp)$/.test(data.mime)) return { ok: false, error: "Please choose a JPEG, PNG or WebP image." };
    const buf = Buffer.from(data.base64, "base64");
    if (!buf.length || buf.length > c.repo.MAX_PHOTO_BYTES) return { ok: false, error: "That image is too large." };
    // Magic-byte check so only real images are stored and served.
    const head = buf.subarray(0, 12);
    const isJpeg = head[0] === 0xff && head[1] === 0xd8;
    const isPng = head[0] === 0x89 && head[1] === 0x50;
    const isWebp = head.subarray(0, 4).toString() === "RIFF" && head.subarray(8, 12).toString() === "WEBP";
    if (!isJpeg && !isPng && !isWebp) return { ok: false, error: "That file isn't an image." };
    try {
      return { ok: true, value: await c.repo.insertPhoto(uid, isJpeg ? "image/jpeg" : isPng ? "image/png" : "image/webp", buf) };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  });

export const deletePhotoFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => s(obj(input).id, 40))
  .handler(async ({ data }) => {
    const c = await ctx();
    c.assertSameSite();
    const uid = await sessionUserId(c);
    if (uid && data.startsWith("ph_")) await c.repo.deletePhoto(uid, data);
    return { ok: true };
  });

function asImage(mime: string, base64: string, maxBytes: number): { ok: true; mime: "image/jpeg" | "image/png" | "image/webp"; buf: Buffer } | { ok: false; error: string } {
  if (!/^image\/(jpeg|png|webp)$/.test(mime)) return { ok: false, error: "Please choose a JPEG, PNG or WebP image." };
  const buf = Buffer.from(base64, "base64");
  if (!buf.length || buf.length > maxBytes) return { ok: false, error: "That image is too large." };
  const head = buf.subarray(0, 12);
  const isJpeg = head[0] === 0xff && head[1] === 0xd8;
  const isPng = head[0] === 0x89 && head[1] === 0x50;
  const isWebp = head.subarray(0, 4).toString() === "RIFF" && head.subarray(8, 12).toString() === "WEBP";
  if (!isJpeg && !isPng && !isWebp) return { ok: false, error: "That file isn't an image." };
  return { ok: true, mime: isJpeg ? "image/jpeg" : isPng ? "image/png" : "image/webp", buf };
}

/** Upload or replace the profile banner (stored in om_banner, never in the gallery). */
export const uploadBannerFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const o = obj(input);
    return { mime: s(o.mime, 40), base64: s(o.base64, 1_000_000) };
  })
  .handler(async ({ data }): Promise<ApiResult<string>> => {
    const c = await ctx();
    c.assertSameSite();
    const uid = await sessionUserId(c);
    if (!uid) return { ok: false, error: "You're signed out." };
    const img = asImage(data.mime, data.base64, c.repo.MAX_PHOTO_BYTES);
    if (!img.ok) return img;
    try {
      return { ok: true, value: await c.repo.upsertBanner(uid, img.mime, img.buf) };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  });

export const deleteBannerFn = createServerFn({ method: "POST" }).handler(async (): Promise<ApiResult<true>> => {
  const c = await ctx();
  c.assertSameSite();
  const uid = await sessionUserId(c);
  if (!uid) return { ok: false, error: "You're signed out." };
  await c.repo.deleteBanner(uid);
  return { ok: true, value: true };
});
