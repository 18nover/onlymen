# Product Spec — OnlyMen

**Last updated:** 2026-11-21
**Status:** Living document — update in place, keep history in the Decision Log when material changes occur.

---

## 1. Vision

OnlyMen is a cleaner, modern, fully-owned alternative to RentMen.men.
We are not cloning or wrapping an existing product. We are building our own platform under the 18nover company.

Goal: treat this like a real company from day one and see how far it can go.

---

## 2. Core identity

| Item | Value |
|------|-------|
| Product name | OnlyMen |
| Primary domain | onlymen.gay |
| Live / hand-off domain | onlymen.live |
| Company | 18nover |
| Company domain | 18nover.gay |
| Positioning | Cleaner, modern alternative to RentMen that we own completely |
| Repo / hosting | `18nover/onlymen`, Vercel project `onlymen` (OnlyMen bot). Company site is owned by the 18nover bot. |

---

## 3. Phase 1 rules (current)

- Free for everyone (platform owner + any models who join). No subscription fees on the directory itself in Phase 1.
- Optional tips only, until paid features are deliberately turned on.
- Grow the platform and community first. Prefer the free or cheapest option for vendors and hosting.
- **Private mode as of 2026-11-21 9:28 PM ET:** public registration is closed server-side and only Jerry's allowlisted account can sign in. Mechanism details are a TODO until the gate commit is in this repo. The owner remains the first model; sign-ups stay closed until he is ready to open them.

---

## 4. Primary users

- **Creators / models** — Create profiles, link their own live rooms, manage schedules, receive tips later, control visibility.
- **Members / viewers** — Browse, watch via hand-off, tip later, follow schedules.
- **Platform owner (Jerry)** — First model on the platform, full admin, moderation, growth. In private mode, the only account that can sign in.

(Detailed personas and flows will be expanded as we learn.)

---

## 5. Core features (Phase 1 + near-term)

### What is already in the product

- Photo-first directory, profiles, filters (including an ethnicity filter that will be a self-identified, optional creator field).
- Sign-up, log-in, onboarding, draft legal pages (`/terms`, `/privacy`, `/guidelines`, `/2257`).
- Live discovery: `/live`, live rings, Watch hand-off interstitial, Go live, schedule and reminders.
- Real accounts on Neon + Better Auth.

### Live streaming (the differentiator)

OnlyMen **never hosts explicit video**. Creators link external rooms (Chaturbate, Stripchat, JustFor.Fans, OnlyFans live, and others) or, later, a white-label room on onlymen.live operated by a licensed partner. OnlyMen shows who is live and hands fans off through a branded 18+ interstitial. See [LIVE.md](LIVE.md). This supersedes the earlier "webcam or RTSP on our own servers" idea for Phase 1. A white-label partner is still to be chosen. Jerry's own cam room links are still outstanding.

### Payments (not built yet)

When money moves:

- Use **adult processors** (Segpay / CCBill), **not Stripe or PayPal**.
- Creators are **1099 contractors**.
- Intended revenue: a **10–15% tip commission**, featured placements, later memberships and affiliates.
- KYC via **Veriff, Yoti, or Persona**.
- Do not take payments while the app is on Vercel Hobby (non-commercial). See [HOSTING.md](HOSTING.md) and [OPERATIONS.md](OPERATIONS.md).

Company form: **Kentucky LLC** (18nover). Legal pages are drafts and need lawyer review.

---

## 6. Non-negotiables (so far)

1. We own the product, brand, data, and infrastructure completely.
2. Phase 1 stays free + tips only, until a deliberate paid launch.
3. Documentation remains chronological and living. No secrets in the repo docs.
4. Prefer small working increments over large unshipped plans. Prefer the free or cheapest vendor that is actually allowed to serve this product.
5. Start with the platform owner as the first live model, then open signups.
6. OnlyMen never hosts explicit video. AI never has the last word on 18+ / ID / CSAM decisions.

---

## 7. Growth and marketing intent

- Launch with the owner as the first model (private mode until that experience is ready).
- Open model/client signups after the core experience works.
- Advertise on X (Twitter) and run a deliberate PR / launch event once there is something real to show.

---

## 8. Out of scope for earliest Phase 1

- Paid subscriptions or membership tiers (planned as later revenue, not the first ship)
- OnlyMen-hosted video or a production media server
- Mobile native apps (web-first)
- Taking payments before commercial-ready hosting and an adult processor are in place

---

*This document is the single source of truth for product intent. Update it when product decisions change.*
