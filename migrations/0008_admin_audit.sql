-- Shared admin action audit. Additive only; records actor and resource without
-- copying sensitive payloads into the log.
create table if not exists om_admin_audit (
  id            bigserial primary key,
  at            timestamptz not null default now(),
  actor_id      text not null,
  action        text not null,
  resource_type text not null,
  resource_id   text
);
create index if not exists om_admin_audit_actor_idx on om_admin_audit (actor_id, at);
create index if not exists om_admin_audit_resource_idx on om_admin_audit (resource_type, resource_id, at);

create or replace function om_admin_audit_append_only() returns trigger language plpgsql as $$
begin
  raise exception 'om_admin_audit is append-only';
end $$;
drop trigger if exists om_admin_audit_no_change on om_admin_audit;
create trigger om_admin_audit_no_change before update or delete on om_admin_audit
  for each row execute function om_admin_audit_append_only();
