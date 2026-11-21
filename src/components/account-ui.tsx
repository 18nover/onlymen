import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { Brand } from "@/components/onlymen-ui";
import { company } from "@/lib/company";

/** Split-screen, photo-first shell for sign-up / log-in / reset. */
export function AuthShell({ children, kicker, title, sub, photos = ["/models/m06.webp", "/models/m03.webp", "/models/m01.webp"] }: {
  children: ReactNode;
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  photos?: string[];
}) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* photo side */}
      <aside className="relative h-56 overflow-hidden sm:h-72 lg:sticky lg:top-0 lg:h-dvh" aria-hidden="true">
        <div className="absolute inset-0 grid grid-cols-3 gap-1 lg:grid-cols-2 lg:grid-rows-2">
          {photos.map((p, i) => (
            <img
              key={p}
              src={p}
              alt=""
              className={`size-full object-cover ${i === 0 ? "lg:row-span-2" : ""}`}
              style={{ objectPosition: "50% 25%" }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-oxblood/30 lg:bg-gradient-to-r lg:from-ink/20 lg:via-ink/50 lg:to-ink" />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-x-0 bottom-0 hidden p-10 lg:block">
          <p className="font-display text-5xl leading-[1.05] font-semibold text-ivory">
            Men worth <span className="text-gold italic">staying up</span> for.
          </p>
          <p className="mt-4 max-w-sm text-sm text-muted">Verified adult creators and the men who adore them. Free to join. Tips only.</p>
        </div>
      </aside>
      {/* form side */}
      <main className="relative -mt-16 px-[var(--gutter)] pb-16 lg:mt-0 lg:flex lg:min-h-dvh lg:items-center lg:py-12">
        <div className="mx-auto w-full max-w-md animate-fade-up">
          <Link to="/" aria-label="OnlyMen home" className="inline-flex">
            <Brand size="md" />
          </Link>
          <p className="mt-8 text-xs font-bold tracking-[0.3em] text-gold uppercase">{kicker}</p>
          <h1 className="mt-2 text-4xl leading-tight font-semibold text-ivory sm:text-5xl">{title}</h1>
          {sub && <p className="mt-3 text-sm leading-relaxed text-muted">{sub}</p>}
          <div className="mt-8">{children}</div>
          <p className="mt-10 text-center text-xs text-dim">
            18+ only · © 2026 {company.company} · <Link to="/terms" className="underline-offset-2 hover:text-muted hover:underline">Terms</Link> ·{" "}
            <Link to="/privacy" className="underline-offset-2 hover:text-muted hover:underline">Privacy</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-surface/80 px-4 text-[15px] text-ivory outline-none transition placeholder:text-dim focus:border-gold/70 focus:bg-surface-2 aria-[invalid=true]:border-ruby/80";

export function Field({ label, hint, error, children, htmlFor, optional }: {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  htmlFor?: string;
  optional?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="flex items-baseline justify-between text-sm font-semibold text-ivory">
        <span>{label}</span>
        {optional && <span className="text-xs font-medium text-dim">Optional</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-semibold text-ruby">{error}</p>
      ) : hint ? (
        <p className="text-xs text-dim">{hint}</p>
      ) : null}
    </div>
  );
}

type TextProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: ReactNode; error?: string | null; optional?: boolean; prefix?: string };

export function TextField({ label, hint, error, optional, prefix, className = "", ...rest }: TextProps) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} optional={optional}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[15px] text-dim">{prefix}</span>}
        <input id={id} aria-invalid={!!error} className={`${inputCls} h-12 ${prefix ? "pl-9" : ""} ${className}`} {...rest} />
      </div>
    </Field>
  );
}

export function PasswordField({ label, hint, error, ...rest }: Omit<TextProps, "type">) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id}>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} aria-invalid={!!error} className={`${inputCls} h-12 pr-12`} {...rest} />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-dim transition hover:text-gold-hi"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </Field>
  );
}

export function TextArea({ label, hint, error, optional, maxLength, value, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: ReactNode; error?: string | null; optional?: boolean }) {
  const id = useId();
  const len = typeof value === "string" ? value.length : 0;
  return (
    <Field label={label} hint={hint ?? (maxLength ? `${len}/${maxLength}` : undefined)} error={error} htmlFor={id} optional={optional}>
      <textarea id={id} aria-invalid={!!error} maxLength={maxLength} value={value} className={`${inputCls} min-h-28 resize-y py-3 leading-relaxed`} {...rest} />
    </Field>
  );
}

export function SelectField({ label, hint, error, optional, options, placeholder, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  options: (string | { value: string; label: string })[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} optional={optional}>
      <select id={id} aria-invalid={!!error} className={`${inputCls} h-12 appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`} style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af6a' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>\")" }} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          return (
            <option key={v} value={v}>
              {typeof o === "string" ? o : o.label}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

/** Big tappable checkbox row. Unchecked by default; caller owns state. */
export function CheckRow({ checked, onChange, children, required, detail, id: idProp }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  required?: boolean;
  detail?: ReactNode;
  id?: string;
}) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={`flex gap-3 rounded-xl border p-4 transition ${checked ? "border-gold/60 bg-gold/[0.06]" : "border-line bg-surface/60 hover:border-gold/30"}`}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <label
        htmlFor={id}
        aria-hidden="true"
        className={`mt-0.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-hi ${checked ? "border-gold bg-gold" : "border-dim bg-ink"}`}
      >
        {checked && <Check className="size-4 text-ink" strokeWidth={3} />}
      </label>
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        <label htmlFor={id} className="cursor-pointer text-ivory">
          {children}
          {required && <span className="ml-1 text-ruby" aria-label="required">*</span>}
        </label>
        {detail && <div className="mt-1 text-xs text-dim">{detail}</div>}
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label, detail, icon }: { checked: boolean; onChange: (v: boolean) => void; label: string; detail?: string; icon?: ReactNode }) {
  const id = useId();
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface/60 p-4">
      {icon && <span className="grid size-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-ink text-gold">{icon}</span>}
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="block cursor-pointer text-sm font-semibold text-ivory">{label}</label>
        {detail && <p className="mt-0.5 text-xs leading-relaxed text-dim">{detail}</p>}
      </div>
      <button
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition ${checked ? "border-gold bg-gold" : "border-line bg-ink"}`}
      >
        <span className={`absolute top-0.5 size-5.5 rounded-full shadow transition-all ${checked ? "left-[calc(100%-1.5rem)] bg-ink" : "left-0.5 bg-dim"}`} />
      </button>
    </div>
  );
}

export function Chips({ options, value, onChange, max, label }: { options: string[]; value: string[]; onChange: (v: string[]) => void; max?: number; label: string }) {
  return (
    <fieldset>
      <legend className="flex w-full items-baseline justify-between text-sm font-semibold text-ivory">
        <span>{label}</span>
        {max && <span className="text-xs font-medium text-dim">{value.length}/{max}</span>}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          const disabled = !on && !!max && value.length >= max;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition disabled:opacity-40 ${on ? "border-gold bg-gold/15 text-gold-hi" : "border-line bg-surface/60 text-muted hover:border-gold/40 hover:text-ivory"}`}
            >
              {on && <Check className="mr-1 -ml-1 inline size-3.5" strokeWidth={3} />}
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function GoldButton({ children, loading, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-bold tracking-[0.14em] uppercase transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100 ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-muted transition hover:border-gold/50 hover:text-ivory disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" />
    </svg>
  );
}
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12Z" />
    </svg>
  );
}
function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5Z" />
    </svg>
  );
}

/** Social sign-in placeholders — disabled until an OAuth provider is configured. */
export function SocialButtons() {
  const items = [
    { name: "Google", icon: <GoogleLogo /> },
    { name: "Apple", icon: <AppleLogo /> },
    { name: "X", icon: <XLogo /> },
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((i) => (
          <button
            key={i.name}
            type="button"
            disabled
            title={`Continue with ${i.name} — coming soon`}
            aria-label={`Continue with ${i.name} (coming soon)`}
            className="relative flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-line bg-surface/50 text-sm font-semibold text-muted opacity-70"
          >
            {i.icon}
            <span className="hidden sm:inline">{i.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[11px] tracking-wide text-dim uppercase">Google, Apple &amp; X sign-in coming soon</p>
      <div className="my-6 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-dim uppercase">
        <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  );
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-xl border border-ruby/50 bg-oxblood/40 px-4 py-3 text-sm font-semibold text-ivory">
      {children}
    </p>
  );
}
