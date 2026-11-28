-- Testers' in-app feedback. Additive only; no changes to existing tables.
create table if not exists om_feedback (
  id         bigserial primary key,
  user_id    text not null,
  body       text not null,
  created_at timestamptz not null default now(),
  constraint om_feedback_body_len check (char_length(body) between 1 and 2000)
);
create index if not exists om_feedback_user_idx on om_feedback (user_id, created_at desc);
