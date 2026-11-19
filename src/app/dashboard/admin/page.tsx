"use client";
import { useFetch } from "@/components/useFetch";
import { Spinner, StatCard, PageTitle, EmptyState } from "@/components/ui";

export default function AdminOverview() {
  const { data, loading, error, reload } = useFetch<{ customers: number; activeServices: number; total: number; pending: number; confirmed: number; payments: number }>("/admin/stats");
  return (
    <>
      <PageTitle title="Admin overview" sub="Salon activity at a glance." />
      {loading ? <Spinner label="Loading dashboard..." /> : error || !data ? (
        <EmptyState title="Could not load stats" text={error || ""} action={<button className="btn-primary" onClick={reload}>Retry</button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Registered customers" value={data.customers} />
          <StatCard label="Active services" value={data.activeServices} tone="sage" />
          <StatCard label="Appointment requests" value={data.total} tone="petal" />
          <StatCard label="Pending appointments" value={data.pending} tone="amber" />
          <StatCard label="Confirmed appointments" value={data.confirmed} tone="sage" />
          <StatCard label="Successful payments" value={data.payments} />
        </div>
      )}
    </>
  );
}
