"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  MapPin,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  CheckCircle,
  Ban,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/ui/pagination";

const PAGE_SIZE = 10;
import { useSession } from "@/lib/auth-client";

import { EquipmentItem } from "@/data/equipment";
import StatusBadge from "@/app/component/ownerEquipments/StatusBadge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"] as const;

// Local edit-form type; numeric fields are edited as strings in the form.
type EditForm = Partial<
  Omit<EquipmentItem, "rentalPrice" | "availableQuantity">
> & {
  rentalPrice?: string | number;
  availableQuantity?: string | number;
};

export default function AllEquipmentPage() {
  const { data: session } = useSession();
  const token = session?.session?.token;
  const [page, setPage] = useState(1);

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyKey, setBusyKey] = useState("");

  // State for the "Update" edit form (a single open form at a time).
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<EditForm>({});

  const isBusy = (key: string) => busyKey === key;

  // Fetch all equipment from the admin endpoint.
  const fetchEquipment = async () => {
    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/admin/equipment`, {
        cache: "no-store",
        headers: session?.session?.token
          ? { Authorization: `Bearer ${session.session.token}` }
          : undefined,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch equipment.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid equipment data received.");
      }

      setEquipment(data);
    } catch (err) {
      console.error("Fetch equipment error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load equipment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token)
      void (async () => {
        await fetchEquipment();
      })();
  }, [token]);

  const equipmentId = (item: EquipmentItem) => item._id || item.id;

  // Normalize the stored status to its display form ("pending" -> "Pending").
  const statusOf = (item: EquipmentItem): string => {
    const raw = String(item.status || "").trim();

    if (!raw) return "Unknown";

    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  const formatPrice = (price: string | number) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) {
      return "N/A";
    }

    return `৳${amount.toLocaleString("en-US")}`;
  };

  const filteredEquipment = equipment.filter((item) => {
    const searchValue = search.toLowerCase();

    return (
      item.name?.toLowerCase().includes(searchValue) ||
      item.category?.toLowerCase().includes(searchValue) ||
      item.location?.toLowerCase().includes(searchValue) ||
      (item.ownerName || item.ownerEmail || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEquipment.length / PAGE_SIZE)
  );
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageEquipment = filteredEquipment.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Set the equipment status (Approve / Reject) via the generic equipment route.
  const updateStatus = async (
    item: EquipmentItem,
    status: "Approved" | "Rejected"
  ) => {
    const id = equipmentId(item);

    if (!id) return;

    setBusyKey(`status:${id}`);

    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(session?.session?.token
            ? { Authorization: `Bearer ${session.session.token}` }
            : {}),
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.error || `Failed to ${status.toLowerCase()} equipment.`
        );
      }

      toast.success(
        status === "Approved" ? "Equipment approved." : "Equipment rejected."
      );

      fetchEquipment();
    } catch (err) {
      console.error("Update status error:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to update equipment."
      );
    } finally {
      setBusyKey("");
    }
  };

  const openEditor = (item: EquipmentItem) => {
    setForm({
      _id: equipmentId(item),
      name: item.name,
      category: item.category,
      rentalPrice: item.rentalPrice,
      rentalType: item.rentalType,
      location: item.location,
      availableQuantity: item.availableQuantity,
      brand: item.brand,
    });
    setFormOpen(true);
  };

  const closeEditor = () => {
    setFormOpen(false);
    setForm({});
  };

  const toNumber = (value?: string | number) => {
    if (value === undefined || value === null) return undefined;

    const str = String(value).trim();

    return str === "" ? undefined : Number(str);
  };

  const saveEquipment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const id = equipmentId(form as EquipmentItem);

    if (!id) return;

    setBusyKey(`save:${id}`);

    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(session?.session?.token
            ? { Authorization: `Bearer ${session.session.token}` }
            : {}),
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          rentalPrice: toNumber(form.rentalPrice),
          rentalType: form.rentalType,
          location: form.location,
          availableQuantity: toNumber(form.availableQuantity),
          brand: form.brand,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to update equipment.");
      }

      toast.success("Equipment updated.");
      closeEditor();
      fetchEquipment();
    } catch (err) {
      console.error("Update equipment error:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to update equipment."
      );
    } finally {
      setBusyKey("");
    }
  };

  const deleteEquipment = async (item: EquipmentItem) => {
    const id = equipmentId(item);

    if (!id) return;

    const confirmed = window.confirm(
      `Delete "${item.name || "this equipment"}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyKey(`delete:${id}`);

    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
        method: "DELETE",
        headers: session?.session?.token
          ? { Authorization: `Bearer ${session.session.token}` }
          : undefined,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete equipment.");
      }

      toast.success("Equipment deleted.");
      fetchEquipment();
    } catch (err) {
      console.error("Delete equipment error:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to delete equipment."
      );
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            All Equipment
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Monitor every equipment listing across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 px-4 py-2">
          <Package className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {equipment.length} Total Listings
          </span>
        </div>
      </div>

      {/* Status Summary */}
      {!loading && !error && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Approved</p>
            <p className="mt-2 text-2xl font-bold">
              {equipment.filter((item) => statusOf(item) === "Approved")
                .length}
            </p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Pending</p>
            <p className="mt-2 text-2xl font-bold">
              {equipment.filter((item) => statusOf(item) === "Pending")
                .length}
            </p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Rejected</p>
            <p className="mt-2 text-2xl font-bold">
              {equipment.filter((item) => statusOf(item) === "Rejected")
                .length}
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, location or owner..."
            className="input input-bordered w-full pl-10"
          />
        </div>

        <button
          type="button"
          onClick={fetchEquipment}
          disabled={loading}
          className="btn btn-outline btn-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
          <p className="mt-3 text-sm text-base-content/60">
            Loading equipment...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-box border border-error bg-error/10 p-6 text-center">
          <p className="text-sm text-error">{error}</p>

          <button
            type="button"
            onClick={fetchEquipment}
            className="btn btn-outline btn-sm mt-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Equipment Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-300 p-5">
            <h2 className="font-semibold text-base-content">
              Equipment Listings
            </h2>

            <p className="mt-1 text-xs text-base-content/50">
              View equipment details, set status and manage listings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/60 text-base-content/70">
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Owner</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pageEquipment.map((item) => {
                  const id = equipmentId(item);
                  const busyStatus = isBusy(`status:${id}`);
                  const busyDelete = isBusy(`delete:${id}`);

                  return (
                    <tr
                      key={id || item.name}
                      className="hover:bg-base-200/40"
                    >
                      {/* Equipment */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
                            <Package className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="font-medium text-base-content">
                              {item.name}
                            </p>

                            <p className="text-xs text-base-content/50">
                              {item.brand || "No brand"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="text-sm text-base-content/70">
                        {item.category || "N/A"}
                      </td>

                      {/* Owner */}
                      <td className="text-sm text-base-content/70">
                        {item.ownerName ||
                          item.ownerEmail ||
                          item.ownerId ||
                          "N/A"}
                      </td>

                      {/* Price */}
                      <td className="text-sm font-medium text-base-content">
                        {formatPrice(item.rentalPrice)}
                        {item.rentalType && (
                          <span className="ml-1 text-xs text-base-content/50">
                            / {item.rentalType}
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td>
                        <div className="flex items-center gap-1 text-sm text-base-content/70">
                          <MapPin className="h-3.5 w-3.5 text-base-content/40" />
                          {item.location || "N/A"}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <StatusBadge status={statusOf(item)} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          {statusOf(item) === "Pending" && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                onClick={() =>
                                  updateStatus(item, "Approved")
                                }
                                disabled={busyStatus}
                              >
                                {busyStatus ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                Approve
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-error btn-outline"
                                onClick={() =>
                                  updateStatus(item, "Rejected")
                                }
                                disabled={busyStatus}
                              >
                                {busyStatus ? (
                                  <span className="loading loading-spinner loading-xs" />
                                ) : (
                                  <Ban className="h-4 w-4" />
                                )}
                                Reject
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            onClick={() => openEditor(item)}
                            title="Update equipment"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-ghost text-error"
                            onClick={() => deleteEquipment(item)}
                            disabled={busyDelete}
                            title="Delete equipment"
                          >
                            {busyDelete ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredEquipment.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <Package className="mx-auto h-10 w-10 text-base-content/30" />

                      <p className="mt-3 font-medium text-base-content">
                        No Equipment Found
                      </p>

                      <p className="mt-1 text-sm text-base-content/50">
                        Try searching with a different name, category or
                        location.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-base-300 px-5 py-3">
            <p className="text-xs text-base-content/50">
              Showing {pageEquipment.length} of {filteredEquipment.length} listings
            </p>
          </div>
        </div>
      )}

      <Pagination
        total={filteredEquipment.length}
        pageSize={PAGE_SIZE}
        page={safePage}
        onPageChange={setPage}
        className="mt-4"
      />

      {/* Update Equipment Modal */}
      {formOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Update Equipment</h3>

            <form onSubmit={saveEquipment} className="space-y-4 pt-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={form.name || ""}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Category</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={form.category || ""}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Brand</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={form.brand || ""}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Rental Price</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={String(form.rentalPrice ?? "")}
                    onChange={(e) =>
                      setForm({ ...form, rentalPrice: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="select select-bordered"
                    value={form.rentalType || "Daily"}
                    onChange={(e) =>
                      setForm({ ...form, rentalType: e.target.value })
                    }
                  >
                    {RENTAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={String(form.availableQuantity ?? "")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        availableQuantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Location</label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={closeEditor}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isBusy(`save:${equipmentId(form as EquipmentItem)}`)}
                >
                  {isBusy(`save:${equipmentId(form as EquipmentItem)}`) ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
