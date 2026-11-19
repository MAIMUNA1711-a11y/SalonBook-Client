"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";
import type { Service } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import { PageTitle } from "./ui";

export default function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const [f, setF] = useState({
    serviceName: initial?.serviceName || "",
    category: initial?.category || CATEGORIES[0],
    description: initial?.description || "",
    price: initial ? String(initial.price) : "",
    duration: initial ? String(initial.duration) : "",
    image: initial?.image || "",
    status: initial?.status || "active",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.serviceName.trim()) return toast.error("Service name is required");
    if (!f.description.trim()) return toast.error("Description is required");
    if (!(Number(f.price) > 0)) return toast.error("Price must be a positive number");
    if (!(Number(f.duration) > 0)) return toast.error("Duration must be a positive number");
    if (!f.image) return toast.error("Please upload a service image");
    setBusy(true);
    try {
      const body = { ...f, price: Number(f.price), duration: Number(f.duration) };
      if (initial) await api(`/services/${initial._id}`, { method: "PUT", body });
      else await api("/services", { method: "POST", body });
      toast.success(initial ? "Service updated" : "Service created");
      router.push("/dashboard/admin/services");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save service");
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageTitle title={initial ? "Update service" : "Add service"} />
      <form onSubmit={submit} className="card max-w-2xl space-y-4 p-6">
        <div><label className="label" htmlFor="sn">Service name</label><input id="sn" className="input" value={f.serviceName} onChange={(e) => set("serviceName", e.target.value)} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="cat">Category</label><select id="cat" className="input" value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
          <div><label className="label" htmlFor="st">Status</label><select id="st" className="input" value={f.status} onChange={(e) => set("status", e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          <div><label className="label" htmlFor="pr">Price (USD)</label><input id="pr" type="number" min="0.01" step="0.01" className="input" value={f.price} onChange={(e) => set("price", e.target.value)} /></div>
          <div><label className="label" htmlFor="du">Estimated duration (minutes)</label><input id="du" type="number" min="1" step="1" className="input" value={f.duration} onChange={(e) => set("duration", e.target.value)} /></div>
        </div>
        <div><label className="label" htmlFor="ds">Description</label><textarea id="ds" rows={4} className="input" value={f.description} onChange={(e) => set("description", e.target.value)} /></div>
        <ImageUploader label="Service image (upload)" value={f.image} onChange={(u) => set("image", u)} />
        <div className="flex gap-3">
          <button className="btn-primary" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} {initial ? "Update service" : "Create service"}</button>
          <button type="button" className="btn-outline" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </>
  );
}
