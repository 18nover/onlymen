// Pluggable account storage.
//
// PRODUCTION: `ServerAccountStore` — accounts, sessions and profile data live in
// Postgres (Neon) behind server functions (./api.ts); passwords are hashed on the
// server by Better Auth (./auth.server.ts). See docs/ACCOUNTS.md.
//
// DEV FALLBACK: `LocalAccountStore` keeps accounts in this browser's localStorage
// (photos in IndexedDB, see media.ts). Used only when the server reports that no
// DATABASE_URL is configured.
//
// The UI only talks to `accountStore` (a facade that picks the adapter at startup).

import { CONSENT_VERSIONS, defaultPermissions, defaultPrivacy, emptyCreator, emptyProfile } from "./constants.ts";
import type { Account, AccountType, ConsentKey, ConsentRecord, PublicAccount } from "./types.ts";
import { normalizeUsername } from "./validation.ts";
import * as api from "./api.ts";

export type SignUpInput = { email: string; username: string; password: string; dob: string; type: AccountType; inviteCode?: string };

export class AccountError extends Error {
  constructor(
    message: string,
    public field?: "email" | "username" | "password" | "token",
  ) {
    super(message);
  }
}

export interface AccountStore {
  readonly kind: "local" | "server";
  /** False until the adapter knows whether someone is signed in. */
  loaded(): boolean;
  signUp(input: SignUpInput): Promise<PublicAccount>;
  logIn(identifier: string, password: string): Promise<PublicAccount>;
  logOut(): Promise<void>;
  current(): PublicAccount | null;
  update(patch: (a: PublicAccount) => PublicAccount): Promise<PublicAccount>;
  isUsernameTaken(username: string): Promise<boolean>;
  /** Returns a reset token. A server adapter emails it instead of returning it. */
  requestPasswordReset(email: string): Promise<string | null>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  subscribe(fn: () => void): () => void;
}

// ---------------------------------------------------------------- crypto helpers

const enc = new TextEncoder();
const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (hex: string) => new Uint8Array(hex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));

export function randomId(bytes = 16) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return toHex(a);
}

const ITERATIONS = 210_000;

export async function hashPassword(password: string, saltHex = randomId(16), iterations = ITERATIONS) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations }, key, 256);
  return { algo: "pbkdf2-sha256" as const, iterations, salt: saltHex, hash: toHex(bits) };
}

async function verifyPassword(password: string, stored: Account["password"]) {
  const { hash } = await hashPassword(password, stored.salt, stored.iterations);
  // constant-time-ish compare
  let diff = hash.length ^ stored.hash.length;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ stored.hash.charCodeAt(i % stored.hash.length);
  return diff === 0;
}

export function consentRecord(key: ConsentKey, granted: boolean, source: string): ConsentRecord {
  return {
    key,
    granted,
    version: CONSENT_VERSIONS[key],
    at: new Date().toISOString(),
    source,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
}

/** Latest answer per consent key (the log itself is append-only). */
export function latestConsents(records: ConsentRecord[]) {
  const out: Partial<Record<ConsentKey, ConsentRecord>> = {};
  for (const r of records) out[r.key] = r;
  return out;
}

const strip = ({ password: _pw, ...rest }: Account): PublicAccount => rest;

// ---------------------------------------------------------------- local adapter

const ACCOUNTS_KEY = "onlymen-accounts-v1";
const SESSION_KEY = "onlymen-session-v1";
const RESETS_KEY = "onlymen-resets-v1";
const EVENT = "onlymen-account";

type Db = Record<string, Account>;

class LocalAccountStore implements AccountStore {
  readonly kind = "local" as const;
  loaded() {
    return true;
  }
  private cache: { raw: string | null; session: string | null; value: PublicAccount | null } = { raw: null, session: null, value: null };

  private get ok() {
    return typeof window !== "undefined" && !!window.localStorage;
  }
  private read(): Db {
    if (!this.ok) return {};
    try {
      return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "{}") as Db;
    } catch {
      return {};
    }
  }
  private write(db: Db) {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(db));
    window.dispatchEvent(new Event(EVENT));
  }
  private setSession(id: string | null) {
    if (id) window.localStorage.setItem(SESSION_KEY, id);
    else window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event(EVENT));
  }

  current(): PublicAccount | null {
    if (!this.ok) return null;
    const session = window.localStorage.getItem(SESSION_KEY);
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (raw === this.cache.raw && session === this.cache.session) return this.cache.value;
    const acc = session ? this.read()[session] : undefined;
    this.cache = { raw, session, value: acc ? strip(acc) : null };
    return this.cache.value;
  }

  async isUsernameTaken(username: string) {
    const n = normalizeUsername(username);
    return Object.values(this.read()).some((a) => a.username === n);
  }

  async signUp(input: SignUpInput) {
    const db = this.read();
    const email = input.email.trim().toLowerCase();
    const username = normalizeUsername(input.username);
    if (Object.values(db).some((a) => a.email === email)) throw new AccountError("An account with this email already exists. Log in instead.", "email");
    if (Object.values(db).some((a) => a.username === username)) throw new AccountError("That username is taken.", "username");
    const now = new Date().toISOString();
    const acc: Account = {
      id: randomId(12),
      email,
      username,
      dob: input.dob,
      type: input.type,
      createdAt: now,
      updatedAt: now,
      password: await hashPassword(input.password),
      emailVerified: false,
      // the DOB check at sign-up is itself an age attestation; recorded for audit
      consents: [consentRecord("age18", true, "signup:dob")],
      permissions: defaultPermissions(),
      profile: { ...emptyProfile(), displayName: input.username.trim().replace(/^@/, "") },
      privacy: defaultPrivacy(),
      creator: input.type === "creator" ? emptyCreator() : undefined,
      onboarding: { current: "consents", completed: [], skipped: [] },
    };
    db[acc.id] = acc;
    this.write(db);
    this.setSession(acc.id);
    return strip(acc);
  }

  async logIn(identifier: string, password: string) {
    const id = identifier.trim().toLowerCase().replace(/^@/, "");
    const acc = Object.values(this.read()).find((a) => a.email === id || a.username === id);
    if (!acc || !(await verifyPassword(password, acc.password))) throw new AccountError("That email/username and password don't match.", "password");
    this.setSession(acc.id);
    return strip(acc);
  }

  async logOut() {
    this.setSession(null);
  }

  async update(patch: (a: PublicAccount) => PublicAccount) {
    const cur = this.current();
    if (!cur) throw new AccountError("You're signed out.");
    const db = this.read();
    const next = patch(cur);
    db[cur.id] = { ...db[cur.id], ...next, id: cur.id, password: db[cur.id].password, updatedAt: new Date().toISOString() };
    this.write(db);
    return strip(db[cur.id]);
  }

  async requestPasswordReset(email: string) {
    const acc = Object.values(this.read()).find((a) => a.email === email.trim().toLowerCase());
    if (!acc) return null;
    const token = randomId(20);
    const resets = JSON.parse(window.localStorage.getItem(RESETS_KEY) || "{}") as Record<string, { id: string; exp: number }>;
    resets[token] = { id: acc.id, exp: Date.now() + 60 * 60 * 1000 };
    window.localStorage.setItem(RESETS_KEY, JSON.stringify(resets));
    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const resets = JSON.parse(window.localStorage.getItem(RESETS_KEY) || "{}") as Record<string, { id: string; exp: number }>;
    const r = resets[token];
    if (!r || r.exp < Date.now()) throw new AccountError("This reset link has expired. Request a new one.", "token");
    const db = this.read();
    if (!db[r.id]) throw new AccountError("Account not found.", "token");
    db[r.id] = { ...db[r.id], password: await hashPassword(newPassword), updatedAt: new Date().toISOString() };
    delete resets[token];
    window.localStorage.setItem(RESETS_KEY, JSON.stringify(resets));
    this.write(db);
    this.setSession(r.id);
  }

  subscribe(fn: () => void) {
    if (typeof window === "undefined") return () => {};
    const onStorage = (e: StorageEvent) => (e.key === ACCOUNTS_KEY || e.key === SESSION_KEY) && fn();
    window.addEventListener(EVENT, fn);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, fn);
      window.removeEventListener("storage", onStorage);
    };
  }
}

// ---------------------------------------------------------------- server adapter

const unwrap = <T,>(r: api.ApiResult<T>): T => {
  if (!r.ok) throw new AccountError(r.error, r.field);
  return r.value;
};

class ServerAccountStore implements AccountStore {
  readonly kind = "server" as const;
  private value: PublicAccount | null;
  private listeners = new Set<() => void>();
  private chain: Promise<unknown> = Promise.resolve();

  constructor(initial: PublicAccount | null) {
    this.value = initial;
  }
  private set(v: PublicAccount | null) {
    this.value = v;
    this.listeners.forEach((fn) => fn());
  }
  loaded() {
    return true;
  }
  current() {
    return this.value;
  }
  async refresh() {
    const s = await api.accountStatus();
    this.set(s.account);
  }
  async signUp(input: SignUpInput) {
    const acc = unwrap(await api.signUpFn({ data: input }));
    this.set(acc);
    return acc;
  }
  async logIn(identifier: string, password: string) {
    const acc = unwrap(await api.logInFn({ data: { identifier, password } }));
    this.set(acc);
    return acc;
  }
  async logOut() {
    await api.logOutFn().catch(() => {});
    this.set(null);
  }
  update(patch: (a: PublicAccount) => PublicAccount): Promise<PublicAccount> {
    const cur = this.value;
    if (!cur) return Promise.reject(new AccountError("You're signed out."));
    // Optimistic: the UI updates now; saves are serialized so the last write wins.
    const next = { ...patch(cur), updatedAt: new Date().toISOString() };
    this.set(next);
    const run = this.chain.then(async () => {
      const saved = unwrap(await api.saveAccountFn({ data: this.value ?? next }));
      // Only adopt the server copy if nothing newer happened meanwhile.
      if (this.value && this.value.updatedAt === next.updatedAt) this.set({ ...saved, updatedAt: next.updatedAt });
      return saved;
    });
    this.chain = run.catch(() => {});
    return run.then(() => this.value ?? next);
  }
  async isUsernameTaken(username: string) {
    return api.usernameTakenFn({ data: { username } });
  }
  async requestPasswordReset(email: string) {
    await api.requestResetFn({ data: { email } });
    return null;
  }
  async resetPassword(token: string, newPassword: string) {
    const r = unwrap(await api.resetPasswordFn({ data: { token, password: newPassword } }));
    if (r.signedIn) await this.refresh();
    else throw new AccountError("Password updated. Log in with your new password.", "token");
  }
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

// ---------------------------------------------------------------- facade

/**
 * Picks the adapter once at startup: the server tells us whether a database is
 * configured. Until then `loaded()` is false and nobody is signed in.
 */
class AccountStoreFacade implements AccountStore {
  private impl: AccountStore | null = null;
  private listeners = new Set<() => void>();
  private unsub: (() => void) | null = null;
  private starting: Promise<AccountStore> | null = null;

  get kind() {
    return this.impl?.kind ?? "server";
  }
  private start(): Promise<AccountStore> {
    if (typeof window === "undefined") return Promise.reject(new Error("Accounts are client-side only."));
    this.starting ??= api
      .accountStatus()
      .then((s) => (s.server ? new ServerAccountStore(s.account) : new LocalAccountStore()))
      .catch((e) => {
        console.error("[accounts] status check failed", e);
        this.starting = null;
        return new ServerAccountStore(null);
      })
      .then((impl) => {
        this.impl = impl;
        this.unsub?.();
        this.unsub = impl.subscribe(() => this.emit());
        this.emit();
        return impl;
      });
    return this.starting;
  }
  private emit() {
    this.listeners.forEach((fn) => fn());
  }
  private async use() {
    return this.impl ?? this.start();
  }
  loaded() {
    if (!this.impl && typeof window !== "undefined") void this.start();
    return !!this.impl?.loaded();
  }
  current() {
    return this.impl?.current() ?? null;
  }
  async signUp(input: SignUpInput) {
    return (await this.use()).signUp(input);
  }
  async logIn(identifier: string, password: string) {
    return (await this.use()).logIn(identifier, password);
  }
  async logOut() {
    return (await this.use()).logOut();
  }
  async update(patch: (a: PublicAccount) => PublicAccount) {
    return (await this.use()).update(patch);
  }
  async isUsernameTaken(username: string) {
    return (await this.use()).isUsernameTaken(username);
  }
  async requestPasswordReset(email: string) {
    return (await this.use()).requestPasswordReset(email);
  }
  async resetPassword(token: string, newPassword: string) {
    return (await this.use()).resetPassword(token, newPassword);
  }
  subscribe(fn: () => void) {
    this.listeners.add(fn);
    if (typeof window !== "undefined") void this.start();
    return () => this.listeners.delete(fn);
  }
}

/** The single store the UI uses. */
export const accountStore = new AccountStoreFacade();
