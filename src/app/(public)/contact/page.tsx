import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 max-w-2xl text-base-content/70">
        Questions about renting, listing equipment or your bookings? Reach us
        any time.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { icon: MapPin, label: "Address", value: siteConfig.contact.address },
          { icon: Phone, label: "Phone", value: siteConfig.contact.phone },
          { icon: Mail, label: "Email", value: siteConfig.contact.email },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wider text-base-content/60">
              {label}
            </h2>
            <p className="mt-1 break-words text-base-content">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
