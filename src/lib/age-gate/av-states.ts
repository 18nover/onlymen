/**
 * U.S. states with adult-website AGE-VERIFICATION laws (used only by the
 * optional geoblock, ONLYMEN_AGE_GATE_GEOBLOCK=on).
 *
 * !!! MUST BE VERIFIED BY COUNSEL AND KEPT CURRENT. This list changes every
 * legislative session and with court orders. It is not legal advice. !!!
 *
 * Last checked: 2026-11-22 against ageverificationlaws.com (27 states, checked
 * 19 Nov 2026), allaboutcookies.org and, for Kentucky, the Kentucky LRC:
 *   - Kentucky: HB 278 (2024 Ky. Acts ch. 106), signed 5 Apr 2024, effective
 *     15 Jul 2024 — KRS 436.001–436.009. Civil liability ($10,000 per instance)
 *     for a "covered platform" (> 1/3 of material harmful to minors) that does
 *     not perform age verification by government ID or commercially reasonable
 *     transactional data. NOTE: a click-through "I am 18" interstitial is NOT
 *     age verification under KRS 436.001(1).
 *
 * Keys are ISO 3166-2 subdivision codes without the "US-" prefix, matching
 * Cloudflare's request.cf.regionCode / the cf-region-code header for US IPs.
 */
export type AvState = { code: string; name: string; law: string; effective: string };

export const AV_LAW_STATES: readonly AvState[] = [
  { code: "AL", name: "Alabama", law: "HB 164 (2024)", effective: "2024-10-01" },
  { code: "AZ", name: "Arizona", law: "HB 2112 (2025)", effective: "2025-09-26" },
  { code: "AR", name: "Arkansas", law: "SB 66 (2023), Act 612", effective: "2023-08-01" },
  { code: "FL", name: "Florida", law: "HB 3 (2024)", effective: "2025-01-01" },
  { code: "GA", name: "Georgia", law: "SB 351 (2024)", effective: "2025-07-01" },
  { code: "ID", name: "Idaho", law: "H 498 (2024)", effective: "2024-07-01" },
  { code: "IN", name: "Indiana", law: "SEA 17 (2024)", effective: "2024-07-01" },
  { code: "IA", name: "Iowa", law: "HF 864 (2026)", effective: "2026-07-01" },
  { code: "KS", name: "Kansas", law: "SB 394 (2024)", effective: "2024-07-01" },
  { code: "KY", name: "Kentucky", law: "HB 278 (2024), KRS 436.001–.009", effective: "2024-07-15" },
  { code: "LA", name: "Louisiana", law: "HB 142 (2022), Act 440", effective: "2023-01-01" },
  { code: "MS", name: "Mississippi", law: "SB 2346 (2023)", effective: "2023-07-01" },
  { code: "MO", name: "Missouri", law: "AG rule (2025); HB 1839 (2026)", effective: "2025-11-30" },
  { code: "MT", name: "Montana", law: "SB 544 (2023)", effective: "2024-01-01" },
  { code: "NE", name: "Nebraska", law: "LB 1092 (2024)", effective: "2024-07-18" },
  { code: "NC", name: "North Carolina", law: "HB 8 (2023), PAVE Act", effective: "2024-01-01" },
  { code: "ND", name: "North Dakota", law: "HB 1561 / SB 2380 (2025)", effective: "2025-08-01" },
  { code: "OH", name: "Ohio", law: "HB 96 (2025), R.C. 1349.10", effective: "2025-09-30" },
  { code: "OK", name: "Oklahoma", law: "SB 1959 (2024)", effective: "2024-11-01" },
  { code: "SC", name: "South Carolina", law: "H 3424 (2024), Act 198", effective: "2025-01-01" },
  { code: "SD", name: "South Dakota", law: "HB 1053 (2025)", effective: "2025-07-01" },
  { code: "TN", name: "Tennessee", law: "Protect Tennessee Minors Act (2024)", effective: "2025-01-01" },
  { code: "TX", name: "Texas", law: "HB 1181 (2023), upheld in FSC v. Paxton (2025)", effective: "2023-09-01" },
  { code: "UT", name: "Utah", law: "SB 287 (2023); SB 73 (2026)", effective: "2023-05-03" },
  { code: "VA", name: "Virginia", law: "SB 1515 (2023)", effective: "2023-07-01" },
  { code: "WV", name: "West Virginia", law: "HB 4412 (2026)", effective: "2026-06-12" },
  { code: "WY", name: "Wyoming", law: "HB 43 (2025)", effective: "2025-07-01" },
];

export const AV_LAW_STATE_CODES: ReadonlySet<string> = new Set(AV_LAW_STATES.map((s) => s.code));
