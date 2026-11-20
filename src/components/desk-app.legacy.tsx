import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Radio } from "lucide-react";
import { agents, company, roadmap, surfaces, type AgentId, type SurfaceId } from "@/lib/company";
import { briefDesk, type DeskReply } from "@/lib/desk.functions";

type LogEntry = DeskReply & {
  id: string;
  at: string;
  agentId: AgentId;
  brief: string;
};

type Slot = {
  status: "idle" | "working" | "filed" | "stuck";
  job: string;
  summary: string;
  why: string;
  next: string;
  error: string;
};

const STORAGE_KEY = "onlymen-desk-log-v1";
const BOARD_KEY = "onlymen-desk-board-v1";

function emptySlot(): Slot {
  return { status: "idle", job: "", summary: "", why: "", next: "", error: "" };
}

export function DeskApp() {
  const ask = useServerFn(briefDesk);
  const [agentId, setAgentId] = useState<AgentId>("desk");
  const [surface, setSurface] = useState<SurfaceId>("spec");
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [board, setBoard] = useState<Record<string, Slot>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLog(JSON.parse(saved) as LogEntry[]);
      const savedBoard = localStorage.getItem(BOARD_KEY);
      if (savedBoard) setBoard(JSON.parse(savedBoard) as Record<string, Slot>);
    } catch {
      /* ignore a bad local log */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log.slice(0, 40)));
    localStorage.setItem(BOARD_KEY, JSON.stringify(board));
  }, [log, board, ready]);

  const agent = agents.find((item) => item.id === agentId) ?? agents[0];

  async function submit() {
    const text = brief.trim();
    if (text.length < 2 || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await ask({ data: { brief: text, agentId, surface } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      const entry: LogEntry = {
        ...result.reply,
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        agentId,
        brief: text,
      };
      setLog((current) => [entry, ...current]);
      setBoard((current) => ({
        ...current,
        [agentId]: {
          status: "filed",
          job: text,
          summary: result.reply.summary,
          why: result.reply.why,
          next: result.reply.nextStep,
          error: "",
        },
      }));
      setBrief("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "The desk could not file that.");
    } finally {
      setBusy(false);
    }
  }

  async function splitAcrossTeam() {
    const text = brief.trim();
    if (text.length < 2 || busy) return;
    setBusy(true);
    setError("");
    setBoard((current) => {
      const next = { ...current };
      for (const item of agents) {
        next[item.id] = { status: "working", job: text, summary: "", why: "", next: "", error: "" };
      }
      return next;
    });
    const results = await Promise.all(
      agents.map(async (item) => {
        try {
          const result = await ask({ data: { brief: text, agentId: item.id, surface: item.surface } });
          return { item, result, error: "" };
        } catch (err) {
          return {
            item,
            result: null,
            error: err instanceof Error ? err.message : "Could not file.",
          };
        }
      }),
    );
    const entries: LogEntry[] = [];
    setBoard((current) => {
      const next = { ...current };
      for (const row of results) {
        if (!row.result || !row.result.ok) {
          next[row.item.id] = {
            status: "stuck",
            job: text,
            summary: "",
            why: "",
            next: "",
            error: row.result && !row.result.ok ? row.result.error : row.error,
          };
          continue;
        }
        next[row.item.id] = {
          status: "filed",
          job: text,
          summary: row.result.reply.summary,
          why: row.result.reply.why,
          next: row.result.reply.nextStep,
          error: "",
        };
        entries.push({
          ...row.result.reply,
          id: crypto.randomUUID(),
          at: new Date().toISOString(),
          agentId: row.item.id,
          brief: text,
        });
      }
      return next;
    });
    if (entries.length) setLog((current) => [...entries, ...current]);
    if (!entries.length) setError("None of the team could file that brief.");
    setBusy(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            {company.company} · {company.domain}
          </p>
          <h1 className="mt-2 text-4xl text-ink sm:text-5xl">OnlyMen Desk</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">{company.phase}</p>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-muted">{company.positioning}</p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["First model", "You. Signups wait until the core works."],
          ["Money", "Free to join. Tips only. No subscriptions yet."],
          ["Differentiator", "Live from the model's space, with tips."],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-xl border border-line bg-paper-2/60 px-4 py-4">
            <h2 className="text-lg text-ink">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium tracking-[0.14em] text-muted uppercase">On the desk</h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">
              One brief can stay with the selected seat, or split so each seat works its own surface at the same time. You see the job, the reason, and the next step. Nothing here is a hidden thought log.
            </p>
          </div>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {agents.map((item) => {
            const slot = board[item.id] ?? emptySlot();
            const active = item.id === agentId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setAgentId(item.id);
                    setSurface(item.surface);
                  }}
                  className={
                    "flex min-h-44 w-full flex-col rounded-xl border px-4 py-3 text-left " +
                    (active ? "border-ink bg-ink text-paper" : "border-line bg-paper text-ink")
                  }
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className={"text-xs tracking-[0.12em] uppercase " + (active ? "text-paper-2" : "text-copper")}>
                      {slot.status}
                    </span>
                  </span>
                  <span className={"mt-2 text-xs leading-snug " + (active ? "text-paper-2" : "text-muted")}>{item.duty}</span>
                  <span className="mt-3 text-xs tracking-[0.12em] uppercase opacity-70">Job</span>
                  <span className="mt-1 line-clamp-2 text-sm leading-snug">
                    {slot.job || "Waiting for a brief."}
                  </span>
                  {slot.status === "working" ? (
                    <span className="mt-3 text-sm">Working this brief on {item.surface}.</span>
                  ) : null}
                  {slot.why ? (
                    <>
                      <span className="mt-3 text-xs tracking-[0.12em] uppercase opacity-70">Reason</span>
                      <span className="mt-1 line-clamp-3 text-sm leading-snug">{slot.why}</span>
                    </>
                  ) : null}
                  {slot.next ? (
                    <>
                      <span className="mt-3 text-xs tracking-[0.12em] uppercase opacity-70">Next</span>
                      <span className="mt-1 line-clamp-2 text-sm leading-snug">{slot.next}</span>
                    </>
                  ) : null}
                  {slot.error ? <span className="mt-3 text-sm">{slot.error}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="min-w-0">
          <h2 className="text-sm font-medium tracking-[0.14em] text-muted uppercase">Team</h2>
          <ul className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {agents.map((item) => {
              const active = item.id === agentId;
              return (
                <li key={item.id} className="w-56 shrink-0 lg:w-auto lg:shrink">
                  <button
                    type="button"
                    onClick={() => {
                      setAgentId(item.id);
                      setSurface(item.surface);
                    }}
                    className={
                      "min-h-11 w-full rounded-lg border px-3 py-2 text-left transition-colors " +
                      (active
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-paper text-ink hover:border-ink")
                    }
                  >
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className={"mt-0.5 block text-xs leading-snug " + (active ? "text-paper-2" : "text-muted")}>
                      {item.duty}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="rounded-xl border border-line bg-paper p-4 sm:p-5">
          <div className="flex items-center gap-2 text-copper">
            <Radio className="size-4" aria-hidden="true" />
            <p className="text-sm font-medium">Brief {agent.name}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            File with this seat only, or split the same brief so every seat answers its own surface. Replies stay on this device.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {surfaces.map((item) => {
              const active = item.id === surface;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSurface(item.id)}
                  className={
                    "min-h-11 rounded-full border px-3 text-sm " +
                    (active ? "border-copper bg-copper text-paper" : "border-line text-ink-soft hover:border-ink")
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <label className="mt-4 block text-sm font-medium text-ink" htmlFor="brief">
            What should {agent.name} decide?
          </label>
          <textarea
            id="brief"
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            rows={5}
            maxLength={1200}
            placeholder="Example: What is the smallest live v1 that still lets me take a tip while I am on camera?"
            className="mt-2 w-full resize-y rounded-lg border border-line bg-paper px-3 py-3 text-sm leading-relaxed text-ink outline-none focus:border-ink"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs tabular-nums text-muted">{brief.trim().length}/1200</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={splitAcrossTeam}
                disabled={busy || brief.trim().length < 2}
                className="inline-flex min-h-11 items-center rounded-lg border border-ink px-4 text-sm font-medium text-ink disabled:opacity-40"
              >
                {busy ? "Working…" : "Split across the team"}
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={busy || brief.trim().length < 2}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-medium text-paper disabled:opacity-40"
              >
                {busy ? "Filing…" : "File with this seat"}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          {error ? <p className="mt-3 text-sm text-copper-ink">{error}</p> : null}
          {log[0] ? <DecisionCard entry={log[0]} featured /> : null}
        </section>

        <aside className="space-y-6">
          <section>
            <h2 className="text-sm font-medium tracking-[0.14em] text-muted uppercase">Order of work</h2>
            <ol className="mt-3 space-y-3">
              {roadmap.map((item, index) => (
                <li key={item.id} className="flex gap-3">
                  <span className="mt-0.5 w-5 shrink-0 font-display text-sm text-copper tabular-nums">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <p className="text-xs leading-relaxed text-muted">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-sm font-medium tracking-[0.14em] text-muted uppercase">Filed</h2>
            {log.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Nothing filed yet. The first decision becomes the start of the living log.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {log.slice(0, 6).map((entry) => (
                  <li key={entry.id}>
                    <DecisionCard entry={entry} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function DecisionCard({ entry, featured = false }: { entry: LogEntry; featured?: boolean }) {
  const who = agents.find((item) => item.id === entry.agentId)?.name ?? "Desk";
  const where = surfaces.find((item) => item.id === entry.surface)?.label ?? entry.surface;
  return (
    <article className={featured ? "mt-5 border-t border-line pt-4" : "rounded-lg border border-line px-3 py-3"}>
      <p className="text-xs tracking-[0.12em] text-muted uppercase">
        {who} · {where}
      </p>
      <h3 className={featured ? "mt-1 text-2xl text-ink" : "mt-1 text-sm font-medium text-ink"}>{entry.decision}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{entry.summary}</p>
      {featured ? (
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs tracking-[0.12em] text-muted uppercase">Why</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{entry.why}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.12em] text-muted uppercase">Next ship</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{entry.nextStep}</dd>
          </div>
        </dl>
      ) : null}
    </article>
  );
}
