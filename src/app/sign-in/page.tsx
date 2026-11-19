"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/AuthProvider";
import { GoogleButton } from "@/components/GoogleButton";

const DEMO_ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@salonbook.com";
const DEMO_ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "";

function SignIn() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/dashboard";
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function fillAdminDemo() {
    if (!DEMO_ADMIN_PASSWORD) {
      return toast.error("Demo admin password is not configured yet");
    }
    setEmail(DEMO_ADMIN_EMAIL);
    setPassword(DEMO_ADMIN_PASSWORD);
    toast.success("Demo admin credentials filled");
  }

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

      <div className="mt-6 rounded-xl border border-plum/15 bg-blush/30 p-4 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-ink">
            <ShieldCheck className="h-4 w-4 text-petal-dark" />
            Demo Admin Access
          </span>
          <button
            type="button"
            onClick={fillAdminDemo}
            disabled={busy}
            className="rounded-lg border border-plum/20 bg-white px-2.5 py-1 font-medium text-ink hover:bg-plum/5"
          >
            Fill Admin
          </button>
        </div>
        <p className="mt-2 text-ink/70">
          Email: <span className="font-mono font-medium">{DEMO_ADMIN_EMAIL}</span>
        </p>
        {DEMO_ADMIN_PASSWORD && (
          <p className="mt-0.5 text-ink/70">
            Password: <span className="font-mono font-medium">{DEMO_ADMIN_PASSWORD}</span>
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="card mt-4 space-y-4 p-6">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="pw">Password</label>
          <input
            id="pw"
            type="password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn-primary w-full" disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
        <div className="flex items-center gap-3 text-xs text-ink/40">
          <span className="h-px flex-1 bg-plum/10" />or<span className="h-px flex-1 bg-plum/10" />
        </div>
        <GoogleButton callbackURL={redirect} />
      </form>
      <p className="mt-5 text-center text-sm">
        New here? <Link href="/sign-up" className="font-semibold text-petal-dark">Create an account</Link>
      </p>
    </div>
  );
}

export default function Page() {
  return <Suspense><SignIn /></Suspense>;
}
