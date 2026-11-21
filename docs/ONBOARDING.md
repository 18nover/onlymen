# Sign-up & onboarding — OnlyMen

**Added:** 2026-11-21 · **Status:** server-backed accounts on Neon + Better Auth (see docs/ACCOUNTS.md). Remaining gaps in §4 and ACCOUNTS.md.

## 1. Routes

| Route | What it does |
|---|---|
| `/join` (`?as=creator`) | Sign-up: account type (Member / Creator), email, @username (live availability check), password + strength meter, date of birth with a hard 18+ check. Google / Apple / X buttons are shown disabled ("coming soon"). |
| `/login` | Email **or** username + password. |
| `/logout` | Ends the session on this device. |
| `/forgot-password` → `/reset-password?token=` | Reset flow. Same response whether or not the email exists. In preview mode (no email provider) the reset link is shown on screen. Tokens expire after 1 hour. |
| `/onboarding?step=…` | Multi-step wizard (below). Progress saves on every change; returning resumes the saved step. |
| `/me` | Your own profile (photo-first gallery, details, rates, links, privacy/permission summary, verification status, edit links into each wizard step). |
| `/terms`, `/privacy`, `/guidelines`, `/2257` | Placeholder legal pages with a **DRAFT — have a lawyer review** banner. |

Header "Sign in" / "Join free" and the mobile nav are wired to these; when signed in they show your avatar → `/me` (or "Finish setup" → `/onboarding`).

## 2. Wizard steps

1. **Agreements** (required, can't skip) — every box unchecked by default. Required: 18+ attestation, Terms, Privacy Policy, adult-content acknowledgement, Community Guidelines. Optional: analytics cookies, marketing email, SMS (asks for a mobile number). Each answer — yes *or* no — is appended to a consent log with key, version, ISO timestamp, source and user agent.
2. **Basics** — display name (required), headline, bio, city, show-age toggle.
3. **Photos** — up to 9; drag-and-drop upload, drag or arrow reorder, "Set main" (first = profile photo), delete; creators can flag a photo 18+ (blurred for viewers who opt in). Images are downscaled to ≤1280px JPEG.
4. **Details** — height, body type, position, tribes, looking for, interests, languages.
5. **Links** (creators: **Links & rates**) — X, Instagram, website (+ OnlyFans/JFF, tips toggle, services, rate list for creators).
6. **Permissions** — location, notifications (web push), camera/photos, microphone. Each card explains why; tapping Allow shows an in-app explainer *before* the real browser prompt. Stores `granted | denied | skipped | unsupported` + timestamp. Never blocks.
7. **Verify** (creators only) — legal name, ID type/country, ID front/back + selfie-with-ID uploads, 18 U.S.C. § 2257 record-keeping acknowledgement, model release / content-ownership consent, payout method + email and tax form (placeholders — no bank/SSN collected). Submitting sets `creator.status = "pending_review"`.
8. **Privacy** — show online, show distance, blur explicit by default, discoverable, who can message (everyone / verified / following / nobody).
9. **Welcome** — profile card, completion checklist, → "See my profile" (`/me`) or "Start browsing".

Optional steps have **Skip for now**; all steps have **Back**.

## 3. Data model & storage (the choice)

Types: `src/lib/account/types.ts` (Account, ConsentRecord, Profile, Photo, PermissionRecord, CreatorVerification, PrivacySettings, OnboardingProgress). Consent versions: `src/lib/account/constants.ts` (`CONSENT_VERSIONS` — bump when a document changes to re-prompt).

**Production (2026-11-21):** `ServerAccountStore` — accounts, consents, photos and progress live in Neon Postgres; see docs/ACCOUNTS.md. ID images still stay on the device.

**Dev fallback (no `DATABASE_URL`):** `LocalAccountStore` (`src/lib/account/store.ts`) keeps accounts in the browser's `localStorage`; photos and ID images go to IndexedDB (`src/lib/account/media.ts`). Passwords are hashed with PBKDF2-SHA256 (210k iterations, random salt) via WebCrypto — the raw password is never stored.

Why: no database or auth provider is provisioned on the Vercel project, and serverless memory/disk doesn't persist between requests, so a server-side "in-memory" store would silently lose sign-ups. The local adapter works on Vercel today with zero infrastructure and lets the full flow be demoed end-to-end.

Limits (why it's not production): accounts exist only in that one browser; no cross-device login; the hash lives on the client; ID documents never reach a reviewer.

All UI talks only to the `AccountStore` interface (`signUp, logIn, logOut, current, update, isUsernameTaken, requestPasswordReset, resetPassword, subscribe`), so moving to a server is an adapter swap, not a UI rewrite.

## 4. Making it production-real

| Need | Recommended | Notes |
|---|---|---|
| Database | **Neon Postgres** (Vercel Marketplace) | Already pre-wired: `src/lib/db.ts` switches to Neon when `DATABASE_URL` is set. Add migrations for `profiles`, `consents` (append-only), `permissions`, `creator_verifications`, `media`. |
| Auth | **Better Auth** (already in deps, `src/lib/auth/`) or Clerk | Email+password with server-side hashing, sessions, email verification, Google/Apple/X OAuth. Implement a `ServerAccountStore` with TanStack server functions + `authMiddleware`. |
| Media storage | Vercel Blob / Cloudflare R2 / S3 | Signed uploads, EXIF strip, CSAM hash scan (e.g. PhotoDNA / Thorn Safer) before anything is shown. |
| ID / age verification | **Veriff**, **Yoti**, Persona or Ondato | Replace the upload slots with the vendor SDK; store vendor session id + result; webhook flips `pending_review → approved/rejected`. Needed for 2257 + state age-verification laws. |
| Email | Resend / Postmark (adult-content policy permitting) or AWS SES | Verification, password reset, receipts. Confirm the provider allows adult platforms. |
| SMS | Twilio / Telnyx | Requires A2P 10DLC registration; adult content is restricted — use for account alerts only. |
| Web push | Web Push + VAPID keys (service worker) | Notification permission is already captured; store push subscriptions server-side. |
| Payouts / tax | Adult-friendly processor (Segpay, CCBill, Epoch, Paxum) | Collect bank + W-9/W-8BEN inside the processor's hosted flow, never in our DB. |
| Legal | Counsel | Replace the DRAFT pages; name a 2257 custodian of records; cookie banner per jurisdiction. |

## 5. QA

`node scripts/e2e-onboarding.mjs` (dev server on :8080) drives a full creator sign-up on desktop and a member sign-up on mobile, checks persistence across reload, wrong-password rejection, log-out/log-in, and writes screenshots to `/workspace/deploy/onboarding-*.png`. Unit tests for the 18+/field validation: `src/lib/account/validation.test.ts` (part of `npm test`).
