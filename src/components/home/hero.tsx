"use client";

import { ShieldCheck, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stats = [
  { value: "1,200+", label: "Equipment listed" },
  { value: "850+", label: "Verified owners" },
  { value: "6,400+", label: "Completed rentals" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-base-200/60">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div
        className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={item}
            className="badge badge-lg gap-2 border border-base-300 bg-base-100 px-4 py-4 font-medium text-base-content/70 shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
            Bangladesh&apos;s trusted rental marketplace
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight text-base-content sm:text-5xl lg:text-[3.4rem]"
          >
            Rent professional equipment for{" "}
            <span className="relative whitespace-nowrap text-primary">
              any job
              <svg
                className="absolute -bottom-2 left-0 w-full text-primary/40"
                viewBox="0 0 120 8"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 6C30 2 90 2 118 6"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            , any event.
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-lg leading-8 text-base-content/70"
          >
            EquipRent connects verified equipment owners with customers who
            need reliable gear for a specific period — from construction
            machinery and farm tractors to camera kits and concert rigs. Book
            online, pay securely, get to work.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Link href="/all-equipment" className="btn btn-primary btn-lg">
              Browse Equipment
            </Link>
            <Link href="/register" className="btn btn-outline btn-lg">
              Become an Owner
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 text-xs text-base-content/60">
                  {stat.label}
                </dt>
                <dd className="order-1 text-2xl font-extrabold text-base-content">
                  {stat.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div
            className="absolute -inset-4 -rotate-2 rounded-[2rem] bg-primary/10"
            aria-hidden
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src="/images/equipment/hero.jpg"
              alt="Construction crew working on a site with rented equipment"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Floating price card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100/95 p-3 pr-5 shadow-xl backdrop-blur sm:-left-8"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Truck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-xs text-base-content/60">Delivery available</p>
              <p className="text-sm font-bold text-base-content">
                64 districts covered
              </p>
            </div>
          </motion.div>

          {/* Floating rating card */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.6 }}
            className="absolute -bottom-5 right-2 rounded-2xl border border-base-300 bg-base-100/95 p-4 shadow-xl backdrop-blur sm:right-8"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" aria-hidden />
              ))}
            </div>
            <p className="mt-1 text-sm font-bold text-base-content">4.9 / 5.0</p>
            <p className="text-xs text-base-content/60">from 2,300+ reviews</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
