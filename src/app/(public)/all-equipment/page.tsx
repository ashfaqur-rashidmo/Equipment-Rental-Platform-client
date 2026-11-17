import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";

export const metadata: Metadata = {
  title: "All Equipment",
};

export default function AllEquipmentPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
        All Equipment
      </h1>
      <p className="mt-3 max-w-2xl text-base-content/70">
        Browse every approved equipment listing with search, filters and
        sorting — coming in the next build step.
      </p>
      <div className="mt-12 flex flex-col items-center justify-center rounded-box border border-base-300 bg-base-200 px-6 py-20 text-center">
        <PackageSearch className="h-12 w-12 text-primary/60" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-base-content">
          No equipment listed yet
        </p>
        <p className="mt-1 max-w-md text-sm text-base-content/60">
          Approved equipment from verified owners will appear here soon.
        </p>
      </div>
    </section>
  );
}
