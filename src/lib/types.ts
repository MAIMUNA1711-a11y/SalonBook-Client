export type Role = "admin" | "customer";

export interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Me {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  role: Role;
  isBlocked: boolean;
}

export interface Appointment {
  _id: string;
  serviceId: Pick<Service, "_id" | "serviceName" | "image" | "category" | "price" | "duration"> | null;
  customerId: string | { _id: string; name: string; email: string; image?: string; phone?: string };
  appointmentDate: string;
  timeSlot: string;
  message: string;
  servicePrice: number;
  paymentStatus: "unpaid" | "paid";
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}
