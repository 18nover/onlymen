import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { Camera, Check, Coins, Crown, Heart, MessageCircle, Radio } from "lucide-react";
import { AuthShell, FormError, GoldButton, PasswordField, SocialButtons, TextField, Field, inputCls } from "@/components/account-ui";
import { accountStore, AccountError } from "@/lib/account/store";
import { BETA_FEEDBACK_AGREE, BETA_TERMS } from "@/lib/beta";
import { useAccount } from "@/lib/account/use-account";
import type { AccountType } from "@/lib/account/types";
import { maxDob, passwordStrength, validateDob, validateEmail, validatePassword, validateUsername } from "@/lib/account/validation";

type Search = { as?: AccountType; code?: string };

export const Route = createFileRoute("/join")({
  validateSearch: (s: Record<string, unknown>): Search => ({ as: s.as === "creator" ? "creator" : s.as === "member" ? "member" : undefined, code: typeof s.code === "string" && s.code ? s.code.slice(0, 20) : undefined }),
  head: () => ({ meta: [{ title: "Join OnlyMen — free, 18+" }] }),
  component: Join,
});

const TYPES: { id: AccountType; title: string; blurb: string; perks: { icon: typeof Heart; text: string }[] }[] = [
  {
    id: "member",
    title: "Member",
    blurb: "Browse, chat and tip the men you like.",
    perks: [
      { icon: Heart, text: "Follow & favorite" },
      { icon: MessageCircle, text: "Message creators" },
      { icon: Coins, text: "Send tips" },
    ],
  },
  {
    id: "creator",
    title: "Creator",
    blurb: "Post content, go live and get paid.",
    perks: [
      { icon: Camera, text: "Photos & videos" },
      { icon: Radio, text: "Live shows" },
      { icon: Crown, text: "Keep your tips" },
    ],
  },
];

function Join() {
  const { as, code: codeParam } = Route.useSearch();
  const nav = useNavigate();
  const { access } = useRouteContext({ from: "__root__" });
  const inviteOnly = access.invites;
  const [inviteCode, setInviteCode] = useState(codeParam ?? "");
  const { account, ready } = useAccount();
  const [type, setType] = useState<AccountType>(as ?? "member");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverErr, setServerErr] = useState<{ msg: string; field?: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [agree, setAgree] = useState(false);
  const [taken, setTaken] = useState(false);

  useEffect(() => {
    if (ready && account) nav({ to: account.onboarding.finishedAt ? "/me" : "/onboarding", replace: true });
  }, [ready, account, nav]);

  useEffect(() => {
    if (validateUsername(username)) return setTaken(false);
    const t = setTimeout(() => accountStore.isUsernameTaken(username).then(setTaken), 250);
    return () => clearTimeout(t);
  }, [username]);

  const errs = {
    inviteCode: inviteOnly && !inviteCode.trim() ? "Enter your invite code." : null,
    email: validateEmail(email),
    username: validateUsername(username) ?? (taken ? "That username is taken." : null),
    password: validatePassword(password),
    dob: validateDob(dob),
  };
  const show = (k: keyof typeof errs) => (touched[k] ? errs[k] : null) ?? (serverErr?.field === k ? serverErr.msg : null);
  const strength = passwordStrength(password);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched({ inviteCode: true, email: true, username: true, password: true, dob: true });
    setServerErr(null);
    if (Object.values(errs).some(Boolean)) return;
    setBusy(true);
    try {
      if (!agree) return setServerErr({ msg: "Please agree to give feedback during the beta." });
      await accountStore.signUp({ email, username, password, dob, type, agreeFeedback: true, ...(inviteOnly ? { inviteCode } : {}) });
      // Full navigation so the server re-checks private-mode access with the new session cookie.
      if (inviteOnly) window.location.assign("/onboarding");
      else nav({ to: "/onboarding" });
    } catch (err) {
      setServerErr(err instanceof AccountError ? { msg: err.message, field: err.field } : { msg: "Something went wrong. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker={inviteOnly ? "Invite only · 18+" : "Free · 18+ only"}
      title={<>Join <span className="text-gold italic">OnlyMen</span></>}
      sub={inviteOnly ? "OnlyMen is invite-only for now. Enter your code, then two minutes to sign up." : "Two minutes to sign up. Then we'll help you build a profile worth looking at."}
    >
      <form onSubmit={submit} noValidate className="grid gap-5">
        {inviteOnly && (
          <TextField
            label="Invite code"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            onBlur={() => setTouched((t) => ({ ...t, inviteCode: true }))}
            error={show("inviteCode")}
            hint="Looks like OM-XXXX-XXXX."
            placeholder="OM-XXXX-XXXX"
            maxLength={20}
          />
        )}
        <fieldset>
          <legend className="text-sm font-semibold text-ivory">I'm joining as</legend>
          <div className="mt-2 grid grid-cols-2 gap-3" role="radiogroup">
            {TYPES.map((t) => {
              const on = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setType(t.id)}
                  className={`relative rounded-2xl p-4 text-left transition ${on ? "border-gold-grad glow-gold" : "border border-line bg-surface/60 hover:border-gold/40"}`}
                >
                  {on && (
                    <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-gold">
                      <Check className="size-3.5 text-ink" strokeWidth={3} />
                    </span>
                  )}
                  <p className={`font-display text-2xl font-semibold ${on ? "text-gold" : "text-ivory"}`}>{t.title}</p>
                  <p className="mt-1 text-xs leading-snug text-muted">{t.blurb}</p>
                  <ul className="mt-3 hidden gap-1.5 sm:grid">
                    {t.perks.map((p) => (
                      <li key={p.text} className="flex items-center gap-2 text-xs text-dim">
                        <p.icon className="size-3.5 text-gold/80" /> {p.text}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
          {type === "creator" && <p className="mt-2 text-xs text-dim">Creators verify their ID and age before going public. You can browse right away.</p>}
        </fieldset>

        <SocialButtons />

        <FormError>{serverErr && !serverErr.field ? serverErr.msg : null}</FormError>
        <TextField label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} error={show("email")} placeholder="you@example.com" />
        <TextField
          label="Username"
          prefix="@"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, username: true }))}
          error={show("username")}
          hint={!validateUsername(username) && !taken ? `onlymen.gay/@${username.toLowerCase()}` : "3–20 letters, numbers, dots or underscores."}
          placeholder="yourname"
        />
        <div className="grid gap-2">
          <PasswordField label="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, password: true }))} error={show("password")} hint="8+ characters with letters and a number." />
          {password && (
            <div className="flex items-center gap-2" aria-live="polite">
              <div className="grid flex-1 grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-1 rounded-full ${i <= strength.score ? (strength.score >= 3 ? "bg-gold" : "bg-ruby") : "bg-line"}`} />
                ))}
              </div>
              <span className="text-xs text-dim">{strength.label}</span>
            </div>
          )}
        </div>
        <Field label="Date of birth" htmlFor="dob" error={show("dob")} hint="You must be 18+. We never show your birthday — only your age, if you choose.">
          <input id="dob" type="date" max={maxDob()} min="1900-01-01" value={dob} onChange={(e) => setDob(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, dob: true }))} aria-invalid={!!show("dob")} className={`${inputCls} h-12 [color-scheme:dark]`} />
        </Field>

        <p className="text-sm leading-relaxed text-muted">{BETA_TERMS}</p>
        <label className="flex items-start gap-3 text-sm text-ivory/90">
          <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
          <span>{BETA_FEEDBACK_AGREE}</span>
        </label>
        <GoldButton type="submit" loading={busy} className="mt-2 w-full" disabled={!agree}>Create account</GoldButton>
        <p className="text-center text-xs leading-relaxed text-dim">
          Next you'll review our Terms, Privacy Policy and Community Guidelines before anything goes public.
        </p>
        <p className="text-center text-sm text-muted">
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-gold-hi underline-offset-4 hover:underline">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
