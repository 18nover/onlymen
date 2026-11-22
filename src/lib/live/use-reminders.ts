import { useNavigate } from "@tanstack/react-router";
import { useAccount } from "@/lib/account/use-account";
import type { Upcoming } from "./demo";
import type { Reminder } from "./types";

/** Show reminders on the signed-in account (local or server store). */
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
