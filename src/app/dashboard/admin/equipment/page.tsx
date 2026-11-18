"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Trash2,
  Edit,
} from "lucide-react";
import Link from "next/link";

const equipment = [
  {
    id: "1",
    name: "Excavator CAT 320",
    ownerName: "Rahim Khan",
    category: "Construction",
    status: "Pending",
    pricePerDay: "$120/day",
    location: "Dhaka, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "DJI Mavic 3 Drone",
    ownerName: "Nusrat Jahan",
    category: "Photography",
    status: "Approved",
    pricePerDay: "$45/day",
    location: "Chattogram, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1444436231540-804f065e3d72?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Portable Generator 5kW",
    ownerName: "Sakib Hasan",
    category: "Equipment",
    status: "Rejected",
    pricePerDay: "$35/day",
    location: "Sylhet, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1590402342344-99599e8a10d9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Scaffold Tower 6m",
    ownerName: "Rahim Khan",
    category: "Construction",
    status: "Pending",
    pricePerDay: "$25/day",
    location: "Khulna, Bangladesh",
    image:
      "https://images.unsplash.com/photo-154187880807e-64292f9e1c6d?auto=format&fit=crop&w=400&q=80",
  },
];

const statuses = ["Pending", "Approved", "Rejected"] as const;

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Pending: "badge-warning",
    Approved: "badge-success",
    Rejected: "badge-error",
  };
  return <Badge className={variants[status] || "badge-outline"}>{status}</Badge>;
};

export default function AllEquipmentPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [newStatuses, setNewStatuses] = useState<Record<string, string>>({});

  const handleStatusSelect = (equipmentId: string, status: string) => {
    setNewStatuses((prev) => ({ ...prev, [equipmentId]: status }));
  };

  const handleSaveStatus = (equipmentId: string) => {
    // UI only — backend implementation required
    const status = newStatuses[equipmentId];
    console.log("Update equipment status:", equipmentId, status);
    setEditingStatus(null);
    setNewStatuses((prev) => {
      const next = { ...prev };
      delete next[equipmentId];
      return next;
    });
  };

  const handleApprove = (id: string) => {
    console.log("Approve equipment:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject equipment:", id);
  };

  const handleUpdate = (id: string) => {
    console.log("Update equipment:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete equipment:", id);
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">All Equipment</h1>
          <p className="text-sm text-base-content/60">
            Review and manage all equipment listings on the platform
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
                <th>Equipment</th>
                <th>Owner</th>
                <th>Category</th>
                <th>Status</th>
                <th>Price/Day</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item.id}>
                  <td className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-base-content/50">
                        {item.category}
                      </div>
                    </div>
                  </td>
                  <td>{item.ownerName}</td>
                  <td>{item.category}</td>
                  <td>
                    {editingStatus === item.id ? (
                      <select
                        defaultValue={item.status}
                        className="select select-sm border-border w-32"
                        onChange={(e) =>
                          handleStatusSelect(item.id, e.target.value)
                        }
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge status={item.status} />
                    )}
                  </td>
                  <td className="font-medium">{item.pricePerDay}</td>
                  <td>{item.location}</td>
                  <td className="flex gap-1">
                    {editingStatus === item.id ? (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveStatus(item.id)}
                          className="btn btn-primary btn-xs"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingStatus(null)}
                          className="btn btn-ghost btn-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          className="btn btn-ghost btn-xs text-success"
                          title="Approve"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(item.id)}
                          className="btn btn-ghost btn-xs text-error"
                          title="Reject"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdate(item.id)}
                          className="btn btn-ghost btn-xs text-primary"
                          title="Update"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
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
          <strong>Note:</strong> Backend implementation is required for
          approve, reject, update, and delete actions.
        </p>
      </div>
    </div>
  );
}
