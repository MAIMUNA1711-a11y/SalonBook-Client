"use client";
import { useFetch } from "@/components/useFetch";
import { Spinner, EmptyState, PageTitle, Badge } from "@/components/ui";
import { fmtApptDate, fmtDateTime, money } from "@/lib/utils";

interface T { _id: string; amount: number; currency: string; stripeSessionId: string; status: string; createdAt: string;
  customerId?: { name: string; email: string } | null; appointmentId?: { appointmentDate: string; timeSlot: string; serviceId?: { serviceName: string } | null } | null }

export default function Transactions() {
  const { data, loading, error, reload } = useFetch<T[]>("/admin/transactions");
  return (
    <>
      <PageTitle title="Transactions" sub="Payments recorded from verified Stripe webhooks. Records are read-only." />
      {loading ? <Spinner label="Loading transactions..." /> : error ? <EmptyState title="Could not load transactions" text={error} action={<button className="btn-primary" onClick={reload}>Retry</button>} /> : !data?.length ? <EmptyState title="No transactions yet" text="Payments will appear here after customers pay." /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-plum/10 bg-mist"><tr>{["Customer", "Service", "Appointment", "Amount", "Currency", "Stripe session", "Status", "Date"].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-plum/5">
              {data.map((t) => (
                <tr key={t._id}>
                  <td className="td"><div className="font-medium">{t.customerId?.name || "—"}</div><div className="text-xs text-ink/50">{t.customerId?.email}</div></td>
                  <td className="td">{t.appointmentId?.serviceId?.serviceName || "—"}</td>
                  <td className="td">{t.appointmentId ? `${fmtApptDate(t.appointmentId.appointmentDate)}, ${t.appointmentId.timeSlot}` : "—"}</td>
                  <td className="td font-semibold">{money(t.amount, t.currency)}</td>
                  <td className="td uppercase">{t.currency}</td>
                  <td className="td font-mono text-xs" title={t.stripeSessionId}>…{t.stripeSessionId.slice(-12)}</td>
                  <td className="td"><Badge value={t.status} /></td>
                  <td className="td">{fmtDateTime(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
