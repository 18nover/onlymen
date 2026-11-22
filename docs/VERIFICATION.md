# Creator ID verification and 2257 records (ONL-9)

**Not legal advice. Have a lawyer review the flow, the retention policy and the
custodian notice before launch.**

This is separate from the visitor age gate ([AGE_GATE.md](AGE_GATE.md)). The
visitor gate stores nothing. This flow must keep records.

## Flags (wrangler.jsonc on the Worker; unset on Vercel = no change)

| Var | Worker | Meaning |
| --- | --- | --- |
| `ONLYMEN_ID_VERIFICATION` | `on` | Turns on the flow and its enforcement. |
| `ONLYMEN_KYC_PROVIDER` | `manual` | Which `VerificationProvider` is used. |
| `ONLYMEN_KYC_SELF_REVIEW` | `on` | Lets an admin approve their **own** verification (needed while Jerry is the only admin). Self-reviews are tagged `self-review` in the audit note. |
| `ONLYMEN_KYC_ENC_KEY` | secret | 32-byte base64 AES key for document files. Set with `wrangler secret put`. If it is lost, stored files can't be read. A backup copy is kept in the box's private secrets folder (never in git). |

## Flow

1. A creator opens **/me/verify**, fills in legal name, date of birth (18+),
   ID type and issuing country, then uploads the ID front, the ID back (not
   needed for a passport) and a selfie holding the ID.
   - The browser re-encodes JPEG/PNG/WebP photos to JPEG, which drops EXIF and GPS.
   - The server checks magic bytes (JPEG, PNG, WebP, HEIC, PDF only), allows up
     to 4 MB, strips JPEG APP1/COM segments and PNG text/EXIF chunks, then
     records the SHA-256 and stores the file encrypted.
2. Submit moves it from `not_started` to `pending`. `om_account.verification_status` is kept in sync
   (`pending` is stored there as `pending_review`).
3. An owner/admin opens **/admin/verifications** to see the queue and a detail
   view with the images, then approves or rejects. A reason is required to
   reject, and the creator sees it. Approving writes an `om_2257_record`
   snapshot. An approved verification can be revoked with a reason.
4. After a rejection, the next upload starts a new attempt (a new row). The old
   attempt and its files are kept.

Status machine: `src/lib/verification/status.ts` (`transition`), unit-tested.

## Enforcement (server-side)

With `ONLYMEN_ID_VERIFICATION=on`, `saveAccount` (`src/lib/account/repo.server.ts`)
refuses to **start a live session** or **newly mark a photo explicit** unless
the account is a creator with `verification_status = 'approved'`. Ending a live
session and keeping photos that were already marked explicit are still allowed.
Clients can no longer set `pending_review` themselves. The Go-live panel, the
profile card and the onboarding Verify step all link to /me/verify.

## Storage

- Tables (migration `0006_creator_verification.sql`, additive only):
  `om_verification`, `om_verification_file`, `om_verification_blob`,
  `om_verification_audit` (append-only, enforced by a trigger) and `om_2257_record`.
  No foreign key to `"user"`, so records outlive a deleted account.
- Files are encrypted with AES-256-GCM (the storage key is the AAD).
  - **R2 (preferred):** add the `KYC_BUCKET` binding in wrangler.jsonc. R2 is
    **not enabled** on the Cloudflare account yet; that needs the dashboard.
    The free tier is 10 GB-month, and Cloudflare asks for a payment method.
  - **Until then:** encrypted bytes live in Neon `om_verification_blob`. This
    counts against the Neon free plan's storage.
- No public URLs. Admins see files only through `GET /api/kyc/file/<id>`,
  which needs an owner/admin session and returns `no-store`, `nosniff` and a
  sandbox CSP. Every view is written to the audit log.
- Logs carry ids and actions only. They never include names, DOBs or files.

## Adding a KYC vendor

`src/lib/verification/providers.ts` defines `VerificationProvider`
(`startSession`, `handleWebhook`, `getStatus`). To add one:

1. Implement a provider (there's a template in the file).
2. Register it.
3. Set `ONLYMEN_KYC_PROVIDER=<name>` and the vendor's secrets.

Webhooks arrive at `POST /api/kyc/webhook/<name>` and go through the same
status machine, audit log and 2257 snapshot. Candidates and prices (read
2026-11-22, confirm that each vendor accepts adult platforms):

- Veriff Self-Serve: $0.80 per check with a $49/mo minimum, up to $1.89 / $209.
- Persona Startup Program: 500 free checks/mo for 12 months, then $1 each.
- Yoti and VerifyMy (adult-industry focused): quote.

## Custodian of records

`/custodian` is a placeholder with TODO fields for name, title, address and
hours. Jerry and counsel fill these in. No address has been invented.

## Test (Worker)

- Creator: log in, then go to https://onlymen.18nover.workers.dev/me/verify
- Admin: https://onlymen.18nover.workers.dev/admin/verifications
- Signed-out: `/api/kyc/file/<id>` returns 404/403 and `/admin/verifications` shows the gate.
