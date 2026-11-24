export const REPORT_REASONS = ["underage", "selling_sex", "scam", "harassment", "impersonation", "non_consensual", "spam", "other"] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  underage: "May be under 18",
  selling_sex: "Paid in-person sexual services",
  non_consensual: "Non-consensual content",
  scam: "Scam or spam links",
  harassment: "Harassment",
  impersonation: "Fake or impersonation",
  spam: "Spam",
  other: "Something else",
};

export const REPORT_REASON_OPTIONS = (["underage", "selling_sex", "non_consensual", "scam", "harassment", "impersonation", "other"] as const).map((id) => ({ id, label: REPORT_REASON_LABELS[id] }));
