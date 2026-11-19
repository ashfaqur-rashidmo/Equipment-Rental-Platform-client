
"use client";

import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatAmount } from "./EquipmentFilters";

interface Chip {
  /** Single chip may own several query keys (e.g. price range). */
  keys: string[];
  label: string;
}

const buildPriceLabel = (min: string, max: string) => {
  if (min && max) return `${formatAmount(Number(min))} – ${formatAmount(Number(max))}`;
  if (max) return `Under ${formatAmount(Number(max))}`;
  if (min) return `${formatAmount(Number(min))} & above`;
  return "Price";
};

const ActiveFilterChips = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const rentalType = searchParams.get("rentalType") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const availableOnly = searchParams.get("available") === "1";

  const chips: Chip[] = [];

  if (search) chips.push({ keys: ["search"], label: `“${search}”` });
  if (category) chips.push({ keys: ["category"], label: category });
  if (rentalType) chips.push({ keys: ["rentalType"], label: `${rentalType} rental` });
  if (minPrice || maxPrice) {
    chips.push({
      keys: ["minPrice", "maxPrice"],
      label: buildPriceLabel(minPrice, maxPrice),
    });
  }
  if (availableOnly) chips.push({ keys: ["available"], label: "Available only" });

  if (chips.length === 0) return null;

  const removeChip = (keys: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => params.delete(key));
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className="badge badge-outline gap-1 py-3 pl-3 pr-1 text-sm"
        >
          {chip.label}

          <button
            type="button"
            onClick={() => removeChip(chip.keys)}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X size={13} />
          </button>
        </span>
      ))}

      <button type="button" onClick={clearAll} className="btn btn-ghost btn-xs">
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilterChips;
