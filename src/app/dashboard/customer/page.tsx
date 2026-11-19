"use client";
import Link from "next/link";
import { useFetch } from "@/components/useFetch";
import { useAuth } from "@/components/AuthProvider";
import { Spinner, StatCard, PageTitle, EmptyState } from "@/components/ui";

export default function CustomerOverview() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch<{ total: number; pending: number; confirmed: number; cancelled: number }>("/appointments/my/stats");
  return (
    <>
      <PageTitle title={`Hello, ${user?.name?.split(" ")[0] || "there"}`} sub="Here is a snapshot of your appointment requests." action={<Link href="/services" className="btn-accent">Book a service</Link>} />
      {loading ? <Spinner label="Loading dashboard..." /> : error || !data ? (
        <EmptyState title="Could not load your stats" text={error || ""} action={<button className="btn-primary" onClick={reload}>Retry</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total requests" value={data.total} />
          <StatCard label="Pending" value={data.pending} tone="amber" />
          <StatCard label="Confirmed" value={data.confirmed} tone="sage" />
          <StatCard label="Cancelled" value={data.cancelled} tone="petal" />
        </div>
      )}
    </>
  );
}
