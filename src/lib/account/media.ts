// Media store. Images are downscaled in the browser before saving.
//
// - Profile photos: with server accounts they're uploaded to the server (stored in
//   Postgres for now, served from /api/photo/<id>; ids start with "ph_").
// - Private images (ID documents) and everything in the local dev fallback stay in
//   this browser's IndexedDB and never leave the device.
// Next step: object storage (Vercel Blob / S3 / R2) + a moderation scan.

import { useEffect, useState } from "react";
import { accountStore, randomId } from "./store.ts";
import { deletePhotoFn, uploadPhotoFn } from "./api.ts";

const isServerPhoto = (id: string) => id.startsWith("ph_");
const serverUrl = (id: string) => `/api/photo/${id}`;

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

const DB = "onlymen-media";
const STORE = "blobs";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const r = fn(db.transaction(STORE, mode).objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

const urlCache = new Map<string, string>();

export async function downscale(file: Blob, max = 1280, quality = 0.84): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), "image/jpeg", quality));
}

export async function saveImage(file: Blob, max?: number, opts: { private?: boolean } = {}): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 25 * 1024 * 1024) throw new Error("That image is over 25 MB.");
  const blob = await downscale(file, max);
  if (!opts.private && accountStore.kind === "server" && accountStore.current()) {
    let upload = blob;
    if (upload.size > 650_000) upload = await downscale(file, 1080, 0.78);
    const r = await uploadPhotoFn({ data: { mime: upload.type || "image/jpeg", base64: await toBase64(upload) } });
    if (!r.ok) throw new Error(r.error);
    return r.value;
  }
  const id = `img_${randomId(10)}`;
  await tx("readwrite", (s) => s.put(blob, id));
  return id;
}

export async function deleteImage(id: string) {
  if (isServerPhoto(id)) {
    await deletePhotoFn({ data: { id } });
    return;
  }
  const u = urlCache.get(id);
  if (u) URL.revokeObjectURL(u);
  urlCache.delete(id);
  await tx("readwrite", (s) => s.delete(id));
}

export async function imageUrl(id: string): Promise<string | null> {
  if (isServerPhoto(id)) return serverUrl(id);
  if (urlCache.has(id)) return urlCache.get(id)!;
  const blob = await tx<Blob | undefined>("readonly", (s) => s.get(id) as IDBRequest<Blob | undefined>);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  return url;
}

export function useImageUrl(id: string | undefined) {
  const [url, setUrl] = useState<string | null>(id ? (isServerPhoto(id) ? serverUrl(id) : (urlCache.get(id) ?? null)) : null);
  useEffect(() => {
    let live = true;
    if (!id) return setUrl(null);
    imageUrl(id).then((u) => live && setUrl(u)).catch(() => live && setUrl(null));
    return () => {
      live = false;
    };
  }, [id]);
  return url;
}
