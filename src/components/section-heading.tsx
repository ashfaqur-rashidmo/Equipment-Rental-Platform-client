import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  action?: { label: string; href: string };
}

/**
 * The one heading style used by every home page section, so headings stay
 * consistent across the site (assignment UI rule #1).
 */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "center",
  action,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`mb-12 flex gap-6 ${
        centered ? "flex-col items-center text-center" : "flex-wrap items-end justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <span className="h-px w-8 bg-primary" aria-hidden />
          {kicker}
          {centered && <span className="h-px w-8 bg-primary" aria-hidden />}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-base leading-7 text-base-content/70">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="btn btn-link btn-sm gap-1 text-primary no-underline hover:opacity-80"
        >
          {action.label} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
