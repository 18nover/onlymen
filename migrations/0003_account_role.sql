-- Account role (private mode / owner seed). Everyone defaults to 'user';
-- the single seeded owner account is 'owner'.
alter table om_account add column if not exists role text not null default 'user';
do $$ begin
  alter table om_account add constraint om_account_role_check check (role in ('user', 'admin', 'owner'));
exception when duplicate_object then null; end $$;
