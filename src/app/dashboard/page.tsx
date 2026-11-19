"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Spinner } from "@/components/ui";

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/sign-in?redirect=/dashboard");
    else router.replace(user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
  }, [user, loading, router]);
  return <Spinner label="Taking you to your dashboard..." />;
}
