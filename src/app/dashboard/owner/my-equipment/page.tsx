
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { EquipmentItem } from "@/data/equipment";

import Link from "next/link";

import {
  Package,
  Plus,
  RefreshCw,
} from "lucide-react";

import EquipmentTable from "@/app/component/ownerEquipments/EquipmentTable";

export default function MyEquipment() {
  const { data: session } = useSession();
  const user = session?.user;

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEquipment = async () => {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

      if (!API_BASE_URL) {
        setError("API URL is not configured.");
        setLoading(false);
        return;
      }

      // Wait for the logged-in user
      if (!user?.id && !user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/equipment`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch equipment.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid equipment data.");
        }

        // Show only the current owner's equipment
        const ownerEquipment = data.filter(
          (item: EquipmentItem) =>
            String(item.ownerId) === String(user.id) ||
            item.ownerEmail === user.email
        );

        setEquipment(ownerEquipment);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Fetch equipment error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load equipment."
        );

        setEquipment([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchEquipment();

    return () => controller.abort();
  }, [user?.id, user?.email, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };


  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            My Equipment
          </h1>

          <p className="text-sm text-base-content/60 mt-1">
            Manage your equipment listings and track their status.
          </p>
        </div>

        <Link
          href="/dashboard/owner/add-equipment"
          className="btn btn-primary btn-sm"
        >
          <Plus className="h-4 w-4" />
          Add Equipment
        </Link>
      </div>

      {/* Owner Information */}
      {user && (
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200 font-semibold text-base-content">
            {user.name?.charAt(0).toUpperCase() || "O"}
          </div>

          <div>
            <p className="text-sm font-medium text-base-content">
              {user.name}
            </p>

            <p className="text-xs text-base-content/50">
              Equipment Owner
            </p>
          </div>
        </div>
      )}

      {/* Equipment Count */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

          <div className="rounded-box border border-base-300 bg-base-100 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-base-content/60">
                Total Equipment
              </p>

              <Package className="h-5 w-5 text-primary" />
            </div>

            <p className="text-2xl font-bold mt-2">
              {equipment.length}
            </p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4">
            <p className="text-sm text-base-content/60">
              Approved Equipment
            </p>

            <p className="text-2xl font-bold mt-2">
              {equipment.filter(
                (item) => item.status === "Approved"
              ).length}
            </p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4">
            <p className="text-sm text-base-content/60">
              Pending Approval
            </p>

            <p className="text-2xl font-bold mt-2">
              {equipment.filter(
                (item) => item.status === "Pending"
              ).length}
            </p>
          </div>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary mb-4" />

          <p className="text-sm text-base-content/60">
            Loading your equipment...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-box border border-error bg-error/10 p-6 text-center">
          <p className="text-sm text-error">
            {error}
          </p>

          <button
            onClick={handleRetry}
            type="button"
            className="btn btn-outline btn-sm mt-4"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      )}

      {/* Equipment Table */}
      {!loading && !error && (
        <EquipmentTable equipment={equipment} />
      )}

    </div>
  );
}
