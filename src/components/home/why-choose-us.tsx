"use client";

import { SectionHeading } from "@/components/section-heading";
import { BadgeCheck, CalendarClock, HandCoins, Wallet } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: HandCoins,
    title: "Affordable rental prices",
    text: "Rent by the day, week or month at fair market rates — no deposits locked in middleman pockets, no hidden fees.",
  },
  {
    icon: BadgeCheck,
    title: "Verified equipment owners",
    text: "Every owner is identity-checked before listing. Equipment condition, terms and history are visible before you book.",
  },
  {
    icon: CalendarClock,
    title: "Flexible rental periods",
    text: "From a single afternoon to a full construction season — pick the window you need and extend it when plans change.",
  },
  {
    icon: Wallet,
    title: "Secure online payments",
    text: "Pay through Stripe's encrypted checkout. Your money is released to the owner only after the booking is confirmed.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative order-2 lg:order-1"
        >
          <div
            className="absolute -inset-4 rotate-2 rounded-[2rem] bg-secondary/10"
            aria-hidden
          />
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] shadow-xl">
            <Image
              src="/images/equipment/toolbox.jpg"
              alt="Engineer's toolbox and blueprint kit rented through EquipRent"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:right-8">
            <p className="text-2xl font-extrabold text-primary">98.2%</p>
            <p className="text-xs text-base-content/60">
              bookings completed
              <br />
              without any dispute
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-1 lg:order-2"
        >
          <SectionHeading
            align="left"
            kicker="Why Choose Us"
            title={
              <>
                Built for people who{" "}
                <span className="text-primary">get things done</span>
              </>
            }
            description="Owning every tool you'll ever use is expensive. EquipRent makes borrowing from neighbours smarter — with guarantees for both sides of every deal."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <benefit.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 font-semibold text-base-content">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-base-content/60">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
