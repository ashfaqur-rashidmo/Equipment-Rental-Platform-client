"use client";

import { BadgeCheck, PackageCheck, Star, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: PackageCheck, value: "1,200+", label: "Equipment listed" },
  { icon: Users, value: "850+", label: "Verified owners" },
  { icon: TrendingUp, value: "6,400+", label: "Completed rentals" },
  { icon: Star, value: "4.9/5", label: "Average rating" },
];

const owners = [
  { name: "Rahim Construction Supplies", detail: "32 items · Dhaka", initials: "RS" },
  { name: "LensHouse BD", detail: "27 items · Chattogram", initials: "LH" },
  { name: "Krishi Machinery Ghor", detail: "18 items · Bogura", initials: "KM" },
];

export function TrustedOwners() {
  return (
    <section className="relative overflow-hidden bg-neutral text-neutral-content">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
            <span className="h-px w-8 bg-primary" aria-hidden />
            Trusted Equipment Owners
            <span className="h-px w-8 bg-primary" aria-hidden />
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Real owners. Real machines. Real accountability.
          </h2>
          <p className="mt-4 text-base-content/70">
            Every listing comes from a verified person or business with
            equipment they actually maintain — not a faceless classified ad.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 p-6 text-center ring-1 ring-white/10"
            >
              <stat.icon className="h-6 w-6 text-primary" aria-hidden />
              <p className="text-3xl font-extrabold">{stat.value}</p>
              <p className="text-sm text-neutral-content/70">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {owners.map((owner) => (
            <div
              key={owner.name}
              className="flex w-full items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:w-auto sm:gap-4 sm:px-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                {owner.initials}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-sm font-semibold">
                  {owner.name}
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                </p>
                <p className="truncate text-xs text-neutral-content/70">
                  {owner.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
