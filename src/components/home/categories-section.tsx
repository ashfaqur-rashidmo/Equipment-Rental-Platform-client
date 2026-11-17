"use client";

import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/data/categories";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function CategoriesSection() {
  return (
    <section className="bg-base-200/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          kicker="Browse Categories"
          title={
            <>
              Everything you need,{" "}
              <span className="text-primary">sorted by trade</span>
            </>
          }
          description="Six popular categories cover the tools, machines and gadgets our customers rent the most."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={item}>
              <Link
                href={`/all-equipment?category=${encodeURIComponent(category.name)}`}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg sm:p-8"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${category.tint}`}
                >
                  <category.icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="text-base font-semibold text-base-content sm:text-lg">
                  {category.name}
                </h3>
                <p className="text-sm text-base-content/60">
                  {category.count} items available
                </p>
                <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Browse <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
