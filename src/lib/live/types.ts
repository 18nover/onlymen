export type LiveRoom = { id: string; platform: string; url: string };
export type TipMenuItem = { id: string; label: string; price: string };

export type LiveSession = {
  id: string;
  title: string;
  tags: string[];
  tipGoal: string;
  roomUrl: string; // "" = OnlyMen Live room
  startedAt: string;
};

export type LiveRecap = LiveSession & {
  endedAt: string;
  peakViewers: number;
  tipsUsd: number;
  newFollowers: number;
  chatMessages: number;
};

export type ScheduledShow = { id: string; title: string; startsAt: string; durationMin: number; tags: string[] };

/** Creator live settings (onboarding "Live" step + Go live). */
export type CreatorLive = {
  streams: boolean;
  rooms: LiveRoom[];
  useOnlyMenLive: boolean;
  categories: string[];
  scheduleDays: string[];
  scheduleTime: string; // "21:00"
  timeZone: string;
  tipMenu: TipMenuItem[];
  recordingsAllowed: boolean;
  blockedRegions: string[];
  moderators: string[];
  bannedWords: string[];
  shows: ScheduledShow[];
  session?: LiveSession;
  lastRecap?: LiveRecap;
};

/** Viewer preferences (Details step). */
export type ViewerPrefs = { goLiveAlerts: boolean; country: string; favoriteCategories: string[] };

export type Reminder = { showId: string; creator: string; title: string; startsAt: string; createdAt: string };
