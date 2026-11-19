import Link from "next/link";
import { XCircle } from "lucide-react";
export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <XCircle className="mx-auto h-14 w-14 text-petal" />
      <h1 className="mt-4 text-4xl font-semibold">Payment cancelled</h1>
      <p className="mt-2 text-ink/60">No charge was made. You can pay any time from My Appointments.</p>
      <Link href="/dashboard/customer/appointments" className="btn-primary mt-8">Back to My Appointments</Link>
    </div>
  );
}
