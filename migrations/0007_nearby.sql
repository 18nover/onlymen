-- OnlyMen Nearby, Phase 1 (ONL-10). ADDITIVE ONLY: new tables + indexes.
--
-- PRIVACY: there are NO latitude/longitude columns anywhere and NO location
-- history. om_location holds ONE row per account with the current snapped
-- geohash cell (precision 6, ≈1.2 km × 0.6 km), updated in place. Raw
-- coordinates are snapped in memory by the server and discarded.
--
-- No foreign keys to "user" (same reason as 0006: never change how the
-- Vercel production build deletes accounts). Rows of a deleted account are
-- simply never matched (every query joins om_account).
--
-- Applied once (see _migrations) via a one-off token-gated Worker endpoint.

create table if not exists om_location (
  user_id        text primary key,
  cell           text check (cell is null or cell ~ '^[0-9b-hjkmnp-z]{6}$'),
  cell4          text generated always as (left(cell, 4)) stored,
  jitter_seed    text not null,
  share_pin      boolean not null default false,  -- opt-in map pin
  hide_distance  boolean not null default false,
  incognito      boolean not null default false,  -- not shown in grid/map at all
  appear_offline boolean not null default false,
  home_cell      text check (home_cell is null or home_cell ~ '^[0-9b-hjkmnp-z]{6}$'),
  consent_at     timestamptz,
  updated_at     timestamptz,                     -- last accepted location update
  window_start   timestamptz,                     -- move rate-limit window (counts only)
  window_count   integer not null default 0,
  created_at     timestamptz not null default now()
);
create index if not exists om_location_cell4_idx on om_location (cell4) where cell is not null;

create table if not exists om_presence (
  user_id    text primary key,
  last_seen  timestamptz not null default now()
);

create table if not exists om_plus (
  user_id     text primary key,
  granted_by  text not null,
  granted_at  timestamptz not null default now(),
  note        text
);

create table if not exists om_block (
  blocker_id  text not null,
  blocked_id  text not null,
  at          timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);
create index if not exists om_block_blocked_idx on om_block (blocked_id);

create table if not exists om_tap (
  from_id  text not null,
  to_id    text not null,
  at       timestamptz not null default now(),
  primary key (from_id, to_id)
);
create index if not exists om_tap_to_idx on om_tap (to_id, at desc);

create table if not exists om_save (
  user_id   text not null,
  saved_id  text not null,
  at        timestamptz not null default now(),
  primary key (user_id, saved_id)
);

create table if not exists om_report (
  id           text primary key,
  reporter_id  text not null,
  target_id    text not null,
  reason       text not null check (reason in ('underage', 'selling_sex', 'scam', 'harassment', 'impersonation', 'non_consensual', 'spam', 'other')),
  details      text,
  status       text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at   timestamptz not null default now(),
  decided_at   timestamptz,
  decided_by   text,
  resolution   text
);
create index if not exists om_report_status_idx on om_report (status, created_at);
create index if not exists om_report_target_idx on om_report (target_id);

-- Append-only T&S audit (same pattern as om_verification_audit).
create table if not exists om_report_audit (
  id         bigserial primary key,
  at         timestamptz not null default now(),
  actor_id   text,
  action     text not null,
  report_id  text,
  note       text
);
create index if not exists om_report_audit_r_idx on om_report_audit (report_id, at);

create or replace function om_report_audit_append_only() returns trigger language plpgsql as $$
begin
  raise exception 'om_report_audit is append-only';
end $$;
drop trigger if exists om_report_audit_no_change on om_report_audit;
create trigger om_report_audit_no_change before update or delete on om_report_audit
  for each row execute function om_report_audit_append_only();
