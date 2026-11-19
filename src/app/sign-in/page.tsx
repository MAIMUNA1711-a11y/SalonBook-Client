"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/AuthProvider";
import { GoogleButton } from "@/components/GoogleButton";

function SignIn() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/dashboard";
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      setBusy(false);
      return toast.error(error.message || "Invalid email or password");
    }
    await refresh();
    toast.success("Welcome back!");
    router.replace(redirect); // /dashboard redirects by role
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <h1 className="text-center text-5xl font-semibold">Sign in</h1>
      <p className="mt-2 text-center text-sm text-ink/60">Welcome back to SalonBook.</p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button className="btn-primary w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in</button>
        <div className="flex items-center gap-3 text-xs text-ink/40"><span className="h-px flex-1 bg-plum/10" />or<span className="h-px flex-1 bg-plum/10" /></div>
        <GoogleButton callbackURL={redirect} />
      </form>
      <p className="mt-5 text-center text-sm">New here? <Link href="/sign-up" className="font-semibold text-petal-dark">Create an account</Link></p>
    </div>
  );
}
export default function Page() { return <Suspense><SignIn /></Suspense>; }
