"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CalendarClock, TrendingUp, Mail } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total Earnings", value: "$2,450.00", icon: CreditCard, color: "text-success" },
  { label: "This Month", value: "$890.00", icon: CalendarClock, color: "text-primary" },
  { label: "Pending Payouts", value: "$180.00", icon: Mail, color: "text-warning" },
  { label: "Completed Rentals", value: "3", icon: TrendingUp, color: "text-base-content" },
];

const monthlyEarnings = [
  { month: "Oct", earnings: "$620" },
  { month: "Nov", earnings: "$890" },
  { month: "Dec", earnings: "$940" },
];

export default function OwnerEarningsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Earnings</h1>
          <p className="text-sm text-base-content/60">
            Track your rental income and payouts
          </p>
        </div>
        <Link
          href="/dashboard/owner"
          className="btn btn-outline btn-sm"
        >
          <span>Back to My Equipment</span>
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

      {/* Earnings chart placeholder */}
      <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          Monthly Earnings
        </h3>
        <div className="flex items-end gap-2 h-48">
          {monthlyEarnings.map((item) => (
            <div
              key={item.month}
              className="flex flex-col items-center gap-2 w-full"
            >
              <div
                className="w-full bg-primary rounded-t"
                style={{ height: "60%" }}
              />
              <span className="text-xs text-base-content/60">{item.month}</span>
              <span className="text-xs font-medium text-base-content">
                {item.earnings}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-base-content/60">Oct</span>
          <span className="text-base-content/60">Dec</span>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mt-6 rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="p-4 border-b border-base-300">
          <h3 className="text-sm font-semibold text-base-content">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/60">
                <th>Date</th>
                <th>Equipment</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">2026-11-15</td>
                <td>DJI Mavic 3 Drone</td>
                <td>Afsara Rahman</td>
                <td className="font-medium text-success">$180.00</td>
                <td>
                  <Badge variant="outline">Pending</Badge>
                </td>
              </tr>
              <tr>
                <td className="font-medium">2026-11-10</td>
                <td>Excavator CAT 320</td>
                <td>Sakib Hasan</td>
                <td className="font-medium text-success">$1,250.00</td>
                <td>
                  <Badge variant="outline">Completed</Badge>
                </td>
              </tr>
              <tr>
                <td className="font-medium">2026-11-08</td>
                <td>Portable Generator 5kW</td>
                <td>Rahim Khan</td>
                <td className="font-medium text-success">$140.00</td>
                <td>
                  <Badge variant="outline">Completed</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
