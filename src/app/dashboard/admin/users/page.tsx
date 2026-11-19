"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useFetch } from "@/components/useFetch";
import { Spinner, EmptyState, PageTitle, Badge, Modal, ConfirmDialog } from "@/components/ui";
import { api } from "@/lib/api";
import { fmtDate } from "@/lib/utils";

interface U { _id: string; name: string; email: string; image?: string; phone?: string; isBlocked?: boolean; createdAt?: string; totalAppointments?: number; paidAppointments?: number }

export default function ManageUsers() {
  const { data, loading, error, reload } = useFetch<U[]>("/admin/users");
  const [detail, setDetail] = useState<U | null>(null);
  const [target, setTarget] = useState<U | null>(null);
  const [busy, setBusy] = useState(false);

  async function openDetail(u: U) {
    try { setDetail(await api<U>(`/admin/users/${u._id}`)); } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function toggle() {
    if (!target) return;
    setBusy(true);
    try { await api(`/admin/users/${target._id}/${target.isBlocked ? "unblock" : "block"}`, { method: "PATCH" }); toast.success(target.isBlocked ? "User unblocked" : "User blocked"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(false); setTarget(null); }
  }

  return (
    <>
      <PageTitle title="Manage users" sub="Registered customers. Blocked users lose access to protected features." />
      {loading ? <Spinner label="Loading users..." /> : error ? <EmptyState title="Could not load users" text={error} action={<button className="btn-primary" onClick={reload}>Retry</button>} /> : !data?.length ? <EmptyState title="No customers yet" /> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="border-b border-plum/10 bg-mist"><tr>{["Customer", "Phone", "Joined", "Status", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-plum/5">
              {data.map((u) => (
                <tr key={u._id}>
                  <td className="td"><div className="flex items-center gap-3">{u.image ? <img src={u.image} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-white">{u.name?.[0]?.toUpperCase()}</span>}<div><div className="font-medium">{u.name}</div><div className="text-xs text-ink/50">{u.email}</div></div></div></td>
                  <td className="td">{u.phone || "—"}</td>
                  <td className="td">{u.createdAt ? fmtDate(u.createdAt) : "—"}</td>
                  <td className="td"><Badge value={u.isBlocked ? "blocked" : "active"} /></td>
                  <td className="td"><div className="flex gap-2">
                    <button className="btn-outline btn-sm" onClick={() => openDetail(u)}>Details</button>
                    <button className={`${u.isBlocked ? "btn-primary" : "btn-danger"} btn-sm`} onClick={() => setTarget(u)}>{u.isBlocked ? "Unblock" : "Block"}</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="User details">
        {detail && <dl className="space-y-3 text-sm">
          {([["Name", detail.name], ["Email", detail.email], ["Phone", detail.phone || "—"], ["Joined", detail.createdAt ? fmtDate(detail.createdAt) : "—"], ["Total appointments", String(detail.totalAppointments ?? 0)], ["Paid appointments", String(detail.paidAppointments ?? 0)]] as [string, string][]).map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-ink/50">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          <div className="flex justify-between"><dt className="text-ink/50">Status</dt><dd><Badge value={detail.isBlocked ? "blocked" : "active"} /></dd></div>
        </dl>}
      </Modal>
      <ConfirmDialog open={!!target} title={target?.isBlocked ? "Unblock this user?" : "Block this user?"} message={target?.isBlocked ? "They will regain access to the platform." : "They will no longer be able to use protected features."} confirmText={target?.isBlocked ? "Unblock" : "Block user"} danger={!target?.isBlocked} loading={busy} onConfirm={toggle} onClose={() => setTarget(null)} />
    </>
  );
}
