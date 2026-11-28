import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Loader2, LogOut, MapPin, MessageCircle, MessageSquare, ShieldCheck } from "lucide-react";
import { Footer, Header, MobileNav } from "@/components/onlymen-ui";
import { useCity } from "@/lib/onlymen-hooks";
import { useAccount } from "@/lib/account/use-account";
import { useIdVerification } from "@/lib/verification/use-verification";
import { blockedListFn } from "@/lib/chat/api";
import { nearbyActionFn, nearbyConfigFn, saveNearbySettingsFn } from "@/lib/nearby/api";
import type { Settings } from "@/lib/nearby/repo.server";

export const Route = createFileRoute("/me_/settings")({
  head: () => ({ meta: [{ title: "Settings — OnlyMen" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SettingsPage,
});

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line/80 bg-night/70 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">{icon} {title}</h2>
      {children}
    </section>
  );
}

function SettingsPage() {
  const { account, ready } = useAccount();
  const [city, setCity] = useCity();
  const nav = useNavigate();
  const idv = useIdVerification();
  const [blocks, setBlocks] = useState<{ username: string; displayName: string }[]>([]);
  const [nearby, setNearby] = useState<Settings | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !account) nav({ to: "/login", replace: true });
  }, [ready, account, nav]);

  useEffect(() => {
    if (!account) return;
    void blockedListFn().then((r) => r.ok && setBlocks(r.value));
    void nearbyConfigFn().then((r) => r.settings && setNearby(r.settings));
  }, [account]);

  if (!ready || !account) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" /></div>;
  }

  const status = account.creator?.status ?? "not_started";
  const priv = account.privacy;

  async function unblock(username: string) {
    const r = await nearbyActionFn({ data: { action: "unblock", username } });
    if (r.ok) setBlocks((b) => b.filter((x) => x.username !== username));
  }

  async function saveNearby(patch: Partial<Settings>) {
    const r = await saveNearbySettingsFn({ data: patch });
    if (r.ok && r.value) setNearby(r.value);
    setNote(r.ok ? "Saved." : r.error);
  }

  return (
    <div className="min-h-screen">
      <Header city={city} onCity={(c) => { setCity(c); void nav({ to: "/nearby" }); }} />
      <main className="om-container grid gap-6 pt-6 pb-28">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Your account</p>
          <h1 className="mt-1 font-display text-5xl font-semibold text-ivory">Settings</h1>
        </div>
        {note && <p className="text-sm text-gold-hi">{note}</p>}

        <Card title="Account">
          <ul className="grid gap-2 text-sm">
            <li className="flex justify-between gap-4"><span className="text-muted">Username</span><span className="text-ivory">@{account.username}</span></li>
            <li className="flex justify-between gap-4"><span className="text-muted">Email</span><span className="truncate text-ivory">{account.email}</span></li>
            <li className="flex justify-between gap-4"><span className="text-muted">Type</span><span className="capitalize text-ivory">{account.type}</span></li>
          </ul>
          <Link to="/onboarding" search={{ step: "basics" }} className="mt-4 inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-gold-hi">Edit profile</Link>
        </Card>

        <Card title="Privacy" icon={<ShieldCheck className="size-3.5" />}>
          <ul className="grid gap-2 text-sm">
            {[["Online status", priv.showOnline], ["Distance", priv.showDistance], ["Blur explicit", priv.blurExplicit], ["In the directory", priv.discoverable]].map(([k, v]) => (
              <li key={k as string} className="flex justify-between"><span className="text-muted">{k as string}</span><span className={v ? "text-gold-hi" : "text-dim"}>{v ? "On" : "Off"}</span></li>
            ))}
            <li className="flex justify-between"><span className="text-muted">Messages from</span><span className="capitalize text-gold-hi">{priv.whoCanMessage}</span></li>
          </ul>
          <Link to="/onboarding" search={{ step: "privacy" }} className="mt-4 inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-gold-hi">Edit privacy</Link>
        </Card>

        <Card title="Nearby sharing" icon={<MapPin className="size-3.5" />}>
          {nearby ? (
            <ul className="grid gap-3 text-sm">
              <li className="flex justify-between"><span className="text-muted">Sharing an approximate area</span><span className={nearby.sharing ? "text-gold-hi" : "text-dim"}>{nearby.sharing ? "On" : "Off — share from Nearby"}</span></li>
              {([
                ["Show a pin on the map", "sharePin", nearby.sharePin],
                ["Hide my distance", "hideDistance", nearby.hideDistance],
                ["Incognito", "incognito", nearby.incognito],
              ] as const).map(([label, key, on]) => (
                <li key={key} className="flex items-center justify-between gap-3">
                  <span className="text-muted">{label}</span>
                  <button type="button" role="switch" aria-checked={on} onClick={() => void saveNearby({ [key]: !on })} className={`h-7 w-12 rounded-full ${on ? "bg-gold" : "bg-line"}`}>
                    <span className={`block size-6 rounded-full bg-ivory transition ${on ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Sign in on the test site with Nearby turned on to manage sharing here.</p>
          )}
        </Card>

        <Card title="Notifications" icon={<Bell className="size-3.5" />}>
          <p className="text-sm text-muted">Notifications aren't in this beta yet. We'll let you know when they are.</p>
        </Card>

        <Card title="Blocked accounts">
          {blocks.length === 0 ? <p className="text-sm text-muted">You haven't blocked anyone.</p> : (
            <ul className="grid gap-2">
              {blocks.map((b) => (
                <li key={b.username} className="flex items-center justify-between gap-3 text-sm">
                  <Link to="/m/$handle" params={{ handle: b.username }} className="font-semibold text-ivory">@{b.username}</Link>
                  <button type="button" onClick={() => void unblock(b.username)} className="text-xs font-semibold text-gold-hi">Unblock</button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Verification">
          <p className="text-sm text-ivory">{status === "approved" ? "Verified." : status === "pending_review" ? "Your ID is in review." : status === "rejected" ? "Your last submission was declined." : "Not verified yet."}</p>
          {idv.enabled && status !== "approved" && status !== "pending_review" && (
            <Link to="/me/verify" className="mt-3 inline-flex text-sm font-semibold text-gold-hi underline underline-offset-2">Start verification</Link>
          )}
        </Card>

        <Card title="Legal">
          <ul className="grid gap-2 text-sm">
            <li><Link to="/terms" className="text-gold-hi underline-offset-2 hover:underline">Terms of Service</Link></li>
            <li><Link to="/privacy" className="text-gold-hi underline-offset-2 hover:underline">Privacy Policy</Link></li>
            <li><Link to="/guidelines" className="text-gold-hi underline-offset-2 hover:underline">Community Guidelines</Link></li>
          </ul>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Link to="/me/feedback" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ivory"><MessageSquare className="size-4 text-gold" /> Feedback</Link>
          <Link to="/messages" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ivory"><MessageCircle className="size-4 text-gold" /> Messages</Link>
          <Link to="/me" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-ivory">Back to profile</Link>
          <Link to="/logout" className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-muted"><LogOut className="size-4" /> Log out</Link>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
