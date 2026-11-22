"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  CalendarClock,
  Shield,
  HardHat,
  CheckCircle2,
  Coins,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EquipmentItem, formatPrice } from "@/data/equipment";
import { Rental } from "@/lib/api/rentals";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AdminStat {
  label: string;
  value: number | string;
  icon: typeof Users;
  color: string;
  fill: string;
}

const quickActions = [
  { href: "/dashboard/admin/all-users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/all-equipment", label: "Review Equipment", icon: Package },
  { href: "/dashboard/admin/all-rentals", label: "Monitor Rentals", icon: CalendarClock },
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const lastSixMonths = (): string[] => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return MONTHS_SHORT[d.getMonth()];
  });
};

async function fetchJson<T>(url: string, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch statistics.");
  }

  return response.json();
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; role?: string } | undefined;
  const token = session?.session?.token;

  const [stats, setStats] = useState<AdminStat[]>([]);
  const [chartData, setChartData] = useState<{ label: string; value: number; fill: string }[]>([]);
  const [supportCounts, setSupportCounts] = useState({
    users: 0,
    equipment: 0,
    rentals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthlyBookings, setMonthlyBookings] = useState<
    { month: string; count: number }[]
  >([]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [users, equipment, rentals] = await Promise.all([
        fetchJson<unknown[]>("/admin/users", token),
        fetchJson<EquipmentItem[]>("/admin/equipment", token),
        fetchJson<Rental[]>("/admin/rentals", token),
      ]);

      const userList = Array.isArray(users) ? users : [];
      const equipmentList = Array.isArray(equipment) ? equipment : [];
      const rentalList = Array.isArray(rentals) ? rentals : [];

      setSupportCounts({
        users: userList.length,
        equipment: equipmentList.length,
        rentals: rentalList.length,
      });

      // Completed rentals, total revenue, and monthly booking statistics.
      const completedRentals = rentalList.filter((r) =>
        ["confirmed", "completed"].includes(
          String(r.bookingStatus || "").toLowerCase()
        )
      ).length;
      const totalRevenue = rentalList
        .filter((r) => String(r.paymentStatus || "").toLowerCase() === "paid")
        .reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);

      const labels = lastSixMonths();
      const monthlyCounts = labels.map(() => 0);
      rentalList.forEach((r) => {
        const d = new Date(r.bookingDate);
        if (Number.isNaN(d.getTime())) return;
        const label = MONTHS_SHORT[d.getMonth()];
        const idx = labels.indexOf(label);
        if (idx !== -1) monthlyCounts[idx] += 1;
      });
      const monthlyBookings = labels.map((month, i) => ({
        month,
        count: monthlyCounts[i],
      }));

      const pendingApprovals = equipmentList.filter(
        (item) => String(item.status || "").toLowerCase() === "pending"
      ).length;

      // Keep raw numbers for the chart; format only for stat-card display.
      const rawStats = [
        { label: "Total Users", value: userList.length, fill: "var(--color-primary)" },
        { label: "Equipment Listings", value: equipmentList.length, fill: "var(--color-success)" },
        { label: "Pending Approvals", value: pendingApprovals, fill: "var(--color-warning)" },
        { label: "Total Rentals", value: rentalList.length, fill: "var(--color-base-content)" },
        { label: "Completed Rentals", value: completedRentals, fill: "var(--color-success)" },
        { label: "Total Revenue", value: totalRevenue, fill: "var(--color-primary)" },
      ] as const;

      setStats([
        {
          label: "Total Users",
          value: userList.length,
          icon: Users,
          color: "text-primary",
          fill: "var(--color-primary)",
        },
        {
          label: "Equipment Listings",
          value: equipmentList.length,
          icon: Package,
          color: "text-success",
          fill: "var(--color-success)",
        },
        {
          label: "Pending Approvals",
          value: pendingApprovals,
          icon: Shield,
          color: "text-warning",
          fill: "var(--color-warning)",
        },
        {
          label: "Total Rentals",
          value: rentalList.length,
          icon: CalendarClock,
          color: "text-base-content",
          fill: "var(--color-base-content)",
        },
        {
          label: "Completed Rentals",
          value: completedRentals,
          icon: CheckCircle2,
          color: "text-success",
          fill: "var(--color-success)",
        },
        {
          label: "Total Revenue",
          value: formatPrice(totalRevenue),
          icon: Coins,
          color: "text-primary",
          fill: "var(--color-primary)",
        },
      ]);

      // Chart uses raw numeric values only (revenue as a number, not the formatted string).
      setChartData(
        rawStats.map((s) => ({
          label: s.label,
          value: s.value,
          fill: s.fill,
        }))
      );

      setMonthlyBookings(monthlyBookings);
    } catch (err) {
      console.error("Fetch stats error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for the session/token before fetching — the fetch needs
    // authorization, so firing immediately would 401 every time.
    if (token) void (async () => { await loadStats(); })();
  }, [token]);

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

      {/* ===== Welcome banner (same card as the customer dashboard) ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#ffffff] p-6 md:p-8 text-base-content relative overflow-hidden border border-blue-200 shadow-sm"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-base-content">
              Welcome back,{" "}
              <span className="text-[#2563eb]">{user?.name ?? "Admin"}</span>!
            </h2>
            <p className="mt-1 text-sm text-base-content/70">
              Monitor users, equipment and rentals across the platform.
            </p>
            <Link
              href="/dashboard/admin"
              className="mt-4 btn btn-primary btn-sm font-bold shadow-lg"
            >
              Manage Dashboard
            </Link>
          </div>
          <div className="hidden md:block md:w-[320px] rounded-xl overflow-hidden border border-blue-200/50 shadow-lg bg-white/40 backdrop-blur-sm">
            <img
              src="/images/equipment/hero.jpg"
              alt="Equipment"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <HardHat className="h-16 w-16 text-[#2563eb]/90 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </motion.div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span>Logged in as {user.name} ({user.role || "Admin"})</span>
        </div>
      )}

      {/* Statistics loading */}
      {loading && (
        <div className="mb-6 flex items-center justify-center gap-2 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <span className="loading loading-spinner loading-md" />
          <span className="text-sm text-base-content/60">Loading statistics...</span>
        </div>
      )}

      {/* Statistics loading error */}
      {!loading && error && (
        <div className="mb-6 rounded-box border border-error bg-error/10 p-6 text-center">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Stats overview */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">{stat.label}</p>
                  <p className="text-xl font-bold text-base-content">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics chart */}
      {!loading && stats.length > 0 && (
        <div className="mb-6 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/70">
            Statistics
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "currentColor" }}
                stroke="transparent"
              />
              <YAxis tick={{ fontSize: 11, fill: "currentColor" }} stroke="transparent" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-base-100)",
                  borderColor: "var(--color-base-300)",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "var(--color-base-content)" }}
                formatter={(value) =>
                  value == null ? "" : Number(value).toLocaleString("en-US")
                }
              />
              <Bar dataKey="value" radius={4}>
                {chartData.map((item) => (
                  <Cell key={item.label} fill={item.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly bookings chart */}
      {!loading && monthlyBookings.length > 0 && (
        <div className="mb-6 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-base-content/70">
            Monthly Bookings
          </h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={monthlyBookings.map((m) => ({
                month: m.month,
                count: m.count,
              }))}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "currentColor" }}
                stroke="transparent"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor" }}
                stroke="transparent"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-base-100)",
                  borderColor: "var(--color-base-300)",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "var(--color-base-content)" }}
                formatter={(value) =>
                  value == null ? "" : Number(value).toLocaleString("en-US")
                }
              />
              <Bar dataKey="count" radius={4} fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent activity placeholder */}
      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-xs text-base-content/50">
              Users this week
            </div>
            <div className="text-xl font-bold text-base-content">
              {supportCounts.users}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-base-content/50">
              Equipment approved
            </div>
            <div className="text-xl font-bold text-base-content">
              {supportCounts.equipment}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-xs text-base-content/50">
              Rentals completed
            </div>
            <div className="text-xl font-bold text-base-content">
              {supportCounts.rentals}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
