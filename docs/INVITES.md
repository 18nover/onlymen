# Invite codes (beta sign-up)

OnlyMen is private. With **invite mode** on, signed-out visitors still only see
the coming-soon page, but `/join` opens and accepts sign-ups that carry a valid
invite code. Everything else is unchanged.

| Deployment | `ONLYMEN_INVITES` | Behaviour |
| --- | --- | --- |
| Cloudflare Worker (`onlymen.18nover.workers.dev`) | `on` (wrangler.jsonc `vars`) | Invite-code sign-up |
| Vercel (`onlymen.gay`, `onlymen.live`) | unset | Owner-only private mode, exactly as before |

Turning it on anywhere is just setting `ONLYMEN_INVITES=on` for that deployment.

## Who gets in

`isUserAllowed` (src/lib/private/allowlist.server.ts) lets an account in when:

- its id is in `ONLYMEN_ALLOWED_USER_IDS` (or username / owner email allowlists), or
- invite mode is on **and** it has a row in `invite_redemptions` (joined with a code), or
- invite mode is on **and** its `om_account.role` is `admin` or `owner`.

Revoking a code stops *new* sign-ups with it; people who already joined keep access.
To remove someone's access, delete their account or their `invite_redemptions` row.

## Tables (migrations/0004_invite_codes.sql)

- `invite_codes` — `code_hash` (SHA-256 hex of the canonical `OM-XXXX-XXXX`),
  `code_hint` (last 4 chars), `note`, `max_uses` (default 1), `use_count`,
  `redeemed_by` / `redeemed_at` (first redeemer), `revoked_at`, `created_by`, `created_at`.
- `invite_redemptions` — one row per account created with a code (multi-use codes have several).
- `invite_attempts` — failed attempts keyed by an HMAC of the client IP (rate limiting; pruned after a day).

Plain codes are never stored, logged or committed.

## Sign-up flow (src/lib/account/api.ts → `signUpWithInvite`)

1. Rate limit: 10 failed code attempts per client per 15 min (IPv4 address, or IPv6 /64), 300 across everyone.
   Override with `ONLYMEN_INVITE_RATE_PER_IP` / `ONLYMEN_INVITE_RATE_GLOBAL`. While limited, even a valid code waits.
2. Read-only pre-check for a friendly message: missing / invalid / used / revoked.
3. Field validation, username and email checks.
4. **One transaction**: insert `user` + credential `account` (Better Auth's scrypt hash),
   claim the code with
   `UPDATE invite_codes SET use_count = use_count + 1 … WHERE code_hash = $1 AND revoked_at IS NULL AND use_count < max_uses RETURNING id`,
   insert `invite_redemptions`, `om_account` and the age consent. If the claim
   returns no row (lost a race, revoked meanwhile) the whole transaction rolls back,
   so no account is left behind and a code can't be over-used.
5. Sign in through Better Auth (session cookie), then onboarding.

Better Auth's own `/sign-up` stays disabled.

## QA

`BASE=https://onlymen.18nover.workers.dev CODE_A=… CODE_B=… CODE_RACE=… node scripts/e2e-invites.mjs` with temporary codes; delete the `e2etest*` accounts and the temporary codes afterwards.

## Managing codes

### Admin page

`/admin/invites` (admin/owner accounts only, invite mode only): list with status,
uses, note and who joined; create codes (count, uses each, note) — the new codes
and `…/join?code=…` links are shown **once**; revoke / restore.

### CLI (needs `DATABASE_URL` in your shell — never commit it)

```sh
node scripts/invite-codes.mjs generate --count 5 --note "for Sam"     # offline: codes + SQL to paste
DATABASE_URL=… node scripts/invite-codes.mjs create --count 5 --note "for Sam" --out ~/codes.txt
DATABASE_URL=… node scripts/invite-codes.mjs list
DATABASE_URL=… node scripts/invite-codes.mjs revoke OM-XXXX-XXXX      # or a numeric id
DATABASE_URL=… node scripts/invite-codes.mjs restore 12
```

### SQL (Neon SQL editor, database `onlymen`)

```sql
-- Add a code you made up (use the alphabet 23456789ABCDEFGHJKMNPQRSTUVWXYZ, format OM-XXXX-XXXX):
insert into invite_codes (code_hash, code_hint, note, max_uses)
values (encode(sha256(convert_to('OM-ABCD-EFGH', 'UTF8')), 'hex'), 'EFGH', 'for Sam', 1);

-- Reusable code (10 sign-ups):
--   … same insert with max_uses = 10

-- Revoke by code, or by id:
update invite_codes set revoked_at = now()
 where code_hash = encode(sha256(convert_to('OM-ABCD-EFGH', 'UTF8')), 'hex');
update invite_codes set revoked_at = now() where id = 12;

-- Restore:
update invite_codes set revoked_at = null where id = 12;

-- Status overview:
select c.id, 'OM-…-' || c.code_hint as code, c.note, c.use_count, c.max_uses,
       case when c.revoked_at is not null then 'revoked' when c.use_count >= c.max_uses then 'used' else 'active' end as status,
       (select string_agg(a.username, ', ') from invite_redemptions r join om_account a on a.user_id = r.user_id where r.code_id = c.id) as joined
  from invite_codes c order by c.id;

-- Clear rate-limit lockouts:
delete from invite_attempts;
```

The initial batch of 25 codes lives only in a private file on the bot's box
(`/home/box/.secrets/onlymen-invite-codes.txt`, chmod 600), not in git.
