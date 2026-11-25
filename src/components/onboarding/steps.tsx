import { useState, type ReactNode } from "react";
import { useIdVerification } from "@/lib/verification/use-verification";
import { usePaymentsEnabled } from "@/lib/use-payments";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Camera,
  Check,
  CircleDollarSign,
  Eye,
  EyeOff,
  FileText,
  IdCard,
  Lock,
  MapPin,
  Mic,
  Radio,
  ScanFace,
  ShieldCheck,
} from "lucide-react";
import { CheckRow, Chips, SelectField, TextArea, TextField, Toggle } from "@/components/account-ui";
import { PhotoGrid, UploadSlot } from "./photo-grid";
import { BannerField } from "@/components/banner-field";
import {
  BODY_TYPES,
  CREATOR_CONSENTS,
  INTERESTS,
  LANGUAGES,
  LOOKING_FOR,
  MEMBER_CONSENTS,
  TRIBES,
  emptyCreator,
  defaultViewer,
  REGIONS,
} from "@/lib/account/constants";
import { LIVE_CATEGORIES } from "@/lib/live/config";
import { consentRecord, latestConsents } from "@/lib/account/store";
import { requestPermission } from "@/lib/account/permissions";
import { ageOn, validatePhone } from "@/lib/account/validation";
import type { ConsentKey, PermissionKey, PublicAccount, WhoCanMessage } from "@/lib/account/types";

export type StepProps = {
  account: PublicAccount;
  save: (patch: (a: PublicAccount) => PublicAccount) => void;
  /** Register the guard that runs when the person taps Continue. Return an error string to block. */
  onNext: (fn: () => string | null | Promise<string | null>) => void;
};

export function StepHead({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <header className="mb-7">
      <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">{kicker}</p>
      <h1 className="mt-2 text-4xl leading-tight font-semibold text-ivory sm:text-5xl">{title}</h1>
      {sub && <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{sub}</p>}
    </header>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line/80 bg-night/70 p-5 sm:p-6 ${className}`}>{children}</section>;
}

// ------------------------------------------------------------------ consents

export function ConsentsStep({ account, save, onNext }: StepProps) {
  const prev = latestConsents(account.consents.filter((c) => c.source.startsWith("onboarding")));
  const [vals, setVals] = useState<Partial<Record<ConsentKey, boolean>>>(() =>
    Object.fromEntries(MEMBER_CONSENTS.map((c) => [c.key, prev[c.key]?.granted ?? false])),
  );
  const [phone, setPhone] = useState(account.phone ?? "");
  const required = MEMBER_CONSENTS.filter((c) => c.required);
  const optional = MEMBER_CONSENTS.filter((c) => !c.required);
  const allReq = required.every((c) => vals[c.key]);

  onNext(() => {
    if (!allReq) return "Please confirm each required item to continue.";
    if (vals.sms && validatePhone(phone)) return "Add a mobile number for text alerts, or untick SMS.";
    save((a) => ({
      ...a,
      phone: vals.sms ? phone : a.phone,
      consents: [...a.consents, ...MEMBER_CONSENTS.map((c) => consentRecord(c.key, !!vals[c.key], "onboarding:consents"))],
    }));
    return null;
  });

  const set = (k: ConsentKey) => (v: boolean) => setVals((s) => ({ ...s, [k]: v }));

  return (
    <>
      <StepHead kicker="Step one · the fine print" title={<>Before the <span className="text-gold italic">lights go down.</span></>} sub="OnlyMen is for consenting adults. Confirm the essentials, then choose what else you'd like from us. Every answer is saved with the date and version you agreed to." />
      <div className="grid gap-6">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase">Required</h2>
            <button type="button" onClick={() => setVals((s) => ({ ...s, ...Object.fromEntries(required.map((c) => [c.key, !allReq])) }))} className="text-xs font-semibold text-gold-hi underline-offset-4 hover:underline">
              {allReq ? "Clear all" : "Agree to all required"}
            </button>
          </div>
          <div className="grid gap-3">
            {required.map((c) => (
              <CheckRow key={c.key} checked={!!vals[c.key]} onChange={set(c.key)} required detail={c.link && <Link to={c.link.to} target="_blank" className="font-semibold text-gold underline-offset-2 hover:underline">{c.link.text} ↗</Link>}>
                {c.label}
              </CheckRow>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase">Your choice</h2>
          <div className="grid gap-3">
            {optional.map((c) => (
              <CheckRow key={c.key} checked={!!vals[c.key]} onChange={set(c.key)} detail={c.detail}>
                {c.label}
              </CheckRow>
            ))}
            {vals.sms && <TextField label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" error={phone && validatePhone(phone)} />}
          </div>
        </Card>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ basics

export function BasicsStep({ account, save, onNext }: StepProps) {
  const p = account.profile;
  const age = ageOn(account.dob);
  const set = (patch: Partial<typeof p>) => save((a) => ({ ...a, profile: { ...a.profile, ...patch } }));
  onNext(() => (p.displayName.trim().length < 2 ? "Add a display name (2+ characters)." : null));
  return (
    <>
      <StepHead kicker="Your profile" title={<>First <span className="text-gold italic">impressions.</span></>} sub="This is what men see first. Keep it real — you can change it any time." />
      <Card className="grid gap-5">
        <TextField label="Display name" value={p.displayName} maxLength={32} onChange={(e) => set({ displayName: e.target.value })} error={p.displayName.trim().length < 2 ? "Required" : null} hint="Shown on your profile and in chats." />
        <TextField label="Headline" optional value={p.headline} maxLength={70} onChange={(e) => set({ headline: e.target.value })} placeholder="Late-night streams and behind-the-scenes." hint={`${p.headline.length}/70 · the one line under your name`} />
        <TextArea label="About you" optional value={p.bio} maxLength={600} rows={5} onChange={(e) => set({ bio: e.target.value })} placeholder="Tell people about yourself and what you post." />
        <TextField label="City" optional value={p.city} autoComplete="address-level2" onChange={(e) => set({ city: e.target.value })} placeholder="New York, NY" hint="City only. We never show your exact location." />
        <Toggle checked={p.showAge} onChange={(v) => set({ showAge: v })} label={`Show my age${age ? ` (${age})` : ""}`} detail="Your birthday itself is never shown." />
      </Card>
    </>
  );
}

// ------------------------------------------------------------------ photos

export function PhotosStep({ account, save, onNext }: StepProps) {
  const creator = account.type === "creator";
  onNext(() => (account.profile.photos.length ? null : "Add at least one photo — or tap Skip for now."));
  return (
    <>
      <StepHead kicker="Photo first" title={<>Show them <span className="text-gold italic">who you are.</span></>} sub={creator ? "Your profile photo must be a clear, non-explicit shot of your face. Mark anything explicit 18+ and it's blurred for men who choose that." : "Profiles with a clear face photo get far more replies. Your first photo is the one everyone sees."} />
      <Card>
        <BannerField
          bannerPhotoId={account.profile.bannerPhotoId}
          onChange={(bannerPhotoId) => save((a) => ({ ...a, profile: { ...a.profile, bannerPhotoId } }))}
        />
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-bold tracking-[0.2em] text-gold uppercase">Gallery</p>
          <PhotoGrid photos={account.profile.photos} creator={creator} onChange={(photos) => save((a) => ({ ...a, profile: { ...a.profile, photos } }))} />
        </div>
      </Card>
      <ul className="mt-5 grid gap-2 text-xs text-dim sm:grid-cols-3">
        {["Only photos of you (or people who consented)", "No minors, ever — not even in the background", "Main photo: face visible, nothing explicit"].map((t) => (
          <li key={t} className="flex gap-2">
            <ShieldCheck className="size-4 shrink-0 text-gold/80" /> {t}
          </li>
        ))}
      </ul>
    </>
  );
}

// ------------------------------------------------------------------ details

const cmToFt = (cm: number) => {
  const inches = Math.round(cm / 2.54);
  return `${Math.floor(inches / 12)}′${inches % 12}″`;
};

export function DetailsStep({ account, save, onNext }: StepProps) {
  const p = account.profile;
  const set = (patch: Partial<typeof p>) => save((a) => ({ ...a, profile: { ...a.profile, ...patch } }));
  onNext(() => null);
  const heights = Array.from({ length: 61 }, (_, i) => 150 + i);
  const v = { ...defaultViewer(), ...account.viewer };
  const setV = (patch: Partial<typeof v>) => save((a) => ({ ...a, viewer: { ...defaultViewer(), ...a.viewer, ...patch } }));
  return (
    <>
      <StepHead kicker="The details" title={<>Your <span className="text-gold italic">type</span>, your way.</>} sub="All optional. The more you share, the better your matches and search placement." />
      <div className="grid gap-6">
        <Card className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Height" optional value={p.heightCm ?? ""} onChange={(e) => set({ heightCm: e.target.value ? Number(e.target.value) : undefined })} placeholder="Prefer not to say" options={heights.map((h) => ({ value: String(h), label: `${cmToFt(h)} · ${h} cm` }))} />
          <SelectField label="Body type" optional value={p.bodyType ?? ""} onChange={(e) => set({ bodyType: e.target.value || undefined })} placeholder="Choose" options={BODY_TYPES} />
        </Card>
        <Card className="grid gap-6">
          <Chips label="Tribes" options={TRIBES} value={p.tribes} max={4} onChange={(tribes) => set({ tribes })} />
          <Chips label="Looking for" options={LOOKING_FOR} value={p.lookingFor} onChange={(lookingFor) => set({ lookingFor })} />
          <Chips label="Interests" options={INTERESTS} value={p.interests} max={8} onChange={(interests) => set({ interests })} />
          <Chips label="Languages" options={LANGUAGES} value={p.languages} onChange={(languages) => set({ languages })} />
        </Card>
        <Card className="grid gap-5">
          <h2 className="flex items-center gap-2 font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase"><Radio className="size-4 text-ruby" /> Live</h2>
          <Toggle checked={v.goLiveAlerts} onChange={(goLiveAlerts) => setV({ goLiveAlerts })} label="Go-live alerts" detail="Get a ping when men you follow start streaming. Uses notifications if you allow them." icon={<Bell className="size-5" />} />
          <SelectField label="Where you're watching from" optional value={v.country} onChange={(e) => setV({ country: e.target.value })} placeholder="Choose region" options={REGIONS} hint="Used to respect creators' region blocks and local laws." />
          <Chips label="Favorite live categories" options={LIVE_CATEGORIES} value={v.favoriteCategories} max={6} onChange={(favoriteCategories) => setV({ favoriteCategories })} />
        </Card>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ socials (+ creator tips)

export function SocialsStep({ account, save, onNext }: StepProps) {
  const p = account.profile;
  const creator = account.type === "creator";
  const set = (patch: Partial<typeof p>) => save((a) => ({ ...a, profile: { ...a.profile, ...patch } }));
  const setSocial = (k: keyof typeof p.social, v: string) => set({ social: { ...p.social, [k]: v.replace(/^@/, "") } });
  onNext(() => null);
  return (
    <>
      <StepHead kicker="Your links" title={<>Where else to <span className="text-gold italic">find you.</span></>} sub={creator ? "Optional. Link your socials so fans know you're real. Tips are on unless you turn them off." : "Optional. Linked accounts help others know you're real."} />
      <div className="grid gap-6">
        <Card className="grid gap-5 sm:grid-cols-2">
          <TextField label="X" optional prefix="@" value={p.social.x ?? ""} onChange={(e) => setSocial("x", e.target.value)} placeholder="handle" />
          <TextField label="Instagram" optional prefix="@" value={p.social.instagram ?? ""} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="handle" />
          {creator && <TextField label="OnlyFans / JFF" optional prefix="@" value={p.social.onlyfans ?? ""} onChange={(e) => setSocial("onlyfans", e.target.value)} placeholder="handle" />}
          <TextField label="Website" optional type="url" inputMode="url" value={p.social.website ?? ""} onChange={(e) => setSocial("website", e.target.value)} placeholder="https://" />
        </Card>
        {creator && (
          <Card className="grid gap-5">
            <Toggle checked={p.acceptsTips} onChange={(acceptsTips) => set({ acceptsTips })} label="Accept tips" detail="Fans can tip you from your profile, chats and live shows." icon={<CircleDollarSign className="size-5" />} />
          </Card>
        )}
      </div>
    </>
  );
}

// ------------------------------------------------------------------ device permissions

const PERMS: { key: PermissionKey; icon: typeof MapPin; title: string; why: string; when: string }[] = [
  { key: "location", icon: MapPin, title: "Location", why: "See who's nearby and show your distance (rounded — never your exact spot).", when: "Used for: Nearby grid, distance sort" },
  { key: "notifications", icon: Bell, title: "Notifications", why: "Know the moment someone messages, tips, or a favorite goes live.", when: "Used for: messages, tips, live alerts" },
  { key: "camera", icon: Camera, title: "Camera & photos", why: "Snap profile photos and do a quick selfie check to get verified.", when: "Used for: uploads, verification, live" },
  { key: "microphone", icon: Mic, title: "Microphone", why: "For live shows and video calls when they launch.", when: "Used for: live & calls (coming soon)" },
];

export function PermissionsStep({ account, save, onNext }: StepProps) {
  const [asking, setAsking] = useState<PermissionKey | null>(null);
  const [explain, setExplain] = useState<PermissionKey | null>(null);
  onNext(() => null); // never blocks
  const record = (key: PermissionKey, state: PublicAccount["permissions"][PermissionKey]["state"]) =>
    save((a) => ({ ...a, permissions: { ...a.permissions, [key]: { state, at: new Date().toISOString() } } }));

  async function ask(key: PermissionKey) {
    setExplain(null);
    setAsking(key);
    const state = await requestPermission(key);
    record(key, state);
    setAsking(null);
  }
  const ex = PERMS.find((p) => p.key === explain);

  return (
    <>
      <StepHead kicker="Permissions" title={<>A few <span className="text-gold italic">yeses</span> make it better.</>} sub="Nothing here is required. We'll explain each one before your browser asks, and you can change your mind in settings." />
      <div className="grid gap-3 sm:grid-cols-2">
        {PERMS.map((p) => {
          const st = account.permissions[p.key]?.state ?? "unasked";
          return (
            <Card key={p.key} className="flex flex-col">
              <div className="flex items-start gap-4">
                <span className={`grid size-12 shrink-0 place-items-center rounded-full ${st === "granted" ? "bg-gold text-ink" : "border-gold-grad text-gold-hi"}`}>
                  {st === "granted" ? <Check className="size-5" strokeWidth={3} /> : <p.icon className="size-5" />}
                </span>
                <div className="min-w-0">
                  <h2 className="font-sans text-base font-bold text-ivory">{p.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.why}</p>
                  <p className="mt-2 text-[11px] tracking-wide text-dim uppercase">{p.when}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 pt-1 sm:mt-auto">
                {st === "granted" ? (
                  <span className="text-sm font-semibold text-online">Allowed</span>
                ) : st === "denied" ? (
                  <span className="text-xs leading-snug text-dim">Blocked in your browser. Turn it on in site settings any time.</span>
                ) : st === "unsupported" ? (
                  <span className="text-xs text-dim">Not available on this browser.</span>
                ) : (
                  <>
                    <button type="button" onClick={() => setExplain(p.key)} disabled={asking !== null} className="h-10 rounded-full bg-gold px-5 text-xs font-bold tracking-[0.14em] uppercase hover:brightness-110 disabled:opacity-50">
                      {asking === p.key ? "Waiting…" : "Allow"}
                    </button>
                    <button type="button" onClick={() => record(p.key, "skipped")} className="h-10 rounded-full px-4 text-xs font-semibold text-muted hover:text-ivory">
                      {st === "skipped" ? "Skipped" : "Not now"}
                    </button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      {ex && createPortal(
        <div className="fixed inset-0 z-[80] grid place-items-end bg-ink/80 p-3 backdrop-blur-md sm:place-items-center" role="dialog" aria-modal="true" aria-labelledby="perm-title" onClick={() => setExplain(null)}>
          <div className="w-full max-w-sm animate-fade-up rounded-2xl border-gold-grad p-6 text-center glow-gold" onClick={(e) => e.stopPropagation()}>
            <span className="mx-auto grid size-14 place-items-center rounded-full border-gold-grad text-gold-hi">
              <ex.icon className="size-6" />
            </span>
            <h2 id="perm-title" className="mt-4 text-3xl font-semibold text-ivory">Allow {ex.title.toLowerCase()}?</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{ex.why}</p>
            <p className="mt-3 text-xs text-dim">Next, your browser will show its own prompt. Choose “Allow” there to turn it on.</p>
            <div className="mt-6 grid gap-2">
              <button type="button" onClick={() => ask(ex.key)} className="h-12 rounded-full bg-gold text-sm font-bold tracking-[0.14em] uppercase">Continue</button>
              <button type="button" onClick={() => setExplain(null)} className="h-11 rounded-full text-sm font-semibold text-muted hover:text-ivory">Maybe later</button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ------------------------------------------------------------------ creator verification

export function VerifyStep(props: StepProps) {
  const idv = useIdVerification();
  // ONLYMEN_ID_VERIFICATION=on: documents go to the server flow at /me/verify instead of this device.
  if (idv.enabled) return <VerifyStepServer {...props} />;
  return <VerifyStepLocal {...props} />;
}

function VerifyStepServer({ account, onNext }: StepProps) {
  onNext(() => null);
  const st = account.creator?.status;
  return (
    <>
      <StepHead kicker="Creator verification" title={<>Prove you're <span className="text-gold italic">you.</span></>} sub="Every creator is ID- and age-verified before going live or posting explicit photos. Documents are encrypted and only seen by our review team." />
      <Card className="grid gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-ivory"><ShieldCheck className="size-4 text-gold" /> {st === "approved" ? "You're verified." : st === "pending_review" ? "Submitted — in review." : st === "rejected" ? "Your last submission was declined." : "Not verified yet."}</p>
        {st !== "approved" && st !== "pending_review" && (
          <Link to="/me/verify" className="inline-flex h-11 w-fit items-center rounded-full bg-gold px-6 text-sm font-bold tracking-[0.12em] uppercase">Verify my ID</Link>
        )}
        <p className="text-xs text-dim">You can finish setting up your profile now and verify later.</p>
      </Card>
    </>
  );
}

function VerifyStepLocal({ account, save, onNext }: StepProps) {
  const payments = usePaymentsEnabled();
  const c = account.creator ?? emptyCreator();
  const set = (patch: Partial<typeof c>) => save((a) => ({ ...a, creator: { ...(a.creator ?? emptyCreator()), ...patch } }));
  const prev = latestConsents(account.consents);
  const [ack, setAck] = useState<Record<string, boolean>>(() => Object.fromEntries(CREATOR_CONSENTS.map((k) => [k.key, prev[k.key]?.granted ?? false])));
  const submitted = c.status === "pending_review" || c.status === "approved";

  onNext(() => {
    if (submitted) return null;
    if (c.legalName.trim().split(/\s+/).length < 2) return "Enter your full legal name as it appears on your ID.";
    if (!c.idType) return "Choose your ID type.";
    if (!c.idFrontMediaId) return "Upload the front of your ID.";
    if (c.idType !== "passport" && !c.idBackMediaId) return "Upload the back of your ID.";
    if (!c.selfieMediaId) return "Take a selfie holding your ID.";
    if (!CREATOR_CONSENTS.every((k) => ack[k.key])) return "Confirm the 2257 and content-ownership statements.";
    save((a) => ({
      ...a,
      consents: [...a.consents, ...CREATOR_CONSENTS.map((k) => consentRecord(k.key, true, "onboarding:verify"))],
      creator: { ...(a.creator ?? emptyCreator()), status: "pending_review", submittedAt: new Date().toISOString() },
    }));
    return null;
  });

  return (
    <>
      <StepHead kicker="Creator verification" title={<>Prove you're <span className="text-gold italic">you.</span></>} sub="Every creator is ID- and age-verified before their profile goes public or gets paid. Your documents are only seen by our verification team — never by fans." />
      {submitted && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold/[0.07] p-4" role="status">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold" />
          <div className="text-sm">
            <p className="font-semibold text-ivory">Submitted — pending review</p>
            <p className="mt-0.5 text-muted">We usually review within 24–48 hours. You'll get an email when you're approved.</p>
          </div>
        </div>
      )}
      <div className="grid gap-6">
        <Card className="grid gap-5">
          <h2 className="flex items-center gap-2 font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase"><IdCard className="size-4 text-gold" /> Identity</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Full legal name" autoComplete="name" value={c.legalName} onChange={(e) => set({ legalName: e.target.value })} hint="Exactly as on your ID. Never shown publicly." />
            <SelectField label="ID type" value={c.idType} onChange={(e) => set({ idType: e.target.value as typeof c.idType })} placeholder="Choose" options={[{ value: "passport", label: "Passport" }, { value: "drivers_license", label: "Driver's license" }, { value: "national_id", label: "National ID card" }]} />
            <TextField label="Issuing country" value={c.idCountry} autoComplete="country-name" onChange={(e) => set({ idCountry: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <UploadSlot label="ID — front" hint="Photo of the front, all corners visible" icon={<IdCard className="size-7" />} mediaId={c.idFrontMediaId} onChange={(id) => set({ idFrontMediaId: id })} capture="environment" />
            {c.idType !== "passport" && <UploadSlot label="ID — back" hint="Photo of the back" icon={<IdCard className="size-7" />} mediaId={c.idBackMediaId} onChange={(id) => set({ idBackMediaId: id })} capture="environment" />}
            <UploadSlot label="Selfie with ID" hint="Hold your ID next to your face" icon={<ScanFace className="size-7" />} mediaId={c.selfieMediaId} onChange={(id) => set({ selfieMediaId: id })} capture="user" />
          </div>
          <p className="flex items-center gap-2 text-xs text-dim"><Lock className="size-3.5" /> Preview: documents stay on this device. A verification partner (e.g. Veriff or Yoti) will handle this at launch.</p>
        </Card>
        <Card className="grid gap-3">
          <h2 className="mb-1 flex items-center gap-2 font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase"><FileText className="size-4 text-gold" /> Records &amp; release</h2>
          {CREATOR_CONSENTS.map((k) => (
            <CheckRow key={k.key} required checked={!!ack[k.key]} onChange={(v) => setAck((s) => ({ ...s, [k.key]: v }))} detail={k.link && <Link to={k.link.to} target="_blank" className="font-semibold text-gold underline-offset-2 hover:underline">{k.link.text} ↗</Link>}>
              {k.label}
            </CheckRow>
          ))}
        </Card>
        {payments && (
        <Card className="grid gap-5">
          <h2 className="flex items-center gap-2 font-sans text-sm font-bold tracking-[0.2em] text-ivory uppercase"><CircleDollarSign className="size-4 text-gold" /> Payouts &amp; tax <span className="rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wider text-dim">Set up after approval</span></h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label="Payout method" optional value={c.payoutMethod} onChange={(e) => set({ payoutMethod: e.target.value as typeof c.payoutMethod })} placeholder="Choose later" options={[{ value: "bank", label: "Bank transfer (ACH / SEPA)" }, { value: "paxum", label: "Paxum" }, { value: "paypal", label: "PayPal (where allowed)" }, { value: "crypto", label: "Crypto (USDC)" }]} />
            <TextField label="Payout email" optional type="email" value={c.payoutEmail} onChange={(e) => set({ payoutEmail: e.target.value })} />
            <SelectField label="Tax form" optional value={c.taxForm} onChange={(e) => set({ taxForm: e.target.value as typeof c.taxForm })} placeholder="Choose later" options={[{ value: "W-9", label: "W-9 (U.S. person)" }, { value: "W-8BEN", label: "W-8BEN (non-U.S.)" }]} />
            <TextField label="Tax residence" optional value={c.taxCountry} onChange={(e) => set({ taxCountry: e.target.value })} />
          </div>
          <p className="text-xs text-dim">We'll collect bank and tax details securely through our payments partner once you're verified. Never enter an SSN or bank number here.</p>
        </Card>
        )}
      </div>
    </>
  );
}

// ------------------------------------------------------------------ privacy

export function PrivacyStep({ account, save, onNext }: StepProps) {
  const p = account.privacy;
  const set = (patch: Partial<typeof p>) => save((a) => ({ ...a, privacy: { ...a.privacy, ...patch } }));
  onNext(() => null);
  const who: { v: WhoCanMessage; label: string; d: string }[] = [
    { v: "everyone", label: "Everyone", d: "Any member can message you" },
    { v: "verified", label: "Verified only", d: "Only ID-verified members" },
    { v: "following", label: "People I follow", d: "Only men you've followed" },
    { v: "nobody", label: "Nobody", d: "Turn off new messages" },
  ];
  return (
    <>
      <StepHead kicker="Privacy" title={<>Private <span className="text-gold italic">by design.</span></>} sub="You decide what's visible. Change any of this later in settings." />
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Toggle checked={p.showOnline} onChange={(v) => set({ showOnline: v })} label="Show when I'm online" detail="A green dot on your photo while you're active." icon={<span className="size-2.5 rounded-full bg-online" />} />
          <Toggle checked={p.showDistance} onChange={(v) => set({ showDistance: v })} label="Show my distance" detail="Rounded, never exact." icon={<MapPin className="size-5" />} />
          <Toggle checked={p.blurExplicit} onChange={(v) => set({ blurExplicit: v })} label="Blur explicit photos by default" detail="Tap to reveal. Handy in public." icon={p.blurExplicit ? <EyeOff className="size-5" /> : <Eye className="size-5" />} />
          <Toggle checked={p.discoverable} onChange={(v) => set({ discoverable: v })} label="Show me in browse & search" detail="Turn off to hide your profile but keep chatting." icon={<ShieldCheck className="size-5" />} />
        </div>
        <fieldset className="rounded-2xl border border-line/80 bg-night/70 p-5 sm:p-6">
          <legend className="px-1 text-sm font-bold tracking-[0.2em] text-ivory uppercase">Who can message me</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2" role="radiogroup">
            {who.map((w) => (
              <button key={w.v} type="button" role="radio" aria-checked={p.whoCanMessage === w.v} onClick={() => set({ whoCanMessage: w.v })} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${p.whoCanMessage === w.v ? "border-gold bg-gold/[0.08]" : "border-line bg-surface/50 hover:border-gold/40"}`}>
                <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${p.whoCanMessage === w.v ? "border-gold" : "border-dim"}`}>{p.whoCanMessage === w.v && <span className="size-2.5 rounded-full bg-gold" />}</span>
                <span>
                  <span className="block text-sm font-semibold text-ivory">{w.label}</span>
                  <span className="block text-xs text-dim">{w.d}</span>
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  );
}
