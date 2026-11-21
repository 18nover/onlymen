// Browser-local media store (IndexedDB). Images are downscaled before saving so a
// full gallery fits comfortably. Production: replace with signed uploads to
// object storage (Vercel Blob / S3 / R2) + moderation scan, keyed by the same ids.

import { useEffect, useState } from "react";
import { randomId } from "./store.ts";

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

export async function saveImage(file: Blob, max?: number): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 25 * 1024 * 1024) throw new Error("That image is over 25 MB.");
  const blob = await downscale(file, max);
  const id = `img_${randomId(10)}`;
  await tx("readwrite", (s) => s.put(blob, id));
  return id;
}

export async function deleteImage(id: string) {
  const u = urlCache.get(id);
  if (u) URL.revokeObjectURL(u);
  urlCache.delete(id);
  await tx("readwrite", (s) => s.delete(id));
}

export async function imageUrl(id: string): Promise<string | null> {
  if (urlCache.has(id)) return urlCache.get(id)!;
  const blob = await tx<Blob | undefined>("readonly", (s) => s.get(id) as IDBRequest<Blob | undefined>);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(id, url);
  return url;
}

export function useImageUrl(id: string | undefined) {
  const [url, setUrl] = useState<string | null>(id ? (urlCache.get(id) ?? null) : null);
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
