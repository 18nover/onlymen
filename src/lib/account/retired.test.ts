import { test } from "node:test";
import assert from "node:assert/strict";
import { carryHiddenTags, retiredCarry, RETIRED_LIVE_KEYS, RETIRED_PROFILE_KEYS, scrubLive, scrubProfile, visibleTags } from "./retired.ts";

const stored = {
  displayName: "X",
  rates: [{ label: "Custom video", price: "50", unit: "per hour" }],
  services: ["Dinner dates", "Custom videos"],
  position: "Vers",
  lookingFor: ["Chat", "Dinner dates", "Right now"],
};

test("retired profile fields are never exposed", () => {
  const s = scrubProfile(stored);
  for (const k of RETIRED_PROFILE_KEYS) assert.equal(k in s, false);
  assert.deepEqual(s.lookingFor, ["Chat"]);
  assert.equal(s.displayName, "X");
  assert.deepEqual(visibleTags(["Dates", "Friends", " dinner DATES "]), ["Friends"]);
});

test("retired live fields are never exposed", () => {
  const l = scrubLive({ privateRate: "3.99", tipMenu: [] });
  for (const k of RETIRED_LIVE_KEYS) assert.equal(k in l, false);
  assert.deepEqual(l.tipMenu, []);
});

test("saving carries retired data over untouched (shared DB: no data loss)", () => {
  assert.deepEqual(retiredCarry(stored, RETIRED_PROFILE_KEYS), { rates: stored.rates, services: stored.services, position: "Vers" });
  assert.deepEqual(retiredCarry({ displayName: "Y" }, RETIRED_PROFILE_KEYS), {});
  assert.deepEqual(carryHiddenTags(stored.lookingFor, ["Chat", "Friends"]), ["Chat", "Friends", "Dinner dates", "Right now"]);
  assert.equal(carryHiddenTags(stored.lookingFor, undefined), undefined);
});
