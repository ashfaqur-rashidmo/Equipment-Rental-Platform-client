"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/ui/pagination";

const PAGE_SIZE = 10;
import { useSession } from "@/lib/auth-client";

import { EquipmentItem, formatPrice } from "@/data/equipment";
import { Rental } from "@/lib/api/rentals";
import StatusBadge from "@/app/component/ownerEquipments/StatusBadge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type EquipmentMap = Record<string, EquipmentItem>;

type UserEntry = { _id?: string; id?: string; name?: string; email?: string };

type UsersMap = Record<string, { name?: string; email?: string }>;

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const durationLabel = (rental: Rental) => {
  const startDate = formatDate(rental.startDate);
  const endDate = formatDate(rental.endDate);

  let days = rental.days;

  if (days === undefined && rental.startDate && rental.endDate) {
    const diff =
      new Date(rental.endDate).getTime() -
      new Date(rental.startDate).getTime();

    days = Math.max(1, Math.ceil(diff / 86400000));
  }

  return days ? `${startDate} – ${endDate} (${days} day${days === 1 ? "" : "s"})` : `${startDate} – ${endDate}`;
};

export default function AllRentalsPage() {
  const { data: session } = useSession();
  const token = session?.session?.token;

  const [page, setPage] = useState(1);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningSweep, setRunningSweep] = useState(false);
  const [error, setError] = useState("");

  // Lookup data used to resolve the owner of each equipment listing.
  const [equipmentMap, setEquipmentMap] = useState<EquipmentMap>({});
  const [usersMap, setUsersMap] = useState<UsersMap>({});

  // Fetch all rentals from the admin endpoint.
  const fetchRentals = async () => {
    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/admin/rentals`, {
        cache: "no-store",
        headers: session?.session?.token
          ? { Authorization: `Bearer ${session.session.token}` }
          : undefined,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rentals.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid rental data received.");
      }

      setRentals(data);
    } catch (err) {
      console.error("Fetch rentals error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load rentals."
      );
    } finally {
      setLoading(false);
    }
  };

  // Run the overdue-booking sweep on demand (same job as the server cron).
  const runStatusSweep = async () => {
    if (!API_BASE_URL || !token) {
      toast.error("Admin session is required to run this action.");
      return;
    }

    setRunningSweep(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/cron/update-booking-status`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Failed to update booking statuses.");
      }

      toast.success(
        `Completed ${data.updated ?? 0} overdue booking(s); ` +
          `${data.restocked ?? 0} equipment restocked.`
      );
      await fetchRentals();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update booking statuses."
      );
    } finally {
      setRunningSweep(false);
    }
  };

  // Fetch equipment + users to resolve owner information for each rental.
  const fetchSupportData = async () => {
    if (!API_BASE_URL) return;

    try {
      const [equipmentRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/equipment`, {
          cache: "no-store",
          headers: session?.session?.token
            ? { Authorization: `Bearer ${session.session.token}` }
            : undefined,
        }),
        fetch(`${API_BASE_URL}/users`, { cache: "no-store" }),
      ]);

      const equipment = await equipmentRes.json().catch(() => null);
      const users: UserEntry[] | null =
        await usersRes.json().catch(() => null);

      const equipmentMap: EquipmentMap = {};

      for (const item of Array.isArray(equipment) ? equipment : []) {
        const key = String(item?._id || item?.id);

        if (key && key !== "undefined") {
          equipmentMap[key] = item as EquipmentItem;
        }
      }

      const usersMap: UsersMap = {};

      for (const user of Array.isArray(users) ? users : []) {
        const key = String(user?._id || user?.id);

        if (key && key !== "undefined") {
          usersMap[key] = { name: user?.name, email: user?.email };
        }
      }

      setEquipmentMap(equipmentMap);
      setUsersMap(usersMap);
    } catch (err) {
      // Owner lookup is enrichment; don't fail the page on it.
      console.error("Fetch support data error:", err);
    }
  };

  useEffect(() => {
    // Wait for the session/token before fetching — the fetches need
    // authorization, so firing immediately would 401 every time.
    if (token) {
      void (async () => {
        await fetchRentals();
        await fetchSupportData();
      })();
    }
  }, [token]);

  const rentalId = (rental: Rental) => String(rental._id);

  // Resolve the owner (name + email) of a rental's equipment listing.
  const getOwner = (rental: Rental) => {
    const equipment = equipmentMap[String(rental.equipmentId)];
    const ownerId = equipment?.ownerId || equipment?.id;
    const owner = ownerId ? usersMap[String(ownerId)] : undefined;

    return {
      name: equipment?.ownerName || owner?.name || "N/A",
      email: equipment?.ownerEmail || owner?.email,
    };
  };

  const sortedRentals = [...rentals].sort((a, b) =>
    (b.bookingDate || "").localeCompare(a.bookingDate || "")
  );

  const totalPages = Math.max(1, Math.ceil(sortedRentals.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageRentals = sortedRentals.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            All Rentals
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            View and manage every rental booking across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 px-4 py-2">
          <Package className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {rentals.length} Total Rentals
          </span>
        </div>
      </div>

      {/* Status Summary */}
      {!loading && !error && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Total Rentals</p>
            <p className="mt-2 text-2xl font-bold">{rentals.length}</p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Pending Bookings</p>
            <p className="mt-2 text-2xl font-bold">
              {
                rentals.filter(
                  (rental) =>
                    String(rental.bookingStatus).toLowerCase() === "pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Paid Rentals</p>
            <p className="mt-2 text-2xl font-bold">
              {
                rentals.filter(
                  (rental) =>
                    String(rental.paymentStatus).toLowerCase() === "paid"
                ).length
              }
            </p>
          </div>
        </div>
      )}

      {/* Refresh */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fetchRentals}
          disabled={loading}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
        <button
          type="button"
          onClick={runStatusSweep}
          disabled={runningSweep || loading}
          className="btn btn-primary btn-sm"
          title="Mark bookings whose rental end date has passed as Completed"
        >
          <CalendarCheck
            className={`h-4 w-4 ${runningSweep ? "animate-spin" : ""}`}
          />
          {runningSweep ? "Updating..." : "Update overdue bookings"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-3 text-sm text-base-content/60">
            Loading rentals...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-box border border-error bg-error/10 p-6 text-center">
          <p className="text-sm text-error">{error}</p>

          <button
            type="button"
            onClick={fetchRentals}
            className="btn btn-outline btn-sm mt-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Rentals Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-300 p-5">
            <h2 className="font-semibold text-base-content">
              Rental Bookings
            </h2>

            <p className="mt-1 text-xs text-base-content/50">
              Manage payment and booking status for every rental activity.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/60 text-base-content/70">
                  <th>Customer Information</th>
                  <th>Owner Information</th>
                  <th>Equipment Name</th>
                  <th>Rental Duration</th>
                  <th>Booking Amount</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                </tr>
              </thead>

              <tbody>
                {pageRentals.map((rental) => {
                  const id = rentalId(rental);
                  const owner = getOwner(rental);

                  return (
                    <tr key={id || rental.equipmentId} className="hover:bg-base-200/40">
                      {/* Customer Information */}
                      <td>
                        <p className="text-sm font-medium text-base-content">
                          {rental.customerName || "Unknown Customer"}
                        </p>

                        {rental.contactNumber && (
                          <p className="mt-0.5 text-xs text-base-content/50">
                            {rental.contactNumber}
                          </p>
                        )}
                      </td>

                      {/* Owner Information */}
                      <td>
                        <p className="text-sm font-medium text-base-content">
                          {owner.name}
                        </p>

                        {owner.email && (
                          <p className="mt-0.5 text-xs text-base-content/50">
                            {owner.email}
                          </p>
                        )}
                      </td>

                      {/* Equipment Name */}
                      <td className="text-sm text-base-content/70">
                        {rental.equipmentName ||
                          equipmentMap[String(rental.equipmentId)]?.name ||
                          "N/A"}
                      </td>

                      {/* Rental Duration */}
                      <td className="text-sm text-base-content/70">
                        {durationLabel(rental)}
                      </td>

                      {/* Booking Amount */}
                      <td className="text-sm font-medium text-base-content">
                        {formatPrice(rental.totalAmount)}
                      </td>

                      {/* Payment Status */}
                      <td>
                        <StatusBadge status={rental.paymentStatus} />
                      </td>

                      {/* Booking Status */}
                      <td>
                        <StatusBadge status={rental.bookingStatus} />
                      </td>
                    </tr>
                  );
                })}

                {sortedRentals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Package className="mx-auto h-10 w-10 text-base-content/30" />

                      <p className="mt-3 font-medium text-base-content">
                        No Rentals Found
                      </p>

                      <p className="mt-1 text-sm text-base-content/50">
                        No rental bookings are recorded yet.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-base-300 px-5 py-3">
            <p className="text-xs text-base-content/50">
              Showing {pageRentals.length} of {rentals.length} rentals
            </p>
          </div>
        </div>
      )}

      <Pagination
        total={sortedRentals.length}
        pageSize={PAGE_SIZE}
        page={safePage}
        onPageChange={setPage}
        className="mt-4"
      />
    </div>
  );
}
