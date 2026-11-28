# 18+ visitor age gate (ONL-8)

**Not legal advice. Needs lawyer review before OnlyMen opens to the public.**

Code: `server/middleware/age-gate.ts` (enforcement), `src/lib/age-gate/`
(`policy.ts` decisions, `token.ts` signed pass token, `verifiers.ts` pluggable
verifiers, `av-states.ts` AV-law state list, `html.ts` pages). Tests:
`src/lib/age-gate/age-gate.test.ts`.

This is **visitor** age verification. It is completely separate from creator
ID verification and 2257 records ([VERIFICATION.md](VERIFICATION.md)), which
must keep records. The visitor gate keeps none.

## Flags (wrangler.jsonc on the Worker; unset on Vercel = no change)

| Var | Worker value | Meaning |
| --- | --- | --- |
| `ONLYMEN_AGE_GATE` | `on` | Every app page needs a valid signed age token. |
| `ONLYMEN_AGE_VERIFIER` | `stripe` | Which verifier issues tokens: `stripe` (Stripe Identity, the real one) or `clickthrough` (**DEV/TEST ONLY**, the default when unset). |
| `ONLYMEN_AGE_GATE_GEOBLOCK` | `off` | `on` = visitors geolocated to a state in `av-states.ts` get "Not available in your region" (HTTP 451). Owner/admin accounts bypass after logging in. Default off because Jerry is in Kentucky. |

## Why click-through is not enough (Kentucky)

Kentucky HB 278 (2024 Ky. Acts ch. 106), signed 5 April 2024, in force
**15 July 2024**, created **KRS 436.001–436.009**:

- KRS 436.001(1): "age verification" means a state or federal government ID,
  or a commercially reasonable method using public or private transactional data.
  A self-declared "I am 18" button does not qualify.
- KRS 436.001(2) and 436.002: applies to a "covered platform" where more than
  one third of the material is harmful to minors. Private right of action,
  $10,000 per instance of failing to verify, plus damages and fees.
- KRS 436.004: the platform or its vendor must **not keep any identifying
  information** after access is granted. $1,000 per 24 hours it is kept.

About 26 other states have similar laws (27 in total as of November 2026, see
`src/lib/age-gate/av-states.ts`, last checked 2026-11-22). **That list must be
re-checked by counsel and kept current.**

So going public in Kentucky, or in any of those states, needs **either** a real
age-verification vendor **or** the geoblock turned on.

## How it works

1. A request for an app page without a valid token gets the active verifier's
   start page (served in place, `200`, `no-store`, `x-onlymen-gate: age`).
   Non-GET requests and `/api/*` get `403`.
2. Clickthrough: the "I am 18 or older, enter" button POSTs to
   `/age/callback?next=…` (same-origin only). "Exit" goes to google.com.
3. On pass the server sets `om_age18`: `v1.<verifier>.<expiry>.<HMAC-SHA256>`,
   30 days, `Path=/; SameSite=Lax; Secure`. The HMAC key is derived from
   `BETTER_AUTH_SECRET`; no new secret. A token from another verifier is
   rejected, so switching to a vendor makes everyone verify again.
4. **Nothing else is stored.** No DOB, no PII, no images, no database rows, no logs about visitors.
5. Exempt (crawl-safe): `/terms`, `/privacy`, `/guidelines`, `/2257`,
   `/custodian`, `/live-rules`, `/legal/*`, `/age`, `/age/callback`,
   `/region-blocked`, `/robots.txt`, static assets, and server-function calls
   (`/_serverFn/*`). Those calls check the session and allowlist themselves and
   return nothing to anonymous visitors. The root route also checks on the client, so
   in-app navigation from an exempt page sends the visitor to `/age`.
6. Order on the Worker: age-gate, then grok-pwa, then private-gate, then the app. Private mode stays on:
   after the age gate, signed-out visitors still see the coming-soon page.

Geo comes from `request.cf.country` / `request.cf.regionCode`, then the
`CF-IPCountry` / `cf-region-code` headers, then Vercel's `x-vercel-ip-*`.
If the location is unknown the visitor is let through (fails open). VPNs get around any geoblock.

## Plugging in a real vendor

Implement `AgeVerifier` (`startVerification(req)` creates a vendor session and
redirects; `handleCallback(req)` checks the vendor's signed webhook or
re-fetches the session and returns pass or fail) next to `stripeIdentityVerifier` in `verifiers.ts`.
Register it, set `ONLYMEN_AGE_VERIFIER=<name>`, and add the vendor's keys with
`wrangler secret put`. The vendor's callback or webhook URL is `/age/callback`.
Keep only the pass/fail result.

The live verifier on the test Worker is Stripe Identity (age/ID check only; not payments; see `HANDOFF.md`). First 50
verifications are free, then paid per check. Stripe restricts adult businesses on
payments, so Identity should be confirmed against that policy before going live.
Store only a verified-18+ flag, session id and timestamp — no ID images or date of
birth from Stripe after the grant. Manual KYC stays the fallback until this is built.

## Test

```
curl -sI https://onlymen.18nover.workers.dev/            # x-onlymen-gate: age
curl -s -c jar -o /dev/null -w '%{http_code} %{redirect_url}\n' -X POST \
  'https://onlymen.18nover.workers.dev/age/callback?next=/'   # 303 → /
curl -sI -b jar https://onlymen.18nover.workers.dev/      # x-onlymen-gate: private (coming soon)
```
