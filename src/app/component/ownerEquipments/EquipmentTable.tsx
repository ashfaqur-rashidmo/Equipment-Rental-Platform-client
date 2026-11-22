
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Package,
  Plus,
  Eye,
  MapPin,
  Pencil,
} from "lucide-react";

import { EquipmentItem } from "@/data/equipment";
import StatusBadge from "@/app/component/ownerEquipments/StatusBadge";
import DeleteEquipment from "@/app/component/ownerEquipments/DeleteEquipment";

interface EquipmentTableProps {
  equipment: EquipmentItem[];
}

export default function EquipmentTable({
  equipment,
}: EquipmentTableProps) {
  const [equipmentList, setEquipmentList] = useState(equipment);

  // Keep local state synchronized with updated props
  // when the parent fetches the equipment list again.
  const [previousEquipment, setPreviousEquipment] = useState(equipment);

  if (equipment !== previousEquipment) {
    setPreviousEquipment(equipment);
    setEquipmentList(equipment);
  }

  const formatPrice = (price: string | number) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "N/A";
    }

    return `৳${amount.toLocaleString("en-US")}`;
  };

  const handleDeleted = (equipmentId: string) => {
    setEquipmentList((prev) =>
      prev.filter(
        (item) => (item._id || item.id) !== equipmentId
      )
    );
  };

  return (
    <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">

      {/* Table Header */}
      <div className="flex flex-col gap-2 border-b border-base-300 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-base-content">
            All Equipment
          </h2>

          <p className="mt-1 text-xs text-base-content/50">
            {equipmentList.length} equipment listing(s) found
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table">

          <thead>
            <tr className="text-base-content/60">
              <th>Equipment</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Rental Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {equipmentList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Package className="mx-auto mb-3 h-12 w-12 text-base-content/30" />

                  <h3 className="font-semibold text-base-content">
                    No Equipment Found
                  </h3>

                  <p className="mt-1 text-sm text-base-content/50">
                    You have not added any equipment yet.
                  </p>

                  <Link
                    href="/dashboard/owner/add-equipment"
                    className="btn btn-primary btn-sm mt-4"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Equipment
                  </Link>
                </td>
              </tr>
            ) : (
              equipmentList.map((item) => {
                const equipmentId = item._id || item.id;

                return (
                  <tr key={equipmentId || item.name}>

                    {/* Equipment */}
                    <td>
                      <div className="flex min-w-52 items-center gap-3">

                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-base-200">
                          {item.image?.trim() ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Package className="h-6 w-6 text-base-content/40" />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-base-content">
                            {item.name}
                          </p>

                          <p className="text-xs text-base-content/50">
                            {item.brand || "No brand"}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="text-sm">
                        {item.category || "N/A"}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td>
                      {item.availableQuantity ?? 0}
                    </td>

                    {/* Rental Price */}
                    <td>
                      <p className="text-sm font-medium">
                        {formatPrice(item.rentalPrice)}
                      </p>

                      <p className="text-xs text-base-content/50">
                        / {item.rentalType || "Rental"}
                      </p>
                    </td>

                    {/* Location */}
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-base-content/40" />
                        {item.location || "N/A"}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Actions */}
                    <td>
                      {equipmentId ? (
                        <div className="flex items-center gap-1">

                          <Link
                            href={`/dashboard/owner/my-equipment/${equipmentId}`}
                            className="btn btn-ghost btn-xs"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/dashboard/owner/my-equipment/${equipmentId}/edit`}
                            className="btn btn-ghost btn-xs text-info"
                            title="Edit Equipment"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <DeleteEquipment
                            equipmentId={equipmentId}
                            onDeleted={handleDeleted}
                          />

                        </div>
                      ) : (
                        <span className="text-xs text-error">
                          Invalid ID
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
