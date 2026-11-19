"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useFetch } from "@/components/useFetch";
import { Spinner, EmptyState, PageTitle, Badge, Modal, ConfirmDialog } from "@/components/ui";
import { api } from "@/lib/api";
import { fmtApptDate, fmtDate, money } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export default function MyAppointments() {
  const { data, loading, error, reload } = useFetch<Appointment[]>("/appointments/my");
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  async function cancel() {
    if (!cancelId) return;
    setBusy(true);
    try { await api(`/appointments/${cancelId}/cancel`, { method: "PATCH" }); toast.success("Appointment request cancelled"); setCancelId(null); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Could not cancel"); setCancelId(null); reload(); }
    finally { setBusy(false); }
  }

  async function pay(id: string) {
    setPayingId(id);
    try {
      const { url } = await api<{ url: string }>("/payments/checkout", { method: "POST", body: { appointmentId: id } });
      window.location.href = url;
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not start payment"); setPayingId(null); }
  }

  return (
    <>
      <PageTitle title="My appointments" sub="Track your requests and pay once they are confirmed." />
      {loading ? <Spinner label="Loading appointments..." /> : error ? (
        <EmptyState title="Could not load appointments" text={error} action={<button className="btn-primary" onClick={reload}>Retry</button>} />
      ) : !data?.length ? (
        <EmptyState title="No appointments yet" text="Pick a service and request your first slot." action={<Link href="/services" className="btn-primary">Browse services</Link>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-plum/10 bg-mist"><tr>
              {["Service", "Category", "Date", "Time", "Price", "Status", "Payment", "Requested", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-plum/5">
              {data.map((a) => (
                <tr key={a._id}>
                  <td className="td"><div className="flex items-center gap-3">{a.serviceId?.image && <img src={a.serviceId.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}<span className="font-medium">{a.serviceId?.serviceName || "Removed service"}</span></div></td>
                  <td className="td">{a.serviceId?.category}</td>
                  <td className="td">{fmtApptDate(a.appointmentDate)}</td>
                  <td className="td">{a.timeSlot}</td>
                  <td className="td font-semibold">{money(a.servicePrice)}</td>
                  <td className="td"><Badge value={a.status} /></td>
                  <td className="td"><Badge value={a.paymentStatus} /></td>
                  <td className="td">{fmtDate(a.createdAt)}</td>
                  <td className="td"><div className="flex gap-2">
                    <button className="btn-outline btn-sm" onClick={() => setDetail(a)}>Details</button>
                    {a.status === "pending" && <button className="btn-danger btn-sm" onClick={() => setCancelId(a._id)}>Cancel</button>}
                    {a.status === "confirmed" && a.paymentStatus === "unpaid" && (
                      <button className="btn-accent btn-sm" disabled={payingId === a._id} onClick={() => pay(a._id)}>{payingId === a._id && <Loader2 className="h-3 w-3 animate-spin" />} Pay Now</button>
                    )}
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
            {detail.serviceId?.image && <img src={detail.serviceId.image} alt="" className="h-40 w-full rounded-lg object-cover" />}
            {([
              ["Service", detail.serviceId?.serviceName], ["Category", detail.serviceId?.category], ["Date", fmtApptDate(detail.appointmentDate)],
              ["Time", detail.timeSlot], ["Price", money(detail.servicePrice)], ["Your message", detail.message || "—"], ["Requested on", fmtDate(detail.createdAt)],
            ] as [string, string | undefined][]).map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-ink/50">{k}</dt><dd className="text-right font-medium">{v}</dd></div>)}
            <div className="flex justify-between"><dt className="text-ink/50">Status</dt><dd><Badge value={detail.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-ink/50">Payment</dt><dd><Badge value={detail.paymentStatus} /></dd></div>
          </dl>
        )}
      </Modal>
      <ConfirmDialog open={!!cancelId} title="Cancel this request?" message="This pending appointment request will be cancelled and the slot released." confirmText="Cancel request" danger loading={busy} onConfirm={cancel} onClose={() => setCancelId(null)} />
    </>
  );
}
