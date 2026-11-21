import { useEffect, useMemo, useState } from "react";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import { liveNow, upcomingShows, type LiveNow, type Upcoming } from "./demo";
import { resolveHandoff } from "./config";
import { liveDirectoryFn } from "@/lib/account/api";

type Directory = Awaited<ReturnType<typeof liveDirectoryFn>>;
let dirCache: { at: number; value: Promise<Directory> } | null = null;

/** Real creators who are live / scheduled (server accounts). Client-only, cached 30 s. */
export function useLiveDirectory(): Directory | null {
  const [dir, setDir] = useState<Directory | null>(null);
  useEffect(() => {
    let live = true;
    if (!dirCache || Date.now() - dirCache.at > 30_000) dirCache = { at: Date.now(), value: liveDirectoryFn().catch(() => ({ live: [], upcoming: [] })) };
    dirCache.value.then((d) => live && setDir(d));
    return () => {
      live = false;
    };
  }, []);
  return dir;
}

/** Who's live now: the signed-in creator's own session (if any) + demo creators. */
export function useLiveNow(): LiveNow[] {
  const { account } = useAccount();
  const photoId = account?.profile.photos.find((p) => p.primary)?.id;
  const photo = useImageUrl(photoId);
  const dir = useLiveDirectory();
  return useMemo(() => {
    const s = account?.live?.session;
    const real: LiveNow[] = (dir?.live ?? [])
      .filter((p) => p.live && p.username !== account?.username)
      .map((p) => {
        const t = resolveHandoff(p.username, p.live!.roomUrl);
        const mins = Math.max(0, Math.round((Date.now() - new Date(p.live!.startedAt).getTime()) / 60000));
        const ph = p.photos.find((x) => x.primary && !x.explicit) ?? p.photos.find((x) => !x.explicit);
        return {
          handle: p.username,
          name: p.displayName,
          photo: ph ? `/api/photo/${ph.id}` : "/models/hero.webp",
          title: p.live!.title,
          tags: p.live!.tags,
          viewers: 12 + mins * 3,
          platform: t.platform,
          roomUrl: t.url,
          startedMinAgo: mins,
          tipGoal: p.live!.tipGoal ? { label: `$${p.live!.tipGoal} goal`, pct: Math.min(100, 8 + mins * 4) } : undefined,
        };
      });
    const realHandles = new Set(real.map((r) => r.handle));
    // a real account always wins over a demo profile with the same handle
    const list = [...real, ...liveNow().filter((d) => !realHandles.has(d.handle) && !(account && s && d.handle === account.username))];
    if (account && s) {
      const t = resolveHandoff(account.username, s.roomUrl);
      const mins = Math.max(0, Math.round((Date.now() - new Date(s.startedAt).getTime()) / 60000));
      list.unshift({
        handle: account.username,
        name: account.profile.displayName || account.username,
        photo: photo ?? "/models/hero.webp",
        title: s.title,
        tags: s.tags,
        viewers: 12 + mins * 3,
        platform: t.platform,
        roomUrl: t.url,
        startedMinAgo: mins,
        tipGoal: s.tipGoal ? { label: `$${s.tipGoal} goal`, pct: Math.min(100, 8 + mins * 4) } : undefined,
        own: true,
      });
    }
    return list;
  }, [account, photo, dir]);
}

/** Upcoming shows (client-only so times match the viewer's clock). */
export function useUpcoming(): Upcoming[] | null {
  const { account } = useAccount();
  const [demo, setDemo] = useState<Upcoming[] | null>(null);
  useEffect(() => setDemo(upcomingShows()), []);
  const dir = useLiveDirectory();
  return useMemo(() => {
    if (!demo) return null;
    const real: Upcoming[] = (dir?.upcoming ?? [])
      .filter((u) => u.username !== account?.username)
      .map((u) => ({
        id: u.id,
        handle: u.username,
        name: u.displayName,
        photo: u.photoId ? `/api/photo/${u.photoId}` : "/models/hero.webp",
        title: u.title,
        startsAt: u.startsAt,
        durationMin: u.durationMin,
        tags: u.tags,
        platform: "Live",
      }));
    const own: Upcoming[] = (account?.live?.shows ?? [])
      .filter((s) => new Date(s.startsAt).getTime() > Date.now() - 3600_000)
      .map((s) => ({
        id: s.id,
        handle: account!.username,
        name: account!.profile.displayName || account!.username,
        photo: "/models/hero.webp",
        title: s.title,
        startsAt: s.startsAt,
        durationMin: s.durationMin,
        tags: s.tags,
        platform: account!.live?.rooms[0] ? resolveHandoff(account!.username, account!.live.rooms[0].url).platform : "OnlyMen Live",
        own: true,
      }));
    return [...own, ...real, ...demo].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [demo, account, dir]);
}
