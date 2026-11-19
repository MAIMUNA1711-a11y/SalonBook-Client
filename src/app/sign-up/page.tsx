"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/AuthProvider";
import { GoogleButton } from "@/components/GoogleButton";
import ImageUploader from "@/components/ImageUploader";
import { PASSWORD_RULE } from "@/lib/utils";

export default function SignUp() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", image: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (form.name.trim().length < 2) err.name = "Please enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Enter a valid email address";
    if (!PASSWORD_RULE.test(form.password)) err.password = "At least 6 characters with one uppercase and one lowercase letter";
    setErrors(err);
    if (Object.keys(err).length) return toast.error("Please fix the highlighted fields");

    setBusy(true);
    const { error } = await authClient.signUp.email({ name: form.name.trim(), email: form.email, password: form.password, image: form.image || undefined });
    if (error) {
      setBusy(false);
      return toast.error(error.message || "Could not create account");
    }
    await refresh();
    toast.success("Account created. Welcome to SalonBook!");
    router.replace("/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <h1 className="text-center text-5xl font-semibold">Create account</h1>
      <p className="mt-2 text-center text-sm text-ink/60">Book your first appointment in minutes.</p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6" noValidate>
        <div><label className="label" htmlFor="name">Full name</label><input id="name" className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}</div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}</div>
        <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" className="input" value={form.password} onChange={(e) => set("password", e.target.value)} />{errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}</div>
        <ImageUploader label="Profile image (optional)" value={form.image} onChange={(u) => set("image", u)} allowUrl />
        <button className="btn-primary w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account</button>
        <div className="flex items-center gap-3 text-xs text-ink/40"><span className="h-px flex-1 bg-plum/10" />or<span className="h-px flex-1 bg-plum/10" /></div>
        <GoogleButton />
      </form>
      <p className="mt-5 text-center text-sm">Already registered? <Link href="/sign-in" className="font-semibold text-petal-dark">Sign in</Link></p>
    </div>
  );
}
