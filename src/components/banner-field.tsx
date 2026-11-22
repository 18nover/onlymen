import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { removeBanner, saveBanner, useImageUrl } from "@/lib/account/media";

/** Upload, replace, or remove the profile banner (cover photo). */
export function BannerField({
  bannerPhotoId,
  onChange,
  compact = false,
}: {
  bannerPhotoId?: string;
  onChange: (id: string | undefined) => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const url = useImageUrl(bannerPhotoId);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pick(files: FileList | File[] | null) {
    const file = files && Array.from(files).find((f) => f.type.startsWith("image/"));
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const id = await saveBanner(file);
      onChange(id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't add that image.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function clear() {
    setErr(null);
    setBusy(true);
    try {
      await removeBanner(bannerPhotoId);
      onChange(undefined);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't remove the banner.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="sr-only" onChange={(e) => pick(e.target.files)} />
      <div
        className={`relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-r from-oxblood/70 via-ink to-night ${compact ? "aspect-[3/1]" : "aspect-[16/5]"}`}
      >
        {url ? (
          <img src={url} alt="Profile banner" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,106,0.18),transparent_55%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-gold px-4 text-xs font-bold text-ink disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
            {bannerPhotoId ? "Replace banner" : "Add a banner"}
          </button>
          {bannerPhotoId && (
            <button
              type="button"
              disabled={busy}
              onClick={clear}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-ink/70 px-4 text-xs font-semibold text-ivory backdrop-blur disabled:opacity-60"
            >
              <Trash2 className="size-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-dim">A wide cover photo for your profile. JPEG, PNG or WebP, shown above your gallery.</p>
      {err && <p role="alert" className="mt-2 text-xs font-semibold text-ruby">{err}</p>}
    </div>
  );
}

/** Read-only cover used on public / own profiles when a banner exists. */
export function ProfileBanner({ id, name }: { id: string; name: string }) {
  const url = useImageUrl(id);
  return (
    <div className="relative aspect-[16/5] overflow-hidden rounded-3xl border border-gold/35 bg-night">
      {url ? (
        <img src={url} alt={`${name} banner`} className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-surface-2" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/20" />
    </div>
  );
}
