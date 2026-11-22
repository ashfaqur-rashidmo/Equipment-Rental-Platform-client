"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CalendarClock, TrendingUp, Mail } from "lucide-react";
import Link from "next/link";
import { GetOwnerDashboard, OwnerDashboardStats } from "@/lib/api/owner-dashboard";
import { formatPrice } from "@/data/equipment";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

const currentMonthLabel = (): string =>
  MONTHS_SHORT[new Date().getMonth()];

export default function OwnerEarningsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const token = session?.session?.token;

  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    void (async () => {
      try {
        const data = await GetOwnerDashboard(userId, token);
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load earnings."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <span className="loading loading-spinner text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-6">
        <p className="rounded-box border border-error/40 bg-error/5 p-4 text-sm text-error">
          {error}
        </p>
      </div>
    );
  }

  const s = stats ?? {
    totalBookings: 0,
    totalEquipment: 0,
    totalEarnings: 0,
    pendingCount: 0,
    confirmedCount: 0,
    cancelledCount: 0,
    monthlyBookings: [],
    monthlyEarnings: [],
    recentRentals: [],
  };

  const monthLabels: string[] =
    s.monthlyEarnings.length > 0
      ? s.monthlyEarnings.map((item) => item.month)
      : Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setDate(1);
          d.setMonth(d.getMonth() - 5 + i);
          return MONTHS_SHORT[d.getMonth()];
        });

  // Monthly earnings, largest bar scaled to a reasonable height.
  const monthAmounts = s.monthlyEarnings.map((item) => item.amount);
  const maxAmount = monthAmounts.length ? Math.max(...monthAmounts, 1) : 1;

  const thisMonthLabel = currentMonthLabel();
  const thisMonthEarnings = s.monthlyEarnings.find(
    (item) => item.month === thisMonthLabel
  )?.amount;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Earnings</h1>
          <p className="text-sm text-base-content/60">
            Track your rental income and payouts
          </p>
        </div>
        <Link href="/dashboard/owner" className="btn btn-outline btn-sm">
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
        <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Total Earnings</p>
              <p className="text-xl font-bold text-base-content">
                {formatPrice(s.totalEarnings)}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">This Month</p>
              <p className="text-xl font-bold text-base-content">
                {formatPrice(thisMonthEarnings ?? 0)}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Pending Payouts</p>
              <p className="text-xl font-bold text-base-content">
                {s.pendingCount}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
              <Mail className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Completed Rentals</p>
              <p className="text-xl font-bold text-base-content">
                {s.confirmedCount}
              </p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-base-200 text-base-content/60">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly earnings chart */}
      <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-4">
          Monthly Earnings
        </h3>
        <div className="flex items-end gap-2 h-40">
          {s.monthlyEarnings.map((item, i) => {
            const height =
              item.amount <= 0 ? 0 : (item.amount / maxAmount) * 100;
            return (
              <div key={item.month} className="flex flex-col items-center gap-2 w-full">
                <div
                  className="w-full bg-primary rounded-t"
                  style={{ height: `${Math.max(height, 4)}%` }}
                  title={`${i < monthLabels.length ? monthLabels[i] : item.month}: ${formatPrice(item.amount)}`}
                />
                <span className="text-xs text-base-content/60">
                  {i < monthLabels.length ? monthLabels[i] : item.month}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-base-content/60">
            {monthLabels[0] ?? "Jan"}
          </span>
          <span className="text-base-content/60">
            {monthLabels[monthLabels.length - 1] ?? "Dec"}
          </span>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="mt-6 rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="p-4 border-b border-base-300">
          <h3 className="text-sm font-semibold text-base-content">
            Recent Rentals
          </h3>
        </div>
        {s.recentRentals.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-base-content/60">
            No rentals yet.
          </div>
        ) : (
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
                {s.recentRentals.map((rental) => (
                  <tr key={rental._id}>
                    <td className="font-medium">
                      {new Date(rental.bookingDate).toLocaleDateString()}
                    </td>
                    <td>{rental.equipmentName}</td>
                    <td>{rental.customerName || "-"}</td>
                    <td className="font-medium text-success">
                      {formatPrice(rental.totalAmount)}
                    </td>
                    <td>
                      <Badge
                        variant="outline"
                        className={
                          String(rental.paymentStatus).toLowerCase() === "paid"
                            ? "badge-success"
                            : ""
                        }
                      >
                        {rental.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
