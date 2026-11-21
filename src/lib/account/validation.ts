// Pure validation helpers (no DOM), unit-tested in validation.test.ts.

export const MIN_AGE = 18;

const RESERVED = new Set(["admin", "support", "onlymen", "18nover", "help", "root", "staff", "moderator", "official", "me", "login", "join"]);

export function ageOn(dob: string, today: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const birth = new Date(Date.UTC(y, mo - 1, d));
  if (birth.getUTCFullYear() !== y || birth.getUTCMonth() !== mo - 1 || birth.getUTCDate() !== d) return null;
  let age = today.getUTCFullYear() - y;
  const beforeBirthday = today.getUTCMonth() < mo - 1 || (today.getUTCMonth() === mo - 1 && today.getUTCDate() < d);
  if (beforeBirthday) age -= 1;
  return age;
}

export function validateDob(dob: string, today: Date = new Date()): string | null {
  if (!dob) return "Enter your date of birth.";
  const age = ageOn(dob, today);
  if (age === null) return "Enter a real date.";
  if (age < 0 || age > 120) return "Enter a real date.";
  if (age < MIN_AGE) return "You must be 18 or older to join OnlyMen.";
  return null;
}

/** Latest DOB that is still 18+ today, as YYYY-MM-DD (for the date input max). */
export function maxDob(today: Date = new Date()): string {
  const d = new Date(Date.UTC(today.getUTCFullYear() - MIN_AGE, today.getUTCMonth(), today.getUTCDate()));
  return d.toISOString().slice(0, 10);
}

export function validateEmail(email: string): string | null {
  const e = email.trim();
  if (!e) return "Enter your email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return "That email doesn't look right.";
  return null;
}

export function normalizeUsername(u: string) {
  return u.trim().replace(/^@/, "").toLowerCase();
}

export function validateUsername(u: string): string | null {
  const n = normalizeUsername(u);
  if (!n) return "Pick a username.";
  if (n.length < 3) return "At least 3 characters.";
  if (n.length > 20) return "20 characters max.";
  if (!/^[a-z0-9._]+$/.test(n)) return "Letters, numbers, dots and underscores only.";
  if (/^[._]|[._]$/.test(n) || /[._]{2}/.test(n)) return "Dots and underscores can't start, end or repeat.";
  if (RESERVED.has(n)) return "That username is reserved.";
  return null;
}

export type PasswordStrength = { score: 0 | 1 | 2 | 3 | 4; label: string };

export function passwordStrength(p: string): PasswordStrength {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p) && /[^A-Za-z0-9]/.test(p)) s++;
  const score = Math.min(4, s) as PasswordStrength["score"];
  return { score, label: ["Too weak", "Weak", "Okay", "Strong", "Very strong"][score] };
}

export function validatePassword(p: string): string | null {
  if (!p) return "Create a password.";
  if (p.length < 8) return "At least 8 characters.";
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return "Use letters and at least one number.";
  return null;
}

export function validatePhone(p: string): string | null {
  const digits = p.replace(/[^\d]/g, "");
  if (digits.length < 10 || digits.length > 15) return "Enter a mobile number with area code.";
  return null;
}
