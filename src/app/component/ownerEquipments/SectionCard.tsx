import { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-box border border-base-300 bg-base-100 shadow-sm p-6 sm:p-8 ${className}`}
    >
      {title && (
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          {title}
        </h3>
      )}

      {children}
    </section>
  );
}