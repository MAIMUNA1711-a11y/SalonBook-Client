"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useFetch } from "@/components/useFetch";
import ServiceCard from "@/components/ServiceCard";
import { Spinner, EmptyState, PageTitle } from "@/components/ui";
import { CATEGORIES } from "@/lib/utils";
import type { Service } from "@/lib/types";

function Browse() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [sort, setSort] = useState("");

  useEffect(() => { const t = setTimeout(() => setDebounced(search), 350); return () => clearTimeout(t); }, [search]);

  const qs = new URLSearchParams();
  if (debounced) qs.set("search", debounced);
  if (category !== "all") qs.set("category", category);
  if (sort) qs.set("sort", sort);
  const { data, loading, error, reload } = useFetch<Service[]>(`/services?${qs}`, { auth: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageTitle title="Browse services" sub="Find the treatment you want and book it online." />
      <div className="card mb-8 grid gap-3 p-4 md:grid-cols-[1fr_220px_200px]">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-ink/40" />
          <input className="input pl-9" placeholder="Search services by name" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" />
        </div>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort by price">
          <option value="">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      {loading ? <Spinner label="Loading services..." /> : error ? (
        <EmptyState title="Could not load services" text={error} action={<button className="btn-primary" onClick={reload}>Try again</button>} />
      ) : !data?.length ? (
        <EmptyState title="No services found" text="Try a different search or category." action={<button className="btn-outline" onClick={() => { setSearch(""); setCategory("all"); }}>Clear filters</button>} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{data.map((s) => <ServiceCard key={s._id} s={s} />)}</div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return <Suspense fallback={<Spinner />}><Browse /></Suspense>;
}
