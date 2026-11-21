
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  Search,
  Users,
  ShieldCheck,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "Customer" | "Owner" | "Admin";
  createdAt: string;
}

const roles = ["Customer", "Owner", "Admin"];

export default function AllUsersPage() {
  const { data: session, isPending } = useSession();
  const currentUser = session?.user;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch all users
  const fetchUsers = async () => {
    if (!API_BASE_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid user data received.");
      }

      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);

      setError(
        err instanceof Error ? err.message : "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!currentUser) {
      setLoading(false);
      setError("Please log in to access this page.");
      return;
    }

    fetchUsers();
  }, [isPending, currentUser?.id]);

  // Change a user's role in local state
  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, role: newRole as AdminUser["role"] }
          : user
      )
    );
  };

  // Save updated role
  const handleSaveRole = async (user: AdminUser) => {
    if (!API_BASE_URL) {
      toast.error("API URL is not configured.");
      return;
    }

    if (!user.role) {
      toast.error("Please select a role.");
      return;
    }

    if (user._id === currentUser?.id && user.role !== "Admin") {
      toast.error("You cannot remove your own Admin role.");
      return;
    }

    try {
      setSavingId(user._id);

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${user._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: user.role }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to update user role.");
      }

      toast.success("User role updated successfully.");

      // Re-fetch from the server so the table reflects the updated role.
      fetchUsers();
    } catch (err) {
      console.error("Update role error:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to update user role."
      );

      fetchUsers();
    } finally {
      setSavingId("");
    }
  };

  // Delete a user
  const handleDeleteUser = async (user: AdminUser) => {
    if (!API_BASE_URL) {
      toast.error("API URL is not configured.");
      return;
    }

    if (user._id === currentUser?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name || user.email}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(user._id);

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${user._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Failed to delete user.");
      }

      setUsers((prev) => prev.filter((item) => item._id !== user._id));

      toast.success("User deleted successfully.");
    } catch (err) {
      console.error("Delete user error:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to delete user."
      );
    } finally {
      setDeletingId("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.role?.toLowerCase().includes(searchValue)
    );
  });

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            All Users
          </h1>

          <p className="mt-1 text-sm text-base-content/60">
            Manage registered users and their account roles.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 px-4 py-2">
          <Users className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            {users.length} Total Users
          </span>
        </div>
      </div>

      {/* User Summary */}
      {!loading && !error && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Total Users</p>
            <p className="mt-2 text-2xl font-bold">{users.length}</p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Customers</p>
            <p className="mt-2 text-2xl font-bold">
              {users.filter((user) => user.role === "Customer").length}
            </p>
          </div>

          <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-base-content/60">Owners</p>
            <p className="mt-2 text-2xl font-bold">
              {users.filter((user) => user.role === "Owner").length}
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
            placeholder="Search by name, email or role..."
            className="input input-bordered w-full pl-10"
          />
        </div>

        <button
          type="button"
          onClick={fetchUsers}
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
            Loading users...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-box border border-error bg-error/10 p-6 text-center">
          <p className="text-sm text-error">{error}</p>

          <button
            type="button"
            onClick={fetchUsers}
            className="btn btn-outline btn-sm mt-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm">
          <div className="border-b border-base-300 p-5">
            <h2 className="font-semibold text-base-content">
              Registered Users
            </h2>

            <p className="mt-1 text-xs text-base-content/50">
              View users and manage their account permissions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/60 text-base-content/70">
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-base-200/40">
                    {/* Name */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <span className="font-medium text-base-content">
                          {user.name || "Unknown User"}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="text-sm text-base-content/70">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />

                        <select
                          value={user.role || "Customer"}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="select select-bordered select-sm min-w-28"
                          disabled={user._id === currentUser?.id}
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="text-sm text-base-content/70">
                      {formatDate(user.createdAt)}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSaveRole(user)}
                          disabled={
                            savingId === user._id ||
                            deletingId === user._id ||
                            user._id === currentUser?.id
                          }
                          className="btn btn-primary btn-sm"
                          title="Save role"
                        >
                          {savingId === user._id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          disabled={
                            deletingId === user._id ||
                            savingId === user._id ||
                            user._id === currentUser?.id
                          }
                          className="btn btn-outline btn-error btn-sm"
                          title="Delete user"
                        >
                          {deletingId === user._id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <Users className="mx-auto h-10 w-10 text-base-content/30" />

                      <p className="mt-3 font-medium text-base-content">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-base-content/50">
                        Try searching with a different name or email.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-base-300 px-5 py-3">
            <p className="text-xs text-base-content/50">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
