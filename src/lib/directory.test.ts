import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  arrangeDirectory,
  demoProfilesEnabled,
  inCity,
  inferMetro,
  isDirectoryEligible,
  mergeDirectory,
  toDirectoryModel,
  type DirectoryProfile,
} from "./directory.ts";
import type { Model } from "./models.ts";

const eligible = {
  role: "owner",
  accountType: "member",
  verificationStatus: "not_started",
  discoverable: true,
  hasAttachedPhoto: true,
};

describe("demoProfilesEnabled", () => {
  it("defaults on, and only explicit off/false/0 hide demos", () => {
    assert.equal(demoProfilesEnabled(undefined), true);
    assert.equal(demoProfilesEnabled(""), true);
    assert.equal(demoProfilesEnabled("on"), true);
    assert.equal(demoProfilesEnabled("ON"), true);
    assert.equal(demoProfilesEnabled("off"), false);
    assert.equal(demoProfilesEnabled("false"), false);
    assert.equal(demoProfilesEnabled("0"), false);
  });
});

describe("isDirectoryEligible", () => {
  it("allows the owner when they have a photo and are discoverable", () => {
    assert.equal(isDirectoryEligible(eligible), true);
  });
  it("rejects missing photos or a hidden profile", () => {
    assert.equal(isDirectoryEligible({ ...eligible, hasAttachedPhoto: false }), false);
    assert.equal(isDirectoryEligible({ ...eligible, discoverable: false }), false);
  });
  it("does not list ordinary creators yet — no KYC/2257 capture is wired", () => {
    assert.equal(
      isDirectoryEligible({
        role: "user",
        accountType: "creator",
        verificationStatus: "approved",
        discoverable: true,
        hasAttachedPhoto: true,
        has2257Records: true,
      }),
      false,
    );
  });
});

describe("inferMetro", () => {
  it("maps common city names and leaves unknown cities unset", () => {
    assert.equal(inferMetro("Chelsea, NYC"), "nyc");
    assert.equal(inferMetro("West Hollywood"), "la");
    assert.equal(inferMetro("Miami"), "mia");
    assert.equal(inferMetro("Chicago"), "chi");
    assert.equal(inferMetro("San Francisco"), "sf");
    assert.equal(inferMetro("Austin"), undefined);
    assert.equal(inferMetro(""), undefined);
  });
});

function demo(handle: string, extra: Partial<Model> = {}): Model {
  return {
    id: handle,
    handle,
    name: handle,
    age: 30,
    km: 1,
    city: "Chelsea",
    metro: "nyc",
    photo: "/models/m01.webp",
    online: false,
    live: false,
    isNew: false,
    verified: true,
    tier: null,
    availableNow: false,
    lastActiveMin: 10,
    tagline: "demo",
    tags: [],
    heightCm: 180,
    build: "Athletic",
    style: "Classic",
    ethnicity: "White",
    hair: "Brown",
    eyes: "Brown",
    tattoos: false,
    zodiac: "Leo",
    languages: ["English"],
    interests: [],
    goodCompanyFor: [],
    about: "",
    availability: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    travels: false,
    rating: 5,
    reviews: [],
    profileViews: 1,
    memberSince: "Jan 2026",
    focal: [],
    source: "demo",
    ...extra,
  };
}

const dakota: DirectoryProfile = {
  username: "admin",
  displayName: "Dakota Alexander",
  headline: "Stage name for adult content",
  bio: "Real bio from the account.",
  city: "New York",
  age: 35,
  verified: false,
  heightCm: 180,
  bodyType: "Athletic",
  tribes: ["Twink"],
  interests: ["Travel"],
  lookingFor: ["Fans"],
  languages: ["English"],
  photos: [{ id: "ph_abc", primary: true, explicit: false }],
  bannerPhotoId: "ph_banner",
  live: null,
  joinedAt: "2026-11-21T00:00:00.000Z",
};

describe("toDirectoryModel", () => {
  it("uses the real name, photo route, and does not invent live or verified", () => {
    const m = toDirectoryModel(dakota, Date.parse("2026-11-22T06:00:00.000Z"));
    assert.ok(m);
    assert.equal(m!.source, "real");
    assert.equal(m!.handle, "admin");
    assert.equal(m!.name, "Dakota Alexander");
    assert.equal(m!.photo, "/api/photo/ph_abc");
    assert.equal(m!.banner, "/api/photo/ph_banner");
    assert.equal(m!.live, false);
    assert.equal(m!.online, false);
    assert.equal(m!.availableNow, false);
    assert.equal(m!.verified, false);
    assert.equal(m!.tier, null);
    assert.equal(m!.metro, "nyc");
    assert.equal(m!.metroKnown, true);
    assert.equal(m!.age, 35);
    assert.equal(m!.tagline, "Stage name for adult content");
  });
  it("marks live only when a real session is present, and skips profiles with no photo", () => {
    const live = toDirectoryModel({ ...dakota, live: { title: "Now", tags: [] } });
    assert.equal(live!.live, true);
    assert.equal(toDirectoryModel({ ...dakota, photos: [] }), null);
  });
  it("keeps an unknown city out of metro filters", () => {
    const m = toDirectoryModel({ ...dakota, city: "Austin" });
    assert.equal(m!.metroKnown, false);
    assert.deepEqual(inCity([m!], "all").map((x) => x.handle), ["admin"]);
    assert.deepEqual(inCity([m!], "nyc"), []);
  });
});

describe("mergeDirectory", () => {
  const demos = [demo("marco.noir", { live: true, tier: "elite" }), demo("dre.gold"), demo("rafa.velvet", { live: true })];
  const real = [toDirectoryModel(dakota)!];

  it("replaces placeholders one-for-one and pins the real profile first", () => {
    const list = mergeDirectory(demos, real, true);
    assert.equal(list.length, demos.length);
    assert.equal(list[0].handle, "admin");
    assert.equal(list[0].source, "real");
    assert.deepEqual(list.slice(1).map((m) => m.handle), ["marco.noir", "dre.gold"]);
    assert.equal(list.some((m) => m.handle === "rafa.velvet"), false);
  });
  it("hides every placeholder when the flag is off", () => {
    const list = mergeDirectory(demos, real, false);
    assert.deepEqual(list.map((m) => m.handle), ["admin"]);
  });
  it("does not duplicate a real handle that already exists as a demo", () => {
    const list = mergeDirectory([demo("admin"), demo("marco.noir")], real, true);
    assert.equal(list.filter((m) => m.handle === "admin").length, 1);
    assert.equal(list[0].source, "real");
  });
});

describe("arrangeDirectory", () => {
  it("keeps real profiles first after a demo-only sort", () => {
    const list = mergeDirectory(
      [demo("marco.noir", { live: true, tier: "elite" }), demo("dre.gold")],
      [toDirectoryModel(dakota)!],
      true,
    );
    const arranged = arrangeDirectory(list, (demos) => [...demos].sort((a, b) => a.handle.localeCompare(b.handle)));
    assert.equal(arranged[0].handle, "admin");
    assert.equal(arranged[0].live, false);
  });
});
