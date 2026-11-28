import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, FormError, GoldButton, PasswordField, TextField, Field, inputCls } from "@/components/account-ui";
import { accountStore, AccountError } from "@/lib/account/store";
import { useAccount } from "@/lib/account/use-account";
import { normalizeCode } from "@/lib/invites/codes";
import { BETA_FEEDBACK_AGREE, BETA_TERMS } from "@/lib/beta";
import { maxDob, passwordStrength, validateDob, validateEmail, validatePassword, validateUsername } from "@/lib/account/validation";

const OG_TITLE = "You're invited to OnlyMen";
const OG_DESC = "A private, invite-only community for adult men. 18+ only.";
const OG_IMAGE = "https://onlymen.18nover.workers.dev/og-invite.jpg";

export const Route = createFileRoute("/join_/$code")({
  head: () => ({
    meta: [
      { title: `${OG_TITLE} — 18+` },
      { name: "description", content: OG_DESC },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: OG_TITLE },
      { property: "og:description", content: OG_DESC },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: OG_TITLE },
      { name: "twitter:description", content: OG_DESC },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: InviteLanding,
});

function InviteLanding() {
  const raw = Route.useParams().code;
  const code = normalizeCode(raw) ?? String(raw ?? "").toUpperCase();
  const valid = Boolean(normalizeCode(raw));
  const nav = useNavigate();
  const { account, ready } = useAccount();
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
    email: validateEmail(email),
    username: validateUsername(username) ?? (taken ? "That username is taken." : null),
    password: validatePassword(password),
    dob: validateDob(dob),
  };
  const show = (k: keyof typeof errs) => (touched[k] ? errs[k] : null) ?? (serverErr?.field === k ? serverErr.msg : null);
  const strength = passwordStrength(password);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched({ email: true, username: true, password: true, dob: true });
    if (!valid) return setServerErr({ msg: "That invite link isn't valid. Check it and try again." });
    if (errs.email || errs.username || errs.password || errs.dob) return;
    setBusy(true);
    setServerErr(null);
    try {
      if (!agree) return setServerErr({ msg: "Please agree to give feedback during the beta." });
      await accountStore.signUp({ email, username, password, dob, type: "member", inviteCode: code, agreeFeedback: true });
      nav({ to: "/onboarding" });
    } catch (err) {
      setServerErr(err instanceof AccountError ? { msg: err.message, field: err.field } : { msg: "Something went wrong. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#070405] text-[#f4ead7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_0%,rgba(120,10,32,.62),transparent_70%),radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(196,22,63,.14),transparent_70%)]" />
      <div className="relative mx-auto grid min-h-dvh max-w-lg content-center gap-8 px-5 py-12">
        <header className="grid justify-items-center gap-3 text-center">
          <p className="text-[11px] font-bold tracking-[0.42em] text-[#d4af6a] uppercase">You're invited</p>
          <h1 className="font-display text-5xl font-semibold leading-none sm:text-6xl">
            Only<span className="italic text-transparent bg-clip-text bg-[linear-gradient(180deg,#f3dca0,#d4af6a_55%,#96702f)]">Men</span>
          </h1>
          <div className="h-px w-40 bg-[linear-gradient(90deg,transparent,#d4af6a,transparent)]" />
          <p className="max-w-sm text-sm leading-relaxed text-[#cbbba0]">A private community for adult men. This link is yours — use it to create a free account.</p>
          <p className="rounded-full border border-[#d4af6a]/40 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[#d4af6a] uppercase">Adults only · 18+</p>
          {valid ? (
            <p className="font-mono text-sm tracking-widest text-[#f3dca0]">{code}</p>
          ) : (
            <p className="text-sm text-ruby">This invite link doesn't look right.</p>
          )}
        </header>
        <AuthShell kicker="Invite only · 18+" title={<>Create your account</>} sub="Two minutes to join. You'll confirm you're 18+ with your date of birth.">
          <form onSubmit={submit} noValidate className="grid gap-5">
            <FormError>{serverErr && !serverErr.field ? serverErr.msg : null}</FormError>
            <TextField label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, email: true }))} error={show("email")} placeholder="you@example.com" />
            <TextField label="Username" prefix="@" autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={(e) => setUsername(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, username: true }))} error={show("username")} placeholder="yourname" />
            <div className="grid gap-2">
              <PasswordField label="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, password: true }))} error={show("password")} hint="8+ characters with letters and a number." />
              {password && (
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className={`h-1 rounded-full ${i <= strength.score ? (strength.score >= 3 ? "bg-gold" : "bg-ruby") : "bg-line"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-dim">{strength.label}</span>
                </div>
              )}
            </div>
            <Field label="Date of birth" htmlFor="invite-dob" error={show("dob")} hint="You must be 18+.">
              <input id="invite-dob" type="date" max={maxDob()} min="1900-01-01" value={dob} onChange={(e) => setDob(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, dob: true }))} aria-invalid={!!show("dob")} className={`${inputCls} h-12 [color-scheme:dark]`} />
            </Field>
            <p className="text-sm leading-relaxed text-muted">{BETA_TERMS}</p>
            <label className="flex items-start gap-3 text-sm text-ivory/90">
              <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
              <span>{BETA_FEEDBACK_AGREE}</span>
            </label>
            <GoldButton type="submit" loading={busy} className="mt-2 w-full" disabled={!valid || !agree}>Accept invite</GoldButton>
            <p className="text-center text-xs leading-relaxed text-dim">By creating an account you confirm you are 18 or older. Next you'll review our Terms, Privacy Policy and Community Guidelines.</p>
            <p className="text-center text-sm text-muted">Already a member? <Link to="/login" className="font-semibold text-gold-hi underline-offset-4 hover:underline">Log in</Link></p>
          </form>
        </AuthShell>
      </div>
    </div>
  );
}
