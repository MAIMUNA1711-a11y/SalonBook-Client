"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFetch } from "@/components/useFetch";
import { Spinner, EmptyState, PageTitle, Badge, Modal, ConfirmDialog } from "@/components/ui";
import { api } from "@/lib/api";
import { fmtApptDate, fmtDate, money } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

type Cust = { _id: string; name: string; email: string; phone?: string };
const cust = (a: Appointment) => (typeof a.customerId === "object" ? (a.customerId as Cust) : null);

export default function AdminAppointments() {
  const [filter, setFilter] = useState("");
  const { data, loading, error, reload } = useFetch<Appointment[]>(`/admin/appointments${filter ? `?status=${filter}` : ""}`);
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [confirm, setConfirm] = useState<{ a: Appointment; action: "confirm" | "cancel" } | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!confirm) return;
    setBusy(true);
    try { await api(`/admin/appointments/${confirm.a._id}/${confirm.action}`, { method: "PATCH" }); toast.success(confirm.action === "confirm" ? "Appointment confirmed" : "Appointment cancelled"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Action failed"); reload(); }
    finally { setBusy(false); setConfirm(null); }
  }

  return (
    <>
      <PageTitle title="Manage appointments" sub="Review requests, confirm or cancel them." />
      <select className="input mb-4 max-w-[220px]" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
        <option value="">All statuses</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option>
      </select>
      {loading ? <Spinner label="Loading appointments..." /> : error ? <EmptyState title="Could not load appointments" text={error} action={<button className="btn-primary" onClick={reload}>Retry</button>} /> : !data?.length ? <EmptyState title="No appointments found" /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b border-plum/10 bg-mist"><tr>{["Customer", "Service", "Date & time", "Price", "Status", "Payment", "Requested", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-plum/5">
              {data.map((a) => (
                <tr key={a._id}>
                  <td className="td"><div className="font-medium">{cust(a)?.name || "Deleted user"}</div><div className="text-xs text-ink/50">{cust(a)?.email}</div></td>
                  <td className="td">{a.serviceId?.serviceName || "Removed service"}</td>
                  <td className="td">{fmtApptDate(a.appointmentDate)}<br /><span className="text-xs text-ink/50">{a.timeSlot}</span></td>
                  <td className="td font-semibold">{money(a.servicePrice)}</td>
                  <td className="td"><Badge value={a.status} /></td>
                  <td className="td"><Badge value={a.paymentStatus} /></td>
                  <td className="td">{fmtDate(a.createdAt)}</td>
                  <td className="td"><div className="flex gap-2">
                    <button className="btn-outline btn-sm" onClick={() => setDetail(a)}>Details</button>
                    {a.status === "pending" && <button className="btn-primary btn-sm" onClick={() => setConfirm({ a, action: "confirm" })}>Confirm</button>}
                    {(a.status === "pending" || a.status === "confirmed") && <button className="btn-danger btn-sm" onClick={() => setConfirm({ a, action: "cancel" })}>Cancel</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Appointment details">
        {detail && (
          <dl className="space-y-3 text-sm">
            {([
              ["Customer", cust(detail)?.name], ["Email", cust(detail)?.email], ["Phone", cust(detail)?.phone || "—"],
              ["Service", detail.serviceId?.serviceName], ["Category", detail.serviceId?.category], ["Date", fmtApptDate(detail.appointmentDate)], ["Time", detail.timeSlot],
              ["Price", money(detail.servicePrice)], ["Customer message", detail.message || "—"], ["Requested on", fmtDate(detail.createdAt)],
            ] as [string, string | undefined][]).map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-ink/50">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
            <div className="flex justify-between"><dt className="text-ink/50">Status</dt><dd><Badge value={detail.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-ink/50">Payment</dt><dd><Badge value={detail.paymentStatus} /></dd></div>
          </dl>
        )}
      </Modal>
      <ConfirmDialog open={!!confirm} title={confirm?.action === "confirm" ? "Confirm appointment?" : "Cancel appointment?"}
        message={confirm?.action === "confirm" ? "The customer will be able to pay for this appointment." : "The appointment will be cancelled and the slot released."}
        confirmText={confirm?.action === "confirm" ? "Confirm" : "Cancel appointment"} danger={confirm?.action === "cancel"} loading={busy} onConfirm={run} onClose={() => setConfirm(null)} />
    </>
  );
}
