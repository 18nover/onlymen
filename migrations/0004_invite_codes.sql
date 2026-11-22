-- Invite codes (beta sign-up). Additive only: new tables, nothing existing is
-- altered, so code that doesn't know about invites keeps working unchanged.
--
-- Plain codes are NEVER stored: code_hash is the lowercase hex SHA-256 of the
-- canonical code text ("OM-XXXX-XXXX", upper case, with dashes), and code_hint
-- is its last 4 characters so a code can be recognised in the admin list.
-- Hash in SQL:  encode(sha256(convert_to('OM-ABCD-EFGH', 'UTF8')), 'hex')
create table if not exists invite_codes (
  id           bigserial primary key,
  code_hash    text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  code_hint    text not null default '',
  note         text,
  max_uses     integer not null default 1 check (max_uses >= 1),
  use_count    integer not null default 0 check (use_count >= 0),
  redeemed_by  text references "user" ("id") on delete set null,  -- first redeemer
  redeemed_at  timestamptz,                                       -- first redemption
  revoked_at   timestamptz,
  created_by   text references "user" ("id") on delete set null,
  created_at   timestamptz not null default now(),
  constraint invite_codes_uses_check check (use_count <= max_uses)
);

-- One row per account created with a code (multi-use codes have several).
-- Having a row here is what lets an invited account past private mode.
create table if not exists invite_redemptions (
  id           bigserial primary key,
  code_id      bigint not null references invite_codes ("id") on delete restrict,
  user_id      text not null references "user" ("id") on delete cascade,
  redeemed_at  timestamptz not null default now(),
  unique (code_id, user_id)
);
create index if not exists invite_redemptions_user_idx on invite_redemptions (user_id);

-- Failed invite attempts, for rate limiting. ip_hash is an HMAC of the client
-- IP (never the raw IP). Rows older than a day are pruned by the app.
create table if not exists invite_attempts (
  id       bigserial primary key,
  ip_hash  text not null,
  at       timestamptz not null default now()
);
create index if not exists invite_attempts_ip_idx on invite_attempts (ip_hash, at);
