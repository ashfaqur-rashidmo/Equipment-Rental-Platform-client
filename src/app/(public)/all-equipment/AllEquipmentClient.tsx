
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { EquipmentItem } from "@/data/equipment";
import { EquipmentCategory } from "@/lib/api/getEquipmentCategories";
import EquipmentGrid from "@/app/component/PublicEquipment/EquipmentGrid";
import EquipmentSearch from "@/app/component/PublicEquipment/EquipmentSearch";
import EquipmentFilters, {
  ClearFiltersButton,
  countActiveFilters,
} from "@/app/component/PublicEquipment/EquipmentFilters";
import ActiveFilterChips from "@/app/component/PublicEquipment/ActiveFilterChips";
import Pagination from "@/components/ui/pagination";

const PAGE_SIZE = 10;

interface AllEquipmentClientProps {
  equipments: EquipmentItem[];
  initialSearch: string;
  categories: EquipmentCategory[];
}

const AllEquipmentClient = ({
  equipments,
  initialSearch,
  categories,
}: AllEquipmentClientProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeCount = countActiveFilters(searchParams);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  // The API returns the full collection, so search, filters and price
  // sorting are applied here against the current URL search params.
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "";
  const rentalType = searchParams.get("rentalType") || "";
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = Number(minPriceParam);
  const maxPrice = Number(maxPriceParam);
  const availableOnly = searchParams.get("available") === "1";
  const sort = searchParams.get("sort") || "recent";

  const filteredEquipments = equipments.filter((item) => {
    if (
      search &&
      !`${item.name || ""} ${item.location || ""}`.toLowerCase().includes(search)
    ) {
      return false;
    }

    if (category) {
      // Match the leading word so "Photography" also matches
      // "Photography Equipment" values stored in the database.
      const leadingWord =
        category.trim().split(/\s+/)[0]?.toLowerCase() || "";
      if (!(item.category || "").trim().toLowerCase().startsWith(leadingWord)) {
        return false;
      }
    }

    if (
      rentalType &&
      (item.rentalType || "").toLowerCase() !== rentalType.toLowerCase()
    ) {
      return false;
    }

    if (minPriceParam || maxPriceParam) {
      const price = Number(item.rentalPrice);
      if (!Number.isFinite(price)) return false;
      if (minPriceParam && price < minPrice) return false;
      if (maxPriceParam && price > maxPrice) return false;
    }

    if (availableOnly && !(Number(item.availableQuantity) > 0)) return false;

    return true;
  });

  const sortedEquipments = [...filteredEquipments];
  if (sort === "priceLow") {
    sortedEquipments.sort(
      (a, b) => Number(a.rentalPrice) - Number(b.rentalPrice)
    );
  } else if (sort === "priceHigh") {
    sortedEquipments.sort(
      (a, b) => Number(b.rentalPrice) - Number(a.rentalPrice)
    );
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") params.delete("sort");
    else params.set("sort", value);

    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(sortedEquipments.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = sortedEquipments.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content">
            All Equipment
          </h1>

          <p className="mt-2 text-base-content/60">
            Find the right equipment for your next project.
          </p>
        </div>

        {/* Search Input */}
        <EquipmentSearch initialSearch={initialSearch} />

        {/* Filters + Results */}
        <div className="grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">

          {/* Mobile: collapsible filter panel */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="btn btn-outline w-full justify-between"
              aria-expanded={filtersOpen}
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal size={16} />
                Filters
              </span>

              <span className="flex items-center gap-2">
                {activeCount > 0 && (
                  <span className="badge badge-primary badge-sm">
                    {activeCount}
                  </span>
                )}
                {filtersOpen ? "Hide" : "Show"}
              </span>
            </button>

            {filtersOpen && (
              <div className="mt-4">
                <EquipmentFilters categories={categories} />
              </div>
            )}
          </div>

          {/* Desktop: sticky filter sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
              <EquipmentFilters categories={categories} />
            </div>
          </aside>

          {/* Results column */}
          <section className="min-w-0">
            {/* Toolbar: sort select + active filter chips + result count */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="equipment-sort"
                    className="text-xs font-medium text-base-content/50"
                  >
                    Sort by
                  </label>
                  <select
                    id="equipment-sort"
                    value={sort}
                    onChange={handleSortChange}
                    className="select select-bordered select-sm"
                    aria-label="Sort equipment"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>

                <ActiveFilterChips />
              </div>

              <p className="ml-auto text-sm text-base-content/60">
                {sortedEquipments.length} equipment
                {sortedEquipments.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Empty State */}
            {sortedEquipments.length === 0 && (
              <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-base-200">
                  <SearchX size={26} className="text-base-content/40" />
                </span>

                <h2 className="mt-4 text-xl font-semibold">
                  No equipment found
                </h2>

                <p className="mt-2 text-sm text-base-content/60">
                  Try another search term, or loosen the filters below.
                </p>

                <div className="mt-5 flex justify-center">
                  <ClearFiltersButton label="Clear search & filters" />
                </div>
              </div>
            )}

            {/* Equipment Grid */}
            {sortedEquipments.length > 0 && (
              <EquipmentGrid equipments={pageItems} />
            )}

            <Pagination
              total={sortedEquipments.length}
              pageSize={PAGE_SIZE}
              page={safePage}
              onPageChange={setPage}
              className="mt-8"
            />
          </section>
        </div>

      </div>
    </main>
  );
};

export default AllEquipmentClient;
