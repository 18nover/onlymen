import type { CreatorLive, ViewerPrefs } from "../live/types.ts";
import type { ConsentKey, CreatorVerification, PermissionKey, PermissionRecord, PrivacySettings, Profile } from "./types.ts";

/**
 * Bump a version whenever the wording or the linked document changes. Records keep
 * the version they were captured under, so we can re-prompt only people whose
 * consent predates a change.
 */
export const CONSENT_VERSIONS: Record<ConsentKey, string> = {
  age18: "2026-11-21",
  terms: "draft-2026-11-21",
  privacy: "draft-2026-11-21",
  adultContent: "2026-11-21",
  guidelines: "draft-2026-11-21",
  cookiesAnalytics: "2026-11-21",
  marketingEmail: "2026-11-21",
  sms: "2026-11-21",
  creator2257: "draft-2026-11-21",
  creatorModelRelease: "draft-2026-11-21",
  liveRules: "draft-2026-11-21",
  liveCoPerformers: "draft-2026-11-21",
};

export type ConsentSpec = { key: ConsentKey; required: boolean; label: string; detail?: string; link?: { to: string; text: string } };

export const MEMBER_CONSENTS: ConsentSpec[] = [
  { key: "age18", required: true, label: "I am at least 18 years old, and of legal age to view adult content where I live." },
  { key: "terms", required: true, label: "I agree to the Terms of Service.", link: { to: "/terms", text: "Read the Terms" } },
  { key: "privacy", required: true, label: "I have read the Privacy Policy and understand how my data is used.", link: { to: "/privacy", text: "Read the Privacy Policy" } },
  { key: "adultContent", required: true, label: "I understand OnlyMen contains sexually explicit content intended for adult men, and I choose to see it." },
  { key: "guidelines", required: true, label: "I'll follow the Community Guidelines: consent always, no minors, no harassment.", link: { to: "/guidelines", text: "Read the Guidelines" } },
  { key: "cookiesAnalytics", required: false, label: "Allow analytics cookies so we can see what's working.", detail: "Essential cookies (sign-in, security) are always on." },
  { key: "marketingEmail", required: false, label: "Email me new faces, live shows and offers.", detail: "Unsubscribe any time." },
  { key: "sms", required: false, label: "Text me account alerts and live-show reminders.", detail: "Message & data rates may apply. Reply STOP to opt out." },
];

export const CREATOR_CONSENTS: ConsentSpec[] = [
  {
    key: "creator2257",
    required: true,
    label: "I acknowledge 18 U.S.C. § 2257 record-keeping: I will provide valid government ID, and every person who appears in my content is 18+ and has a matching ID and signed release on file.",
    link: { to: "/2257", text: "Read the 2257 statement" },
  },
  {
    key: "creatorModelRelease",
    required: true,
    label: "I own or have the rights to everything I post, everyone in it consented to being recorded and published, and I grant OnlyMen a license to host and display it.",
  },
];

export const emptyProfile = (): Profile => ({
  displayName: "",
  headline: "",
  bio: "",
  city: "",
  showAge: true,
  tribes: [],
  interests: [],
  lookingFor: [],
  languages: ["English"],
  social: {},
  photos: [],
  rates: [],
  services: [],
  acceptsTips: true,
});

export const defaultPrivacy = (): PrivacySettings => ({
  showOnline: true,
  showDistance: true,
  whoCanMessage: "everyone",
  blurExplicit: true,
  discoverable: true,
});

export const defaultPermissions = (): Record<PermissionKey, PermissionRecord> => ({
  location: { state: "unasked" },
  notifications: { state: "unasked" },
  camera: { state: "unasked" },
  microphone: { state: "unasked" },
});

export const emptyCreator = (): CreatorVerification => ({
  status: "not_started",
  legalName: "",
  idType: "",
  idCountry: "United States",
  payoutMethod: "",
  payoutEmail: "",
  taxForm: "",
  taxCountry: "United States",
});

export const BODY_TYPES = ["Slim", "Toned", "Athletic", "Muscular", "Average", "Stocky", "Big & tall", "Bear"];
export const POSITIONS = ["Top", "Vers top", "Versatile", "Vers bottom", "Bottom", "Side", "Prefer not to say"];
export const TRIBES = ["Bear", "Cub", "Daddy", "Jock", "Twink", "Otter", "Leather", "Geek", "Clean-cut", "Rugged", "Trans", "Discreet", "Poz", "Sober"];
export const INTERESTS = ["Fine dining", "Cocktail bars", "Gym", "Nightlife", "Travel", "Art", "Music", "Gaming", "Fashion", "Outdoors", "Cooking", "Film", "Fetish-friendly", "Kink-curious"];
export const LOOKING_FOR = ["Chat", "Dates", "Friends", "Right now", "Relationship", "Content collabs", "Live shows", "Fans"];
export const LANGUAGES = ["English", "Spanish", "Portuguese", "French", "German", "Italian", "Arabic", "Hindi", "Japanese", "Mandarin", "Russian", "Tagalog"];
export const CREATOR_SERVICES = ["Custom videos", "Custom photos", "Video calls", "Live shows", "Sexting", "Fan club", "Dinner dates", "Events & travel"];

export const MAX_PHOTOS = 9;

export const LIVE_CONSENTS: ConsentSpec[] = [
  {
    key: "liveCoPerformers",
    required: true,
    label: "Everyone who appears on camera with me is 18+, verified on OnlyMen (or on the platform I stream from), and has their own ID and 2257 records on file before they appear.",
  },
  {
    key: "liveRules",
    required: true,
    label: "I agree to the Live Stream Rules: no minors, no one who can't consent, no public spaces without consent, no off-platform payments, and I follow the rules of whatever platform I stream on.",
    link: { to: "/live-rules", text: "Read the Live Stream Rules" },
  },
];

export const emptyLive = (): CreatorLive => ({
  streams: true,
  rooms: [],
  useOnlyMenLive: true,
  categories: [],
  scheduleDays: [],
  scheduleTime: "21:00",
  timeZone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "America/New_York",
  tipMenu: [],
  privateRate: "",
  recordingsAllowed: false,
  blockedRegions: [],
  moderators: [],
  bannedWords: [],
  shows: [],
});

export const defaultViewer = (): ViewerPrefs => ({ goLiveAlerts: false, country: "", favoriteCategories: [] });

export const REGIONS = ["United States", "Canada", "United Kingdom", "European Union", "Australia", "Brazil", "Mexico", "India", "Philippines", "Other"];
export const BLOCKABLE_REGIONS = ["My home state", "My home country", "Texas", "Utah", "Louisiana", "Virginia", "Mississippi", "Arkansas", "United Kingdom", "France", "Germany", "Russia", "China", "Middle East"];
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
