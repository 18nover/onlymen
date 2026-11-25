import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePaymentsEnabled } from "@/lib/use-payments";
import { Ban, CalendarClock, Coins, Plus, Radio, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { CheckRow, Chips, SelectField, TextField, Toggle, inputCls } from "@/components/account-ui";
import { StepHead, type StepProps } from "./steps";
import { BLOCKABLE_REGIONS, LIVE_CONSENTS, WEEKDAYS, emptyLive } from "@/lib/account/constants";
import { consentRecord, latestConsents, randomId } from "@/lib/account/store";
import { LIVE_CATEGORIES, LIVE_PLATFORMS, liveHost, safeExternalUrl } from "@/lib/live/config";
import type { CreatorLive } from "@/lib/live/types";

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line/80 bg-night/70 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase">
        <span className="text-gold">{icon}</span> {title}
      </h2>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

const TIMEZONES = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Phoenix", "America/Anchorage", "Pacific/Honolulu", "America/Toronto", "America/Mexico_City", "America/Sao_Paulo", "Europe/London", "Europe/Berlin", "Europe/Madrid", "Asia/Manila", "Asia/Kolkata", "Australia/Sydney"];

/** Tag entry: type + Enter/comma. */
function TagInput({ label, value, onChange, placeholder, prefix }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder: string; prefix?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim().replace(/^@/, "")).filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])].slice(0, 50));
    setDraft("");
  };
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-semibold text-ivory">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {value.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/[0.08] py-1 pr-1 pl-3 text-xs font-semibold text-gold-hi">
            {prefix}{v}
            <button type="button" onClick={() => onChange(value.filter((x) => x !== v))} aria-label={`Remove ${v}`} className="grid size-5 place-items-center rounded-full hover:bg-ink/60"><X className="size-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          aria-label={label}
          className={`${inputCls} h-11`}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" onClick={add} className="h-11 shrink-0 rounded-xl border border-gold/50 px-4 text-xs font-bold text-gold-hi hover:bg-gold/10">Add</button>
      </div>
    </div>
  );
}

export function LiveStep({ account, save, onNext }: StepProps) {
  const payments = usePaymentsEnabled();
  const l: CreatorLive = { ...emptyLive(), ...account.live };
  const set = (patch: Partial<CreatorLive>) => save((a) => ({ ...a, live: { ...emptyLive(), ...a.live, ...patch } }));
  const prev = latestConsents(account.consents);
  const [ack, setAck] = useState<Record<string, boolean>>(() => Object.fromEntries(LIVE_CONSENTS.map((c) => [c.key, prev[c.key]?.granted ?? false])));
  const [platform, setPlatform] = useState<string>(LIVE_PLATFORMS[1].id);
  const [url, setUrl] = useState("");
  const [urlErr, setUrlErr] = useState<string | null>(null);
  const plat = LIVE_PLATFORMS.find((p) => p.id === platform)!;

  onNext(() => {
    if (!l.streams) return null;
    if (!l.rooms.length && !l.useOnlyMenLive) return "Add a room link, or choose to use your OnlyMen Live room.";
    if (!LIVE_CONSENTS.every((c) => ack[c.key])) return "Accept the co-performer policy and Live Stream Rules to stream.";
    const bad = payments && l.tipMenu.find((t) => t.label.trim() && !/^\d+(\.\d{1,2})?$/.test(t.price.trim()));
    if (bad) return `Enter a token/dollar amount for “${bad.label}”.`;
    save((a) => ({ ...a, consents: [...a.consents, ...LIVE_CONSENTS.map((c) => consentRecord(c.key, true, "onboarding:live"))] }));
    return null;
  });

  const addRoom = () => {
    const safe = safeExternalUrl(url);
    if (!safe) return setUrlErr("Paste the full link, starting with https://");
    setUrlErr(null);
    set({ rooms: [...l.rooms, { id: randomId(4), platform: plat.label, url: safe }] });
    setUrl("");
  };

  return (
    <>
      <StepHead
        kicker="Live"
        title={<>Your <span className="text-gold italic">stage</span>, your rules.</>}
        sub="OnlyMen sends fans to your room — on the platform you already stream on, or your OnlyMen Live room when it opens. That platform handles the video, age checks and payments, so you stay in control without extra paperwork."
      />
      <div className="grid gap-6">
        <Toggle checked={l.streams} onChange={(v) => set({ streams: v })} label="I want to go live" detail="Turn off if you only post photos and messages. You can change this any time." icon={<Radio className="size-5" />} />

        {l.streams && (
          <>
            <Card title="Where fans watch you" icon={<Radio className="size-4" />}>
              {l.rooms.length > 0 && (
                <ul className="grid gap-2">
                  {l.rooms.map((r) => (
                    <li key={r.id} className="flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/[0.05] p-3 text-sm">
                      <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase">{r.platform}</span>
                      <span className="min-w-0 flex-1 truncate text-muted">{r.url}</span>
                      <button type="button" onClick={() => set({ rooms: l.rooms.filter((x) => x.id !== r.id) })} aria-label={`Remove ${r.platform} room`} className="grid size-9 place-items-center rounded-lg text-dim hover:text-ruby"><Trash2 className="size-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="grid gap-3 sm:grid-cols-[1fr_1.6fr_auto] sm:items-end">
                <SelectField label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} options={LIVE_PLATFORMS.filter((p) => p.id !== "onlymen-live").map((p) => ({ value: p.id, label: p.label }))} />
                <TextField label="Your room link" type="url" inputMode="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={plat.example} error={urlErr} />
                <button type="button" onClick={addRoom} className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-gold/50 px-4 text-sm font-bold text-gold-hi hover:bg-gold/10"><Plus className="size-4" /> Add</button>
              </div>
              <Toggle checked={l.useOnlyMenLive} onChange={(v) => set({ useOnlyMenLive: v })} label={`Reserve my OnlyMen Live room (${liveHost()}/${account.username})`} detail="Our white-label room — opening soon. Affiliate links (for example a Chaturbate /in/? campaign URL) are kept as-is. Until then, fans are sent to the links above." />
            </Card>

            <Card title="Categories & schedule" icon={<CalendarClock className="size-4" />}>
              <Chips label="Categories" options={LIVE_CATEGORIES} value={l.categories} max={5} onChange={(categories) => set({ categories })} />
              <Chips label="Usual days" options={WEEKDAYS} value={l.scheduleDays} onChange={(scheduleDays) => set({ scheduleDays })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Usual start time" type="time" value={l.scheduleTime} onChange={(e) => set({ scheduleTime: e.target.value })} className="[color-scheme:dark]" />
                <SelectField label="Time zone" value={l.timeZone} onChange={(e) => set({ timeZone: e.target.value })} options={[...new Set([l.timeZone, ...TIMEZONES])]} />
              </div>
            </Card>

            <Card title={payments ? "Tips & private shows" : "Recordings"} icon={<Coins className="size-4" />}>
              {payments && (
                <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ivory">Tip menu</p>
                <button type="button" onClick={() => set({ tipMenu: [...l.tipMenu, { id: randomId(4), label: "", price: "" }] })} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gold/50 px-3 text-xs font-bold text-gold-hi hover:bg-gold/10"><Plus className="size-3.5" /> Add item</button>
              </div>
              {l.tipMenu.length === 0 ? (
                <p className="-mt-2 text-sm text-dim">e.g. “Flex — $5”, “Song request — $10”, “Shirt off — $25”.</p>
              ) : (
                <div className="grid gap-2">
                  {l.tipMenu.map((t, i) => {
                    const upd = (patch: Partial<typeof t>) => set({ tipMenu: l.tipMenu.map((x, k) => (k === i ? { ...x, ...patch } : x)) });
                    return (
                      <div key={t.id} className="grid grid-cols-[1fr_6.5rem_auto] gap-2">
                        <input aria-label="Tip menu item" className={`${inputCls} h-11`} placeholder="Song request" value={t.label} onChange={(e) => upd({ label: e.target.value })} />
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-dim">$</span>
                          <input aria-label="Tip price in USD" inputMode="decimal" className={`${inputCls} h-11 pl-7`} placeholder="10" value={t.price} onChange={(e) => upd({ price: e.target.value })} />
                        </div>
                        <button type="button" aria-label="Remove item" onClick={() => set({ tipMenu: l.tipMenu.filter((_, k) => k !== i) })} className="grid size-11 place-items-center rounded-xl text-dim hover:text-ruby"><Trash2 className="size-4" /></button>
                      </div>
                    );
                  })}
                </div>
              )}
                </>
              )}
              <Toggle checked={l.recordingsAllowed} onChange={(v) => set({ recordingsAllowed: v })} label="Allow recordings & replays" detail="Only if everyone on camera agreed to be recorded and published." />
            </Card>

            <Card title="Safety & moderation" icon={<Ban className="size-4" />}>
              <Chips label="Block these regions from seeing I'm live" options={BLOCKABLE_REGIONS} value={l.blockedRegions} onChange={(blockedRegions) => set({ blockedRegions })} />
              <TagInput label="Chat moderators" prefix="@" value={l.moderators} onChange={(moderators) => set({ moderators })} placeholder="username, then Enter" />
              <TagInput label="Banned words" value={l.bannedWords} onChange={(bannedWords) => set({ bannedWords })} placeholder="word, then Enter" />
            </Card>

            <Card title="Co-performers & rules" icon={<Users className="size-4" />}>
              {LIVE_CONSENTS.map((c) => (
                <CheckRow key={c.key} required checked={!!ack[c.key]} onChange={(v) => setAck((s) => ({ ...s, [c.key]: v }))} detail={c.link && <Link to={c.link.to} target="_blank" className="font-semibold text-gold underline-offset-2 hover:underline">{c.link.text} ↗</Link>}>
                  {c.label}
                </CheckRow>
              ))}
              <p className="flex items-start gap-2 text-xs text-dim"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-gold/80" /> The platform hosting your stream verifies co-performers and keeps the stream's records. You're responsible for records for anything you record and post yourself.</p>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
