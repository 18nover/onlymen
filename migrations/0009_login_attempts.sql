-- Failed password sign-in attempts. Keys are keyed hashes, never raw IPs or
-- account identifiers; old rows are pruned by the application.
create table if not exists om_login_attempts (
  id         bigserial primary key,
  key_type   text not null check (key_type in ('ip', 'account')),
  key_hash   text not null,
  at         timestamptz not null default now()
);
create index if not exists om_login_attempts_key_idx on om_login_attempts (key_type, key_hash, at);
