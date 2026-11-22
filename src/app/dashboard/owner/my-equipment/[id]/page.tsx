
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import {
  Package,
  CalendarClock,
  User,
  MapPin,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface EquipmentItem {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: string | number;
  rentalType: string;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image?: string;
  terms: string;
  status: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  location: string;
}

const statusVariants: Record<string, string> = {
  Pending: "badge-warning",
  Approved: "badge-success",
  Rejected: "badge-error",
  Available: "badge-success",
  Rented: "badge-warning",
  Maintenance: "badge-error",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={statusVariants[status] || "badge-outline"}>
      {status || "Unknown"}
    </Badge>
  );
}

export default function EquipmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const equipmentId = params.id;

  const { data: session } = useSession();
  const user = session?.user;

  const [equipment, setEquipment] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEquipment = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

      if (!API_BASE_URL) {
        setError("API URL is not configured.");
        setLoading(false);
        return;
      }

      if (!equipmentId) {
        setError("Invalid equipment ID.");
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
          throw new Error("Invalid equipment data received from server.");
        }

        const foundEquipment = data.find(
          (item: EquipmentItem) =>
            String(item._id) === equipmentId ||
            String(item.id) === equipmentId
        );

        if (!foundEquipment) {
          throw new Error("Equipment not found.");
        }

        setEquipment(foundEquipment);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Fetch equipment details error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load equipment details."
        );

        setEquipment(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }

    };

    fetchEquipment();

    return () => controller.abort();
  }, [equipmentId, retryCount]);

  const formatPrice = (price: string | number) => {
    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return "Price unavailable";
    }

    return `৳${numericPrice.toLocaleString("en-US")}`;
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg text-primary mb-4" />
        <p className="text-sm text-base-content/60">
          Loading equipment details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-box border border-error bg-error/10 p-6 text-center shadow-sm max-w-md">
          <p className="text-sm text-error">{error}</p>

          <button
            type="button"
            onClick={handleRetry}
            className="btn btn-outline btn-sm mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>

          <div>
            <Link
              href="/dashboard/owner/my-equipment"
              className="btn btn-ghost btn-sm mt-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Equipment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm max-w-md">
          <p className="text-sm text-base-content/50">
            Equipment not found.
          </p>

          <Link
            href="/dashboard/owner/my-equipment"
            className="btn btn-outline btn-sm mt-4"
          >
            Back to My Equipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Equipment Details
          </h1>

          <p className="text-sm text-base-content/60">
            View all details for {equipment.name}
          </p>
        </div>

        <Link
          href="/dashboard/owner/my-equipment"
          className="btn btn-outline btn-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Equipment
        </Link>
      </div>

      {/* Logged-in User */}
      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <span>Logged in as {user.name}</span>
        </div>
      )}

      {/* Equipment Details */}
      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm p-6 sm:p-8 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Equipment Image */}
          <div className="relative h-64 w-full lg:w-1/3 shrink-0 rounded-lg overflow-hidden border border-base-300 bg-base-200">
            {equipment.image?.trim() ? (
  <Image
    height={256}
    width={256}
    src={equipment.image}
    alt={equipment.name || "Equipment"}
    className="h-full w-full object-cover"
    unoptimized
  />
) : (
              <div className="h-full w-full flex items-center justify-center bg-base-200 text-base-content/40">
                <Package className="h-12 w-12" />
              </div>
            )}

            <div className="absolute top-3 right-3">
              <StatusBadge status={equipment.status} />
            </div>
          </div>

          {/* Equipment Information */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-base-content mb-2">
              {equipment.name}
            </h2>

            <p className="text-base-content/60 mb-4 whitespace-pre-line">
              {equipment.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-base-content/50 uppercase">
                  Category
                </span>
                <p className="text-sm text-base-content">
                  {equipment.category || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-base-content/50 uppercase">
                  Condition
                </span>
                <p className="text-sm text-base-content">
                  {equipment.condition || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-base-content/50 uppercase">
                  Brand
                </span>
                <p className="text-sm text-base-content">
                  {equipment.brand || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-base-content/50 uppercase">
                  Model
                </span>
                <p className="text-sm text-base-content">
                  {equipment.model || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-base-content/50 uppercase">
                  Rental Type
                </span>
                <p className="text-sm text-base-content">
                  {equipment.rentalType || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-base-content/50 uppercase">
                  Available Quantity
                </span>
                <p className="text-sm text-base-content font-medium">
                  {equipment.availableQuantity ?? 0}
                </p>
              </div>
            </div>

            {/* Rental Price */}
            <div className="space-y-1 mb-4">
              <span className="text-xs font-semibold text-base-content/50 uppercase">
                Price / {equipment.rentalType || "Rental"}
              </span>

              <p className="text-lg font-bold text-base-content">
                {formatPrice(equipment.rentalPrice)}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-1 mb-4">
              <span className="text-xs font-semibold text-base-content/50 uppercase">
                Location
              </span>

              <p className="text-sm text-base-content">
                <MapPin className="mr-2 h-4 w-4 inline shrink-0" />
                {equipment.location || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Terms */}
      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm p-6 sm:p-8 mb-6">
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          Rental Terms and Conditions
        </h3>

        <p className="text-sm text-base-content/60 whitespace-pre-line">
          {equipment.terms || "No rental terms provided."}
        </p>
      </div>

      {/* Owner Information */}
      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm p-6 sm:p-8">
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          Owner Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content/60">
              <User className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-base-content">
                {equipment.ownerName || "Owner"}
              </p>

              <p className="text-xs text-base-content/50">
                {equipment.ownerEmail || ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200 text-base-content/60">
              <CalendarClock className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-base-content">
                Status
              </p>

              <StatusBadge status={equipment.status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
