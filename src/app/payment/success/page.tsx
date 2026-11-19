"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { money, fmtApptDate } from "@/lib/utils";

function Success() {
  const sessionId = useSearchParams().get("session_id");
  const [state, setState] = useState<any>({ status: "processing" });
  const [tries, setTries] = useState(0);

  // The page only READS the result. Only the verified Stripe webhook marks the appointment as paid,
  // so we poll briefly until the webhook has saved the transaction.
  useEffect(() => {
    if (!sessionId) return;
    let stop = false;
    const tick = async (n: number) => {
      try {
        const r = await api<any>(`/payments/session/${sessionId}`);
        if (stop) return;
        setState(r);
        if (r.status === "processing" && n < 12) setTimeout(() => tick(n + 1), 2000);
        else setTries(n);
      } catch { if (!stop) setState({ status: "error" }); }
    };
    tick(0);
    return () => { stop = true; };
  }, [sessionId]);

  const tx = state.transaction;
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      {!sessionId || state.status === "error" ? (
        <><XCircle className="mx-auto h-14 w-14 text-red-500" /><h1 className="mt-4 text-4xl font-semibold">We could not verify this payment</h1><p className="mt-2 text-ink/60">Check My Appointments for the latest status.</p></>
      ) : state.status === "paid" ? (
        <><CheckCircle2 className="mx-auto h-14 w-14 text-sage" /><h1 className="mt-4 text-4xl font-semibold">Payment received</h1>
          <p className="mt-2 text-ink/60">Your appointment is paid and confirmed. See you at the salon.</p>
          <div className="card mt-6 space-y-2 p-5 text-left text-sm">
            <div className="flex justify-between"><span className="text-ink/50">Service</span><b>{tx?.appointmentId?.serviceId?.serviceName}</b></div>
            {tx?.appointmentId?.appointmentDate && <div className="flex justify-between"><span className="text-ink/50">When</span><b>{fmtApptDate(tx.appointmentId.appointmentDate)}, {tx.appointmentId.timeSlot}</b></div>}
            <div className="flex justify-between"><span className="text-ink/50">Amount</span><b>{money(tx?.amount, tx?.currency)}</b></div>
            <div className="flex justify-between"><span className="text-ink/50">Reference</span><b>…{String(tx?.stripeSessionId).slice(-10)}</b></div>
          </div></>
      ) : state.status === "failed" ? (
        <><XCircle className="mx-auto h-14 w-14 text-red-500" /><h1 className="mt-4 text-4xl font-semibold">Payment failed</h1><p className="mt-2 text-ink/60">You were not charged. Please try again from My Appointments.</p></>
      ) : (
        <><Loader2 className="mx-auto h-12 w-12 animate-spin text-plum" /><h1 className="mt-4 text-4xl font-semibold">Confirming your payment</h1>
          <p className="mt-2 text-ink/60">{tries >= 12 ? "This is taking longer than usual. Your payment will appear in My Appointments shortly." : "Waiting for Stripe to confirm. This usually takes a few seconds."}</p></>
      )}
      <Link href="/dashboard/customer/appointments" className="btn-primary mt-8">Go to My Appointments</Link>
    </div>
  );
}
export default function Page() { return <Suspense><Success /></Suspense>; }
