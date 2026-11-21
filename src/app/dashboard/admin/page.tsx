"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Users, Package, CalendarClock, Shield } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Users", value: "124", icon: Users, color: "text-primary" },
  { label: "Equipment Listings", value: "56", icon: Package, color: "text-success" },
  { label: "Pending Approvals", value: "8", icon: Shield, color: "text-warning" },
  { label: "Total Rentals", value: "230", icon: CalendarClock, color: "text-base-content" },
];

const quickActions = [
  { href: "/dashboard/admin/all-users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/all-equipment", label: "Review Equipment", icon: Package },
  { href: "/dashboard/admin/all-rentals", label: "Monitor Rentals", icon: CalendarClock },
];

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Admin Dashboard</h1>
          <p className="text-sm text-base-content/60">
            Manage users, equipment, and rentals across the platform
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="btn btn-outline btn-sm flex items-center gap-2"
            >
              <action.icon className="h-4 w-4" /> {action.label}
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span>Logged in as {user.name} ({user.role || "Admin"})</span>
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

      {/* Recent activity placeholder */}
      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-base-content/50">Users this week</div>
            <div className="text-xl font-bold text-base-content">12</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-base-content/50">Equipment approved</div>
            <div className="text-xl font-bold text-base-content">4</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-base-content/50">Rentals completed</div>
            <div className="text-xl font-bold text-base-content">18</div>
          </div>
        </div>
      </div>
    </div>
  );
}
