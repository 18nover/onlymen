-- Creator ID verification + 18 U.S.C. § 2257 records (ONL-9). ADDITIVE ONLY:
-- new tables, a trigger function and indexes; nothing existing is altered.
-- om_account.verification_status (0002) is kept in sync by the app
-- (pending ↔ 'pending_review').
--
-- No foreign key to "user" on purpose: 2257 records must outlive an account
-- (retention is a lawyer question), and a cascade or restrict here would
-- change how the Vercel production build deletes accounts.
--
-- Visitor age verification (ONL-8) stores NOTHING here; see docs/AGE_GATE.md.
--
-- Applied once (see _migrations). The Worker preview applies this via a
-- one-off token-gated endpoint; Vercel will see the name already recorded.

create table if not exists om_verification (
  id             text primary key,
  user_id        text not null,
  status         text not null default 'not_started'
                 check (status in ('not_started', 'pending', 'approved', 'rejected')),
  provider       text not null default 'manual',
  provider_ref   text,
  legal_name     text,
  dob            date,
  id_type        text check (id_type is null or id_type in ('passport', 'drivers_license', 'national_id', 'state_id')),
  id_country     text,
  submitted_at   timestamptz,
  reviewed_at    timestamptz,
  reviewer_id    text,
  reject_reason  text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists om_verification_user_idx on om_verification (user_id, created_at desc);
create index if not exists om_verification_status_idx on om_verification (status, submitted_at);
-- At most one open (draft or pending) attempt per creator.
create unique index if not exists om_verification_open_uq on om_verification (user_id) where status in ('not_started', 'pending');

-- Document files. Bytes live in private object storage (R2 binding) or, until
-- R2 is enabled, AES-256-GCM-encrypted in om_verification_blob. Never public.
create table if not exists om_verification_file (
  id               text primary key,
  verification_id  text not null references om_verification (id) on delete restrict,
  kind             text not null check (kind in ('id_front', 'id_back', 'selfie_with_id')),
  storage          text not null default 'r2' check (storage in ('r2', 'db')),
  r2_key           text not null,
  content_type     text not null,
  size             integer not null,
  sha256           text not null,
  enc              text,
  created_at       timestamptz not null default now(),
  unique (verification_id, kind)
);

-- Fallback private store (encrypted bytes only; key in a Worker secret).
create table if not exists om_verification_blob (
  key         text primary key,
  data        bytea not null,
  created_at  timestamptz not null default now()
);

-- Append-only audit log: who did what to which verification. No PII in note.
create table if not exists om_verification_audit (
  id               bigserial primary key,
  at               timestamptz not null default now(),
  actor_id         text,
  action           text not null,
  verification_id  text,
  note             text
);
create index if not exists om_verification_audit_v_idx on om_verification_audit (verification_id, at);

create or replace function om_verification_audit_append_only() returns trigger language plpgsql as $$
begin
  raise exception 'om_verification_audit is append-only';
end $$;
drop trigger if exists om_verification_audit_no_change on om_verification_audit;
create trigger om_verification_audit_no_change before update or delete on om_verification_audit
  for each row execute function om_verification_audit_append_only();

-- 2257 record snapshot, written when a verification is approved.
create table if not exists om_2257_record (
  id               text primary key,
  verification_id  text not null unique references om_verification (id) on delete restrict,
  user_id          text not null,
  legal_name       text not null,
  dob              date not null,
  stage_names      jsonb not null default '[]'::jsonb,
  id_type          text not null,
  id_country       text,
  approved_at      timestamptz not null,
  approved_by      text not null,
  created_at       timestamptz not null default now()
);
create index if not exists om_2257_record_user_idx on om_2257_record (user_id);
