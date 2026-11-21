import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Loader2, Radio, ShieldAlert } from "lucide-react";
import { Brand } from "@/components/onlymen-ui";
import { LiveRing } from "@/components/live-ui";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import { publicProfileFn } from "@/lib/account/api";
import { liveNow } from "@/lib/live/demo";
import { findModel } from "@/lib/models";
import { LIVE_BASE_URL, liveHost, resolveHandoff } from "@/lib/live/config";

export const Route = createFileRoute("/watch/$handle")({
  head: () => ({ meta: [{ title: "Taking you to OnlyMen Live…" }, { name: "robots", content: "noindex" }] }),
  component: Watch,
});

const DELAY = 3;

function Watch() {
  const { handle } = Route.useParams();
  const router = useRouter();
  const { account, ready } = useAccount();
  const ownPhoto = useImageUrl(account?.username === handle ? account.profile.photos.find((p) => p.primary)?.id : undefined);
  const [left, setLeft] = useState(DELAY);
  const [paused, setPaused] = useState(false);

  const [real, setReal] = useState<Awaited<ReturnType<typeof publicProfileFn>> | undefined>(undefined);
  useEffect(() => {
    if (findModel(handle) || (account && account.username === handle)) return;
    let live = true;
    publicProfileFn({ data: { username: handle } }).then((p) => live && setReal(p)).catch(() => live && setReal(null));
    return () => {
      live = false;
    };
  }, [handle, account]);

  const info = useMemo(() => {
    if (account && account.username === handle && account.live?.session) {
      const t = resolveHandoff(handle, account.live.session.roomUrl);
      return { name: account.profile.displayName || handle, photo: ownPhoto ?? "/models/hero.webp", title: account.live.session.title, live: true, target: t, profile: false };
    }
    if (real) {
      const ph = real.photos.find((x) => x.primary && !x.explicit) ?? real.photos.find((x) => !x.explicit);
      return {
        name: real.displayName,
        photo: ph ? `/api/photo/${ph.id}` : "/models/hero.webp",
        title: real.live?.title ?? real.headline,
        live: !!real.live,
        target: resolveHandoff(handle, real.live?.roomUrl ?? null),
        profile: true,
      };
    }
    const d = liveNow().find((s) => s.handle === handle);
    const m = findModel(handle);
    if (!m) return null;
    // demo creators have no linked external room, so they resolve to their OnlyMen Live room
    return { name: m.name, photo: m.photo, title: d?.title ?? m.tagline, live: !!d, target: resolveHandoff(handle, null), profile: true };
  }, [account, handle, ownPhoto, real]);

  const go = info?.live && info.target.available && !paused;

  useEffect(() => {
    if (!go) return;
    if (left <= 0) {
      window.location.assign(info!.target.url);
      return;
    }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [go, left, info]);

  const back = () => (window.history.length > 1 ? router.history.back() : router.navigate({ to: "/live" }));

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden p-4">
      {info && <img src={info.photo} alt="" aria-hidden="true" className="absolute inset-0 size-full scale-110 object-cover opacity-25 blur-2xl" />}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/80 to-ink" />
      <div className="absolute inset-0 vignette" />
      <div className="relative w-full max-w-md animate-fade-up rounded-3xl border-gold-grad p-[clamp(1.5rem,6vw,2.5rem)] text-center glow-gold">
        <div className="flex justify-center"><Brand /></div>
        {!ready || (!info && real === undefined && !findModel(handle) && account?.username !== handle) ? (
          <Loader2 className="mx-auto mt-10 size-8 animate-spin text-gold" />
        ) : !info ? (
          <>
            <h1 className="mt-8 text-3xl font-semibold text-ivory">We couldn't find that room.</h1>
            <Link to="/live" className="mt-6 inline-grid h-12 place-items-center rounded-full bg-gold px-7 text-sm font-bold">See who's live</Link>
          </>
        ) : (
          <>
            <LiveRing live={info.live} radius="rounded-full" className="mx-auto mt-8 size-28">
              <img src={info.photo} alt={info.name} className="size-full rounded-full object-cover" />
            </LiveRing>
            {info.live && info.target.available ? (
              <>
                <p className="mt-6 text-xs font-bold tracking-[0.3em] text-ruby uppercase">● Live now</p>
                <h1 className="mt-2 text-4xl leading-tight font-semibold text-ivory">Taking you to <span className="text-gold italic">OnlyMen Live</span>…</h1>
                <p className="mt-2 text-sm text-muted">{info.name}: “{info.title}”</p>
                <p className="mt-1 text-xs text-dim">Opening {info.target.platform} · {new URL(info.target.url).hostname}</p>
                <div className="mx-auto mt-6 h-1 w-48 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-gold transition-all duration-1000 ease-linear" style={{ width: `${((DELAY - left) / DELAY) * 100}%` }} />
                </div>
                <div className="mt-6 grid gap-2">
                  <a href={info.target.url} rel="noopener noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full bg-gold text-sm font-bold tracking-[0.14em] uppercase">
                    <ExternalLink className="size-4" /> {paused ? "Continue to room" : `Go now (${left})`}
                  </a>
                  {!paused && <button type="button" onClick={() => setPaused(true)} className="h-10 text-xs font-semibold text-dim hover:text-ivory">Stay here</button>}
                </div>
              </>
            ) : info.live ? (
              <>
                <p className="mt-6 text-xs font-bold tracking-[0.3em] text-ruby uppercase">● Live now</p>
                <h1 className="mt-2 text-4xl leading-tight font-semibold text-ivory"><span className="text-gold italic">OnlyMen Live</span> opens soon.</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {info.name}'s room will live at <span className="text-ivory">{liveHost()}/{handle}</span>. We're putting the finishing touches on it — follow him to get a ping when it opens.
                </p>
                <p className="mt-2 text-[11px] text-dim">Preview: live domain not connected yet ({LIVE_BASE_URL}).</p>
                <div className="mt-6 grid gap-2">
                  {info.profile && <Link to="/m/$handle" params={{ handle }} className="grid h-12 place-items-center rounded-full bg-gold text-sm font-bold tracking-[0.14em] uppercase">See {info.name}'s profile</Link>}
                  <Link to="/live" className="grid h-11 place-items-center rounded-full border border-line text-sm font-semibold text-muted hover:text-ivory">Who else is live</Link>
                </div>
              </>
            ) : (
              <>
                <h1 className="mt-6 text-3xl font-semibold text-ivory">{info.name} isn't live right now.</h1>
                <div className="mt-6 grid gap-2">
                  <Link to="/live" className="flex h-12 items-center justify-center gap-2 rounded-full bg-gold text-sm font-bold"><Radio className="size-4" /> See who's live</Link>
                  {info.profile && <Link to="/m/$handle" params={{ handle }} className="grid h-11 place-items-center rounded-full border border-line text-sm font-semibold text-muted">View profile</Link>}
                </div>
              </>
            )}
            <p className="mt-6 flex items-start justify-center gap-2 text-left text-[11px] leading-relaxed text-dim">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-gold/80" /> 18+ only. You're leaving OnlyMen for a live room run by its platform; their terms, age checks and payments apply. Never pay anyone outside the platform.
            </p>
          </>
        )}
        <button type="button" onClick={back} className="mt-5 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted hover:text-gold-hi">
          <ArrowLeft className="size-4" /> Back to OnlyMen
        </button>
      </div>
    </div>
  );
}
