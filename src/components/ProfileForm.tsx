"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthProvider";
import ImageUploader from "./ImageUploader";
import { PageTitle } from "./ui";

export default function ProfileForm() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [image, setImage] = useState(user?.image || "");
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/users/me", { method: "PATCH", body: { name, phone, image } });
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageTitle title="My profile" sub="Update your personal details." />
      <form onSubmit={save} className="card max-w-xl space-y-4 p-6">
        <ImageUploader label="Profile image" value={image} onChange={setImage} allowUrl />
        <div><label className="label" htmlFor="n">Full name</label><input id="n" className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label className="label" htmlFor="e">Email</label><input id="e" className="input bg-mist" value={user?.email || ""} disabled /></div>
        <div><label className="label" htmlFor="p">Phone</label><input id="p" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1XXX-XXXXXX" /></div>
        <p className="text-xs text-ink/50">Role: <b className="capitalize">{user?.role}</b>. Your role and account status cannot be changed here.</p>
        <button className="btn-primary" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</button>
      </form>
    </>
  );
}
