"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { EquipmentItem } from "@/data/equipment";


const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Available: "badge-success",
    Rented: "badge-warning",
    Maintenance: "badge-error",
    Pending: "badge-warning",
  };
  return <Badge className={variants[status] || "badge-outline"}>{status}</Badge>;
};

export default function MyEquipment() {
  const { data: session } = useSession();
  const user = session?.user;
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!API_BASE_URL) {
          setError("API base URL is not configured.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/equipment`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch equipment.");
        }

        const data = await response.json();

        // Filter equipment belonging to the current owner
        const ownerEquipment: EquipmentItem[] = data.filter(
          (item: EquipmentItem) =>
            item.ownerId === user?.id || item.ownerEmail === user?.email
        );

        setEquipment(ownerEquipment);
        setError(null);
      } catch (err) {
        console.error("Fetch equipment error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load equipment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [user?.id, user?.email]);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">My Equipment</h1>
          <p className="text-sm text-base-content/60">
            Manage your equipment listings and rentals
          </p>
        </div>
        <Link
          href="/dashboard/owner/add-equipment"
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Equipment
        </Link>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "O"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="loading loading-spinner loading-lg text-primary mb-4" />
          <p className="text-sm text-base-content/60">Loading equipment...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-box border border-error bg-error/10 p-6 text-center shadow-sm">
          <p className="text-sm text-error">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-outline btn-sm mt-4"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-base-content/60">
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Available Qty</th>
                  <th>Status</th>
                  <th>Price/Day</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-base-content/50">
                      No equipment listed yet.{" "}
                      <Link
                        href="/dashboard/owner/add-equipment"
                        className="font-semibold text-primary link-hover"
                      >
                        Add your first equipment
                      </Link>
                    </td>
                  </tr>
                ) : (
                  equipment.map((item: EquipmentItem) => (
                    <tr key={item._id || item.id}>
                      <td className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0">
                          {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-base-content/40" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-base-content/50">
                            {item.category}
                          </div>
                        </div>
                      </td>
                      <td>{item.category}</td>
                      <td>{item.availableQuantity}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="font-medium">{item.rentalPrice}</td>
                      <td>{item.location}</td>
                      <td className="flex gap-2">
                        <Link
                          href={`/dashboard/owner/my-equipment/${item._id || item.id}`}
                          className="btn btn-ghost btn-xs"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-destructive"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
