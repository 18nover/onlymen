import { createHmac } from "node:crypto";
import type { Sql } from "../db";
import { platformEnv } from "../platform/runtime.ts";
import { ipHash } from "../invites/invites.server.ts";

export const LOGIN_RATE_LIMIT = { windowMin: 15, failures: 5 } as const;

export function normalizeLoginIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase().replace(/^@/, "").slice(0, 254);
}

export function loginRateKeys(headers: Headers, identifier: string): { ip: string; account: string } {
  const secret = platformEnv("BETTER_AUTH_SECRET") ?? "onlymen-dev-login-rate";
  const account = normalizeLoginIdentifier(identifier);
  return {
    ip: ipHash(headers),
    account: createHmac("sha256", secret).update(`account:${account}`).digest("hex"),
  };
}

export async function isLoginRateLimited(db: Sql, keys: { ip: string; account: string }): Promise<boolean> {
  const rows = await db<{ ip_count: number; account_count: number }>`select
      count(*) filter (where key_type = 'ip' and key_hash = ${keys.ip}) as ip_count,
      count(*) filter (where key_type = 'account' and key_hash = ${keys.account}) as account_count
    from om_login_attempts where at > now() - make_interval(mins => ${LOGIN_RATE_LIMIT.windowMin})`;
  return Number(rows[0]?.ip_count ?? 0) >= LOGIN_RATE_LIMIT.failures ||
    Number(rows[0]?.account_count ?? 0) >= LOGIN_RATE_LIMIT.failures;
}

export async function recordFailedLogin(db: Sql, keys: { ip: string; account: string }): Promise<void> {
  await db`insert into om_login_attempts (key_type, key_hash)
    values ('ip', ${keys.ip}), ('account', ${keys.account})`;
  if (Math.random() < 0.05) await db`delete from om_login_attempts where at < now() - interval '1 day'`;
}
