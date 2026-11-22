# Decision Log — OnlyMen

Chronological record of material decisions. Newest entries at the bottom.

Format:  
**YYYY-MM-DD** — Decision title  
What we decided + why.

---

**2026-11-20** — Project identity and company  
We are building OnlyMen as our own platform for verified adult creators and the men who follow them.  
- Product domain: onlymen.gay  
- Company: 18nover  
- Company domain: 18nover.gay  
Reason: Full ownership from day one. Treat it as a real company, not a side project or wrapper.

**2026-11-20** — Phase 1 monetization  
Phase 1 is free for everyone (owner + models). No subscription fees. Optional tips only.  
Pricing decisions are deferred until the platform has real value and users.  
Reason: Grow first. Avoid friction while we validate the product.

**2026-11-20** — Documentation approach  
All key documents live as markdown in the repo and stay chronological/living:  
- PRODUCT_SPEC.md  
- ARCHITECTURE.md  
- ROADMAP.md  
- DECISION_LOG.md  
Reason: Single source of truth. Prevents the same context from being re-explained repeatedly. Enables any future collaborator (human or AI) to pick up state quickly.

**2026-11-20** — Starting point  
Full idea + research only. No existing code or designs.  
First concrete action: create and seed the documentation skeleton, then proceed in the order defined in ROADMAP.md.

**2026-11-20** — Clean GitHub repository  
Deleted the previous 18nover/onlymen repository (which contained an AT Protocol / Bluesky-fork social network experiment).  
Created a fresh private repository at https://github.com/18nover/onlymen focused solely on the creator product defined in these docs.  
Reason: The two product directions were incompatible. We are committing to a modern creator platform (profiles, tips, Phase 1 free) and starting with a clean slate. *(Wording updated 2026-11-22, ONL-11: OnlyMen bans escorting and paid sexual services outright; see the Terms.)*

**2026-11-20** — Live streaming as a core differentiator  
Creators will be able to go live from their space (webcam or RTSP source) and stream to viewers on the platform, with the ability to receive tips.  
The platform starts with the owner as the first model, then opens signups. Marketing will include X (Twitter) advertising and a deliberate PR/launch event once there is a real working experience.  
Reason: Live + tips is a strong differentiator versus classic static directory sites. Starting with the owner keeps scope manageable and gives us a real product to show before opening the floodgates.

**2026-11-21** — Sign-up & onboarding storage  
Built sign-up, log-in, password reset and a multi-step onboarding wizard (consents, profile, photos, device permissions, creator ID verification, privacy). No database or auth provider is provisioned yet, so accounts are stored by a clearly isolated browser-local adapter (`LocalAccountStore`, PBKDF2-hashed passwords, photos in IndexedDB) behind an `AccountStore` interface.  
Reason: works on Vercel today with zero paid services; a server adapter (Neon + Better Auth, both pre-wired) can replace it without UI changes. Must be swapped before real sign-ups open. Details: docs/ONBOARDING.md.

**2026-11-21** — Live streaming via linked, licensed platforms  
OnlyMen never hosts explicit video. Creators link their own rooms (Chaturbate, Stripchat, JustFor.Fans, OnlyFans live…) or a future white-label room on `onlymen.live`; OnlyMen shows who's live (rings, /live page, schedule, reminders) and hands fans off through a branded 18+ interstitial. The live domain is one config constant (`VITE_LIVE_BASE_URL`, `VITE_LIVE_DOMAIN_READY`) with a graceful "opens soon" fallback until it exists. Going live requires a creator account, submitted ID verification and the versioned Live Stream Rules + co-performer consents.  
Reason: a solo founder can't carry performer KYC, 2257 records for streams, adult payment processing and stream moderation; licensed platforms already do. Supersedes the "webcam or RTSP source" plan from 2026-11-20 for Phase 1. Details: docs/LIVE.md.

**2026-11-21** — Real accounts on free Neon + Better Auth  
Accounts, sessions, profiles, versioned consents, onboarding progress, verification status, live status, schedules, reminders and profile photos moved to a free-tier Neon Postgres database, with Better Auth (own instance under `src/lib/account`, separate from the template's broker-bound auth) hashing passwords server-side. Photos are stored as downscaled bytea in Postgres to avoid another service. The browser-local adapter remains only as a dev fallback when `DATABASE_URL` is missing. Reset emails and KYC remain open (no paid services). Details: docs/ACCOUNTS.md.


**2026-11-21** — Keep the ethnicity filter
Jerry decided to keep the ethnicity filter. It will be a self-identified, optional creator field (never assigned by the platform). The browse filter and demo profiles already use it; the real account `Profile` type still needs the field added.

**2026-11-21** — onlymen.live
Jerry bought onlymen.live in the afternoon (ET). It is attached to the `onlymen` Vercel project with HTTPS. `VITE_LIVE_DOMAIN_READY` was set on Production so Go live / Watch hand-offs can use the domain. A white-label live partner is still to be chosen; until then the domain serves the same OnlyMen app.

**2026-11-21** — Business and payments direction
18nover will be a Kentucky LLC. Creators are 1099 contractors. When payments exist, use an adult-content-friendly processor (owner + lawyer decision). KYC via Veriff, Yoti, or Persona. Intended revenue: a 10–15% tip commission, memberships and affiliates. Always try the free or cheapest allowed option first. Vercel Hobby is non-commercial, so the app must move (planned Cloudflare Workers migration, not started) or upgrade before taking payments.

**2026-11-21** — Role split among the bots
OnlyMen bot owns repo `18nover/onlymen`, the `onlymen` Vercel project, onlymen.gay, onlymen.live, and the product roadmap. 18nover bot owns the company side. Supervisor coordinates. Nobody changes another's repo, project, or DNS without asking first. The 18nover.gay footer links at OnlyMen legal and join routes must not be renamed without coordinating.

**2026-11-21 9:28 PM ET** — Private mode
Public registration is closed server-side and only Jerry's allowlisted account can sign in, so the site can stay private until he is ready to open it. Landed in commit `8311918`: Better Auth `disableSignUp`, an allowlist (`ONLYMEN_ALLOWED_USER_IDS` / `ONLYMEN_ALLOWED_USERNAMES`; unset = nobody), a "Private — coming soon" Nitro gate for logged-out visitors, a token-gated `/api/owner-seed`, and `om_account.role`. Details: docs/ACCOUNTS.md. Production still needs a file-upload redeploy and the allowlist env vars set (names only in docs) before the gate is live on onlymen.gay.

**2026-11-22** — ONL-11 cleanup (branch `invite-codes`)
Removed reviews and star ratings, paid-style tier badges ("Elite"/"Premium"), "Available now", availability grids, travel flags, creator rate cards with per-hour units, the services menu, the position field, the private show rate and date-style copy. Stored values for retired fields stay in the shared database untouched (never shown or edited by this branch); see docs/CLEANUP.md for the later-drop list. Prostitution, escorting and paid sexual services are banned in the Terms.

