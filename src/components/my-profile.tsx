import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Camera, Check, Coins, Crown, ExternalLink, Eye, EyeOff, Globe, Instagram, Loader2, LogOut, MapPin, Mic, Pencil, ShieldCheck, Sparkles, X as XIcon } from "lucide-react";
import { Footer, Header, MobileNav } from "@/components/onlymen-ui";
import { GoLivePanel, RemindersCard } from "@/components/go-live";
import { LiveRing } from "@/components/live-ui";
import { useCity } from "@/lib/onlymen-hooks";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import { ageOn } from "@/lib/account/validation";
import { latestConsents } from "@/lib/account/store";
import type { OnboardingStepId, PermissionKey, Photo, PublicAccount } from "@/lib/account/types";

function Img({ photo, className = "", alt, blur }: { photo?: Photo; className?: string; alt: string; blur?: boolean }) {
  const url = useImageUrl(photo?.id);
  if (!photo) return null;
  return url ? <img src={url} alt={alt} className={`${className} ${blur ? "blur-xl" : ""}`} /> : <div className={`${className} animate-pulse bg-surface-2`} />;
}

function Card({ title, icon, children, edit }: { title: string; icon?: React.ReactNode; children: React.ReactNode; edit?: OnboardingStepId }) {
  return (
    <section className="rounded-2xl border border-line/80 bg-night/70 p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">{icon} {title}</h2>
        {edit && (
          <Link to="/onboarding" search={{ step: edit }} className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs font-semibold text-muted hover:text-gold-hi">
            <Pencil className="size-3.5" /> Edit
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

const permIcon: Record<PermissionKey, typeof Bell> = { location: MapPin, notifications: Bell, camera: Camera, microphone: Mic };

export function MyProfile() {
  const { account, ready } = useAccount();
  const [city, setCity] = useCity();
  const nav = useNavigate();
  useEffect(() => {
    if (ready && !account) nav({ to: "/login", replace: true });
  }, [ready, account, nav]);
  if (!ready || !account) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" />
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <Header city={city} onCity={(c) => { setCity(c); void nav({ to: "/", hash: "browse" }); }} />
      <Body a={account} />
      <Footer />
      <MobileNav />
    </div>
  );
}

function Body({ a }: { a: PublicAccount }) {
  const p = a.profile;
  const photos = p.photos;
  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(false);
  const age = ageOn(a.dob);
  const creator = a.type === "creator";
  const status = a.creator?.status;
  const consents = latestConsents(a.consents);
  const shown = photos[active] ?? photos[0];
  const blurred = !!shown?.explicit && a.privacy.blurExplicit && !reveal;

  return (
    <main className="om-container pt-6">
      {!a.onboarding.finishedAt && (
        <Link to="/onboarding" className="mb-5 flex items-center gap-3 rounded-2xl border border-gold/50 bg-gold/[0.07] p-4 text-sm">
          <Sparkles className="size-5 shrink-0 text-gold" />
          <span className="flex-1 text-ivory">Finish setting up your profile to show up in browse.</span>
          <span className="font-semibold text-gold-hi">Continue →</span>
        </Link>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
        {/* gallery */}
        <div className="min-w-0">
          <LiveRing live={!!a.live?.session} radius="rounded-3xl">
          <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${a.live?.session ? "" : "border-gold-grad glow-gold"}`}>
            {shown ? (
              <Img photo={shown} alt={`${p.displayName} photo ${active + 1}`} className="size-full object-cover" blur={blurred} />
            ) : (
              <Link to="/onboarding" search={{ step: "photos" }} className="grid size-full place-items-center bg-gradient-to-br from-oxblood/50 to-ink text-center">
                <span>
                  <Camera className="mx-auto size-10 text-gold" strokeWidth={1.4} />
                  <span className="mt-3 block font-display text-2xl text-ivory">Add your first photo</span>
                  <span className="mt-1 block text-xs text-dim">Profiles with photos get 10× more views</span>
                </span>
              </Link>
            )}
            {blurred && (
              <button type="button" onClick={() => setReveal(true)} className="absolute inset-0 grid place-items-center text-sm font-bold tracking-wider text-ivory uppercase">
                <span className="flex items-center gap-2 rounded-full bg-ink/70 px-4 py-2 backdrop-blur"><Eye className="size-4" /> Tap to reveal 18+</span>
              </button>
            )}
            <div className="pointer-events-none absolute inset-0 tile-shade" />
            <div className="pointer-events-none absolute inset-x-5 bottom-5">
              <div className="flex flex-wrap items-center gap-2">
                {creator && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-[0.14em] uppercase ${status === "approved" ? "bg-gold" : "border border-gold/60 bg-ink/70 text-gold-hi backdrop-blur"}`}>
                    <Crown className="size-3" /> Creator
                  </span>
                )}
                {a.privacy.showOnline && <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-semibold text-ivory backdrop-blur"><span className="size-2 rounded-full bg-online" /> Online</span>}
              </div>
              <h1 className="mt-2 font-display text-5xl leading-none font-semibold text-ivory">
                {p.displayName}
                {p.showAge && age && <span className="font-medium text-ivory/75">, {age}</span>}
              </h1>
              {p.headline && <p className="mt-2 text-sm text-ivory/80">{p.headline}</p>}
            </div>
          </div>
          </LiveRing>
          {photos.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {photos.map((ph, i) => (
                <button key={ph.id} type="button" onClick={() => { setActive(i); setReveal(false); }} aria-label={`Show photo ${i + 1}`} className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl transition ${i === active ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"}`}>
                  <Img photo={ph} alt="" className="size-full object-cover" blur={ph.explicit && a.privacy.blurExplicit} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* side */}
        <div className="grid min-w-0 content-start gap-6 md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border-gold-grad p-5 sm:p-6">
            <p className="text-xs text-dim">onlymen.gay/@{a.username}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              {p.city && <span className="flex items-center gap-1.5"><MapPin className="size-4 text-gold" /> {p.city}</span>}
              <span className="capitalize">{a.type}</span>
              <span>Joined {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
            </div>
            {creator && (
              <div className={`mt-4 flex items-start gap-3 rounded-xl p-3 text-sm ${status === "pending_review" ? "border border-gold/40 bg-gold/[0.06]" : status === "approved" ? "bg-online/10" : "border border-ruby/40 bg-oxblood/30"}`}>
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold text-ivory">{status === "pending_review" ? "ID verification pending review" : status === "approved" ? "Verified creator" : "Verify your ID to go public"}</p>
                  {status !== "pending_review" && status !== "approved" && (
                    <Link to="/onboarding" search={{ step: "verify" }} className="mt-1 inline-block text-xs font-semibold text-gold-hi underline underline-offset-2">Start verification</Link>
                  )}
                </div>
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Link to="/onboarding" search={{ step: "basics" }} className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-gold text-sm font-bold"><Pencil className="size-4" /> Edit profile</Link>
              <Link to="/logout" className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-line text-sm font-semibold text-muted hover:text-ivory"><LogOut className="size-4" /> Log out</Link>
            </div>
          </div>

          {creator && <GoLivePanel a={a} />}

          <Card title="About" icon={<Sparkles className="size-3.5" />} edit="basics">
            <p className="leading-relaxed whitespace-pre-line text-ivory/85">{p.bio || <span className="text-dim">Nothing yet — tell people about yourself and your content.</span>}</p>
          </Card>

          <Card title="Details" edit="details">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ["Height", p.heightCm ? `${Math.floor(Math.round(p.heightCm / 2.54) / 12)}′${Math.round(p.heightCm / 2.54) % 12}″` : "—"],
                ["Body", p.bodyType ?? "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[11px] tracking-wider text-dim uppercase">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-ivory">{v}</dd>
                </div>
              ))}
            </dl>
            {[["Tribes", p.tribes], ["Looking for", p.lookingFor], ["Interests", p.interests], ["Languages", p.languages]].map(([k, list]) =>
              (list as string[]).length ? (
                <div key={k as string} className="mt-4">
                  <p className="text-[11px] tracking-wider text-dim uppercase">{k as string}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(list as string[]).map((t) => <span key={t} className="rounded-full border border-gold/30 bg-gold/[0.07] px-3 py-1 text-xs font-semibold text-gold-hi">{t}</span>)}
                  </div>
                </div>
              ) : null,
            )}
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {creator && (
          <Card title="Tips" icon={<Coins className="size-3.5" />} edit="socials">
            <p className="text-sm text-ivory">Tips {p.acceptsTips ? "on" : "off"}</p>
          </Card>
        )}
        <RemindersCard a={a} />
        <Card title="Links" icon={<Globe className="size-3.5" />} edit="socials">
          {p.social.x || p.social.instagram || p.social.onlyfans || p.social.website ? (
            <ul className="grid gap-2 text-sm">
              {p.social.x && <li className="flex items-center gap-2 text-ivory"><XIcon className="size-4 text-gold" /> @{p.social.x}</li>}
              {p.social.instagram && <li className="flex items-center gap-2 text-ivory"><Instagram className="size-4 text-gold" /> @{p.social.instagram}</li>}
              {p.social.onlyfans && <li className="flex items-center gap-2 text-ivory"><Crown className="size-4 text-gold" /> @{p.social.onlyfans}</li>}
              {p.social.website && <li className="flex items-center gap-2 text-ivory"><ExternalLink className="size-4 text-gold" /> {p.social.website}</li>}
            </ul>
          ) : <p className="text-sm text-dim">No links yet.</p>}
        </Card>
        <Card title="Privacy & permissions" icon={<ShieldCheck className="size-3.5" />} edit="privacy">
          <ul className="grid gap-2 text-sm">
            {[
              ["Online status", a.privacy.showOnline],
              ["Distance", a.privacy.showDistance],
              ["Blur explicit", a.privacy.blurExplicit],
              ["In browse", a.privacy.discoverable],
            ].map(([k, v]) => (
              <li key={k as string} className="flex justify-between"><span className="text-muted">{k as string}</span><span className={v ? "text-gold-hi" : "text-dim"}>{v ? "On" : "Off"}</span></li>
            ))}
            <li className="flex justify-between"><span className="text-muted">Messages from</span><span className="text-gold-hi capitalize">{a.privacy.whoCanMessage}</span></li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(a.permissions) as PermissionKey[]).map((k) => {
              const I = permIcon[k];
              const on = a.permissions[k].state === "granted";
              return (
                <Link key={k} to="/onboarding" search={{ step: "permissions" }} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs capitalize ${on ? "border-gold/50 text-gold-hi" : "border-line text-dim"}`}>
                  <I className="size-3.5" /> {k} {on ? <Check className="size-3" /> : <EyeOff className="size-3" />}
                </Link>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-dim">
            Email offers {consents.marketingEmail?.granted ? "on" : "off"} · SMS {consents.sms?.granted ? "on" : "off"} · Analytics {consents.cookiesAnalytics?.granted ? "on" : "off"}
          </p>
        </Card>
      </div>
    </main>
  );
}
