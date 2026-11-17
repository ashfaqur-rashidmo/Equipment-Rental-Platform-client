"use client";

import { ArrowRight, Warehouse } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] bg-neutral px-6 py-14 text-center text-neutral-content sm:px-12"
      >
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div
          className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Warehouse className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Own equipment that sits idle?
          </h2>
          <p className="mt-4 text-lg leading-8 text-neutral-content/75">
            List it on EquipRent and turn it into income. You set the
            price, the terms and the schedule — we bring the customers and
            handle the secure payments.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start Earning Today
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href="/how-it-works"
              className="btn btn-lg border-white/20 bg-transparent text-neutral-content hover:border-white/40 hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
