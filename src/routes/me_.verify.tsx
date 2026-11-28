import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, IdCard, Loader2, Lock, ScanFace, ShieldCheck, Upload } from "lucide-react";
import { CheckRow, FormError, GoldButton, SelectField, TextField } from "@/components/account-ui";
import { downscale } from "@/lib/account/media";
import { submitVerificationFn, uploadVerificationFileFn } from "@/lib/verification/api";
import { useIdVerification } from "@/lib/verification/use-verification";
import { FILE_KIND_LABEL, ID_TYPE_LABEL, ID_TYPES, MAX_FILE_BYTES, requiredKinds, type FileKind } from "@/lib/verification/status";

export const Route = createFileRoute("/me_/verify")({
  head: () => ({ meta: [{ title: "Verify your ID — OnlyMen" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: VerifyPage,
});

const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf,.heic,.heif";

/** Photos are re-encoded to JPEG in the browser: smaller, and it drops EXIF/GPS. HEIC/PDF go as-is. */
async function prepare(file: File): Promise<Blob> {
  if (/^image\/(jpeg|png|webp)$/.test(file.type)) {
    try {
      const out = await downscale(file, 2400, 0.88);
      if (out.size <= MAX_FILE_BYTES) return out;
      return await downscale(file, 1800, 0.8);
    } catch {
      return file;
    }
  }
  return file;
}

async function toBase64(b: Blob): Promise<string> {
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

function VerifyPage() {
  const { ready, enabled, me, reload } = useIdVerification();
  const [legalName, setLegalName] = useState("");
  const [dob, setDob] = useState("");
  const [idType, setIdType] = useState("");
  const [idCountry, setIdCountry] = useState("");
  const [attest, setAttest] = useState(false);
  const [busy, setBusy] = useState<FileKind | "submit" | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showManual, setShowManual] = useState(false);

  if (!ready) return <Shell><p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading…</p></Shell>;
  if (!enabled) return <Shell><p className="text-muted">ID verification isn't turned on here yet.</p></Shell>;
  if (!me) return <Shell><p className="text-muted">Log in first.</p></Shell>;
  if (me.accountType !== "creator") return <Shell><p className="text-muted">Only creator accounts verify ID. Members don't need to.</p></Shell>;

  const status = done ? "pending" : me.status;
  if (status === "approved")
    return <Shell><Status icon={<ShieldCheck className="size-5 text-online" />} title="You're verified." body="You can go live and post explicit photos." /></Shell>;
  if (status === "pending")
    return <Shell><Status icon={<ShieldCheck className="size-5 text-gold" />} title="Submitted — in review." body="An admin will review your documents. Until it's approved you can't go live or post explicit photos." /></Shell>;

  // Stripe Identity is the one verification path. The manual document upload is only an admin-approved fallback
  // (revealed after "Stripe didn't work for me"), so beta members never see it by default.
  if (!showManual)
    return (
      <Shell>
        <Status icon={<ScanFace className="size-5 text-gold" />} title="Verify with Stripe." body="Quick ID and selfie check with Stripe. It unlocks going live and explicit photos right away." />
        <a href="/age?next=%2Fme%2Fverify" className="mt-4 inline-grid h-12 place-items-center rounded-full bg-gold px-7 text-sm font-bold text-ink">Verify with Stripe</a>
        <button type="button" onClick={() => setShowManual(true)} className="mt-4 block text-xs text-dim underline underline-offset-4">Stripe didn't work for me</button>
      </Shell>
    );

  // not_started, or rejected (a new attempt starts with the first upload)
  const have = new Set(me.status === "rejected" ? [] : me.files);
  const kinds = requiredKinds(idType || "drivers_license");

  async function upload(kind: FileKind, file: File | undefined) {
    if (!file) return;
    setErr(null);
    setBusy(kind);
    try {
      if (file.size > 25 * 1024 * 1024) throw new Error("That file is over 25 MB.");
      const blob = await prepare(file);
      if (blob.size > MAX_FILE_BYTES) throw new Error("That file is over 4 MB after resizing. Try a smaller photo or PDF.");
      const r = await uploadVerificationFileFn({ data: { kind, base64: await toBase64(blob) } });
      if (!r.ok) throw new Error(r.error);
      await reload();
    } catch (e) {
      setErr((e as Error).message || "Upload failed. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy("submit");
    try {
      const r = await submitVerificationFn({ data: { legalName, dob, idType, idCountry, attest } });
      if (!r.ok) return setErr(r.error);
      setDone(true);
      await reload();
    } catch {
      setErr("Couldn't submit. Try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Shell>
      {me.status === "rejected" && (
        <div className="mb-6 rounded-2xl border border-ruby/50 bg-oxblood/30 p-4 text-sm" role="alert">
          <p className="font-semibold text-ivory">Your last submission was declined.</p>
          {me.rejectReason && <p className="mt-1 text-muted">Reason: {me.rejectReason}</p>}
          <p className="mt-1 text-muted">Upload new documents below to try again.</p>
        </div>
      )}
      <form onSubmit={submit} className="grid gap-6">
        <section className="grid gap-5 rounded-2xl border border-line bg-surface/60 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase"><IdCard className="size-4 text-gold" /> Identity</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Full legal name" autoComplete="name" value={legalName} onChange={(e) => setLegalName(e.target.value)} hint="Exactly as on your ID. Never shown publicly." />
            <TextField label="Date of birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} hint="You must be 18 or older." />
            <SelectField label="ID type" value={idType} onChange={(e) => setIdType(e.target.value)} placeholder="Choose" options={ID_TYPES.map((t) => ({ value: t, label: ID_TYPE_LABEL[t] }))} />
            <TextField label="Issuing country" optional value={idCountry} autoComplete="country-name" onChange={(e) => setIdCountry(e.target.value)} />
          </div>
        </section>
        <section className="grid gap-4 rounded-2xl border border-line bg-surface/60 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase"><Upload className="size-4 text-gold" /> Documents</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {kinds.map((k) => (
              <label key={k} className={`grid min-h-36 cursor-pointer place-items-center gap-2 rounded-2xl border border-dashed p-4 text-center text-sm ${have.has(k) ? "border-online/60 bg-online/5" : "border-gold/40 hover:bg-oxblood/20"}`}>
                {busy === k ? <Loader2 className="size-7 animate-spin text-gold" /> : have.has(k) ? <Check className="size-7 text-online" /> : k === "selfie_with_id" ? <ScanFace className="size-7 text-gold" /> : <IdCard className="size-7 text-gold" />}
                <span className="font-semibold text-ivory">{FILE_KIND_LABEL[k]}</span>
                <span className="text-xs text-dim">{have.has(k) ? "Uploaded — tap to replace" : k === "selfie_with_id" ? "Hold your ID next to your face" : "All four corners visible"}</span>
                <input type="file" accept={ACCEPT} className="sr-only" disabled={busy !== null} onChange={(e) => void upload(k, e.target.files?.[0])} />
              </label>
            ))}
          </div>
          <p className="flex items-center gap-2 text-xs text-dim"><Lock className="size-3.5" /> JPEG, PNG, WebP, HEIC or PDF, up to 4 MB each. Encrypted and stored privately; only our review team can open them. Photo location data (EXIF) is removed.</p>
        </section>
        <CheckRow required checked={attest} onChange={setAttest}>
          I confirm I am at least 18, the ID is mine and genuine, and the details above match it. I understand these records are kept to meet 18 U.S.C. § 2257.
        </CheckRow>
        <FormError>{err}</FormError>
        <GoldButton type="submit" loading={busy === "submit"} disabled={busy !== null}>Submit for review</GoldButton>
      </form>
    </Shell>
  );
}

function Status({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/[0.06] p-5" role="status">
      {icon}
      <div>
        <p className="font-semibold text-ivory">{title}</p>
        <p className="mt-1 text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid max-w-3xl gap-6 px-5 py-10 text-ivory">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Creator verification</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Verify your ID</h1>
          <p className="mt-2 text-sm text-muted">Required before you go live or post explicit photos.</p>
        </div>
        <Link to="/me" className="text-sm font-semibold text-gold-hi underline-offset-4 hover:underline">Back to my profile</Link>
      </header>
      {children}
    </main>
  );
}
