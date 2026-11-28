-- 1:1 text messages. Additive only; no changes to existing tables.
-- Body is plain text. Participants are the sender and recipient ids.
create table if not exists om_message (
  id           bigserial primary key,
  sender_id    text not null,
  recipient_id text not null,
  body         text not null,
  created_at   timestamptz not null default now(),
  constraint om_message_not_self check (sender_id <> recipient_id),
  constraint om_message_body_len check (char_length(body) between 1 and 2000)
);
create index if not exists om_message_thread_idx
  on om_message (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);
create index if not exists om_message_party_idx
  on om_message (sender_id, created_at desc);
create index if not exists om_message_inbox_idx
  on om_message (recipient_id, created_at desc);
