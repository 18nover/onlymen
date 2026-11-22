export const company = {
  product: "OnlyMen",
  domain: "onlymen.gay",
  company: "18nover",
  companyDomain: "18nover.gay",
  phase: "Phase 1 — free for everyone. Optional tips only. No subscriptions.",
  positioning:
    "A private, fully owned community of verified adult creators for gay men.",
  repo: "https://github.com/18nover/onlymen",
} as const;

export const surfaces = [
  { id: "spec", label: "Product spec" },
  { id: "architecture", label: "Architecture" },
  { id: "live", label: "Live" },
  { id: "tips", label: "Tips" },
  { id: "growth", label: "Growth" },
  { id: "safety", label: "Safety" },
  { id: "engineering", label: "Engineering" },
] as const;

export type SurfaceId = (typeof surfaces)[number]["id"];

export const agents = [
  {
    id: "desk",
    name: "Desk",
    duty: "Turns a brief into one decision, a reason, and the next thing to ship.",
    surface: "spec" as SurfaceId,
  },
  {
    id: "product",
    name: "Product",
    duty: "Keeps Phase 1 small. Owns flows, screens, and what waits.",
    surface: "spec" as SurfaceId,
  },
  {
    id: "architecture",
    name: "Architecture",
    duty: "Owns the stack and the data model. Boring tech we control.",
    surface: "architecture" as SurfaceId,
  },
  {
    id: "live",
    name: "Live",
    duty: "Webcam first, RTSP later. Tips on the stream. Start simple.",
    surface: "live" as SurfaceId,
  },
  {
    id: "growth",
    name: "Growth",
    duty: "Waitlist, then X, then a real launch. Nothing before there is a product.",
    surface: "growth" as SurfaceId,
  },
  {
    id: "safety",
    name: "Safety",
    duty: "Age gate, moderation, and company risk at a high level.",
    surface: "safety" as SurfaceId,
  },
  {
    id: "engineering",
    name: "Engineering",
    duty: "Names the next small slice of code and refuses big unshipped plans.",
    surface: "engineering" as SurfaceId,
  },
] as const;

export type AgentId = (typeof agents)[number]["id"];

export const roadmap = [
  { id: "spec", title: "Tighten the product spec", detail: "Flows, screens, Phase 1 list." },
  { id: "arch", title: "Lock architecture and schema", detail: "Auth, storage, live approach." },
  { id: "land", title: "Public landing and waitlist", detail: "First thing anyone can see." },
  { id: "mvp", title: "Owner profile", detail: "You are the first model on the platform." },
  { id: "live", title: "Live v1 plus tips", detail: "Webcam, then RTSP." },
  { id: "launch", title: "Open signups and the X push", detail: "Only after the above works." },
] as const;

export const lockedFacts = [
  "OnlyMen is owned by 18nover. Domains: onlymen.gay and 18nover.gay.",
  "Phase 1 is free. Optional tips only. Subscriptions come later, if ever.",
  "The owner is the first model. Signups open after the core experience works.",
  "Live is a differentiator: webcam or RTSP from the model's space, with tips.",
  "Growth is X advertising and a launch push, after there is something real.",
  "Prefer small working pieces. Document decisions as they happen.",
  "This desk is the agent team. It can brief any surface. It does not invent a second product.",
].join("\n");
