"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, ImagePlus } from "lucide-react";
import { uploadImage } from "@/lib/api";

export default function ImageUploader({ value, onChange, allowUrl = false, label = "Image" }: {
  value: string; onChange: (url: string) => void; allowUrl?: boolean; label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">("upload");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be 5MB or smaller");
    setBusy(true);
    try {
      onChange(await uploadImage(file));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="label mb-0">{label}</span>
        {allowUrl && (
          <button type="button" className="text-xs font-medium text-petal-dark" onClick={() => setMode(mode === "upload" ? "url" : "upload")}>
            {mode === "upload" ? "Use image URL" : "Upload instead"}
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-plum/30 bg-mist">
          {value ? <img src={value} alt="Preview" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-plum/40" />}
        </div>
        {mode === "upload" ? (
          <div>
            <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} className="hidden" id="img-up" />
            <button type="button" className="btn-outline btn-sm" disabled={busy} onClick={() => ref.current?.click()}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {busy ? "Uploading..." : value ? "Change image" : "Choose image"}
            </button>
            <p className="mt-1 text-xs text-ink/50">PNG, JPG, WEBP or GIF, up to 5MB</p>
          </div>
        ) : (
          <input className="input" placeholder="https://..." value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    </div>
  );
}
