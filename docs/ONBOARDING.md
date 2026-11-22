# Sign-up & onboarding — OnlyMen

**Added:** 2026-11-21 · **Status:** server-backed accounts on Neon + Better Auth (see [ACCOUNTS.md](ACCOUNTS.md)). Remaining gaps in §4 and ACCOUNTS.md.

**Private mode (as of 2026-11-21 9:28 PM ET):** public registration is closed server-side and only Jerry's allowlisted account can sign in. Logged-out visitors see a coming-soon page; `/join` is gated. Mechanism: [ACCOUNTS.md](ACCOUNTS.md).

The 18nover.gay footer links to `/terms`, `/privacy`, `/2257`, `/guidelines`, and `/join?as=creator` on this product. **Coordinate with the 18nover bot before moving or renaming those routes.**

## 1. Routes

| Route | What it does |
|---|---|
| `/join` (`?as=creator`) | Sign-up: account type (Member / Creator), email, @username (live availability check), password + strength meter, date of birth with a hard 18+ check. Google / Apple / X buttons are shown disabled ("coming soon"). In private mode the coming-soon gate is shown instead; server-side sign-up is disabled. |
| `/login` | Email **or** username + password. |
| `/logout` | Ends the session on this device. |
| `/forgot-password` → `/reset-password?token=` | Reset flow. Same response whether or not the email exists. Tokens expire after 1 hour. In **server** mode the link is never shown in the browser (no email provider yet; support must deliver it). The browser-local dev adapter still shows a demo link. |
| `/onboarding?step=…` | Multi-step wizard (below). Progress saves on every change; returning resumes the saved step. |
| `/me` | Your own profile (photo-first gallery, details, rates, links, privacy/permission summary, verification status, edit links into each wizard step). |
| `/terms`, `/privacy`, `/guidelines`, `/2257` | Placeholder legal pages with a **DRAFT — have a lawyer review** banner. `/live-rules` is a separate draft for creators who go live. |

Header "Sign in" / "Join free" and the mobile nav are wired to these; when signed in they show your avatar → `/me` (or "Finish setup" → `/onboarding`).

## 2. Wizard steps

The wizard is defined in `src/components/onboarding/wizard.tsx`. Creators see nine content steps plus a Done screen. Members skip **Verify** and **Live**.

1. **Agreements** (required, can't skip) — every box unchecked by default. Required: 18+ attestation, Terms, Privacy Policy, adult-content acknowledgement, Community Guidelines. Optional: analytics cookies, marketing email, SMS (asks for a mobile number). Each answer — yes *or* no — is appended to a consent log with key, version, ISO timestamp, source and user agent.
2. **Basics** — display name (required), headline, bio, city, show-age toggle.
3. **Photos** — up to 9 in the UI; drag-and-drop upload, drag or arrow reorder, "Set main" (first = profile photo), delete; creators can flag a photo 18+ (blurred for viewers who opt in). Images are downscaled to ≤1280px JPEG. The server adapter will reject a 16th photo (hard cap 15).
4. **Details** — height, body type, position, tribes, looking for, interests, languages. (Ethnicity is a decided optional creator field but is not on this step yet; see [ACCOUNTS.md](ACCOUNTS.md).)
5. **Links** (creators: **Links & rates**) — X, Instagram, website (+ OnlyFans/JFF, tips toggle, services, rate list for creators).
6. **Permissions** — location, notifications (web push), camera/photos, microphone. Each card explains why; tapping Allow shows an in-app explainer *before* the real browser prompt. Stores `granted | denied | skipped | unsupported` + timestamp. Never blocks.
7. **Verify** (creators only, skippable) — legal name, ID type/country, ID front/back + selfie-with-ID uploads, 18 U.S.C. § 2257 record-keeping acknowledgement, model release / content-ownership consent, payout method + email and tax form (placeholders — no bank/SSN collected). Submitting sets `creator.status = "pending_review"`. ID images stay on the device.
8. **Live** (creators only, skippable) — room links, schedule prefs, tip menu, co-performer and Live Stream Rules consents. See [LIVE.md](LIVE.md).
9. **Privacy** — show online, show distance, blur explicit by default, discoverable, who can message (everyone / verified / following / nobody).

**Done / Welcome** — profile card, completion checklist, → "See my profile" (`/me`) or "Start browsing".

Optional steps have **Skip for now**; all steps have **Back**.

## 3. Data model and storage

Types: `src/lib/account/types.ts` (Account, ConsentRecord, Profile, Photo, PermissionRecord, CreatorVerification, PrivacySettings, OnboardingProgress). Consent versions: `src/lib/account/constants.ts` (`CONSENT_VERSIONS` — bump when a document changes to re-prompt).

**Production (from 2026-11-21):** `ServerAccountStore` — accounts, consents, photos and progress live in Neon Postgres; see [ACCOUNTS.md](ACCOUNTS.md). ID images still stay on the device.

**Dev fallback (no `DATABASE_URL`):** `LocalAccountStore` (`src/lib/account/store.ts`) keeps accounts in the browser's `localStorage`; photos and ID images go to IndexedDB (`src/lib/account/media.ts`). Passwords are hashed with PBKDF2-SHA256 (210k iterations, random salt) via WebCrypto — the raw password is never stored. That fallback is not for real sign-ups: accounts exist only in that one browser.

All UI talks only to the `AccountStore` interface (`signUp, logIn, logOut, current, update, isUsernameTaken, requestPasswordReset, resetPassword, subscribe`).

## 4. Still needed for a public, paid product

| Need | Recommended | Notes |
|---|---|---|
| Email | Resend / Postmark (adult-content policy permitting) or AWS SES | Password reset, verification, receipts. Confirm the provider allows adult platforms. |
| ID / age verification | **Veriff**, **Yoti**, or Persona | Replace the upload slots with the vendor SDK; store vendor session id + result; webhook flips `pending_review → approved/rejected`. Needed for 2257 + state age-verification laws. |
| Media storage | Cloudflare R2 / S3 (planned with the Cloudflare move) | Signed uploads, EXIF strip, CSAM hash scan (e.g. PhotoDNA) before anything is shown. Today photos are `bytea` in Neon. |
| SMS | Twilio / Telnyx | Requires A2P 10DLC registration; adult content is restricted — use for account alerts only. |
| Web push | Web Push + VAPID keys (service worker) | Notification permission is already captured; store push subscriptions server-side. |
| Payouts / tax | Adult-friendly processor (Segpay, CCBill, Epoch, Paxum) — not Stripe or PayPal | Creators are 1099 contractors. Collect bank + W-9/W-8BEN inside the processor's hosted flow, never in our DB. |
| Legal | Counsel | Replace the DRAFT pages; name a 2257 custodian of records; cookie banner per jurisdiction. |
| Hosting | Cloudflare Workers (planned) or Vercel Pro | Vercel Hobby is non-commercial; required before taking payments. See [HOSTING.md](HOSTING.md). |

## 5. QA

`node scripts/e2e-onboarding.mjs` (dev server on :8080) drives a full creator sign-up on desktop and a member sign-up on mobile, checks persistence across reload, wrong-password rejection, log-out/log-in, and writes screenshots to `/workspace/deploy/onboarding-*.png`. Unit tests for the 18+/field validation: `src/lib/account/validation.test.ts` (part of `npm test`). Account e2e: `scripts/e2e-accounts.mjs`.
