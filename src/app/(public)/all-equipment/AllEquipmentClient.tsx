
"use client";

import EquipmentGrid from "@/app/component/PublicEquipment/EquipmentGrid";
import { EquipmentItem } from "@/data/equipment";
import EquipmentSearch from "@/app/component/PublicEquipment/EquipmentSearch";

interface AllEquipmentClientProps {
  equipments: EquipmentItem[];
  initialSearch: string;
}

const AllEquipmentClient = ({
  equipments,
  initialSearch,
}: AllEquipmentClientProps) => {
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

        {/* Equipment Count */}
        <p className="mb-5 text-sm text-base-content/60">
          {equipments.length} equipment
          {equipments.length !== 1 ? "s" : ""} found
        </p>

        {/* Empty State */}
        {equipments.length === 0 && (
          <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center">
            <h2 className="text-xl font-semibold">
              No equipment found
            </h2>

            <p className="mt-2 text-sm text-base-content/60">
              Try searching with another equipment name or location.
            </p>
          </div>
        )}

        {/* Equipment Grid */}
        {equipments.length > 0 && (
          <EquipmentGrid equipments={equipments} />
        )}

      </div>
    </main>
  );
};

export default AllEquipmentClient;
