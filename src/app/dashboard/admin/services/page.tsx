"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useFetch } from "@/components/useFetch";
import { Spinner, EmptyState, PageTitle, Badge, ConfirmDialog } from "@/components/ui";
import { api } from "@/lib/api";
import { money } from "@/lib/utils";
import type { Service } from "@/lib/types";

export default function ManageServices() {
  const [search, setSearch] = useState("");
  const { data, loading, error, reload } = useFetch<Service[]>(`/services/admin/all${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  const [del, setDel] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle(s: Service) {
    try { await api(`/services/${s._id}/status`, { method: "PATCH", body: { status: s.status === "active" ? "inactive" : "active" } }); toast.success(s.status === "active" ? "Service deactivated" : "Service activated"); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }
  async function remove() {
    if (!del) return;
    setBusy(true);
    try { await api(`/services/${del._id}`, { method: "DELETE" }); toast.success("Service deleted"); setDel(null); reload(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); setDel(null); }
    finally { setBusy(false); }
  }

  return (
    <>
      <PageTitle title="Manage services" action={<Link href="/dashboard/admin/services/new" className="btn-accent"><Plus className="h-4 w-4" /> Add service</Link>} />
      <input className="input mb-4 max-w-sm" placeholder="Search by service name" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" />
      {loading ? <Spinner label="Loading services..." /> : error ? <EmptyState title="Could not load services" text={error} action={<button className="btn-primary" onClick={reload}>Retry</button>} /> : !data?.length ? (
        <EmptyState title="No services found" action={<Link href="/dashboard/admin/services/new" className="btn-primary">Add your first service</Link>} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-plum/10 bg-mist"><tr>{["Service", "Category", "Price", "Duration", "Status", "Actions"].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-plum/5">
              {data.map((s) => (
                <tr key={s._id}>
                  <td className="td"><div className="flex items-center gap-3"><img src={s.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="font-medium">{s.serviceName}</span></div></td>
                  <td className="td">{s.category}</td>
                  <td className="td font-semibold">{money(s.price)}</td>
                  <td className="td">{s.duration} min</td>
                  <td className="td"><Badge value={s.status} /></td>
                  <td className="td"><div className="flex gap-2">
                    <Link href={`/dashboard/admin/services/${s._id}/edit`} className="btn-outline btn-sm">Edit</Link>
                    <button className="btn-outline btn-sm" onClick={() => toggle(s)}>{s.status === "active" ? "Deactivate" : "Activate"}</button>
                    <button className="btn-danger btn-sm" onClick={() => setDel(s)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog open={!!del} title="Delete this service?" message={`"${del?.serviceName}" will be permanently removed. Deactivate it instead if you may need it again.`} confirmText="Delete service" danger loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}
