import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, CalendarClock, Crown, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { AgeGate, Footer, Header, MobileNav } from "@/components/onlymen-ui";
import { ProfileBanner } from "@/components/banner-field";
import { WatchLiveLink } from "@/components/live-ui";
import { useAgeGate, useCity } from "@/lib/onlymen-hooks";
import type { PublicProfile } from "@/lib/account/repo.server";

const chip = "rounded-full border border-line bg-surface/60 px-3 py-1 text-xs font-semibold text-muted";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line/70 bg-surface/50 p-5 sm:p-6">
      <p className="text-[11px] font-bold tracking-[0.2em] text-gold uppercase">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Public profile of a real OnlyMen account (server-backed). */
export function MemberProfile({ p }: { p: PublicProfile }) {
  const { gate, enter } = useAgeGate();
  const [city, setCity] = useCity();
  const navigate = useNavigate();
  const photos = [...p.photos].sort((a, b) => Number(b.primary) - Number(a.primary));
  const [i, setI] = useState(0);
  const [reveal, setReveal] = useState(false);
  const cur = photos[i];
  const blurred = cur?.explicit && !reveal;
  const tags = [...p.tribes, ...p.interests].slice(0, 14);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header
        city={city}
        onCity={(c) => {
          setCity(c);
          void navigate({ to: "/", hash: "browse" });
        }}
      />
      <main className="om-container">
        <Link to="/" hash="browse" className="mt-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-gold-hi">
          <ArrowLeft className="size-4" /> Back to browse
        </Link>
        {p.bannerPhotoId && (
          <div className="mt-4">
            <ProfileBanner id={p.bannerPhotoId} name={p.displayName} />
          </div>
        )}
        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <div>
            <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface ${p.live ? "shadow-[0_0_40px_-10px_rgb(194_42_69_/_0.9)]" : "border-gold-grad glow-gold"}`}>
              {p.live && <span className="live-ring-border !z-20 !p-1" aria-hidden="true" />}
              {cur ? (
                <img src={`/api/photo/${cur.id}`} alt={`${p.displayName}, photo ${i + 1}`} className={`absolute inset-0 size-full object-cover transition ${blurred ? "scale-110 blur-2xl" : ""}`} />
              ) : (
                <div className="absolute inset-0 grid place-items-center font-display text-8xl text-gold/40">{p.displayName.slice(0, 1).toUpperCase()}</div>
              )}
              {blurred && (
                <button type="button" onClick={() => setReveal(true)} className="absolute inset-0 z-10 grid place-items-center text-sm font-semibold text-ivory">
                  <span className="rounded-full bg-ink/70 px-4 py-2 ring-1 ring-gold/40">18+ photo · tap to view</span>
                </button>
              )}
              {p.live && (
                <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-ruby px-3 py-1 text-xs font-bold tracking-wider text-ivory uppercase">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-ivory" /> Live
                </span>
              )}
            </div>
            {photos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
                {photos.map((ph, k) => (
                  <button key={ph.id} type="button" onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} className={`relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 ${k === i ? "ring-gold" : "ring-transparent"}`}>
                    <img src={`/api/photo/${ph.id}`} alt="" className={`size-full object-cover ${ph.explicit ? "blur-md" : ""}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid content-start gap-5">
            <div className="rounded-3xl border-gold-grad p-5 sm:p-7">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-gold">
                @{p.username} {p.verified && <BadgeCheck className="size-4" aria-label="Verified" />}
                {p.type === "creator" && (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-gold/50 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                    <Crown className="size-3" /> Creator
                  </span>
                )}
              </p>
              <h1 className="mt-1 text-5xl leading-none font-semibold text-ivory">
                {p.displayName}
                {p.age != null && (
                  <>
                    <span className="text-gold">,</span> <span className="font-normal text-ivory/80">{p.age}</span>
                  </>
                )}
              </h1>
              {p.city && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="size-4 text-gold" /> {p.city}
                </p>
              )}
              {p.headline && <p className="mt-4 font-display text-2xl leading-snug text-ivory/90 italic">“{p.headline}”</p>}
              {p.live && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-ruby/50 bg-oxblood/30 p-3">
                  <span className="size-2.5 shrink-0 animate-pulse-dot rounded-full bg-ruby" />
                  <p className="min-w-0 flex-1 truncate text-sm text-ivory"><b>Live now</b> <span className="text-muted">· {p.live.title}</span></p>
                  <WatchLiveLink handle={p.username} className="h-11 shrink-0" />
                </div>
              )}
              {!p.verified && p.type === "creator" && <p className="mt-4 text-xs text-dim">ID verification in review.</p>}
            </div>

            {p.bio && (
              <Section title="About">
                <p className="text-sm leading-relaxed whitespace-pre-line text-ivory/85">{p.bio}</p>
              </Section>
            )}
            {(tags.length > 0 || p.lookingFor.length > 0) && (
              <Section title="Into">
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => <span key={t} className={chip}>{t}</span>)}
                  {p.lookingFor.map((t) => <span key={`l-${t}`} className={`${chip} border-gold/40 text-gold-hi`}>{t}</span>)}
                </div>
              </Section>
            )}
            {p.shows.length > 0 && (
              <Section title="Upcoming shows">
                <ul className="grid gap-2">
                  {p.shows.map((s) => (
                    <li key={s.id} className="flex items-center gap-3 text-sm text-ivory">
                      <CalendarClock className="size-4 text-gold" /> {s.title}
                      <span className="ml-auto text-xs text-dim" suppressHydrationWarning>{new Date(s.startsAt).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {p.tipMenu.length > 0 && (
              <Section title="Tip menu">
                <ul className="grid gap-1.5 text-sm">
                  {p.tipMenu.map((t, k) => (
                    <li key={k} className="flex justify-between text-ivory/85"><span>{t.label}</span><b className="text-gold-hi">${t.price}</b></li>
                  ))}
                </ul>
              </Section>
            )}
            <p className="flex items-center gap-1.5 px-1 text-xs text-dim"><Sparkles className="size-3.5" /> Member since <span suppressHydrationWarning>{new Date(p.joinedAt).toLocaleDateString([], { month: "short", year: "numeric" })}</span></p>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
      {gate !== "ok" && <AgeGate onEnter={enter} />}
    </div>
  );
}
