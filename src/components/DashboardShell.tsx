"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, CalendarDays, User, Scissors, Users, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthProvider";
import { Spinner } from "./ui";
import type { Role } from "@/lib/types";

const NAV: Record<Role, { href: string; label: string; icon: any }[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/appointments", label: "My Appointments", icon: CalendarDays },
    { href: "/dashboard/customer/profile", label: "My Profile", icon: User },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Scissors },
    { href: "/dashboard/admin/services/new", label: "Add Service", icon: Scissors },
    { href: "/dashboard/admin/appointments", label: "Manage Appointments", icon: CalendarDays },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
    { href: "/dashboard/admin/profile", label: "My Profile", icon: User },
  ],
};

export default function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`); return; }
    if (user.isBlocked) { toast.error("Your account has been blocked."); logout().then(() => router.replace("/sign-in")); return; }
    if (user.role !== role) router.replace("/dashboard"); // wrong role -> own dashboard
  }, [user, loading, role, router, pathname, logout]);

  useEffect(() => setOpen(false), [pathname]);

  if (loading || !user || user.role !== role || user.isBlocked) return <Spinner label="Loading your dashboard..." />;

  const items = NAV[role];
  const isActive = (href: string) => (href === items[0].href ? pathname === href : pathname === href || (pathname.startsWith(href + "/") && !items.some((i) => i.href !== href && i.href.length > href.length && pathname.startsWith(i.href))));

  const sidebar = (
    <nav className="space-y-1">
      <p className="mb-3 px-3 text-sm font-semibold text-ink/50">{role === "admin" ? "Admin panel" : "My account"}</p>
      {items.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive(href) ? "bg-plum text-white" : "text-ink/70 hover:bg-plum-soft"}`}>
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
      <aside className="card sticky top-20 hidden h-fit w-64 shrink-0 p-4 lg:block">{sidebar}</aside>
      <div className="min-w-0 flex-1">
        <button className="btn-outline btn-sm mb-4 lg:hidden" onClick={() => setOpen(true)}><Menu className="h-4 w-4" /> Menu</button>
        {open && (
          <div className="fixed inset-0 z-50 bg-ink/50 lg:hidden" onClick={() => setOpen(false)}>
            <div className="h-full w-72 bg-white p-4" onClick={(e) => e.stopPropagation()}>
              <button className="mb-3" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
              {sidebar}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
