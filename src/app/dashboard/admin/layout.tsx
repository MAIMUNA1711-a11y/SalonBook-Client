import DashboardShell from "@/components/DashboardShell";
export default function L({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
