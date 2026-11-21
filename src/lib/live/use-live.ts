import { useEffect, useMemo, useState } from "react";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import { liveNow, upcomingShows, type LiveNow, type Upcoming } from "./demo";
import { resolveHandoff } from "./config";

/** Who's live now: the signed-in creator's own session (if any) + demo creators. */
export function useLiveNow(): LiveNow[] {
  const { account } = useAccount();
  const photoId = account?.profile.photos.find((p) => p.primary)?.id;
  const photo = useImageUrl(photoId);
  return useMemo(() => {
    const s = account?.live?.session;
    // a real account always wins over a demo profile with the same handle
    const list = liveNow().filter((d) => !(account && s && d.handle === account.username));
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
  }, [account, photo]);
}

/** Upcoming shows (client-only so times match the viewer's clock). */
export function useUpcoming(): Upcoming[] | null {
  const { account } = useAccount();
  const [demo, setDemo] = useState<Upcoming[] | null>(null);
  useEffect(() => setDemo(upcomingShows()), []);
  return useMemo(() => {
    if (!demo) return null;
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
    return [...own, ...demo].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [demo, account]);
}
