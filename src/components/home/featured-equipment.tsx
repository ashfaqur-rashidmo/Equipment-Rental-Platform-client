"use client";

import { useEffect, useState } from "react";
import { EquipmentCard } from "@/components/equipment-card";
import { SectionHeading } from "@/components/section-heading";
import type { EquipmentItem } from "@/data/equipment";
import { motion, type Variants } from "framer-motion";
import { API_BASE_URL } from "@/lib/baseurl";


const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function FeaturedEquipment() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEquipment = async () => {
    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/featured-equipment`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch equipment.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid equipment data received.");
      }

      // Featured = the 6 newest approved items.
      const featured = data
        .filter(
          (eq: EquipmentItem) =>
            String(eq.status || "").toLowerCase() === "approved"
        )
      

      setEquipment(featured);
    } catch (err) {
      console.error("Fetch equipment error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load equipment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        align="left"
        kicker="Featured Equipment"
        title={
          <>
            Gear that&apos;s ready{" "}
            <span className="text-primary">right now</span>
          </>
        }
        description="Hand-picked from the newest approved listings — verified owners, transparent pricing and instant booking."
        action={{ label: "View All Equipment", href: "/all-equipment" }}
      />

      {loading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-box border border-error bg-error/10 p-6 text-center">
          <p className="text-sm text-error">{error}</p>

          <button
            type="button"
            onClick={fetchEquipment}
            className="btn btn-outline btn-sm mt-4"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && equipment.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {equipment.map((eq, index) => (
            <motion.div
              key={eq._id || eq.id || eq.name}
              variants={item}
              className="h-full"
            >
              <EquipmentCard equipment={eq} priority={index < 3} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && !error && equipment.length === 0 && (
        <p className="py-12 text-center text-sm text-base-content/60">
          No approved equipment right now.
        </p>
      )}
    </section>
  );
}
