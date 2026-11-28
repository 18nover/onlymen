-- Username change history (additive only). Used to enforce "2 changes per rolling 12 months"
-- and to reserve a released username for 30 days (anti-impersonation).
-- Run in the Neon SQL editor, then record it:
--   insert into _migrations (name) values ('0013_username_history.sql');
create table if not exists om_username_history (
  id            bigserial primary key,
  user_id       text not null,
  old_username  text not null,
  new_username  text not null,
  changed_at    timestamptz not null default now()
);
create index if not exists om_username_history_user_idx on om_username_history (user_id, changed_at);
create index if not exists om_username_history_old_idx on om_username_history (old_username, changed_at);
