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
  Package,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/data/equipment";
import { cn } from "@/lib/utils";
import {
  GetCustomerDashboard,
  CustomerDashboardStats,
} from "@/lib/api/customer-dashboard";
import StatcardHomeDashboard from "@/app/component/CustomerDashboard/StatcardHomeDashboard";
import StatusPill from "@/app/component/CustomerDashboard/StatusPill";
import MonthlySpendingChart from "@/app/component/CustomerDashboard/MonthlySpendingChart";
import BookingCard from "@/app/component/CustomerDashboard/BookingCard";
import EquipmentCard from "@/app/component/CustomerDashboard/EquipmentCard";



export default function CustomerDashboardPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const [stats, setStats] = useState<CustomerDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    GetCustomerDashboard(userId)
      .then((data) => {
        if (!cancelled) {
          setError(null);
          setStats(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load dashboard.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, retryCount]);

  const showLoader = isPending || (Boolean(userId) && !stats && !error);
  const hasData = Boolean(stats) && !error;
  const s = stats ?? {
    totalBookings: 0,
    completedRentals: 0,
    totalSpent: 0,
    favoritesCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
    cancelledCount: 0,
    monthlySpending: [],
    recentRentals: [],
    favorites: [],
  };

  const handleRetry = () => setRetryCount((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-20 bg-base-100/80 backdrop-blur border-b border-base-300">
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
                Customer Overview
              </span>
              <button className="relative p-2 text-base-content/60 hover:text-base-content focus:outline-none">
                
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error"></span>
              </button>
             
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ===== Welcome banner (customer-themed light gradient) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-[#e0f2fe] via-[#f0fdf4] to-[#ffffff] p-6 md:p-8 text-base-content relative overflow-hidden border border-blue-200 shadow-sm"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-base-content">
                Welcome back,{" "}
                <span className="text-[#2563eb]">{user?.name ?? "Customer"}</span>!
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                Track your rentals, spending and saved equipment in one place.
              </p>
              <Button
                variant="default"
                size="sm"
                className="mt-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold shadow-lg"
              >
                Browse Equipment
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
              You need to be logged in to view your customer dashboard.
            </p>
            <a href="/login" className="btn btn-outline btn-sm">
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
        {!showLoader && error && userId && (
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

        {/* ===== Dashboard content ===== */}
        {hasData && userId && (
          <>
            {/* ===== Stat cards ===== */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <StatcardHomeDashboard
                  title="Total Bookings"
                  value={s.totalBookings}
                  subtitle="All bookings"
                  icon={Calendar}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <StatcardHomeDashboard
                  title="Completed Rentals"
                  value={s.completedRentals}
                  subtitle="Fulfilled"
                  icon={CheckCircle2}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <StatcardHomeDashboard
                  title="Total Spent"
                  value={formatPrice(s.totalSpent)}
                  subtitle="Paid out"
                  icon={CreditCard}
                  iconColor="text-success"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <StatcardHomeDashboard
                  title="Favorites"
                  value={s.favoritesCount}
                  subtitle="Saved equipment"
                  icon={Star}
                  iconColor="text-warning"
                />
              </motion.div>
            </div>

            {/* ===== Booking status pills ===== */}
            <div className="grid gap-3 sm:grid-cols-3">
              <StatusPill
                label="Pending Bookings"
                value={s.pendingCount}
                icon={Clock}
                color="bg-warning/10 text-warning border-warning/20"
                dotColor="bg-warning"
              />
              <StatusPill
                label="Confirmed"
                value={s.confirmedCount}
                icon={CheckCircle2}
                color="bg-blue-50/60 text-blue-700 border-blue-200"
                dotColor="bg-blue-500"
              />
              <StatusPill
                label="Cancelled"
                value={s.cancelledCount}
                icon={XCircle}
                color="bg-error/10 text-error border-error/20"
                dotColor="bg-error"
              />
            </div>

            {/* ===== Chart + two-column sections ===== */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Spending chart */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold">Monthly Spending Performance</h3>
                  <span className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100/50 px-2.5 py-0.5 text-xs text-base-content/60">
                    Last 6 Months
                  </span>
                </div>
                <div className="h-[220px] flex items-center">
                  <MonthlySpendingChart data={s.monthlySpending} />
                </div>
              </motion.div>

              {/* Quick actions / summary card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <h3 className="text-sm font-semibold mb-4">Your Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total Spent", value: formatPrice(s.totalSpent), color: "text-success" },
                    { label: "Completed Rentals", value: String(s.completedRentals), color: "text-blue-600" },
                    { label: "Pending Bookings", value: String(s.pendingCount), color: "text-warning" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-base-content/60">{item.label}</span>
                      <span className={cn("font-medium", item.color)}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between p-3 rounded-lg border border-base-200 bg-base-200/50 text-sm">
                  <span className="text-base-content/60">Next action</span>
                  <Link href="/all-equipment" className="btn btn-default btn-sm">
                    Browse Equipment
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* ===== Recent Bookings + Favorite Equipment (two columns) ===== */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Bookings */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Recent Bookings</h3>
                  <a
                    href="/dashboard/customer/my-rentals"
                    className="btn btn-outline btn-sm text-sm"
                  >
                    Manage Rentals <span className="text-[#ea580c]">→</span>
                  </a>
                </div>
                <AnimatePresence>
                  {s.recentRentals.length === 0 ? (
                    <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center">
                      <Package className="mx-auto mb-3 h-10 w-10 text-base-content/20" />
                      <p className="text-sm text-base-content/60">No recent bookings.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {s.recentRentals.slice(0, 4).map((rental) => (
                        <BookingCard key={rental._id} rental={rental} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Favorite Equipment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">Favorite Equipment</h3>
                  <a
                    href="/dashboard/customer/favorites"
                    className="btn btn-outline btn-sm text-sm"
                  >
                    Manage Favorites <span className="text-[#ea580c]">→</span>
                  </a>
                </div>
                <AnimatePresence>
                  {s.favorites.length === 0 ? (
                    <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center">
                      <Star className="mx-auto mb-3 h-10 w-10 text-base-content/20" />
                      <p className="text-sm text-base-content/60">No favorite equipment yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {s.favorites.slice(0, 4).map((fav) => (
                        <div key={fav._id}>
                          <EquipmentCard equipment={fav.equipment ?? { name: "Unknown Equipment", rentalPrice: "—", rentalType: "daily", availableQuantity: 0 }} />
                        </div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
