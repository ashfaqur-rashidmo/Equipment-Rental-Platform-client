"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CreditCard,
  Star,
  HardHat,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Package,
  PackageOpen,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/data/equipment";
import { formatDate, cn } from "@/lib/utils";
import { GetOwnerDashboard, OwnerDashboardStats } from "@/lib/api/owner-dashboard";

/* --------------------------------------------------------------------------
   Owner dashboard — real data from the Express/MongoDB backend.
   -------------------------------------------------------------------------- */
export default function OwnerDashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const ownerId = user?.id;

  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!ownerId) return;

    let cancelled = false;

    GetOwnerDashboard(ownerId)
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setStats(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load dashboard."
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId, retryCount]);

  const showLoader = isPending || (Boolean(ownerId) && !stats && !error);
  const hasData = Boolean(stats) && !error;
  const s = stats ?? {
    totalBookings: 0,
    totalEquipment: 0,
    totalEarnings: 0,
    pendingCount: 0,
    confirmedCount: 0,
    cancelledCount: 0,
    monthlyBookings: [],
    recentRentals: [],
  };

  const handleRetry = () => setRetryCount((prev) => prev + 1);

  /* ------------------------------------------------------------------ */
  /* Booking Overview — animated line chart (last 6 months)             */
  /* ------------------------------------------------------------------ */
  const months = s.monthlyBookings.map((m) => m.month);
  const values = s.monthlyBookings.map((m) => m.count);
  const maxY = Math.max(4, ...values, 1);

  const chartWidth = 360;
  const chartHeight = 190;
  const padding = { top: 16, right: 16, bottom: 34, left: 34 };
  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  const xPoints = months.map((_, i) => padding.left + (i / Math.max(months.length - 1, 1)) * plotW);
  const yPoints = values.map((v) => padding.top + plotH - (v / maxY) * plotH);

  const linePath = values.reduce(
    (d, v, i) => `${d}${i === 0 ? "M" : "L"}${xPoints[i]},${yPoints[i]}`,
    ""
  );

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-20  backdrop-blur border-b border-base-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search equipment..."
                  className="pl-9 pr-4 h-9 w-64 rounded-full border border-base-300 bg-base-100 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
                  <HardHat className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center gap-3">
              <span className="hidden sm:block text-sm text-base-content/60 font-medium">
                Owner Overview
              </span>
              <button className="relative p-2 text-base-content/60 hover:text-base-content focus:outline-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M15 18h5v-18H0v21h18" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error"></span>
              </button>
              <img
                src="/images/equipment/avatar.jpg"
                alt="User avatar"
                className="h-8 w-8 rounded-full object-cover border border-base-300 bg-base-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23d97706'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='16' font-weight='bold'%3EO%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

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
                <span className="text-[#2563eb]">{user?.name ?? "Owner"}</span>!
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                Track your equipment, bookings and earnings in one place.
              </p>
              <Button
                variant="default"
                size="sm"
                className="mt-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold shadow-lg"
              >
                Explore Equipment
              </Button>
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

        {/* ===== Not logged in ===== */}
        {!isPending && !user && (
          <div className="rounded-xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-12 w-12 text-base-content/20" />
            <h3 className="text-lg font-medium text-base-content">Please log in</h3>
            <p className="mt-1 text-sm text-base-content/60">
              You need to be logged in to view your owner dashboard.
            </p>
            <a
              href="/login"
              className="btn btn-outline btn-sm"
            >
              Go to Login
            </a>
          </div>
        )}

        {/* ===== Loading ===== */}
        {showLoader && (
          <div className="rounded-xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-base-content/60">Loading your dashboard…</p>
          </div>
        )}

        {/* ===== Error ===== */}
        {!showLoader && error && ownerId && (
          <div className="rounded-xl border border-error bg-error/10 p-6 text-center shadow-sm">
            <AlertTriangle className="mx-auto mb-3 h-6 w-6 text-error" />
            <p className="text-sm text-error">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 btn btn-outline btn-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Try again
            </button>
          </div>
        )}

        {/* ===== Dashboard content (only when data loaded) ===== */}
        {hasData && ownerId && (
          <>
            {/* ===== Stat cards ===== */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/60 font-medium">
                      Total Bookings
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {s.totalBookings}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-base-content/60" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs font-medium text-success">Real-time</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/60 font-medium">
                      Your Equipment
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {s.totalEquipment}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Package className="h-5 w-5 text-base-content/60" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs font-medium text-success">Active</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/60 font-medium">
                      Total Earnings
                    </p>
                    <p className="mt-1 text-3xl font-bold">
                      {formatPrice(s.totalEarnings)}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-base-content/60" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs font-medium text-success">Paid</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/60 font-medium">
                      Your Reviews
                    </p>
                    <p className="mt-1 text-3xl font-bold">0</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Star className="h-5 w-5 text-base-content/60" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-xs font-medium text-secondary">Published</span>
                </div>
              </motion.div>
            </div>

            {/* ===== Booking status pills ===== */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 flex items-center justify-between",
                  "bg-warning/10 text-warning border-warning/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-warning flex items-center justify-center text-white text-[10px]">
                    <Clock className="h-3 w-3" />
                  </div>
                  <p className="text-sm font-semibold">Pending Bookings</p>
                </div>
                <span className="text-sm font-bold">{s.pendingCount}</span>
              </div>
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 flex items-center justify-between",
                  "bg-blue-50/60 text-blue-700 border-blue-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <p className="text-sm font-semibold">Confirmed</p>
                </div>
                <span className="text-sm font-bold">{s.confirmedCount}</span>
              </div>
              <div
                className={cn(
                  "rounded-xl border px-4 py-3 flex items-center justify-between",
                  "bg-error/10 text-error border-error/20"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-error flex items-center justify-center text-white text-[10px]">
                    <XCircle className="h-3 w-3" />
                  </div>
                  <p className="text-sm font-semibold">Cancelled</p>
                </div>
                <span className="text-sm font-bold">{s.cancelledCount}</span>
              </div>
            </div>

            {/* ===== Charts ===== */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Booking Overview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold">Your Booking Overview</h3>
                  <span className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100/50 px-2.5 py-0.5 text-xs text-base-content/60">
                    Last 6 Months
                  </span>
                </div>
                <div className="h-[220px] flex items-center">
                  <svg
                    width={chartWidth}
                    height={chartHeight}
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full max-w-md"
                  >
                    <defs>
                      <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>

                    {/* Y axis ticks */}
                    {[0, 1, 2, 3, 4].map((tick) => {
                      const y =
                        padding.top + plotH - (tick / maxY) * plotH;
                      return (
                        <g key={tick}>
                          <line
                            x1={padding.left - 6}
                            x2={padding.left}
                            y1={y}
                            y2={y}
                            stroke="#cbd5e1"
                            strokeWidth={1}
                          />
                          <text
                            x={padding.left - 10}
                            y={y + 4}
                            fontSize={11}
                            fill="#64748b"
                            textAnchor="end"
                          >
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    {/* X axis labels */}
                    {months.map((m, i) => (
                      <text
                        key={m}
                        x={xPoints[i]}
                        y={padding.top + plotH + 20}
                        fontSize={12}
                        fill="#94a3b8"
                        textAnchor="middle"
                      >
                        {m}
                      </text>
                    ))}

                    {/* Area fill */}
                    <path
                      d={`${linePath} L${xPoints[xPoints.length - 1]},${padding.top + plotH} L${xPoints[0]},${padding.top + plotH} Z`}
                      fill="url(#lineGradient)"
                    />
                    {/* Animated line */}
                    <motion.path
                      d={linePath}
                      stroke="#d97706"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ strokeDasharray: 600, strokeDashoffset: 600 }}
                      initial={{ strokeDashoffset: 600 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                    {/* Animated dots */}
                    {xPoints.map((x, i) => (
                      <motion.circle
                        key={i}
                        cx={x}
                        cy={yPoints[i]}
                        r={4}
                        fill="#d97706"
                        stroke="#ffffff"
                        strokeWidth={2}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                      />
                    ))}
                  </svg>
                </div>
              </motion.div>

              {/* Booking Status */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold mb-4">Booking Status</h3>
                <div className="flex flex-col items-center">
                  <svg
                    width={160}
                    height={160}
                    viewBox="0 0 160 160"
                    className="mb-2"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth={14}
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="56"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={14}
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 2 * Math.PI * 56,
                        strokeDashoffset: 2 * Math.PI * 56,
                        transform: "rotate(-90 80 80)",
                      }}
                      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 56 -
                          (s.confirmedCount / Math.max(s.totalBookings, 1)) *
                            (2 * Math.PI * 56),
                      }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                    <text
                      x="80"
                      y="86"
                      textAnchor="middle"
                      fontSize={20}
                      fontWeight={800}
                      fill="#0f172a"
                    >
                      {Math.round(
                        (s.confirmedCount / Math.max(s.totalBookings, 1)) * 100
                      )}%
                    </text>
                    <text
                      x="80"
                      y="104"
                      textAnchor="middle"
                      fontSize={11}
                      fill="#64748b"
                    >
                      Confirmed
                    </text>
                  </svg>
                  <div className="w-full text-left space-y-1.5">
                    {[
                      { label: "Confirmed", color: "bg-blue-500", count: s.confirmedCount },
                      { label: "Pending", color: "bg-warning", count: s.pendingCount },
                      { label: "Cancelled", color: "bg-error", count: s.cancelledCount },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-2.5 w-2.5 rounded-full ${item.color}`}
                          />
                          <span className="text-base-content/70">{item.label}</span>
                        </div>
                        <span className="text-base-content font-medium">
                          {item.count}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 flex items-center justify-between p-3 rounded-lg border border-base-200 bg-base-200/50 text-sm"
                >
                  <span className="text-base-content/60">Bookings this month</span>
                  <span className="text-base-content font-medium">
                    {s.totalBookings}
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* ===== Recent bookings ===== */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Recent Bookings</h3>
                <a
                  href="/dashboard/owner/my-equipment-rental"
                  className="btn btn-outline btn-sm text-sm"
                >
                  View all <span className="text-[#f59e0b]">→</span>
                </a>
              </div>

              <AnimatePresence>
                {s.recentRentals.length === 0 ? (
                  <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center">
                    <PackageOpen className="mx-auto mb-3 h-10 w-10 text-base-content/20" />
                    <p className="text-sm text-base-content/60">No recent bookings.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table text-sm">
                      <thead>
                        <tr className="text-base-content/60">
                          <th>Customer</th>
                          <th>Equipment</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.recentRentals.slice(0, 5).map((rental) => (
                          <tr key={rental._id}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-200 text-xs font-semibold text-base-content">
                                  {(rental.customerName || "C").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-base-content">
                                    {rental.customerName || "Customer"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="font-medium">
                              {rental.equipmentName}
                            </td>
                            <td>
                              <p className="text-sm">{formatDate(rental.bookingDate)}</p>
                            </td>
                            <td className="font-medium">
                              {formatPrice(Number(rental.totalAmount || 0))}
                            </td>
                            <td>
                              <Badge
                                variant={
                                  rental.bookingStatus === "Confirmed"
                                    ? "success"
                                    : rental.bookingStatus === "Cancelled"
                                      ? "error"
                                      : "warning"
                                }
                              >
                                {rental.bookingStatus}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
