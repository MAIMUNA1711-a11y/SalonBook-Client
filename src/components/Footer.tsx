import Link from "next/link";
import { Scissors, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl font-bold text-white"><Scissors className="h-5 w-5 text-petal" /> SalonBook</p>
          <p className="mt-3 text-sm">Book hair, skin, nails and spa treatments online. Pick a service, choose a time and pay once it is confirmed.</p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Quick links</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/services" className="hover:text-white">Browse Services</Link></li>
            <li><Link href="/sign-in" className="hover:text-white">Sign In</Link></li>
            <li><Link href="/sign-up" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Visit us</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> House 12, Road 5, Dhanmondi, Dhaka</li>
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> +880 1700-000000</li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" /> hello@salonbook.com</li>
            <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0" /> Sat–Thu 9:00 AM – 7:00 PM<br />Friday 3:00 PM – 8:00 PM</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Follow us</p>
          <div className="flex gap-3">
            <a href="https://facebook.com" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-petal"><Facebook className="h-4 w-4" /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-petal"><Instagram className="h-4 w-4" /></a>
            <a href="https://twitter.com" aria-label="Twitter" className="rounded-full bg-white/10 p-2 hover:bg-petal"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} SalonBook. All rights reserved.</div>
    </footer>
  );
}
