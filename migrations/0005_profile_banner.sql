-- Profile banner images. Additive only: a new table, nothing existing is
-- altered. Banners are deliberately NOT stored in om_photo.
--
-- Why a separate table: the Vercel production build (main) loads the gallery
-- with `where user_id = $1 and attached`, deletes leftover attached rows on
-- save, and purges unattached rows older than a day. A banner row in om_photo
-- would either appear in the prod gallery, be deleted on a prod profile save,
-- or be swept by that cleanup. om_banner is invisible to those queries.
--
-- Applied once (see _migrations). The Worker preview applies this via a
-- one-off token-gated endpoint; Vercel will see the name already recorded
-- and will not re-run it when this file later lands on main.

create table if not exists om_banner (
  user_id    text primary key references "user" ("id") on delete cascade,
  photo_id   text not null unique,
  mime       text not null default 'image/jpeg',
  bytes      integer not null default 0,
  data       bytea,
  added_at   timestamptz not null default now()
);
