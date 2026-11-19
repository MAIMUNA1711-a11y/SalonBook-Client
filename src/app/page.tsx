"use client";
import Link from "next/link";
import { Sparkles, ShieldCheck, CalendarCheck, CreditCard, Scissors, Palette, Droplets, Flower2, Brush, Hand, Waves } from "lucide-react";
import { useFetch } from "@/components/useFetch";
import ServiceCard from "@/components/ServiceCard";
import { Spinner, EmptyState } from "@/components/ui";
import type { Service } from "@/lib/types";

const catIcons = [Scissors, Palette, Droplets, Flower2, Brush, Hand, Waves];

export default function Home() {
  const { data: services, loading, error } = useFetch<Service[]>("/services?limit=6", { auth: false });
  const { data: cats } = useFetch<{ name: string; count: number }[]>("/services/categories", { auth: false });

  return (
    <>
      {/* Banner */}
      <section
        className="relative isolate overflow-hidden bg-plum-dark bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(100deg, rgba(42,27,46,.92) 20%, rgba(42,27,46,.35)), url(https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=70)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36">
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.05] text-white md:text-7xl">Your chair is waiting. Pick the time.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">Choose a service, request a slot, and pay online as soon as the salon confirms your appointment.</p>
          <Link href="/services" className="btn-accent mt-8 px-6 py-3 text-base">Explore Salon Services</Link>
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-semibold">Featured services</h2>
            <p className="mt-1 text-ink/60">Most requested treatments at the salon right now.</p>
          </div>
          <Link href="/services" className="btn-outline hidden sm:inline-flex">View all</Link>
        </div>
        {loading ? <Spinner label="Loading services..." /> : error ? (
          <EmptyState title="Services are unavailable" text={error} />
        ) : !services?.length ? (
          <EmptyState title="No services yet" text="Check back soon. The salon is adding its menu." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((s) => <ServiceCard key={s._id} s={s} />)}</div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-plum-soft/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-4xl font-semibold">Browse by category</h2>
          <p className="mt-1 text-ink/60">Jump straight to the kind of treatment you want.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {(cats || []).map((c, i) => {
              const Icon = catIcons[i % catIcons.length];
              return (
                <Link key={c.name} href={`/services?category=${encodeURIComponent(c.name)}`} className="card flex items-center gap-3 p-4 transition hover:border-petal">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-petal-soft text-petal-dark"><Icon className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-sm font-semibold leading-tight">{c.name}</span>
                    <span className="text-xs text-ink/50">{c.count} service{c.count === 1 ? "" : "s"}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extra section: how it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-4xl font-semibold">How booking works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            { icon: Sparkles, t: "Pick a service", d: "Search the menu or filter by category." },
            { icon: CalendarCheck, t: "Request a time", d: "Choose a date and slot. We hold it as pending." },
            { icon: ShieldCheck, t: "Get confirmed", d: "The salon reviews and confirms your request." },
            { icon: CreditCard, t: "Pay securely", d: "Pay with Stripe from your dashboard." },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="card p-6">
              <Icon className="h-7 w-7 text-petal" />
              <h3 className="mt-3 text-2xl font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-ink/60">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
