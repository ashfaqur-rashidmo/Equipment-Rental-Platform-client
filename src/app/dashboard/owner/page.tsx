"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CalendarClock,
  CreditCard,
  User,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Equipment", value: "4", icon: Package, color: "text-primary" },
  { label: "Active Rentals", value: "2", icon: CalendarClock, color: "text-success" },
  { label: "Pending Requests", value: "1", icon: CreditCard, color: "text-warning" },
  { label: "Total Earnings", value: "$2,450", icon: User, color: "text-base-content" },
];

const equipment = [
  {
    id: "1",
    name: "Excavator CAT 320",
    category: "Construction",
    status: "Available",
    pricePerDay: "$120/day",
    location: "Dhaka, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "DJI Mavic 3 Drone",
    category: "Photography",
    status: "Rented",
    pricePerDay: "$45/day",
    location: "Chattogram, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1444436231540-804f065e3d72?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Portable Generator 5kW",
    category: "Equipment",
    status: "Available",
    pricePerDay: "$35/day",
    location: "Sylhet, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1590402342344-99599e8a10d9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Scaffold Tower 6m",
    category: "Construction",
    status: "Maintenance",
    pricePerDay: "$25/day",
    location: "Khulna, Bangladesh",
    image:
      "https://images.unsplash.com/photo-154187880807e-64292f9e1c6d?auto=format&fit=crop&w=400&q=80",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Available: "badge-success",
    Rented: "badge-warning",
    Maintenance: "badge-error",
  };
  return <Badge className={variants[status] || "badge-outline"}>{status}</Badge>;
};

export default function OwnerDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

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
          href="/all-equipment"
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

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">{stat.label}</p>
                <p className="text-xl font-bold text-base-content">{stat.value}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment list */}
      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/60">
                <th>Equipment</th>
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
                      <div className="text-xs text-base-content/50">{item.category}</div>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="font-medium">{item.pricePerDay}</td>
                  <td>{item.location}</td>
                  <td className="flex gap-2">
                    <Link
                      href={`/all-equipment/${item.id}`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
