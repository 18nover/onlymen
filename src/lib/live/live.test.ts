import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LIVE_BASE_URL, LIVE_DOMAIN_READY, resolveHandoff, safeExternalUrl, hostLabel } from "./config.ts";
import { canGoLive } from "./gate.ts";

const rec = (key: string, granted: boolean) => ({ key, granted, version: "x", at: "", source: "t" }) as never;

describe("live handoff", () => {
  it("defaults to onlymen.live and is not ready yet", () => {
    assert.equal(LIVE_BASE_URL, "https://onlymen.live");
    assert.equal(LIVE_DOMAIN_READY, false);
  });
  it("prefers the creator's own room", () => {
    const t = resolveHandoff("marco", "https://stripchat.com/marco");
    assert.equal(t.kind, "own-room");
    assert.equal(t.available, true);
    assert.equal(t.platform, "Stripchat");
  });
  it("falls back to the OnlyMen Live room, flagged unavailable", () => {
    const t = resolveHandoff("marco", "javascript:alert(1)");
    assert.equal(t.kind, "onlymen-live");
    assert.equal(t.url, "https://onlymen.live/marco");
    assert.equal(t.available, false);
  });
  it("rejects non-http urls", () => {
    assert.equal(safeExternalUrl("javascript:alert(1)"), null);
    assert.equal(safeExternalUrl("not a url"), null);
    assert.equal(hostLabel("https://www.chaturbate.com/x/"), "Chaturbate");
  });
});

describe("go-live gate", () => {
  it("needs creator + verification + both live consents", () => {
    assert.equal(canGoLive({ type: "member", consents: [] }).ok, false);
    const base = { type: "creator" as const, creator: { status: "pending_review" } as never };
    assert.deepEqual(canGoLive({ ...base, consents: [] }).missing.map((m) => m.key), ["rules"]);
    assert.equal(canGoLive({ ...base, consents: [rec("liveRules", true), rec("liveCoPerformers", true)] }).ok, true);
    assert.equal(canGoLive({ ...base, consents: [rec("liveRules", true), rec("liveCoPerformers", true), rec("liveRules", false)] }).ok, false);
    assert.equal(canGoLive({ type: "creator", creator: { status: "not_started" } as never, consents: [rec("liveRules", true), rec("liveCoPerformers", true)] }).missing[0].key, "verification");
  });
});
