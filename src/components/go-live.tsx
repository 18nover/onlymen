import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "@tanstack/react-router";
import { BellRing, CalendarPlus, Check, Clock, Coins, Eye, Heart, Lock, MessageCircle, Radio, Square, Trash2, X } from "lucide-react";
import { Chips, GoldButton, TextField, inputCls } from "@/components/account-ui";
import { LiveBadge, LiveRing } from "@/components/live-ui";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import { emptyLive } from "@/lib/account/constants";
import { randomId } from "@/lib/account/store";
import { canGoLive } from "@/lib/live/gate";
import { demoRecapStats } from "@/lib/live/demo";
import { LIVE_CATEGORIES, liveHost, resolveHandoff } from "@/lib/live/config";
import type { CreatorLive, LiveRecap } from "@/lib/live/types";
import type { PublicAccount } from "@/lib/account/types";

const fmtDur = (ms: number) => {
  const m = Math.max(0, Math.floor(ms / 60000));
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

export function GoLivePanel({ a }: { a: PublicAccount }) {
  const { update } = useAccount();
  const nav = useNavigate();
  const [sheet, setSheet] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const live: CreatorLive = { ...emptyLive(), ...a.live };
  const session = live.session;
  const gate = canGoLive(a);
  const photo = useImageUrl(a.profile.photos.find((p) => p.primary)?.id);

  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, [session]);

  const end = () => {
    if (!session) return;
    const endedAt = new Date();
    const mins = Math.round((endedAt.getTime() - new Date(session.startedAt).getTime()) / 60000);
    const recap: LiveRecap = { ...session, endedAt: endedAt.toISOString(), ...demoRecapStats(mins) };
    update((x) => ({ ...x, live: { ...emptyLive(), ...x.live, session: undefined, lastRecap: recap } }));
  };

  return (
    <section id="go-live" className="scroll-mt-24 rounded-2xl border-gold-grad p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-sans text-xs font-bold tracking-[0.2em] text-ruby uppercase"><Radio className="size-4" /> Live</h2>
        <Link to="/onboarding" search={{ step: "live" }} className="text-xs font-semibold text-muted hover:text-gold-hi">Live settings</Link>
      </div>

      {session ? (
        <div className="mt-4 flex items-center gap-4">
          <LiveRing live radius="rounded-full" className="size-16 shrink-0">
            {photo ? <img src={photo} alt="" className="size-full rounded-full object-cover" /> : <span className="grid size-full place-items-center rounded-full bg-oxblood font-display text-xl text-gold-hi">{a.profile.displayName[0]}</span>}
          </LiveRing>
          <div className="min-w-0 flex-1">
            <LiveBadge />
            <p className="mt-1 truncate font-display text-2xl font-semibold text-ivory">{session.title}</p>
            <p className="text-xs text-muted">On air {fmtDur(now - new Date(session.startedAt).getTime())} · {resolveHandoff(a.username, session.roomUrl).platform}</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted">Going live puts you at the top of <Link to="/live" className="text-gold-hi underline underline-offset-2">OnlyMen Live</Link> with a glowing ring on your photo, and sends fans straight to your room.</p>
      )}

      {session ? (
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link to="/watch/$handle" params={{ handle: a.username }} className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-gold/50 text-sm font-semibold text-gold-hi">Open my room</Link>
          <button type="button" onClick={end} className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-ruby text-sm font-bold text-ivory"><Square className="size-3.5 fill-current" /> End stream</button>
        </div>
      ) : gate.ok ? (
        <GoldButton type="button" onClick={() => setSheet(true)} className="mt-5 w-full"><Radio className="size-4" /> Go live</GoldButton>
      ) : (
        <div className="mt-4 rounded-xl border border-line bg-surface/50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ivory"><Lock className="size-4 text-gold" /> Before you can go live</p>
          <ul className="mt-2 grid gap-1.5 text-sm">
            {gate.missing.map((m) => (
              <li key={m.key} className="flex items-center justify-between gap-2">
                <span className="text-muted">{m.label}</span>
                {m.step && <Link to="/onboarding" search={{ step: m.step }} className="text-xs font-semibold text-gold-hi underline underline-offset-2">Do it</Link>}
              </li>
            ))}
          </ul>
          <button type="button" disabled className="mt-4 h-11 w-full cursor-not-allowed rounded-full bg-gold/30 text-sm font-bold text-ink/70 uppercase tracking-[0.14em]">Go live</button>
        </div>
      )}

      {!session && live.lastRecap && <Recap r={live.lastRecap} onDismiss={() => update((x) => ({ ...x, live: { ...emptyLive(), ...x.live, lastRecap: undefined } }))} />}

      <Schedule a={a} live={live} />

      {sheet && (
        <PreflightSheet
          a={a}
          live={live}
          onClose={() => setSheet(false)}
          onStart={(s) => {
            update((x) => ({ ...x, live: { ...emptyLive(), ...x.live, session: { ...s, id: randomId(6), startedAt: new Date().toISOString() } } })).then(() => {
              setSheet(false);
              nav({ to: "/watch/$handle", params: { handle: a.username } });
            });
          }}
        />
      )}
    </section>
  );
}

function Recap({ r, onDismiss }: { r: LiveRecap; onDismiss: () => void }) {
  const stats = [
    { icon: Clock, label: "Duration", v: fmtDur(new Date(r.endedAt).getTime() - new Date(r.startedAt).getTime()) },
    { icon: Eye, label: "Peak viewers", v: r.peakViewers.toLocaleString("en-US") },
    { icon: Coins, label: "Tips", v: `$${r.tipsUsd.toLocaleString("en-US")}` },
    { icon: Heart, label: "New followers", v: String(r.newFollowers) },
    { icon: MessageCircle, label: "Chat messages", v: r.chatMessages.toLocaleString("en-US") },
  ];
  return (
    <div className="relative mt-5 animate-fade-up overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-oxblood/40 to-night p-5" role="status">
      <button type="button" onClick={onDismiss} aria-label="Dismiss recap" className="absolute top-3 right-3 grid size-8 place-items-center rounded-full text-dim hover:text-ivory"><X className="size-4" /></button>
      <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Stream recap</p>
      <p className="mt-1 pr-8 font-display text-2xl font-semibold text-ivory">“{r.title}”</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-ink/50 p-3">
            <dt className="flex items-center gap-1.5 text-[11px] text-dim"><s.icon className="size-3.5 text-gold" /> {s.label}</dt>
            <dd className="mt-1 text-lg font-bold text-ivory">{s.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] text-dim">Demo numbers — real stats come from your streaming platform once connected.</p>
    </div>
  );
}

function PreflightSheet({ a, live, onClose, onStart }: { a: PublicAccount; live: CreatorLive; onClose: () => void; onStart: (s: { title: string; tags: string[]; tipGoal: string; roomUrl: string }) => void }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>(live.categories.slice(0, 3));
  const [tipGoal, setTipGoal] = useState("");
  const [room, setRoom] = useState(live.rooms[0]?.url ?? "");
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const options = [...live.rooms.map((r) => ({ url: r.url, label: r.platform, sub: r.url, soon: false })), { url: "", label: "OnlyMen Live room", sub: `${liveHost()}/${a.username}`, soon: true }];
  const start = () => {
    if (title.trim().length < 3) return setErr("Give your stream a title.");
    if (tipGoal && !/^\d+$/.test(tipGoal)) return setErr("Tip goal should be a whole dollar amount.");
    onStart({ title: title.trim(), tags, tipGoal, roomUrl: room });
  };
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/80 backdrop-blur-md sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="preflight-title" onClick={onClose}>
      <div className="max-h-[92dvh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-3xl border-gold-grad p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:p-7" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line sm:hidden" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-ruby uppercase">Pre-flight</p>
            <h2 id="preflight-title" className="mt-1 text-4xl font-semibold text-ivory">Ready for your <span className="text-gold italic">close-up?</span></h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full text-dim hover:text-ivory"><X className="size-5" /></button>
        </div>
        <div className="mt-6 grid gap-5">
          <TextField label="Stream title" value={title} maxLength={70} onChange={(e) => setTitle(e.target.value)} placeholder="Late-night lounge: wine & whispers" autoFocus />
          <Chips label="Category & tags" options={LIVE_CATEGORIES} value={tags} max={4} onChange={setTags} />
          <TextField label="Tip goal" optional prefix="$" inputMode="numeric" value={tipGoal} onChange={(e) => setTipGoal(e.target.value)} placeholder="250" hint="Shown as a progress bar on your live card." />
          <fieldset>
            <legend className="text-sm font-semibold text-ivory">Send viewers to</legend>
            <div className="mt-2 grid gap-2" role="radiogroup">
              {options.map((o) => (
                <button key={o.url || "oml"} type="button" role="radio" aria-checked={room === o.url} onClick={() => setRoom(o.url)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${room === o.url ? "border-gold bg-gold/[0.08]" : "border-line bg-surface/50 hover:border-gold/40"}`}>
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${room === o.url ? "border-gold" : "border-dim"}`}>{room === o.url && <span className="size-2.5 rounded-full bg-gold" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ivory">{o.label} {o.soon && <span className="ml-1 rounded-full border border-line px-1.5 py-0.5 text-[9px] tracking-wider text-dim uppercase">Opening soon</span>}</span>
                    <span className="block truncate text-xs text-dim">{o.sub}</span>
                  </span>
                </button>
              ))}
            </div>
            {live.rooms.length === 0 && <p className="mt-2 text-xs text-dim"><Link to="/onboarding" search={{ step: "live" }} className="text-gold-hi underline">Link your own room</Link> (CAM4, Chaturbate, Stripchat, JFF…) so fans can watch today.</p>}
          </fieldset>
          {err && <p role="alert" className="rounded-xl border border-ruby/50 bg-oxblood/50 px-4 py-2.5 text-sm font-semibold text-ivory">{err}</p>}
          <ul className="grid gap-1 text-xs text-dim">
            {["Everyone on camera is 18+ and verified", "You're in a private space — no bystanders", "Start your stream on the platform first"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="size-3.5 text-gold" /> {t}</li>
            ))}
          </ul>
          <GoldButton type="button" onClick={start} className="w-full"><Radio className="size-4" /> Go live now</GoldButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Schedule({ a, live }: { a: PublicAccount; live: CreatorLive }) {
  const { update } = useAccount();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [dur, setDur] = useState("60");
  const [err, setErr] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const upcoming = live.shows.filter((s) => now === null || new Date(s.startsAt).getTime() > now - 3600_000).sort((x, y) => x.startsAt.localeCompare(y.startsAt));
  const add = () => {
    const t = new Date(when);
    if (!title.trim()) return setErr("Add a title.");
    if (!when || isNaN(t.getTime()) || t.getTime() < Date.now()) return setErr("Pick a time in the future.");
    setErr(null);
    update((x) => ({ ...x, live: { ...emptyLive(), ...x.live, shows: [...(x.live?.shows ?? []), { id: `show-${a.username}-${randomId(4)}`, title: title.trim(), startsAt: t.toISOString(), durationMin: Number(dur), tags: live.categories.slice(0, 2) }] } }));
    setTitle("");
    setWhen("");
    setOpen(false);
  };
  return (
    <div className="mt-6 border-t border-line/60 pt-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-ivory"><CalendarPlus className="size-4 text-gold" /> Scheduled shows</p>
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs font-semibold text-gold-hi">{open ? "Cancel" : "+ Schedule"}</button>
      </div>
      {open && (
        <div className="mt-3 grid gap-3 rounded-xl border border-line bg-surface/50 p-3">
          <TextField label="Show title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sunday pump" />
          <div className="grid grid-cols-[1fr_7rem] gap-2">
            <TextField label="Starts" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="[color-scheme:dark]" />
            <div className="grid gap-1.5">
              <label htmlFor="dur" className="text-sm font-semibold text-ivory">Length</label>
              <select id="dur" className={`${inputCls} h-12`} value={dur} onChange={(e) => setDur(e.target.value)}>
                {["30", "45", "60", "90", "120"].map((d) => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          </div>
          {err && <p role="alert" className="text-xs font-semibold text-ruby">{err}</p>}
          <button type="button" onClick={add} className="h-11 rounded-full bg-gold text-sm font-bold">Add to schedule</button>
        </div>
      )}
      {upcoming.length ? (
        <ul className="mt-3 grid gap-2">
          {upcoming.map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-xl bg-surface/50 p-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ivory">{s.title}</span>
                <span className="block text-xs text-dim">{now ? new Date(s.startsAt).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : ""} · {s.durationMin} min</span>
              </span>
              <button type="button" aria-label={`Delete ${s.title}`} onClick={() => update((x) => ({ ...x, live: { ...emptyLive(), ...x.live, shows: (x.live?.shows ?? []).filter((y) => y.id !== s.id) } }))} className="grid size-9 place-items-center rounded-lg text-dim hover:text-ruby"><Trash2 className="size-4" /></button>
            </li>
          ))}
        </ul>
      ) : (
        !open && <p className="mt-2 text-xs text-dim">Scheduled shows appear on /live with a “Remind me” button.</p>
      )}
    </div>
  );
}

/** Reminders list for anyone (member or creator). */
export function RemindersCard({ a }: { a: PublicAccount }) {
  const { update } = useAccount();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const list = (a.reminders ?? []).filter((r) => now === null || new Date(r.startsAt).getTime() > now - 3600_000);
  return (
    <section className="rounded-2xl border border-line/80 bg-night/70 p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase"><BellRing className="size-3.5" /> Show reminders</h2>
        <Link to="/live" className="text-xs font-semibold text-muted hover:text-gold-hi">Schedule</Link>
      </div>
      {list.length ? (
        <ul className="grid gap-2">
          {list.map((r) => (
            <li key={r.showId} className="flex items-center gap-3 text-sm">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-ivory">{r.title}</span>
                <span className="block text-xs text-dim">@{r.creator} · {now ? new Date(r.startsAt).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }) : ""}</span>
              </span>
              <button type="button" aria-label={`Remove reminder for ${r.title}`} onClick={() => update((x) => ({ ...x, reminders: (x.reminders ?? []).filter((y) => y.showId !== r.showId) }))} className="grid size-8 place-items-center rounded-lg text-dim hover:text-ruby"><X className="size-4" /></button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-dim">No reminders yet. Tap “Remind me” on an upcoming show.</p>
      )}
    </section>
  );
}
