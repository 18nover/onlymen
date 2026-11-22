/**
 * OnlyMen's own Better Auth instance (server-only) for email + password accounts.
 *
 * This is separate from the template's Grok-broker config in src/lib/auth/server.ts
 * (which stays off: VITE_AUTH_ENABLED=false). It is only ever called in-process
 * via `auth.api.*` from the account server functions in ./api.ts — no
 * `/api/auth/*` HTTP route is mounted.
 *
 * Passwords: Better Auth hashes with scrypt on the server; the browser never
 * hashes or stores credentials in server mode.
 * Sessions: httpOnly, Secure, SameSite=Lax cookie (30 days, rolling).
 */
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { getPglite } from "../db";
import { pgliteDialect } from "../auth/pglite-dialect";
import { isSignUpAllowed, isUserAllowed, allowlist, privateModeOff } from "../private/allowlist.server";

const env = (k: string) => {
  const v = process.env[k]?.trim();
  return v ? v : undefined;
};

const databaseUrl = env("DATABASE_URL");

/** Server accounts are on when a real database is configured, or forced on in dev (PGLite). */
export const serverAccountsEnabled = Boolean(databaseUrl) || env("OM_ACCOUNTS") === "server";

const isProd = process.env.NODE_ENV === "production";

const g = globalThis as typeof globalThis & { __omDevAuthSecret__?: string; __omAuth__?: ReturnType<typeof create> };

function secret() {
  const s = env("BETTER_AUTH_SECRET");
  if (s) return s;
  if (databaseUrl && isProd) throw new Error("BETTER_AUTH_SECRET must be set when DATABASE_URL is set.");
  g.__omDevAuthSecret__ ??= randomBytes(32).toString("hex");
  return g.__omDevAuthSecret__;
}

/** Hosts this app is served from. Requests from anywhere else are rejected. */
const HOSTS = ["onlymen.gay", "www.onlymen.gay", "onlymen.live", "www.onlymen.live", "onlymen.vercel.app", "onlymen-18nover.vercel.app", "*.vercel.app", "localhost", "127.0.0.1"];
const ORIGINS = [
  "https://onlymen.gay",
  "https://www.onlymen.gay",
  "https://onlymen.live",
  "https://www.onlymen.live",
  "https://onlymen.vercel.app",
  "https://onlymen-18nover.vercel.app",
  "https://*.vercel.app",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
];

function create() {
  return betterAuth({
    appName: "OnlyMen",
    baseURL: env("BETTER_AUTH_URL") ?? { allowedHosts: HOSTS, protocol: "auto" as const, fallback: "https://onlymen.vercel.app" },
    basePath: "/api/account",
    secret: secret(),
    trustedOrigins: ORIGINS,
    database: databaseUrl
      ? new Pool({ connectionString: databaseUrl, max: 3 })
      : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const },
    emailAndPassword: {
      enabled: true,
      // PRIVATE MODE: public sign-up is off. The only exception is a one-time
      // owner bootstrap email (ONLYMEN_OWNER_SIGNUP_EMAIL), enforced again in
      // the before-hook below.
      disableSignUp: !privateModeOff() && allowlist().ownerEmails.size === 0,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      // No email provider is connected yet. Better Auth stores the single-use,
      // 1-hour token server-side; we deliberately never log or return it.
      sendResetPassword: async ({ user }) => {
        console.info(`[accounts] password reset requested for user ${user.id} (email delivery not configured)`);
      },
    },
    // PRIVATE MODE gates, enforced inside Better Auth itself (not just the UI):
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path.startsWith("/sign-up")) {
          const email = (ctx.body as { email?: string } | undefined)?.email;
          if (!isSignUpAllowed(email)) throw new APIError("FORBIDDEN", { message: "Sign-ups are closed. OnlyMen is private for now.", code: "SIGNUP_DISABLED" });
        }
      }),
    },
    databaseHooks: {
      // No session is ever created for an account that isn't on the allowlist
      // (blocks sign-in, auto sign-in after sign-up, and sign-in after reset).
      session: {
        create: {
          before: async (session) => {
            if (!(await isUserAllowed(session.userId))) {
              console.info("[private] blocked session for non-allowlisted user");
              return false;
            }
          },
        },
      },
    },
    session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
    advanced: {
      cookiePrefix: "onlymen",
      useSecureCookies: isProd,
      defaultCookieAttributes: { sameSite: "lax", httpOnly: true, path: "/" },
    },
    // MUST be last: bridges Better Auth's Set-Cookie into TanStack Start responses.
    plugins: [tanstackStartCookies()],
  });
}

export function getAuth() {
  g.__omAuth__ ??= create();
  return g.__omAuth__;
}
