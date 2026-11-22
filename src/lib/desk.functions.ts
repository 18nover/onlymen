import { createServerFn } from "@tanstack/react-start";
import { agents, company, lockedFacts, surfaces, type AgentId, type SurfaceId } from "./company";

export type DeskReply = {
  summary: string;
  decision: string;
  why: string;
  nextStep: string;
  surface: SurfaceId;
};

const agentIds = new Set<string>(agents.map((agent) => agent.id));
const surfaceIds = new Set<string>(surfaces.map((surface) => surface.id));

function asAgent(value: string): AgentId {
  return agentIds.has(value) ? (value as AgentId) : "desk";
}

function asSurface(value: string, fallback: SurfaceId): SurfaceId {
  return surfaceIds.has(value) ? (value as SurfaceId) : fallback;
}

export const briefDesk = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Missing brief");
    const raw = input as { brief?: unknown; agentId?: unknown; surface?: unknown };
    const brief = typeof raw.brief === "string" ? raw.brief.trim() : "";
    if (brief.length < 2 || brief.length > 1200) {
      throw new Error("Brief must be between 2 and 1200 characters.");
    }
    const agentId = asAgent(typeof raw.agentId === "string" ? raw.agentId : "desk");
    const agent = agents.find((item) => item.id === agentId) ?? agents[0];
    const surface = asSurface(
      typeof raw.surface === "string" ? raw.surface : agent.surface,
      agent.surface,
    );
    return { brief, agentId, surface };
  })
  .handler(async ({ data }): Promise<{ ok: true; reply: DeskReply } | { ok: false; error: string }> => {
    const { platformEnv } = await import("@/lib/platform/runtime.ts");
    const apiKey = platformEnv("XAI_API_KEY");
    if (!apiKey) {
      return { ok: false, error: "The desk has no model key in this environment yet." };
    }

    const agent = agents.find((item) => item.id === data.agentId) ?? agents[0];
    const surface = surfaces.find((item) => item.id === data.surface);

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.4,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: [
              `You are ${agent.name} on the OnlyMen desk for ${company.company}.`,
              agent.duty,
              `Company: ${company.product} (${company.domain}). ${company.positioning}`,
              company.phase,
              "Locked facts:",
              lockedFacts,
              "Write like a sharp operator. No hype. No explicit sexual content.",
              "Return only JSON with keys summary, decision, why, nextStep, surface.",
              `surface must be one of: ${surfaces.map((item) => item.id).join(", ")}.`,
              `The human asked about the ${surface?.label ?? data.surface} surface.`,
            ].join("\n"),
          },
          { role: "user", content: data.brief },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false, error: `The model returned ${res.status}. Try once more.` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const reply = parseReply(text, data.surface);
    if (!reply) {
      return { ok: false, error: "The desk answered, but not in a form I could file." };
    }
    return { ok: true, reply };
  });

function parseReply(text: string, fallback: SurfaceId): DeskReply | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]) as Partial<DeskReply>;
    if (!parsed.summary || !parsed.decision || !parsed.why || !parsed.nextStep) return null;
    return {
      summary: String(parsed.summary).slice(0, 800),
      decision: String(parsed.decision).slice(0, 500),
      why: String(parsed.why).slice(0, 500),
      nextStep: String(parsed.nextStep).slice(0, 400),
      surface: asSurface(String(parsed.surface ?? fallback), fallback),
    };
  } catch {
    return null;
  }
}
