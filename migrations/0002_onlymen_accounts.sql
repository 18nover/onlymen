-- OnlyMen account data (server-side storage adapter, see docs/ACCOUNTS.md).
-- Identity, password hashes (scrypt) and sessions live in Better Auth's tables
-- (0001_auth.sql). Everything else about a person lives here, keyed by user_id.

-- One row per account: profile + settings + onboarding + verification + live.
create table if not exists om_account (
  user_id              text primary key references "user" ("id") on delete cascade,
  username             text not null unique,
  account_type         text not null check (account_type in ('member', 'creator')),
  dob                  date not null,
  profile              jsonb not null default '{}'::jsonb,   -- Profile minus photos (see om_photo)
  privacy              jsonb not null default '{}'::jsonb,
  permissions          jsonb not null default '{}'::jsonb,
  onboarding           jsonb not null default '{}'::jsonb,
  verification_status  text not null default 'not_started'
                       check (verification_status in ('not_started', 'pending_review', 'approved', 'rejected')),
  creator              jsonb,                                 -- legal name, ID type, payout prefs (no ID images)
  viewer               jsonb,                                 -- go-live alerts, region, favourite categories
  live_settings        jsonb,                                 -- rooms, tip menu, schedule defaults, moderation
  live_session         jsonb,                                 -- non-null while the creator is live
  live_last_recap      jsonb,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists om_account_live_idx on om_account ((live_session is not null)) where live_session is not null;

-- Append-only consent log: every answer, with the document version shown.
create table if not exists om_consent (
  id          bigserial primary key,
  user_id     text not null references "user" ("id") on delete cascade,
  key         text not null,
  granted     boolean not null,
  version     text not null,
  source      text not null,
  user_agent  text,
  at          timestamptz not null,
  recorded_at timestamptz not null default now(),
  unique (user_id, key, at)
);
create index if not exists om_consent_user_idx on om_consent (user_id, key, at);

-- Profile photo metadata + bytes. Downscaled JPEGs (<= ~400 KB) stored in
-- Postgres until object storage is set up; ID documents are NOT stored here.
create table if not exists om_photo (
  id          text primary key,
  user_id     text not null references "user" ("id") on delete cascade,
  is_primary  boolean not null default false,
  explicit    boolean not null default false,
  position    integer not null default 0,
  mime        text not null default 'image/jpeg',
  bytes       integer not null default 0,
  data        bytea,
  attached    boolean not null default false,  -- false until saved on the profile
  added_at    timestamptz not null default now()
);
create index if not exists om_photo_user_idx on om_photo (user_id, position);

-- Creator schedule.
create table if not exists om_show (
  id           text primary key,
  user_id      text not null references "user" ("id") on delete cascade,
  title        text not null,
  starts_at    timestamptz not null,
  duration_min integer not null default 60,
  tags         jsonb not null default '[]'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists om_show_user_idx on om_show (user_id, starts_at);
create index if not exists om_show_starts_idx on om_show (starts_at);

-- Viewer "Remind me".
create table if not exists om_reminder (
  user_id     text not null references "user" ("id") on delete cascade,
  show_id     text not null,
  creator     text not null,
  title       text not null,
  starts_at   timestamptz not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, show_id)
);
