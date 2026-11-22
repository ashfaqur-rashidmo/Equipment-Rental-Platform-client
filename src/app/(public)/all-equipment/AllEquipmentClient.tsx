
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
  const [sort, setSort] = useState(searchParams.get("sort") || "recent");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSort(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value === "recent") params.delete("sort");
    else params.set("sort", value);

    router.push(`${pathname}?${params.toString()}`);
  };
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(equipments.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageItems = equipments.slice(
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
                {equipments.length} equipment
                {equipments.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Empty State */}
            {equipments.length === 0 && (
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
            {equipments.length > 0 && (
              <EquipmentGrid equipments={pageItems} />
            )}

            <Pagination
              total={equipments.length}
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
