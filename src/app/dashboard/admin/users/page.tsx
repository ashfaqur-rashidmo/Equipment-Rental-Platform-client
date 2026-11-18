"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Shield, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const users = [
  {
    id: "1",
    name: "Afsara Rahman",
    email: "afsara@example.com",
    role: "Customer",
    registeredAt: "2026-10-01",
  },
  {
    id: "2",
    name: "Rahim Khan",
    email: "rahim@example.com",
    role: "Owner",
    registeredAt: "2026-10-05",
  },
  {
    id: "3",
    name: "Sakib Hasan",
    email: "sakib@example.com",
    role: "Customer",
    registeredAt: "2026-10-12",
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "Owner",
    registeredAt: "2026-10-15",
  },
  {
    id: "5",
    name: "Tanvir Ahmed",
    email: "tanvir@example.com",
    role: "Admin",
    registeredAt: "2026-10-20",
  },
];

const roles = ["Customer", "Owner", "Admin"] as const;

const RoleBadge = ({ role }: { role: string }) => {
  const variants: Record<string, string> = {
    Customer: "badge-outline",
    Owner: "badge-secondary",
    Admin: "badge-error",
  };
  return <Badge className={variants[role] || "badge-outline"}>{role}</Badge>;
};

export default function AllUsersPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRoles, setNewRoles] = useState<Record<string, string>>({});

  const handleRoleSelect = (userId: string, role: string) => {
    setNewRoles((prev) => ({ ...prev, [userId]: role }));
  };

  const handleSaveRole = (userId: string) => {
    // UI only — backend implementation required
    const role = newRoles[userId] || users.find((u) => u.id === userId)?.role;
    console.log("Change role:", userId, role);
    setEditingRole(null);
    setNewRoles((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">All Users</h1>
          <p className="text-sm text-base-content/60">
            Manage all registered users on the platform
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="btn btn-outline btn-sm"
        >
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}

      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/60">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id}>
                  <td className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-base-200 flex items-center justify-center text-base-content/60">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{userItem.name}</div>
                      <div className="text-xs text-base-content/50">
                        {userItem.email}
                      </div>
                    </div>
                  </td>
                  <td>{userItem.email}</td>
                  <td>
                    {editingRole === userItem.id ? (
                      <select
                        defaultValue={userItem.role}
                        className="select select-sm border-border w-24"
                        onChange={(e) =>
                          handleRoleSelect(userItem.id, e.target.value)
                        }
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <RoleBadge role={userItem.role} />
                    )}
                  </td>
                  <td>{userItem.registeredAt}</td>
                  <td className="flex gap-1">
                    {editingRole === userItem.id ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveRole(userItem.id)}
                          className="btn btn-primary btn-xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRole(null)}
                          className="btn btn-ghost btn-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingRole(userItem.id)}
                          className="btn btn-ghost btn-xs text-primary"
                          title="Change Role"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-base-content"
                          title="Manage User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-base-content/50">
        <p>
          <strong>Note:</strong> Backend implementation is required for role
          changes and user management actions.
        </p>
      </div>
    </div>
  );
}
