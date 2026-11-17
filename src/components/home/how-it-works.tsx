"use client";

import { SectionHeading } from "@/components/section-heading";
import { CalendarCheck, CreditCard, Search, Truck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Search & compare",
    text: "Filter by category, location, price and availability until you find the exact equipment.",
  },
  {
    icon: CalendarCheck,
    title: "Book your dates",
    text: "Pick the rental window and quantity. The total is calculated before you commit to anything.",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Check out through Stripe. Your payment is recorded and the booking is confirmed instantly.",
  },
  {
    icon: Truck,
    title: "Pick up or get it delivered",
    text: "Collect from the owner or agree on delivery to your site, venue or farm gate.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-base-200/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          kicker="How It Works"
          title={
            <>
              From browsing to building,{" "}
              <span className="text-primary">in four steps</span>
            </>
          }
        />

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div
            className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-base-300 lg:block"
            aria-hidden
          />
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-4 text-center"
            >
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-base-300 bg-base-100 text-primary shadow-sm">
                <step.icon className="h-6 w-6" aria-hidden />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-content">
                  {index + 1}
                </span>
              </span>
              <h3 className="text-lg font-semibold text-base-content">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-6 text-base-content/60">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
