"use client";
import { useParams } from "next/navigation";
import ServiceForm from "@/components/ServiceForm";
import { useFetch } from "@/components/useFetch";
import { Spinner, EmptyState } from "@/components/ui";
import type { Service } from "@/lib/types";

export default function EditService() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch<Service>(`/services/${id}`, { auth: false });
  if (loading) return <Spinner label="Loading service..." />;
  if (error || !data) return <EmptyState title="Service not found" text={error || ""} />;
  return <ServiceForm initial={data} />;
}
