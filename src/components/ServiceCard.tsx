import Link from "next/link";
import { Clock } from "lucide-react";
import type { Service } from "@/lib/types";
import { money } from "@/lib/utils";

export default function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden bg-plum-soft">
        <img src={s.image} alt={s.serviceName} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium text-petal-dark">{s.category}</span>
        <h3 className="mt-1 text-2xl font-semibold leading-tight">{s.serviceName}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink/65">{s.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-lg font-bold text-plum">{money(s.price)}</span>
          <span className="flex items-center gap-1 text-ink/60"><Clock className="h-4 w-4" /> {s.duration} min</span>
        </div>
        <Link href={`/services/${s._id}`} className="btn-primary mt-4">View Details</Link>
      </div>
    </article>
  );
}
