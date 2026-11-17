"use client";

import { SectionHeading } from "@/components/section-heading";
import { reviews } from "@/data/reviews";
import { Quote, Star } from "lucide-react";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ReviewsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionHeading
        kicker="Customer Reviews"
        title={
          <>
            Rented, used, <span className="text-primary">reviewed</span>
          </>
        }
        description="What customers say after the job is done — the only metric that matters."
      />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {reviews.map((review) => (
          <motion.figure
            key={review.name}
            variants={item}
            className="relative flex h-full flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition-shadow hover:shadow-lg"
          >
            <Quote
              className="absolute right-5 top-5 h-8 w-8 text-primary/15"
              aria-hidden
            />
            <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-warning text-warning"
                      : "text-base-300"
                  }`}
                  aria-hidden
                />
              ))}
            </div>
            <blockquote className="flex-1 text-sm leading-6 text-base-content/70">
              “{review.comment}”
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-base-200 pt-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary">
                {review.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-base-content">
                  {review.name}
                </p>
                <p className="truncate text-xs text-base-content/60">
                  {review.role}
                </p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
