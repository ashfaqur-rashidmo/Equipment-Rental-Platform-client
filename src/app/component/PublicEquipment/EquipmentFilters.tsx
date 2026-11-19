
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Banknote,
  Camera,
  CheckCircle2,
  Coins,
  HardHat,
  Laptop,
  LayoutGrid,
  ListFilter,
  Package,
  PartyPopper,
  RotateCcw,
  Tag,
  Tractor,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { EquipmentCategory } from "@/lib/api/getEquipmentCategories";

/** Query keys owned by the filter panel (search stays independent). */
export const FILTER_KEYS = [
  "category",
  "rentalType",
  "minPrice",
  "maxPrice",
  "available",
] as const;

export const countActiveFilters = (params: URLSearchParams) =>
  FILTER_KEYS.filter((key) => params.get(key)).length;

export const formatAmount = (value: number) =>
  `৳${value.toLocaleString("en-US")}`;

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

const PRICE_PRESETS: { label: string; min: string; max: string }[] = [
  { label: "Any price", min: "", max: "" },
  { label: "Under ৳1,000", min: "", max: "1000" },
  { label: "৳1,000 – ৳3,000", min: "1000", max: "3000" },
  { label: "৳3,000 – ৳5,000", min: "3000", max: "5000" },
  { label: "৳5,000 & above", min: "5000", max: "" },
];

/** Icon + tint per category, covering both the full and short label forms. */
const CATEGORY_META: Record<string, { icon: LucideIcon; tint: string }> = {
  "Construction Equipment": { icon: HardHat, tint: "bg-amber-500/10 text-amber-600" },
  Construction: { icon: HardHat, tint: "bg-amber-500/10 text-amber-600" },
  "Photography Equipment": { icon: Camera, tint: "bg-sky-500/10 text-sky-600" },
  Photography: { icon: Camera, tint: "bg-sky-500/10 text-sky-600" },
  "Vehicles & Transportation": { icon: Truck, tint: "bg-emerald-500/10 text-emerald-600" },
  Vehicles: { icon: Truck, tint: "bg-emerald-500/10 text-emerald-600" },
  "Agriculture Equipment": { icon: Tractor, tint: "bg-lime-500/10 text-lime-600" },
  Agriculture: { icon: Tractor, tint: "bg-lime-500/10 text-lime-600" },
  Electronics: { icon: Laptop, tint: "bg-violet-500/10 text-violet-600" },
  "Event Equipment": { icon: PartyPopper, tint: "bg-rose-500/10 text-rose-600" },
  Events: { icon: PartyPopper, tint: "bg-rose-500/10 text-rose-600" },
  Tools: { icon: Wrench, tint: "bg-orange-500/10 text-orange-600" },
  Other: { icon: Package, tint: "bg-base-300/60 text-base-content/70" },
};

const metaFor = (name: string) =>
  CATEGORY_META[name] ?? { icon: Package, tint: "bg-base-300/60 text-base-content/70" };

const SectionTitle = ({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) => (
  <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">
    <Icon size={14} className="text-primary" />
    {children}
  </h3>
);

interface EquipmentFiltersProps {
  categories: EquipmentCategory[];
}

const EquipmentFilters = ({ categories }: EquipmentFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const activeType = searchParams.get("rentalType") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const availableOnly = searchParams.get("available") === "1";
  const activeCount = countActiveFilters(searchParams);

  const applyParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const rawMin = String(data.get("minPrice") || "").trim();
    const rawMax = String(data.get("maxPrice") || "").trim();

    const min = rawMin && Number(rawMin) >= 0 ? rawMin : null;
    const max = rawMax && Number(rawMax) >= 0 ? rawMax : null;

    applyParams({ minPrice: min, maxPrice: max });
  };

  const isPresetActive = (preset: (typeof PRICE_PRESETS)[number]) =>
    (minPrice || "") === preset.min && (maxPrice || "") === preset.max;

  const hasCounts = categories.some((category) => typeof category.count === "number");
  const totalCount = categories.reduce(
    (sum, category) => sum + (category.count ?? 0),
    0
  );

  const rowClass = (active: boolean) =>
    [
      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
      active
        ? "bg-primary/10 font-semibold text-primary ring-1 ring-primary/30"
        : "text-base-content/80 hover:bg-base-200",
    ].join(" ");

  const chipClass = (active: boolean) =>
    [
      "btn btn-xs rounded-full",
      active ? "btn-primary" : "btn-ghost border border-base-300",
    ].join(" ");

  return (
    <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
          <ListFilter size={16} className="text-primary" />
          Filters
          {activeCount > 0 && (
            <span className="badge badge-primary badge-sm">{activeCount}</span>
          )}
        </h2>

        <button
          type="button"
          onClick={resetFilters}
          disabled={activeCount === 0}
          className="btn btn-ghost btn-xs gap-1"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="divide-y divide-base-300">
        {/* Category */}
        <section className="px-5 py-4">
          <SectionTitle icon={Tag}>Equipment Category</SectionTitle>

          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => applyParams({ category: null })}
                className={rowClass(!activeCategory)}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-base-200">
                  <LayoutGrid size={15} />
                </span>
                <span className="flex-1 text-left">All categories</span>
                {hasCounts && (
                  <span className="badge badge-ghost badge-sm">{totalCount}</span>
                )}
              </button>
            </li>

            {categories.map((category) => {
              const meta = metaFor(category.name);
              const Icon = meta.icon;
              const active = activeCategory === category.name;

              return (
                <li key={category.name}>
                  <button
                    type="button"
                    onClick={() => applyParams({ category: category.name })}
                    className={rowClass(active)}
                    title={category.name}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${meta.tint}`}
                    >
                      <Icon size={15} />
                    </span>

                    <span className="flex-1 truncate text-left">
                      {category.name}
                    </span>

                    {typeof category.count === "number" && (
                      <span
                        className={`badge badge-sm ${
                          active ? "badge-primary" : "badge-ghost"
                        }`}
                      >
                        {category.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Rental type */}
        <section className="px-5 py-4">
          <SectionTitle icon={Banknote}>Rental Type</SectionTitle>

          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyParams({ rentalType: null })}
              className={`btn btn-xs ${!activeType ? "btn-primary" : "btn-outline"}`}
            >
              All
            </button>

            {RENTAL_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  applyParams({ rentalType: activeType === type ? null : type })
                }
                className={`btn btn-xs ${
                  activeType === type ? "btn-primary" : "btn-outline"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Price range */}
        <section className="px-5 py-4">
          <SectionTitle icon={Coins}>Price Range</SectionTitle>

          <div className="mb-3 flex flex-wrap gap-2">
            {PRICE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  applyParams({ minPrice: preset.min, maxPrice: preset.max })
                }
                className={chipClass(isPresetActive(preset))}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form onSubmit={handlePriceSubmit} className="flex items-center gap-2">
            <input
              key={`min-${minPrice}-${maxPrice}`}
              type="number"
              name="minPrice"
              min={0}
              placeholder="Min"
              defaultValue={minPrice}
              className="input input-bordered input-sm w-full"
            />
            <span className="text-base-content/40">–</span>
            <input
              key={`max-${minPrice}-${maxPrice}`}
              type="number"
              name="maxPrice"
              min={0}
              placeholder="Max"
              defaultValue={maxPrice}
              className="input input-bordered input-sm w-full"
            />
            <button type="submit" className="btn btn-primary btn-sm shrink-0">
              Go
            </button>
          </form>
        </section>

        {/* Availability */}
        <section className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">
              <CheckCircle2 size={14} className="text-primary" />
              Availability
            </h3>
            <p className="mt-1 text-xs text-base-content/50">
              Only show items ready to book
            </p>
          </div>

          <input
            type="checkbox"
            className="toggle toggle-primary toggle-sm"
            checked={availableOnly}
            onChange={(e) =>
              applyParams({ available: e.target.checked ? "1" : null })
            }
            aria-label="Only show available equipment"
          />
        </section>
      </div>

      {/* Footer */}
      {activeCount > 0 && (
        <div className="border-t border-base-300 p-4">
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-outline btn-sm w-full"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

/** Resets every filter param (keeps the search term). */
export const ClearFiltersButton = ({ label }: { label: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <button
      type="button"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        FILTER_KEYS.forEach((key) => params.delete(key));
        params.delete("search");
        router.push(`${pathname}?${params.toString()}`);
      }}
      className="btn btn-primary btn-sm"
    >
      {label}
    </button>
  );
};

export default EquipmentFilters;
