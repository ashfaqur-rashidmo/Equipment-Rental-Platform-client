"use client";

import { EquipmentCard } from "@/components/equipment-card";
import { SectionHeading } from "@/components/section-heading";
import { equipmentList } from "@/data/equipment";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function FeaturedEquipment() {
  // Featured = 6 newest approved items (mirrors the future MongoDB
  // `.sort({ createdAt: -1 }).limit(6)` query).
  const featured = equipmentList
    .filter((eq) => eq.status === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        align="left"
        kicker="Featured Equipment"
        title={
          <>
            Gear that&apos;s ready <span className="text-primary">right now</span>
          </>
        }
        description="Hand-picked from the newest approved listings — verified owners, transparent pricing and instant booking."
        action={{ label: "View All Equipment", href: "/all-equipment" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {featured.map((equipment, index) => (
          <motion.div key={equipment.id} variants={item} className="h-full">
            <EquipmentCard equipment={equipment} priority={index < 3} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <a href="/all-equipment" className="btn btn-primary btn-lg px-10">
          View All Equipment
        </a>
      </div>
    </section>
  );
}
