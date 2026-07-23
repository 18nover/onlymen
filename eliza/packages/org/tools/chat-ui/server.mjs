#!/usr/bin/env bun
// Local multi-agent chat dashboard for the OnlyMen org roster.
// Boots each character on its own elizaOS agent-server process (on demand),
// then proxies chat over that server's REST API. Same boot mechanism as
// .claude/skills/run-eliza/driver.sh, extended to run more than one
// character at a time so you can talk to different agents without
// restarting anything. Localhost-only dev tool — not part of the product.

import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORG_ROOT = join(__dirname, "..", "..");           // packages/org
const AGENT_ROOT = join(ORG_ROOT, "..", "agent");        // packages/agent
const CHARACTERS_DIR = join(ORG_ROOT, "characters");
const STATE_ROOT = process.env.CHAT_UI_STATE_ROOT || "/tmp/eliza-chat-ui-state";
const BASE_PORT = Number(process.env.CHAT_UI_BASE_PORT || 2140);
const UI_PORT = Number(process.env.CHAT_UI_PORT || 4173);
const BACKEND = process.env.ELIZA_RUN_BACKEND || "claude-sdk";

mkdirSync(STATE_ROOT, { recursive: true });

const characterFiles = readdirSync(CHARACTERS_DIR)
  .filter((f) => f.endsWith(".json"))
  .sort();

/** @type {Map<string, {name:string, bio:string[], adjectives:string[], role:string, port:number, proc:any, status:"stopped"|"booting"|"ready"|"error", agentId:string|null, error:string|null}>} */
const agents = new Map();

characterFiles.forEach((file, i) => {
  const id = file.replace(/\.json$/, "");
  const char = JSON.parse(readFileSync(join(CHARACTERS_DIR, file), "utf8"));
  agents.set(id, {
    name: char.name,
    bio: char.bio || [],
    adjectives: char.adjectives || [],
    role: char.settings?.ORG_ROLE || "",
    port: BASE_PORT + i,
    proc: null,
    status: "stopped",
    agentId: null,
    error: null,
  });
});

function roster() {
  return [...agents.entries()].map(([id, a]) => ({
    id,
    name: a.name,
    bio: a.bio,
    adjectives: a.adjectives,
    role: a.role,
    status: a.status,
    error: a.error,
  }));
}

async function health(port) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAgentId(port) {
  const res = await fetch(`http://127.0.0.1:${port}/api/agents`, { signal: AbortSignal.timeout(5000) });
  const body = await res.json();
  return body.agents?.[0]?.id ?? null;
}

async function startAgent(id) {
  const a = agents.get(id);
  if (!a) throw new Error(`unknown agent ${id}`);
  if (a.status === "ready" || a.status === "booting") return a;

  a.status = "booting";
  a.error = null;
  const stateDir = join(STATE_ROOT, id);
  mkdirSync(stateDir, { recursive: true });
  const elizaConfigPath = join(stateDir, "eliza.json");
  try {
    readFileSync(elizaConfigPath);
  } catch {
    await Bun.write(
      elizaConfigPath,
      JSON.stringify({ plugins: { entries: { "@onlymen/plugin-org-coordinator": { enabled: true } } } }, null, 2)
    );
  }

  const charJson = readFileSync(join(CHARACTERS_DIR, `${id}.json`), "utf8");
  const logPath = join(stateDir, "server.log");

  const proc = Bun.spawn({
    cmd: ["bun", "--conditions=eliza-source", "src/bin.ts", "serve"],
    cwd: AGENT_ROOT,
    env: {
      ...process.env,
      ELIZA_STATE_DIR: stateDir,
      ELIZA_API_PORT: String(a.port),
      ELIZA_CHAT_VIA_CLI: BACKEND,
      ELIZA_PLANNER_NATIVE_TOOLS: "0",
      ELIZA_AGENT_CHARACTER_JSON: charJson,
    },
    stdout: Bun.file(logPath),
    stderr: Bun.file(logPath),
  });
  a.proc = proc;

  // Poll for readiness in the background; UI polls /api/agents/:id/status.
  (async () => {
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      const h = await health(a.port);
      if (h?.ready) {
        a.agentId = await fetchAgentId(a.port).catch(() => null);
        a.status = a.agentId ? "ready" : "error";
        if (!a.agentId) a.error = "server ready but no agent id returned";
        return;
      }
      if (proc.exitCode !== null && proc.exitCode !== undefined) {
        a.status = "error";
        a.error = `process exited with code ${proc.exitCode} — see ${logPath}`;
        return;
      }
    }
    a.status = "error";
    a.error = `did not become ready within 240s — see ${logPath}`;
  })();

  return a;
}

async function chat(id, message) {
  const a = agents.get(id);
  if (!a) throw new Error(`unknown agent ${id}`);
  if (a.status !== "ready" || !a.agentId) throw new Error(`agent ${id} is not ready (status: ${a.status})`);
  const res = await fetch(`http://127.0.0.1:${a.port}/api/agents/${a.agentId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "jerry", text: message }),
    signal: AbortSignal.timeout(300000),
  });
  if (!res.ok) throw new Error(`chat request failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

const indexHtml = readFileSync(join(__dirname, "index.html"), "utf8");

Bun.serve({
  port: UI_PORT,
  hostname: "127.0.0.1",
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" ) {
      return new Response(indexHtml, { headers: { "Content-Type": "text/html" } });
    }

    if (url.pathname === "/api/roster" && req.method === "GET") {
      return Response.json(roster());
    }

    const startMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/start$/);
    if (startMatch && req.method === "POST") {
      try {
        await startAgent(startMatch[1]);
        return Response.json({ ok: true });
      } catch (err) {
        return Response.json({ ok: false, error: String(err) }, { status: 400 });
      }
    }

    const statusMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/status$/);
    if (statusMatch && req.method === "GET") {
      const a = agents.get(statusMatch[1]);
      if (!a) return Response.json({ error: "unknown agent" }, { status: 404 });
      return Response.json({ status: a.status, error: a.error });
    }

    const chatMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/chat$/);
    if (chatMatch && req.method === "POST") {
      const { message } = await req.json();
      try {
        const result = await chat(chatMatch[1], message);
        return Response.json(result);
      } catch (err) {
        return Response.json({ error: String(err) }, { status: 400 });
      }
    }

    return new Response("not found", { status: 404 });
  },
});

console.log(`Agent chat UI running at http://127.0.0.1:${UI_PORT}`);
console.log(`Roster: ${[...agents.keys()].join(", ")}`);
