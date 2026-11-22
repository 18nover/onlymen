import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, CircleCheck, Crown, Loader2, LogOut } from "lucide-react";
import { Brand } from "@/components/onlymen-ui";
import { GoldButton } from "@/components/account-ui";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import type { OnboardingStepId, PublicAccount } from "@/lib/account/types";
import { LiveStep } from "./live-step";
import { BasicsStep, ConsentsStep, DetailsStep, PermissionsStep, PhotosStep, PrivacyStep, SocialsStep, VerifyStep, type StepProps } from "./steps";

type StepDef = { id: OnboardingStepId; label: string; skippable: boolean; Component?: (p: StepProps) => React.ReactNode };

const ALL: StepDef[] = [
  { id: "consents", label: "Agreements", skippable: false, Component: ConsentsStep },
  { id: "basics", label: "Basics", skippable: false, Component: BasicsStep },
  { id: "photos", label: "Photos", skippable: true, Component: PhotosStep },
  { id: "details", label: "Details", skippable: true, Component: DetailsStep },
  { id: "socials", label: "Links", skippable: true, Component: SocialsStep },
  { id: "permissions", label: "Permissions", skippable: true, Component: PermissionsStep },
  { id: "verify", label: "Verify", skippable: true, Component: VerifyStep },
  { id: "live", label: "Live", skippable: true, Component: LiveStep },
  { id: "privacy", label: "Privacy", skippable: true, Component: PrivacyStep },
  { id: "finish", label: "Done", skippable: false },
];

function stepsFor(a: Pick<PublicAccount, "type">) {
  return ALL.filter((s) => (s.id !== "verify" && s.id !== "live") || a.type === "creator").map((s) =>
    s.id === "socials" && a.type === "creator" ? { ...s, label: "Links & content menu" } : s,
  );
}

export function OnboardingWizard({ step: stepParam, onStep }: { step?: OnboardingStepId; onStep: (s: OnboardingStepId, replace?: boolean) => void }) {
  const { account, ready, update } = useAccount();
  const nav = useNavigate();
  const guard = useRef<() => string | null | Promise<string | null>>(() => null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (ready && !account) nav({ to: "/join", replace: true });
  }, [ready, account, nav]);

  const steps = useMemo(() => (account ? stepsFor(account) : ALL), [account?.type]); // eslint-disable-line react-hooks/exhaustive-deps
  const current = account ? (steps.find((s) => s.id === (stepParam ?? account.onboarding.current)) ?? steps[0]) : steps[0];
  const idx = steps.indexOf(current);

  // Keep the URL in sync with saved progress (resume where they left off).
  useEffect(() => {
    if (account && !stepParam) onStep(account.onboarding.current, true);
  }, [account, stepParam, onStep]);

  useEffect(() => {
    setErr(null);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [current.id]);

  const save = useCallback(
    (patch: (a: PublicAccount) => PublicAccount) => {
      update(patch).then(() => setSavedAt(Date.now()));
    },
    [update],
  );

  if (!ready || !account) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" />
      </div>
    );
  }

  const go = (to: OnboardingStepId, mark?: "completed" | "skipped") => {
    save((a) => {
      const o = a.onboarding;
      const done = mark === "completed" ? [...new Set([...o.completed, current.id])] : o.completed.filter((x) => x !== current.id || mark !== "skipped");
      const skipped = mark === "skipped" ? [...new Set([...o.skipped, current.id])] : o.skipped.filter((x) => x !== current.id || mark !== "completed");
      return { ...a, onboarding: { ...o, current: to, completed: done, skipped, finishedAt: to === "finish" ? (o.finishedAt ?? new Date().toISOString()) : o.finishedAt } };
    });
    onStep(to);
  };

  const next = async () => {
    setBusy(true);
    const e = await guard.current();
    setBusy(false);
    if (e) {
      setErr(e);
      return;
    }
    go(steps[idx + 1].id, "completed");
  };

  const pct = Math.round((idx / (steps.length - 1)) * 100);
  const Component = current.Component;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-xl">
        <div className="om-container flex h-16 items-center gap-3">
          <Link to="/" aria-label="OnlyMen home" className="shrink-0">
            <Brand />
          </Link>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-dim" aria-live="polite">
            {savedAt && <><CircleCheck className="size-4 text-gold/80" /> <span className="hidden sm:inline">Progress saved</span></>}
          </span>
          <Link to="/logout" className="flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-muted hover:text-ivory">
            <LogOut className="size-4" /> <span className="hidden sm:inline">Log out</span>
          </Link>
        </div>
        {/* progress */}
        <div className="om-container pb-3">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-[0.2em] uppercase">
            <span className="text-gold">{current.id === "finish" ? "All set" : `Step ${idx + 1} of ${steps.length - 1}`}</span>
            <span className="text-dim">{current.label}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Onboarding progress">
            <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${Math.max(4, pct)}%` }} />
          </div>
          <ol className="mt-3 hidden gap-1 lg:flex">
            {steps.slice(0, -1).map((s, i) => {
              const done = account.onboarding.completed.includes(s.id);
              const reachable = i <= idx || done || account.onboarding.skipped.includes(s.id) || !!account.onboarding.finishedAt;
              return (
                <li key={s.id} className="flex-1">
                  <button
                    type="button"
                    disabled={!reachable || (s.id !== "consents" && !account.onboarding.completed.includes("consents"))}
                    onClick={() => onStep(s.id)}
                    aria-current={s.id === current.id ? "step" : undefined}
                    className={`flex w-full items-center gap-1.5 truncate rounded-md px-1.5 py-1 text-left text-xs transition disabled:cursor-default ${s.id === current.id ? "text-gold-hi" : done ? "text-muted hover:text-ivory" : "text-dim"}`}
                  >
                    <span className={`grid size-4 shrink-0 place-items-center rounded-full text-[9px] font-bold ${done ? "bg-gold text-ink" : s.id === current.id ? "border border-gold text-gold" : "border border-line"}`}>
                      {done ? <Check className="size-2.5" strokeWidth={4} /> : i + 1}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {current.id === "finish" ? (
        <Finish account={account} />
      ) : (
        <main className="om-container pt-8 pb-40 sm:pt-12">
          <div className="mx-auto max-w-3xl animate-fade-up" key={current.id}>
            {Component && <Component account={account} save={save} onNext={(fn) => (guard.current = fn)} />}
          </div>
        </main>
      )}

      {current.id !== "finish" && (
        <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-line/60 bg-ink/90 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          <div className="om-container mx-auto max-w-3xl pt-3">
            {err && (
              <p role="alert" className="mb-3 rounded-xl border border-ruby/50 bg-oxblood/50 px-4 py-2.5 text-sm font-semibold text-ivory">
                {err}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => idx > 0 && onStep(steps[idx - 1].id)}
                disabled={idx === 0}
                className="flex h-12 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-muted transition hover:text-ivory disabled:invisible"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <div className="ml-auto flex items-center gap-2">
                {current.skippable && (
                  <button type="button" onClick={() => go(steps[idx + 1].id, "skipped")} className="h-12 rounded-full px-4 text-sm font-semibold text-muted transition hover:text-ivory">
                    Skip for now
                  </button>
                )}
                <GoldButton type="button" onClick={next} loading={busy} className="min-w-36">
                  {current.id === "verify" && account.creator?.status !== "pending_review" ? "Submit" : steps[idx + 1]?.id === "finish" ? "Finish" : "Continue"}
                </GoldButton>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function Finish({ account }: { account: PublicAccount }) {
  const primary = account.profile.photos.find((p) => p.primary) ?? account.profile.photos[0];
  const url = useImageUrl(primary?.id);
  const creator = account.type === "creator";
  const p = account.profile;
  const checks = [
    { label: "Agreements signed", done: account.onboarding.completed.includes("consents") },
    { label: "Profile photo", done: !!primary },
    { label: "Headline & bio", done: !!(p.headline && p.bio) },
    { label: "Details & tags", done: !!(p.bodyType || p.tribes.length || p.interests.length) },
    { label: "Notifications on", done: account.permissions.notifications.state === "granted" },
    ...(creator ? [{ label: "Live room linked", done: !!account.live?.rooms.length }] : []),
    ...(creator ? [{ label: account.creator?.status === "pending_review" ? "ID submitted — in review" : "ID verification", done: account.creator?.status === "pending_review" || account.creator?.status === "approved" }] : []),
  ];
  const pct = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);
  return (
    <main className="om-container pt-10 pb-20">
      <div className="mx-auto grid max-w-4xl animate-fade-up items-center gap-10 md:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-xs">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border-gold-grad glow-gold">
            {url ? (
              <img src={url} alt="Your profile photo" className="size-full object-cover" />
            ) : (
              <div className="grid size-full place-items-center bg-gradient-to-br from-oxblood/60 to-ink">
                <Crown className="size-16 text-gold/60" strokeWidth={1.2} />
              </div>
            )}
            <div className="absolute inset-0 tile-shade" />
            <div className="absolute inset-x-4 bottom-4">
              <p className="truncate font-display text-3xl font-semibold text-ivory">{p.displayName}</p>
              {p.headline && <p className="mt-1 line-clamp-2 text-xs text-muted">{p.headline}</p>}
            </div>
          </div>
          <span className="absolute -top-3 -right-3 grid size-14 place-items-center rounded-full bg-gold font-display text-lg font-bold shadow-xl">{pct}%</span>
        </div>
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Welcome to OnlyMen</p>
          <h1 className="mt-2 text-5xl leading-[1.05] font-semibold text-ivory sm:text-6xl">
            You're <span className="text-gold italic">in</span>, {p.displayName.split(" ")[0]}.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {creator
              ? "Your creator profile is set up. It goes public as soon as our team approves your ID — usually within 48 hours. Until then you can browse, chat and polish your page."
              : "Your profile is live. Start browsing, follow the men you like and say hello."}
          </p>
          <ul className="mt-6 grid gap-2">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-3 text-sm">
                <span className={`grid size-5 place-items-center rounded-full ${c.done ? "bg-gold text-ink" : "border border-line text-dim"}`}>{c.done && <Check className="size-3" strokeWidth={3.5} />}</span>
                <span className={c.done ? "text-ivory" : "text-dim"}>{c.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/me" className="grid h-12 flex-1 place-items-center rounded-full bg-gold px-6 text-sm font-bold tracking-[0.14em] uppercase hover:brightness-110">See my profile</Link>
            <Link to="/" hash="browse" className="grid h-12 flex-1 place-items-center rounded-full border border-gold/50 px-6 text-sm font-semibold text-gold-hi hover:bg-gold/10">Start browsing</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
