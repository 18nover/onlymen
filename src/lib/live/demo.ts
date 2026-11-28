// Demo live data built from the demo directory. Deterministic per hour so SSR
// and the client agree.
import { models, type Model } from "@/lib/models";
import { onlymenLiveRoom } from "./config";

export type LiveNow = {
  handle: string;
  name: string;
  photo: string;
  title: string;
  tags: string[];
  viewers: number;
  platform: string;
  roomUrl: string;
  startedMinAgo: number;
  tipGoal?: { label: string; pct?: number };
  model?: Model;
  own?: boolean;
};

export type Upcoming = { id: string; handle: string; name: string; photo: string; title: string; startsAt: string; durationMin: number; tags: string[]; platform: string; own?: boolean };

const titles = ["Late-night lounge: wine & whispers", "Sunday pump — come spot me", "Velvet room Q&A", "After-party energy", "Slow jazz, slower talk", "Golden-hour beach set", "Ink & leather night", "Bear hug hour", "Gallery after dark"];
const tagSets = [["Chill & chat", "Q&A"], ["Workout", "Muscle"], ["Chill & chat"], ["Dance"], ["ASMR", "Chill & chat"], ["Workout"], ["Leather", "Fetish"], ["Bear"], ["Roleplay"]];
const platforms = ["OnlyMen Live", "Stripchat", "Chaturbate", "JustFor.Fans", "OnlyMen Live"];

export function liveNow(): LiveNow[] {
  return models
    .filter((m) => m.live)
    .map((m, i) => ({
      handle: m.handle,
      name: m.name,
      photo: m.photo,
      title: titles[i % titles.length],
      tags: tagSets[i % tagSets.length],
      viewers: m.viewers ?? 50 + i * 37,
      platform: platforms[i % platforms.length],
      // demo: every room points at the future onlymen.live room (no real external rooms)
      roomUrl: onlymenLiveRoom(m.handle),
      startedMinAgo: 6 + ((i * 17) % 80),
      tipGoal: { label: ["Shirt off… just kidding, new playlist", "100 squats", "Bubble bath stream", "Answer anything"][i % 4], pct: [72, 38, 91, 55][i % 4] },
      model: m,
    }));
}

export function upcomingShows(now = new Date()): Upcoming[] {
  const base = new Date(now);
  base.setMinutes(0, 0, 0);
  return models
    .filter((m) => !m.live)
    .slice(0, 8)
    .map((m, i) => {
      const start = new Date(base.getTime() + (1 + i * 3 + (i % 2) * 2) * 3600_000);
      return {
        id: `demo-${m.handle}-${start.toISOString().slice(0, 13)}`,
        handle: m.handle,
        name: m.name,
        photo: m.photo,
        title: titles[(i + 3) % titles.length],
        startsAt: start.toISOString(),
        durationMin: [60, 90, 45, 120][i % 4],
        tags: tagSets[(i + 2) % tagSets.length],
        platform: platforms[(i + 1) % platforms.length],
      };
    });
}

export const liveHandles = () => new Set(models.filter((m) => m.live).map((m) => m.handle));

/** Demo recap numbers derived from the session length. */
export function demoRecapStats(minutes: number) {
  const m = Math.max(1, minutes);
  return {
    peakViewers: Math.round(40 + m * 6.5 + (m % 7) * 11),
    tipsUsd: Math.round(m * 3.4 + 25),
    newFollowers: Math.round(3 + m / 2.5),
    chatMessages: Math.round(m * 18 + 40),
  };
}
