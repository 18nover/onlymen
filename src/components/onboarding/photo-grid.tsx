import { useRef, useState, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, Flame, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { deleteImage, saveImage, useImageUrl } from "@/lib/account/media";
import { MAX_PHOTOS } from "@/lib/account/constants";
import type { Photo } from "@/lib/account/types";

/** Photo-first uploader: drop/choose, drag to reorder, pick a primary. */
export function PhotoGrid({ photos, onChange, creator }: { photos: Photo[]; onChange: (p: Photo[]) => void; creator?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [over, setOver] = useState(false);

  const normalize = (list: Photo[]) => {
    if (list.length && !list.some((p) => p.primary)) list = list.map((p, i) => ({ ...p, primary: i === 0 }));
    // primary always first
    return [...list].sort((a, b) => Number(b.primary) - Number(a.primary));
  };

  async function add(files: FileList | File[]) {
    setErr(null);
    const room = MAX_PHOTOS - photos.length;
    const list = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (!list.length) return setErr(room <= 0 ? `You can add up to ${MAX_PHOTOS} photos.` : "Choose JPG, PNG, WEBP or HEIC images.");
    setBusy(list.length);
    const added: Photo[] = [];
    for (const f of list) {
      try {
        const id = await saveImage(f);
        added.push({ id, primary: false, addedAt: new Date().toISOString() });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Couldn't add that image.");
      }
      setBusy((b) => b - 1);
    }
    onChange(normalize([...photos, ...added]));
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length || from === to) return;
    const next = [...photos];
    const [p] = next.splice(from, 1);
    next.splice(to, 0, p);
    // first slot is always the primary photo
    onChange(next.map((x, i) => ({ ...x, primary: i === 0 })));
  }

  const makePrimary = (i: number) => move(i, 0);
  const remove = (i: number) => {
    deleteImage(photos[i].id).catch(() => {});
    onChange(normalize(photos.filter((_, k) => k !== i).map((p) => ({ ...p, primary: false }))));
  };
  const toggleExplicit = (i: number) => onChange(photos.map((p, k) => (k === i ? { ...p, explicit: !p.explicit } : p)));

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files?.length) add(e.dataTransfer.files);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {photos.map((p, i) => (
          <Tile
            key={p.id}
            photo={p}
            index={i}
            count={photos.length}
            creator={creator}
            dragging={dragIdx === i}
            onDragStart={() => setDragIdx(i)}
            onDragEnd={() => setDragIdx(null)}
            onDropOn={() => dragIdx !== null && move(dragIdx, i)}
            onPrimary={() => makePrimary(i)}
            onLeft={() => move(i, i - 1)}
            onRight={() => move(i, i + 1)}
            onRemove={() => remove(i)}
            onExplicit={() => toggleExplicit(i)}
          />
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={`b${i}`} className="grid aspect-[4/5] place-items-center rounded-xl border border-line bg-surface/60">
            <Loader2 className="size-6 animate-spin text-gold" />
          </div>
        ))}
        {photos.length + busy < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={onDrop}
            className={`group flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition ${over ? "border-gold bg-gold/10" : "border-gold/35 bg-surface/40 hover:border-gold/70 hover:bg-gold/[0.05]"} ${photos.length === 0 ? "col-span-full aspect-[4/3] sm:aspect-[21/9]" : ""}`}
          >
            <span className="grid size-12 place-items-center rounded-full border-gold-grad">
              <ImagePlus className="size-5 text-gold-hi" />
            </span>
            <span className="px-2 text-sm font-semibold text-ivory">{photos.length ? "Add more" : "Add your photos"}</span>
            {photos.length === 0 && <span className="px-4 text-xs text-dim">Drop images here or tap to choose · up to {MAX_PHOTOS}</span>}
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label="Upload photos"
        data-testid="photo-input"
        onChange={(e) => {
          if (e.target.files) add(e.target.files);
          e.target.value = "";
        }}
      />
      {err && <p role="alert" className="mt-3 text-xs font-semibold text-ruby">{err}</p>}
      {photos.length > 1 && <p className="mt-3 text-xs text-dim">Drag to reorder, or use the arrows. Your first photo is your profile photo.</p>}
    </div>
  );
}

function Tile(props: {
  photo: Photo;
  index: number;
  count: number;
  creator?: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropOn: () => void;
  onPrimary: () => void;
  onLeft: () => void;
  onRight: () => void;
  onRemove: () => void;
  onExplicit: () => void;
}) {
  const { photo, index, count } = props;
  const url = useImageUrl(photo.id);
  const btn = "grid size-8 place-items-center rounded-full bg-ink/75 text-ivory backdrop-blur transition hover:bg-ink hover:text-gold-hi disabled:opacity-30";
  return (
    <div
      draggable
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        props.onDropOn();
      }}
      className={`group relative aspect-[4/5] overflow-hidden rounded-xl bg-surface transition ${photo.primary ? "border-gold-grad glow-gold" : "border border-line"} ${props.dragging ? "scale-95 opacity-50" : ""}`}
    >
      {url && <img src={url} alt={photo.primary ? "Your profile photo" : `Gallery photo ${index + 1}`} className={`size-full cursor-grab object-cover ${photo.explicit ? "blur-md" : ""}`} draggable={false} />}
      <div className="absolute inset-0 tile-shade opacity-80" />
      {photo.primary ? (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold tracking-[0.14em] uppercase">
          <Star className="size-3 fill-current" /> Profile
        </span>
      ) : (
        <button type="button" onClick={props.onPrimary} className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full border border-gold/50 bg-ink/70 px-2 py-0.5 text-[10px] font-bold tracking-wider text-gold-hi uppercase backdrop-blur" aria-label={`Make photo ${index + 1} your profile photo`}>
          <Star className="size-3" /> <span className="hidden sm:inline">Set main</span>
        </button>
      )}
      <button type="button" onClick={props.onRemove} className={`${btn} absolute top-2 right-2`} aria-label={`Remove photo ${index + 1}`}>
        <Trash2 className="size-3.5" />
      </button>
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-1">
        <button type="button" onClick={props.onLeft} disabled={index === 0} className={btn} aria-label="Move earlier">
          <ArrowLeft className="size-3.5" />
        </button>
        {props.creator && (
          <button
            type="button"
            onClick={props.onExplicit}
            aria-pressed={!!photo.explicit}
            className={`inline-flex h-8 items-center gap-1 rounded-full px-2 text-[10px] font-bold tracking-wider uppercase backdrop-blur ${photo.explicit ? "bg-ruby text-ivory" : "bg-ink/70 text-muted"}`}
            title="Mark as explicit (blurred for people who opt in)"
          >
            <Flame className="size-3" /> 18+
          </button>
        )}
        <button type="button" onClick={props.onRight} disabled={index === count - 1} className={btn} aria-label="Move later">
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Single-image upload slot (ID, selfie). */
export function UploadSlot({ label, hint, mediaId, onChange, capture, icon }: {
  label: string;
  hint: string;
  mediaId?: string;
  onChange: (id: string | undefined) => void;
  capture?: "user" | "environment";
  icon: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const url = useImageUrl(mediaId);
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid gap-2">
      <p className="text-sm font-semibold text-ivory">{label}</p>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`relative grid aspect-[3/2] place-items-center overflow-hidden rounded-xl border-2 border-dashed transition ${mediaId ? "border-gold/60" : "border-line hover:border-gold/50"} bg-surface/50`}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin text-gold" />
        ) : url ? (
          <>
            <img src={url} alt={`${label} uploaded`} className="size-full object-cover blur-sm" />
            <span className="absolute inset-0 grid place-items-center bg-ink/50 text-xs font-bold tracking-wider text-gold-hi uppercase">Uploaded · tap to replace</span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-3 text-center text-dim">
            <span className="text-gold">{icon}</span>
            <span className="text-xs">{hint}</span>
          </span>
        )}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture={capture}
        className="sr-only"
        aria-label={label}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          setBusy(true);
          try {
            if (mediaId) await deleteImage(mediaId).catch(() => {});
            onChange(await saveImage(f, 1600));
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
