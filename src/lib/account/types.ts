// OnlyMen account + onboarding data model.
// Storage-agnostic: the same shapes are persisted by the local adapter today and
// by a real database adapter later (see docs/ONBOARDING.md).

export type AccountType = "member" | "creator";

/** Every consent the platform may need, now or soon. */
export type ConsentKey =
  | "age18"
  | "terms"
  | "privacy"
  | "adultContent"
  | "guidelines"
  | "cookiesAnalytics"
  | "marketingEmail"
  | "sms"
  | "creator2257"
  | "creatorModelRelease";

/** One immutable entry in the append-only consent log. */
export type ConsentRecord = {
  key: ConsentKey;
  granted: boolean;
  /** Version of the document/wording the person saw when they answered. */
  version: string;
  /** ISO timestamp. */
  at: string;
  /** Where it was captured, e.g. "onboarding:consents". */
  source: string;
  userAgent?: string;
};

export type PermissionKey = "location" | "notifications" | "camera" | "microphone";
export type PermissionState = "unasked" | "granted" | "denied" | "skipped" | "unsupported";
export type PermissionRecord = { state: PermissionState; at?: string };

export type Photo = {
  /** Key of the image blob in the media store. */
  id: string;
  /** True for the single profile photo. */
  primary: boolean;
  /** Creator-only flag; explicit photos are blurred for viewers who opt in. */
  explicit?: boolean;
  addedAt: string;
};

export type SocialLinks = { x?: string; instagram?: string; onlyfans?: string; website?: string };

export type Rate = { id: string; label: string; price: string; unit: string };

export type Profile = {
  displayName: string;
  headline: string;
  bio: string;
  city: string;
  showAge: boolean;
  heightCm?: number;
  bodyType?: string;
  position?: string;
  tribes: string[];
  interests: string[];
  lookingFor: string[];
  languages: string[];
  social: SocialLinks;
  photos: Photo[];
  /** Creators only. */
  rates: Rate[];
  services: string[];
  acceptsTips: boolean;
};

export type VerificationStatus = "not_started" | "pending_review" | "approved" | "rejected";

/** Creator identity / payout data. UI + model only; no KYC vendor is wired yet. */
export type CreatorVerification = {
  status: VerificationStatus;
  legalName: string;
  idType: "" | "passport" | "drivers_license" | "national_id";
  idCountry: string;
  idFrontMediaId?: string;
  idBackMediaId?: string;
  selfieMediaId?: string;
  payoutMethod: "" | "bank" | "paypal" | "paxum" | "crypto";
  payoutEmail: string;
  taxForm: "" | "W-9" | "W-8BEN";
  taxCountry: string;
  submittedAt?: string;
};

export type WhoCanMessage = "everyone" | "verified" | "following" | "nobody";

export type PrivacySettings = {
  showOnline: boolean;
  showDistance: boolean;
  whoCanMessage: WhoCanMessage;
  blurExplicit: boolean;
  discoverable: boolean;
};

export type OnboardingStepId =
  | "consents"
  | "basics"
  | "photos"
  | "details"
  | "socials"
  | "permissions"
  | "verify"
  | "privacy"
  | "finish";

export type OnboardingProgress = {
  current: OnboardingStepId;
  completed: OnboardingStepId[];
  skipped: OnboardingStepId[];
  finishedAt?: string;
};

export type Account = {
  id: string;
  email: string;
  username: string;
  /** YYYY-MM-DD */
  dob: string;
  type: AccountType;
  createdAt: string;
  updatedAt: string;
  /** PBKDF2-SHA256; never the raw password. */
  password: { algo: "pbkdf2-sha256"; iterations: number; salt: string; hash: string };
  emailVerified: boolean;
  phone?: string;
  consents: ConsentRecord[];
  permissions: Record<PermissionKey, PermissionRecord>;
  profile: Profile;
  privacy: PrivacySettings;
  creator?: CreatorVerification;
  onboarding: OnboardingProgress;
};

/** Account with the credential stripped, safe to hand to the UI. */
export type PublicAccount = Omit<Account, "password">;
