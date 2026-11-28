-- Account-level 18+ pass (additive only). Stores ONLY when the account passed the
-- Stripe Identity age check and which Stripe session did it. No DOB, name, or images.
-- Lets a verified member log in on any device / the installed app without
-- repeating the paid ID check. Run in the Neon SQL editor, then record it:
--   insert into _migrations (name) values ('0012_age_verified.sql');
alter table om_account add column if not exists age_verified_at timestamptz;
alter table om_account add column if not exists age_verified_session text;
