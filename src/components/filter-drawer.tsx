import { useEffect } from "react";
import { BadgeCheck, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { allLanguages, builds, defaultSearch, ethnicities, fmtHeight, styles, type Search as SearchState } from "@/lib/models";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line/60 py-5 last:border-0">
      <h3 className="mb-3 font-sans text-[11px] font-bold tracking-[0.2em] text-dim uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Chips<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T[]; onChange: (v: T[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            key={o}
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
            className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
              on ? "bg-gold" : "border border-line bg-surface-2/60 text-muted hover:border-gold/50 hover:text-ivory"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ label, icon, checked, onChange }: { label: string; icon: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ivory">
      <span className="text-gold">{icon}</span>
      <span className="flex-1">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-gold" : "bg-surface-2 ring-1 ring-line"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-ivory shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}

function DualRange({
  min,
  max,
  value,
  onChange,
  format,
  label,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format: (n: number) => string;
  label: string;
}) {
  const pct = (n: number) => ((n - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ivory">{format(value[0])}</span>
        <span className="text-xs text-dim">to</span>
        <span className="font-semibold text-ivory">{value[1] >= max ? `${format(max)}+` : format(value[1])}</span>
      </div>
      <div className="dual-range relative h-6">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-surface-2" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <input
          type="range"
          aria-label={`Minimum ${label}`}
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([Math.min(+e.target.value, value[1] - 1), value[1]])}
        />
        <input
          type="range"
          aria-label={`Maximum ${label}`}
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(+e.target.value, value[0] + 1)])}
        />
      </div>
    </div>
  );
}

export function FilterDrawer({
  open,
  value,
  onChange,
  onClose,
  resultCount,
}: {
  open: boolean;
  value: SearchState;
  onChange: (s: SearchState) => void;
  onClose: () => void;
  resultCount: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const set = <K extends keyof SearchState>(k: K, v: SearchState[K]) => onChange({ ...value, [k]: v });

  return (
    <div className={`fixed inset-0 z-50 ${open ? "visible" : "pointer-events-none invisible delay-300"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-ink/75 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Search filters"
        className={`absolute flex flex-col border-gold-grad shadow-2xl transition-transform duration-300 ease-out
          inset-x-0 bottom-0 max-h-[calc(100dvh-env(safe-area-inset-top)-1.5rem)] rounded-t-3xl
          md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[min(440px,100vw)] md:rounded-none md:rounded-l-3xl
          ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line md:hidden" />
        <div className="flex items-center justify-between gap-4 border-b border-line/60 px-5 pt-4 pb-3 sm:px-6">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-gold uppercase">Refine</p>
            <h2 className="text-3xl font-semibold text-ivory">Search filters</h2>
          </div>
          <button onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-ivory transition hover:text-gold-hi" aria-label="Close filters">
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
          <Section title="Keyword">
            <label className="flex h-11 items-center gap-2 rounded-xl border border-line bg-surface-2/60 px-3 text-sm focus-within:border-gold/60">
              <Search className="size-4 text-dim" />
              <input
                value={value.q}
                onChange={(e) => set("q", e.target.value)}
                placeholder="Name, #interest or neighborhood"
                className="min-w-0 flex-1 bg-transparent text-ivory outline-none placeholder:text-dim"
              />
            </label>
          </Section>
          <Section title="Quick picks">
            <Toggle label="Verified only" icon={<BadgeCheck className="size-4" />} checked={value.verifiedOnly} onChange={(v) => set("verifiedOnly", v)} />
          </Section>
          <Section title="Age">
            <DualRange label="age" min={18} max={60} value={value.age} onChange={(v) => set("age", v)} format={(n) => `${n}`} />
          </Section>
          <Section title="Height">
            <DualRange label="height" min={155} max={205} value={value.heightCm} onChange={(v) => set("heightCm", v)} format={(n) => fmtHeight(n).split(" · ")[0]} />
          </Section>
          <Section title="Build">
            <Chips options={builds} value={value.builds} onChange={(v) => set("builds", v)} />
          </Section>
          <Section title="Style">
            <Chips options={styles} value={value.styles} onChange={(v) => set("styles", v)} />
          </Section>
          <Section title="Ethnicity">
            <Chips options={ethnicities} value={value.ethnicities} onChange={(v) => set("ethnicities", v)} />
          </Section>
          <Section title="Speaks">
            <Chips options={allLanguages} value={value.languages} onChange={(v) => set("languages", v)} />
          </Section>
          <p className="flex items-start gap-1.5 pb-6 text-xs leading-relaxed text-dim">
            <Sparkles className="mt-0.5 size-3.5 shrink-0" /> Creator profiles only. Tips are always optional.
          </p>
        </div>

        <div className="flex items-center gap-3 border-t border-line/60 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
          <button
            onClick={() => onChange(defaultSearch)}
            className="flex h-12 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-muted transition hover:border-gold/50 hover:text-ivory"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
          <button onClick={onClose} className="h-12 flex-1 rounded-full bg-gold text-sm font-bold glow-gold transition hover:brightness-110">
            Show {resultCount} {resultCount === 1 ? "man" : "men"}
          </button>
        </div>
      </aside>
    </div>
  );
}
