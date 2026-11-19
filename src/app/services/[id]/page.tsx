"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Clock, Loader2 } from "lucide-react";
import { useFetch } from "@/components/useFetch";
import { useAuth } from "@/components/AuthProvider";
import { Spinner, EmptyState } from "@/components/ui";
import { api } from "@/lib/api";
import { money, todayStr } from "@/lib/utils";
import type { Service } from "@/lib/types";

type Slot = { time: string; available: boolean };

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { data: service, loading, error } = useFetch<Service>(`/services/${id}`, { auth: false });

  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!date || !service) return;
    setSlot(""); setSlotsLoading(true);
    api<Slot[]>(`/appointments/slots?serviceId=${service._id}&date=${date}`)
      .then(setSlots)
      .catch((e) => toast.error(e.message))
      .finally(() => setSlotsLoading(false));
  }, [date, service]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return toast.error("Please choose a date");
    if (!slot) return toast.error("Please choose a time slot");
    setSubmitting(true);
    try {
      await api("/appointments", { method: "POST", body: { serviceId: service!._id, appointmentDate: date, timeSlot: slot, message } });
      toast.success("Appointment request sent. We will confirm it soon.");
      router.push("/dashboard/customer/appointments");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not book appointment");
      if (date) api<Slot[]>(`/appointments/slots?serviceId=${service!._id}&date=${date}`).then(setSlots).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || authLoading) return <Spinner label="Loading service..." />;
  if (error || !service)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState title="Service not found" text={error || "This service does not exist or was removed."} action={<Link href="/services" className="btn-primary">Browse services</Link>} />
      </div>
    );

  const inactive = service.status !== "active";
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
      <img src={service.image} alt={service.serviceName} className="aspect-[4/3] w-full rounded-2xl object-cover" />
      <div>
        <span className="badge bg-petal-soft text-petal-dark">{service.category}</span>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{service.serviceName}</h1>
        <div className="mt-4 flex items-center gap-6">
          <span className="text-3xl font-bold text-plum">{money(service.price)}</span>
          <span className="flex items-center gap-1 text-ink/60"><Clock className="h-4 w-4" /> about {service.duration} min</span>
        </div>
        <p className="mt-5 whitespace-pre-line leading-relaxed text-ink/75">{service.description}</p>

        <div className="mt-8">
          {inactive ? (
            <p className="rounded-lg bg-gray-100 p-4 text-sm text-ink/70">This service is currently unavailable for booking.</p>
          ) : isAdmin ? (
            <p className="rounded-lg bg-plum-soft p-4 text-sm text-plum">Admin accounts cannot submit customer appointment requests.</p>
          ) : !showForm ? (
            <button className="btn-accent px-6 py-3 text-base" onClick={() => setShowForm(true)}>Book appointment</button>
          ) : (
            <form onSubmit={submit} className="card space-y-4 p-5">
              <h2 className="text-2xl font-semibold">Request an appointment</h2>
              <div>
                <label className="label" htmlFor="date">Date</label>
                <input id="date" type="date" min={todayStr()} className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div>
                <span className="label">Time slot</span>
                {!date ? <p className="text-sm text-ink/50">Choose a date to see available times.</p> : slotsLoading ? <Spinner label="Checking availability..." /> : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {slots.map((s) => (
                      <button type="button" key={s.time} disabled={!s.available} onClick={() => setSlot(s.time)}
                        className={`rounded-lg border px-2 py-2 text-sm ${slot === s.time ? "border-plum bg-plum text-white" : "border-plum/20 bg-white"} ${!s.available ? "cursor-not-allowed bg-gray-100 text-ink/30 line-through" : "hover:border-plum"}`}>
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="label" htmlFor="msg">Additional message (optional)</label>
                <textarea id="msg" className="input" rows={3} maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Anything the stylist should know?" />
              </div>
              <button className="btn-primary w-full" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />} {submitting ? "Sending request..." : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
