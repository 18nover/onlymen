import { createFileRoute } from "@tanstack/react-router";

/**
 * One-off OWNER SEED (private mode). Creates — or updates in place — the single
 * owner/admin account using Better Auth's own password hashing and internal
 * adapter. Public sign-up stays closed.
 *
 * Inert unless ONLYMEN_OWNER_SEED_TOKEN (>= 32 chars) is set on the server, and
 * then only for a request carrying that exact bearer token. Remove the env var
 * right after use. Nothing about the request (password, email) is logged or
 * returned; the response carries the user id and other accounts' handles only.
 *
 * The reserved handle "admin" is allowed here and nowhere else (sign-up keeps
 * the RESERVED list in validation.ts).
 */
const OWNER_USERNAME = "admin";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", "x-robots-tag": "noindex" } });

export const Route = createFileRoute("/api/owner-seed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = process.env.ONLYMEN_OWNER_SEED_TOKEN?.trim() ?? "";
        if (token.length < 32) return json({ error: "Not found" }, 404);
        const { timingSafeEqual, createHash } = await import("node:crypto");
        const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
        const h = (s: string) => createHash("sha256").update(s).digest();
        if (!timingSafeEqual(h(given), h(token))) return json({ error: "Not found" }, 404);

        let body: { email?: unknown; password?: unknown; dob?: unknown; displayName?: unknown };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Bad request" }, 400);
        }
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const dob = typeof body.dob === "string" ? body.dob : "";
        const displayName = typeof body.displayName === "string" && body.displayName.trim() ? body.displayName.trim().slice(0, 60) : "Admin";
        const v = await import("@/lib/account/validation");
        if (v.validateEmail(email) || v.validatePassword(password) || v.validateDob(dob)) return json({ error: "Invalid email, password or date of birth." }, 400);

        const [{ getAuth, serverAccountsEnabled }, repo, c] = await Promise.all([import("@/lib/account/auth.server"), import("@/lib/account/repo.server"), import("@/lib/account/constants")]);
        if (!serverAccountsEnabled) return json({ error: "No database" }, 503);
        const ctx = await getAuth().$context;
        const db = await repo.sql();
        const hash = await ctx.password.hash(password);

        // Existing account with this email or the owner handle → update in place.
        const found = await db<{ id: string }>`select u.id from "user" u left join om_account a on a.user_id = u.id
          where lower(u.email) = ${email} or a.username = ${OWNER_USERNAME} order by u."createdAt" limit 1`;
        let userId = found[0]?.id ?? null;
        let action: "created" | "updated";
        if (userId) {
          action = "updated";
          await ctx.internalAdapter.updateUser(userId, { email, name: OWNER_USERNAME, emailVerified: true });
          const accounts = await ctx.internalAdapter.findAccounts(userId);
          if (accounts.some((a) => a.providerId === "credential")) await ctx.internalAdapter.updatePassword(userId, hash);
          else await ctx.internalAdapter.linkAccount({ userId, providerId: "credential", accountId: userId, password: hash });
          // Sign out every existing session of this account.
          await ctx.internalAdapter.deleteUserSessions(userId);
        } else {
          action = "created";
          const user = await ctx.internalAdapter.createUser({ email, name: OWNER_USERNAME, emailVerified: true });
          userId = user.id;
          await ctx.internalAdapter.linkAccount({ userId, providerId: "credential", accountId: userId, password: hash });
        }

        const profile = { ...c.emptyProfile(), displayName };
        delete (profile as Partial<typeof profile>).photos;
        const now = new Date().toISOString();
        const onboarding = { current: "finish", completed: ["consents", "basics"], skipped: ["photos", "details", "socials", "permissions", "verify", "live", "privacy"], finishedAt: now };
        await db`insert into om_account (user_id, username, account_type, dob, profile, privacy, permissions, onboarding, role)
          values (${userId}, ${OWNER_USERNAME}, 'member', ${dob}, ${JSON.stringify(profile)}::jsonb, ${JSON.stringify(c.defaultPrivacy())}::jsonb,
                  ${JSON.stringify(c.defaultPermissions())}::jsonb, ${JSON.stringify(onboarding)}::jsonb, 'owner')
          on conflict (user_id) do update set username = excluded.username, dob = excluded.dob, onboarding = excluded.onboarding, role = 'owner', updated_at = now()`;
        const hasAge = await db`select 1 from om_consent where user_id = ${userId} and key = 'age18' and granted`;
        if (!hasAge.length) await db`insert into om_consent (user_id, key, granted, version, source, at) values (${userId}, 'age18', true, ${c.CONSENT_VERSIONS.age18}, 'owner-seed:dob', now())`;

        const others = await db<{ username: string | null; created: string }>`select a.username, u."createdAt"::text as created from "user" u left join om_account a on a.user_id = u.id where u.id <> ${userId} order by u."createdAt"`;
        console.info(`[owner-seed] ${action} owner account ${userId}`);
        return json({ ok: true, action, userId, username: OWNER_USERNAME, others });
      },
    },
  },
});
