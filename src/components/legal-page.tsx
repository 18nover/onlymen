import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Brand } from "@/components/onlymen-ui";
import { company } from "@/lib/company";

export type LegalSection = { h: string; body: ReactNode };

export function LegalPage({ title, version, intro, sections }: { title: string; version: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <div className="min-h-screen">
      <div role="alert" className="sticky top-0 z-40 border-b border-ruby/60 bg-oxblood/95 backdrop-blur">
        <p className="om-container flex items-center gap-2 py-2.5 text-xs font-bold tracking-wide text-ivory sm:text-sm">
          <AlertTriangle className="size-4 shrink-0 text-gold-hi" /> DRAFT — placeholder text. Have a lawyer review before launch. Not legal advice.
        </p>
      </div>
      <header className="border-b border-line/60">
        <div className="om-container flex h-16 items-center justify-between">
          <Link to="/" aria-label="OnlyMen home"><Brand /></Link>
          <nav className="flex gap-1 text-xs font-semibold text-muted sm:text-sm">
            {[["/terms", "Terms"], ["/privacy", "Privacy"], ["/guidelines", "Guidelines"], ["/2257", "2257"]].map(([to, l]) => (
              <Link key={to} to={to} className="rounded-full px-2.5 py-2 hover:text-gold-hi" activeProps={{ className: "text-gold-hi" }}>{l}</Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="om-container py-12">
        <article className="mx-auto max-w-2xl">
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">{company.product} · {company.company}</p>
          <h1 className="mt-2 text-5xl font-semibold text-ivory">{title}</h1>
          <p className="mt-2 text-xs text-dim">Version {version} · Applies to {company.domain}</p>
          <div className="mt-6 text-[15px] leading-relaxed text-muted">{intro}</div>
          <ol className="mt-10 grid gap-8">
            {sections.map((s, i) => (
              <li key={s.h}>
                <h2 className="font-display text-2xl font-semibold text-ivory">{i + 1}. {s.h}</h2>
                <div className="mt-2 grid gap-3 text-[15px] leading-relaxed text-muted">{s.body}</div>
              </li>
            ))}
          </ol>
          <p className="mt-12 border-t border-line/60 pt-6 text-xs text-dim">Questions: legal@{company.companyDomain} · © 2026 {company.company}</p>
        </article>
      </main>
    </div>
  );
}
