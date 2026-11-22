# OnlyMen Live — "rent compliance" model

_Status: built 2026-11-21. Accounts, live status, schedules and reminders are server-backed on Neon (see [ACCOUNTS.md](ACCOUNTS.md)). Demo creators still come from `src/lib/live/demo.ts`. Draft, not legal advice._

`onlymen.live` is bought and attached to the `onlymen` Vercel project (HTTPS live as of 2026-11-21). Go live / Watch hand-offs to that domain are enabled in Production when `VITE_LIVE_DOMAIN_READY` is set. A white-label live partner has **not** been chosen yet, so the domain currently serves the same OnlyMen app rather than a partner-operated room product.

## The idea in one paragraph

OnlyMen is the **brand, discovery and fan relationship**. It never hosts, records or
relays explicit video. When a creator goes live, the video runs on a platform that
already carries the heavy compliance load — the creator's **own room** (Chaturbate,
Stripchat, JustFor.Fans, OnlyFans live, Fansly, CamSoda, Flirt4Free, X…) or, later,
a **white-label room on `onlymen.live`** operated by a licensed partner. OnlyMen
shows who is live, rings their photo, sends fans there through a branded hand-off,
and keeps the schedule, reminders and follower list. Creators own their audience,
links and content; the streaming platform owns age verification of performers,
2257 records for the stream, payments/payouts and stream moderation tooling.

This lets one founder open a live product without a legal department: the
regulated parts (performer KYC, 2257 custodian of records for streamed content,
card processing for adult content, chargebacks, DMCA on streams) are "rented"
from companies set up to handle them.

## What is built

| Surface | Where | Notes |
| --- | --- | --- |
| Live page | `/live` | Who's live now (gold/red animated ring, viewers, tip-goal bar), category filter, "Coming up" schedule with **Remind me**, compliance note. |
| Hand-off interstitial | `/watch/$handle` | "Taking you to OnlyMen Live…", 18+ reminder, platform + host shown, 3s countdown, **Stay here** / **Back to OnlyMen**. If the destination is `onlymen.live` and `VITE_LIVE_DOMAIN_READY` is not set, shows "OnlyMen Live opens soon" + profile link instead of a dead link. |
| Live rings | home grid, home "Live now" row, profile gallery, `/me` photo | `.live-ring` (wrapper) and `.live-ring-border` (overlay) in `src/styles.css`. |
| Watch live buttons | profile action panel, home live row, `/live` cards | All go through `/watch/$handle`. |
| Go live | `/me#go-live` (`src/components/go-live.tsx`) | Gate → pre-flight sheet (title, up to 4 tags, tip goal, which room) → marks session live → hand-off. **End stream** → recap card (demo stats). Schedule shows (date/time + length). Reminders card for viewers. |
| Gate | `src/lib/live/gate.ts` | Creator account + ID verification submitted (pending review or approved) + latest **Live Stream Rules** and **co-performer** consents. |
| Onboarding — creators | step `live` (after Verify, skippable) | Streams yes/no, room links per platform, reserve OnlyMen Live room, categories (≤5), usual days/time/time zone, tip menu, private show rate, recordings allowed, blocked regions, moderators, banned words, co-performer acknowledgement, versioned live-rules consent (logged with source `onboarding:live`). |
| Onboarding — everyone | Details step → "Live" card | Go-live alerts on/off, country/region, favorite categories (≤6). |
| Rules | `/live-rules` | DRAFT with lawyer banner; version `CONSENT_VERSIONS.liveRules`. Bumping the version re-prompts creators (the gate checks the latest version). |

Data lives on the account (`account.live`, `account.viewer`, `account.reminders`)
through the same `AccountStore` adapter as onboarding. In production that is the
Neon server adapter; see [ACCOUNTS.md](ACCOUNTS.md) and [ONBOARDING.md](ONBOARDING.md).
Demo creators come from `src/lib/live/demo.ts`.

## Config — one constant

`src/lib/live/config.ts`

```ts
LIVE_BASE_URL     = import.meta.env.VITE_LIVE_BASE_URL ?? "https://onlymen.live"
LIVE_DOMAIN_READY = import.meta.env.VITE_LIVE_DOMAIN_READY === "true"
```

* Change the domain: set `VITE_LIVE_BASE_URL` (for example a partner subdomain like `live.onlymen.gay`).
* Turn on hand-off to it: set `VITE_LIVE_DOMAIN_READY` so its value is the string `true`, then redeploy. This is set on Production as of 2026-11-21.
* Until that flag is set, every OnlyMen-Live destination degrades to the "opens soon" screen; a creator's own linked room hands off for real.
* Only `http(s)` room links are accepted (`safeExternalUrl`), and known platforms are recognised by host (`LIVE_PLATFORMS`).

Jerry's own cam room links are still waiting to be added. Open UI polish: tap-friendly Tip/Message buttons on phone tiles, and a Live-now name alignment fix (Marco's two-line tagline).

## SSO to onlymen.live — one-time token hand-off (design, not built)

Goal: a signed-in OnlyMen fan lands in the live room already logged in, without
sharing cookies across domains or exposing a long-lived credential.

1. Fan taps **Watch live** → `/watch/$handle` (OnlyMen origin).
2. OnlyMen server creates a **single-use token**: random 256-bit nonce stored
   server-side (or a signed JWT, `aud=onlymen.live`, `sub=userId`, `jti`, `exp` ≤ 60s,
   minimal claims: user id, display name, 18+ verified flag, wallet id).
3. Redirect to `https://onlymen.live/sso?token=…&room=$handle` (POST form is
   even better — keeps the token out of logs/history).
4. onlymen.live **back-channel exchanges** the token with OnlyMen
   (`POST /api/sso/exchange`, mutual auth with a shared secret or mTLS), OnlyMen
   marks it used (`jti` deny-list) and returns the profile.
5. onlymen.live sets its own first-party session cookie and drops the token from
   the URL (`history.replaceState`).
* Single use, ≤60s expiry, bound to `aud`, rejected if replayed.
* If the white-label partner supports SSO natively (most do via an affiliate /
  "white label login" API), OnlyMen becomes the identity provider in the same way.

## Shared wallet (design, not built)

* One **token balance** per fan, shown on both sites. The ledger lives with the
  party that is the merchant of record — for white-label rooms that's the partner
  (their payments, their chargebacks). OnlyMen displays the balance via API and
  deep-links to the partner's top-up page.
* Tips from an OnlyMen profile to a creator who streams elsewhere stay on the
  creator's platform (we just link) — OnlyMen does not hold money in Phase 1.
* If OnlyMen ever processes payments itself it needs a high-risk merchant account
  (Segpay / CCBill / Epoch-type processors) — not Stripe or PayPal. Out of scope
  until hosting is commercial-ready (see [HOSTING.md](HOSTING.md)).

## White-label options (to evaluate — verify current terms)

| Option | What it is | What they typically handle |
| --- | --- | --- |
| **Chaturbate white label** | Branded copy of the Chaturbate site/rooms on your domain, filtered to your categories (e.g. male only). | Performer ID/age verification and 2257 records, streaming infra, token sales, payouts, chargebacks, moderation tools. You earn revenue share on fans you bring. |
| **Stripchat white label** (via its affiliate program) | Branded cam site on your domain with Stripchat models, filterable (gay/men). | Same: performer KYC, records, payments/payouts, geo rules, streaming. |
| **CrakRevenue** | Adult affiliate network offering white-label cam sites and offers from several cam brands. | The underlying cam brand handles KYC, records and payments; CrakRevenue handles tracking + affiliate payouts to you. |

What stays OnlyMen's job either way: our own terms/privacy, our 18+ gate on the
directory, takedown/report handling for **our** pages (photos, bios), not
re-hosting stream content, and honest labeling that the room is run by the partner.

## Gaps / next steps

1. ~~Buy `onlymen.live` and point it at the app.~~ Done 2026-11-21. `VITE_LIVE_DOMAIN_READY` is set on Production.
2. Pick a white-label partner and read their contract (revenue share, who is merchant of record, SSO API). The domain is attached to the OnlyMen Vercel project until that partner is serving it.
3. ~~Server adapter for accounts so live status, schedules and reminders are shared.~~ Done; see [ACCOUNTS.md](ACCOUNTS.md).
4. Real notifications for reminders and go-live alerts (email/push) — needs a sender.
5. Blocked regions are stored but only **enforceable** with a server-side IP lookup; partner platforms already geo-block their rooms.
6. Live status detection: today the creator presses Go live/End. Later, poll partner APIs (many expose "is online") so the ring is automatic.
7. Lawyer review of `/live-rules`, then bump `CONSENT_VERSIONS.liveRules` to a dated final version.
8. Add `onlymen.live` and `www.onlymen.live` to Better Auth allowed hosts / trusted origins.
9. Jerry's own cam room links; Tip/Message phone-tile polish; Live-now name alignment (Marco's two-line tagline).
