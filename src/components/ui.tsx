"use client";
import { Loader2, X } from "lucide-react";
import { useEffect } from "react";

export function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-plum" role="status">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-sm text-ink/60">{label}</span>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center">
      <h3 className="text-2xl font-semibold">{title}</h3>
      {text && <p className="max-w-md text-sm text-ink/60">{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

const badgeColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sage-soft text-sage",
  cancelled: "bg-red-100 text-red-700",
  paid: "bg-sage-soft text-sage",
  unpaid: "bg-amber-100 text-amber-800",
  failed: "bg-red-100 text-red-700",
  active: "bg-sage-soft text-sage",
  inactive: "bg-gray-100 text-gray-600",
  blocked: "bg-red-100 text-red-700",
};
export function Badge({ value }: { value: string }) {
  return <span className={`badge ${badgeColors[value] || "bg-gray-100 text-gray-700"}`}>{value}</span>;
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-mist"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmText = "Confirm", danger, loading, onConfirm, onClose }: {
  open: boolean; title: string; message: string; confirmText?: string; danger?: boolean; loading?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink/70">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-outline" onClick={onClose} disabled={loading}>Keep it</button>
        <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export function StatCard({ label, value, tone = "plum" }: { label: string; value: number | string; tone?: "plum" | "petal" | "sage" | "amber" }) {
  const tones = { plum: "border-l-plum", petal: "border-l-petal", sage: "border-l-sage", amber: "border-l-amber-500" };
  return (
    <div className={`card border-l-4 p-5 ${tones[tone]}`}>
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-1 font-display text-4xl font-semibold">{value}</p>
    </div>
  );
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-4xl font-semibold">{title}</h1>
        {sub && <p className="mt-1 text-sm text-ink/60">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
