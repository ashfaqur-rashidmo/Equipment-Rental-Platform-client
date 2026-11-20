"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { GetMyRentals, Rental } from "@/lib/api/rentals";
import {
  CreditCard,
  Clock,
  CalendarDays,
  PackageOpen,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import DashboardHeader from "@/app/component/Dashboard/DashboardHeader";
import StateCard from "@/app/component/Dashboard/StateCard";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/app/component/Dashboard/StatusBadges";

export default function CustomerRentalsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const [state, setState] = useState<{
    userId: string;
    rentals: Rental[];
    error?: string;
  } | null>(null);

  // Load the bookings of the logged-in customer.
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    GetMyRentals(userId)
      .then((rows) => {
        if (!cancelled) setState({ userId, rentals: rows });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ userId, rentals: [], error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Only trust data that belongs to the user we just asked for.
  const current = state && state.userId === userId ? state : null;
  const rentals = current?.rentals ?? [];
  const error = current?.error ?? null;
  const showLoader = isPending || (Boolean(userId) && !current);

  const hasRows = !showLoader && !error && rentals.length > 0;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <DashboardHeader
        title="My Rentals"
        subtitle="Manage your equipment rental bookings"
        user={user}
        action={
          <Link
            href="/dashboard/customer/favorites"
            className="btn btn-outline btn-sm"
          >
            <span>Go to Favorites</span>
          </Link>
        }
      />

      {/* Not logged in */}
      {!isPending && !user && (
        <StateCard
          icon={PackageOpen}
          title="Please log in"
          description="You need to be logged in to see your rental bookings."
          action={
            <Link href="/login" className="btn btn-primary btn-sm">
              Go to Login
            </Link>
          }
        />
      )}

      {/* Loading */}
      {showLoader && (
        <StateCard
          variant="loading"
          icon={Loader2}
          description="Loading your rentals..."
        />
      )}

      {/* Error */}
      {!showLoader && error && (
        <StateCard
          variant="error"
          icon={AlertTriangle}
          title={error}
          description="We could not load your bookings."
          action={
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn btn-outline btn-sm"
            >
              Try again
            </button>
          }
        />
      )}

      {/* Empty */}
      {!showLoader && !error && rentals.length === 0 && (
        <StateCard
          icon={PackageOpen}
          title="No rentals yet"
          description="Rent an equipment and your bookings will show up here."
          action={
            <Link href="/all-equipment" className="btn btn-primary btn-sm">
              Browse Equipment
            </Link>
          }
        />
      )}

      {/* Bookings table */}
      {hasRows && (
        <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-base-content/60">
                  <th>Equipment Name</th>
                  <th>Rental Start Date</th>
                  <th>Rental End Date</th>
                  <th>Booking Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Booking Status</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental._id}>
                    <td className="font-medium">
                      <Link
                        href={`/all-equipment/${rental.equipmentId}`}
                        className="link link-hover"
                      >
                        {rental.equipmentName}
                      </Link>
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-base-content/40" />
                        {formatDate(rental.startDate)}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-base-content/40" />
                        {formatDate(rental.endDate)}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-base-content/40" />
                        {formatDate(rental.bookingDate)}
                      </span>
                    </td>
                    <td className="font-medium">
                      ৳{Number(rental.totalAmount || 0).toLocaleString("en-US")}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <PaymentStatusBadge status={rental.paymentStatus} />

                        {rental.paymentStatus !== "Paid" && (
                          <Link
                            href={`/dashboard/customer/payment/${rental._id}`}
                            className="btn btn-primary btn-xs"
                          >
                            Pay
                          </Link>
                        )}
                      </div>
                    </td>
                    <td>
                      <BookingStatusBadge status={rental.bookingStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-2 border-t border-base-300 px-4 py-3 text-xs text-base-content/50">
            <CreditCard className="h-3.5 w-3.5" />
            {rentals.length} booking{rentals.length !== 1 ? "s" : ""} on file
          </div>
        </div>
      )}
    </div>
  );
}
