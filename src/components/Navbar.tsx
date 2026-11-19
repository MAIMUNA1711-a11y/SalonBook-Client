"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, Scissors } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession(); // reacts instantly to sign-in/out
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user;

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : [{ href: "/sign-in", label: "Sign In" }, { href: "/sign-up", label: "Sign Up" }]),
  ];
  const active = (h: string) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  async function onLogout() {
    setMenu(false); setOpen(false);
    await logout();
    toast.success("Signed out");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-plum/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-plum">
          <Scissors className="h-5 w-5 text-petal" /> SalonBook
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.filter((l) => !(user && l.href === "/dashboard")).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={`rounded-lg px-3 py-2 text-sm font-medium ${active(l.href) ? "bg-plum-soft text-plum" : "text-ink/70 hover:text-plum"}`}>{l.label}</Link>
            </li>
          ))}
          {!isPending && user && (
            <li className="relative ml-2">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full border border-plum/20 py-1 pl-1 pr-3 text-sm font-medium hover:bg-plum-soft" aria-haspopup="menu" aria-expanded={menu}>
                {user.image ? <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum text-white">{user.name?.[0]?.toUpperCase()}</span>}
                <span className="max-w-[120px] truncate">{user.name}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-plum/10 bg-white p-2 shadow-lg" role="menu">
                  <p className="truncate px-3 py-2 text-sm font-semibold">{user.name}</p>
                  <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-mist"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                  <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Logout</button>
                </div>
              )}
            </li>
          )}
        </ul>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
      </nav>

      {open && (
        <div className="border-t border-plum/10 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-mist">{l.label}</Link>
          ))}
          {user && <button onClick={onLogout} className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Logout ({user.name})</button>}
        </div>
      )}
    </header>
  );
}
