import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, BellRing, ExternalLink, Eye, Radio, Target } from "lucide-react";
import { useAccount } from "@/lib/account/use-account";
import type { LiveNow, Upcoming } from "@/lib/live/demo";
import type { Reminder } from "@/lib/live/types";
import type { PublicRoom } from "@/lib/live/config";

/** Gold → ruby rotating ring for anything that's live. */
export function LiveRing({ live, children, className = "", radius = "rounded-2xl" }: { live: boolean; children: ReactNode; className?: string; radius?: string }) {
  if (!live) return <div className={className}>{children}</div>;
  return (
    <div className={`live-ring relative p-[3px] ${radius} ${className}`}>
      <div className={`relative size-full overflow-hidden ${radius} bg-ink`}>{children}</div>
    </div>
  );
}

export function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-ruby px-2.5 py-1 text-[10px] font-extrabold tracking-[0.16em] text-ivory uppercase shadow-[0_0_18px_-2px_rgb(194_42_69_/_0.8)] ${className}`}>
      <span className="size-1.5 animate-pulse rounded-full bg-ivory" /> Live
    </span>
  );
}

export function WatchLiveLink({ handle, className = "", children }: { handle: string; className?: string; children?: ReactNode }) {
  return (
    <Link
      to="/watch/$handle"
      params={{ handle }}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ruby to-oxblood px-5 text-sm font-bold text-ivory shadow-[0_0_24px_-6px_rgb(194_42_69_/_0.9)] ring-1 ring-gold/40 transition hover:brightness-110 ${className}`}
    >
      {children ?? (
        <>
          <Radio className="size-4" /> Watch live
        </>
      )}
    </Link>
  );
}

export function LiveCard({ s }: { s: LiveNow }) {
  const mins = s.startedMinAgo;
  return (
    <article className="group relative">
      <LiveRing live className="aspect-[4/5]">
        <img src={s.photo} alt={`${s.name}, live now`} className="size-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 tile-shade" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <LiveBadge />
          <span className="flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-[11px] font-semibold text-ivory backdrop-blur">
            <Eye className="size-3" /> {s.viewers}
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <p className="text-[10px] font-bold tracking-[0.18em] text-gold-hi uppercase">{s.own ? "You · " : ""}{s.platform}</p>
          <p className="mt-0.5 truncate font-display text-2xl leading-tight font-semibold text-ivory">{s.name}</p>
          <p className="line-clamp-1 text-xs text-muted">{s.title}</p>
          {s.tipGoal && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-dim">
                <span className="flex items-center gap-1 truncate"><Target className="size-3 text-gold" /> {s.tipGoal.label}</span>
                <span>{s.tipGoal.pct}%</span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-gold" style={{ width: `${s.tipGoal.pct}%` }} />
              </div>
            </div>
          )}
          <WatchLiveLink handle={s.handle} className="relative z-10 mt-3 h-10 w-full" />
          <p className="mt-1.5 text-center text-[10px] text-dim">Live for {mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`}</p>
        </div>
      </LiveRing>
    </article>
  );
}

export function useReminders() {
  const { account, update } = useAccount();
  const nav = useNavigate();
  const list: Reminder[] = account?.reminders ?? [];
  const has = (id: string) => list.some((r) => r.showId === id);
  const toggle = (show: Upcoming) => {
    if (!account) return nav({ to: "/join" });
    update((a) => {
      const cur = a.reminders ?? [];
      const exists = cur.some((r) => r.showId === show.id);
      return {
        ...a,
        reminders: exists
          ? cur.filter((r) => r.showId !== show.id)
          : [...cur, { showId: show.id, creator: show.handle, title: show.title, startsAt: show.startsAt, createdAt: new Date().toISOString() }],
      };
    });
  };
  return { list, has, toggle, signedIn: !!account };
}

function fmtWhen(iso: string, now: number) {
  const d = new Date(iso);
  const diffH = (d.getTime() - now) / 3600_000;
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffH < 24 && d.getDate() === new Date(now).getDate()) return `Today · ${time}`;
  if (diffH < 48) return `Tomorrow · ${time}`;
  return `${d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
}

export function UpcomingRow({ show, reminded, onRemind }: { show: Upcoming; reminded: boolean; onRemind: () => void }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-line/80 bg-night/70 p-3 sm:gap-4 sm:p-4">
      <Link to="/m/$handle" params={{ handle: show.handle }} className="shrink-0">
        <img src={show.photo} alt={show.name} className="size-16 rounded-xl object-cover ring-1 ring-gold/40 sm:size-20" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-[0.16em] text-gold uppercase">{now ? fmtWhen(show.startsAt, now) : "\u00a0"}</p>
        <p className="truncate font-display text-xl font-semibold text-ivory">{show.name} <span className="text-sm font-sans font-normal text-dim">· {show.platform}</span></p>
        <p className="truncate text-sm text-muted">{show.title}</p>
        <p className="mt-1 hidden text-xs text-dim sm:block">{show.durationMin} min · {show.tags.join(" · ")}</p>
      </div>
      <button
        type="button"
        onClick={onRemind}
        aria-pressed={reminded}
        className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition sm:px-4 ${reminded ? "bg-gold text-ink" : "border border-gold/50 text-gold-hi hover:bg-gold/10"}`}
      >
        {reminded ? <BellRing className="size-4" /> : <Bell className="size-4" />}
        <span className="hidden sm:inline">{reminded ? "Reminder set" : "Remind me"}</span>
        <span className="sm:hidden">{reminded ? "Set" : "Remind"}</span>
      </button>
    </article>
  );
}

export function RoomLinks({ rooms, className = "" }: { rooms: PublicRoom[]; className?: string }) {
  if (!rooms.length) return null;
  return (
    <div className={`grid gap-2 ${className}`}>
      {rooms.map((r) => (
        <a
          key={r.url}
          href={r.url}
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-gold/50 px-5 text-sm font-semibold text-gold-hi transition hover:bg-gold/10"
        >
          <ExternalLink className="size-4" /> Open on {r.platform}
        </a>
      ))}
    </div>
  );
}

export function ChaturbateEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/40 bg-ink aspect-[850/528]">
      <iframe
        src={src}
        title={title}
        className="size-full border-0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

