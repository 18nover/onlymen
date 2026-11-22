/**
 * Private storage for ID documents. Never public: no public bucket, no public
 * URLs, no r2.dev domain. Admins see files only through the authenticated
 * streaming route /api/kyc/file/$id.
 *
 * Every file is AES-256-GCM encrypted before it is stored (key: Worker secret
 * ONLYMEN_KYC_ENC_KEY, 32 bytes base64). Missing key → uploads refused.
 *
 * Backend:
 *  - R2 binding KYC_BUCKET (wrangler.jsonc r2_buckets) when present — preferred.
 *  - Otherwise encrypted bytes in om_verification_blob (Neon). Used today
 *    because R2 is not enabled on the Cloudflare account yet.
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { platformBinding, platformEnv } from "../platform/runtime.ts";
import type { Sql } from "../db";

export const ENC_SCHEME = "aes-256-gcm:v1";

type R2Like = {
  put(key: string, value: ArrayBuffer | Uint8Array, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
};

export interface FileStore {
  readonly kind: "r2" | "db";
  put(key: string, data: Uint8Array): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  delete(key: string): Promise<void>;
}

export function encKey(): Buffer | null {
  const raw = platformEnv("ONLYMEN_KYC_ENC_KEY");
  if (!raw) return null;
  const k = Buffer.from(raw, "base64");
  return k.length === 32 ? k : null;
}

/** iv(12) | tag(16) | ciphertext. `aad` binds the blob to its storage key. */
export function encrypt(key: Buffer, plain: Uint8Array, aad: string): Uint8Array {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  c.setAAD(Buffer.from(aad));
  const body = Buffer.concat([c.update(plain), c.final()]);
  return new Uint8Array(Buffer.concat([iv, c.getAuthTag(), body]));
}

export function decrypt(key: Buffer, blob: Uint8Array, aad: string): Uint8Array {
  const b = Buffer.from(blob);
  const d = createDecipheriv("aes-256-gcm", key, b.subarray(0, 12));
  d.setAAD(Buffer.from(aad));
  d.setAuthTag(b.subarray(12, 28));
  return new Uint8Array(Buffer.concat([d.update(b.subarray(28)), d.final()]));
}

export function fileStore(db: Sql): FileStore {
  const bucket = platformBinding<R2Like>("KYC_BUCKET");
  if (bucket) {
    return {
      kind: "r2",
      async put(key, data) {
        await bucket.put(key, data, { httpMetadata: { contentType: "application/octet-stream" } });
      },
      async get(key) {
        const o = await bucket.get(key);
        return o ? new Uint8Array(await o.arrayBuffer()) : null;
      },
      async delete(key) {
        await bucket.delete(key);
      },
    };
  }
  return {
    kind: "db",
    async put(key, data) {
      await db`insert into om_verification_blob (key, data) values (${key}, ${Buffer.from(data)}) on conflict (key) do update set data = excluded.data`;
    },
    async get(key) {
      const r = await db<{ data: Buffer }>`select data from om_verification_blob where key = ${key}`;
      return r[0] ? new Uint8Array(r[0].data) : null;
    },
    async delete(key) {
      await db`delete from om_verification_blob where key = ${key}`;
    },
  };
}
