"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { GetRentalById, Rental } from "@/lib/api/rentals";
import { formatDate } from "@/lib/utils";
import DashboardHeader from "@/app/component/Dashboard/DashboardHeader";
import StateCard from "@/app/component/Dashboard/StateCard";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Package,
  ShieldCheck,
} from "lucide-react";

const paymentStatusVariant: Record<string, string> = {
  Paid: "badge-success",
  Pending: "badge-warning",
  Failed: "badge-error",
};

export default function PaymentPage({searchParams}: {searchParams: {id: string}}) {

  const params = useParams<{ id: string }>();
  const rentalId = params.id || searchParams.id;

  // A failed checkout start comes back as ?error=... (see /api/checkout-sessions).
  const payError = useSearchParams().get("error");

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const [state, setState] = useState<{
    key: string;
    rental: Rental | null;
    error?: string;
  } | null>(null);

  // Load the booking that is being paid for.
  useEffect(() => {
    if (!userId || !rentalId) return;

    let cancelled = false;
    const key = `${userId}:${rentalId}`;

    GetRentalById(rentalId, session?.session?.token)
      .then((rental) => {
        if (!cancelled) setState({ key, rental });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ key, rental: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [userId, rentalId]);

  // Only trust data that belongs to this user + this booking.
  const current =
    state && state.key === `${userId}:${rentalId}` ? state : null;
  const rental = current?.rental ?? null;
  const error = current?.error ?? null;
  const loading = isPending || (Boolean(userId) && !current);

  const isOwner =
    Boolean(rental) && Boolean(userId) && rental?.customerId === userId;
  const isPaid = rental?.paymentStatus === "Paid";

  const amount = Number(rental?.totalAmount || 0);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <DashboardHeader
        title="Payment"
        subtitle="Complete the payment for your booking"
        user={user}
        action={
          <Link
            href="/dashboard/customer/my-rentals"
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft size={14} />
            <span>Back to My Rentals</span>
          </Link>
        }
      />

      {/* Checkout failed earlier — explain it instead of showing raw JSON */}
      {payError && (
        <div className="mb-6 rounded-box border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
          <AlertTriangle
            size={16}
            className="mr-2 inline-block align-text-bottom"
          />
          {payError}
        </div>
      )}

      {/* Not logged in */}
      {!isPending && !user && (
        <StateCard
          icon={Lock}
          title="Please log in"
          description="You need to be logged in to pay for a booking."
          action={
            <Link href="/login" className="btn btn-primary btn-sm">
              Go to Login
            </Link>
          }
        />
      )}

      {/* Loading */}
      {loading && (
        <StateCard
          variant="loading"
          icon={Loader2}
          description="Loading your booking..."
        />
      )}

      {/* Error (fetch failed or booking not found) */}
      {!loading && error && (
        <StateCard
          variant="error"
          icon={AlertTriangle}
          title={error}
          description="This booking could not be loaded."
          action={
            <Link
              href="/dashboard/customer/my-rentals"
              className="btn btn-outline btn-sm"
            >
              Back to My Rentals
            </Link>
          }
        />
      )}

      {/* Someone else's booking */}
      {!loading && !error && rental && !isOwner && (
        <StateCard
          icon={Lock}
          title="Access denied"
          description="This booking belongs to another account."
          action={
            <Link
              href="/dashboard/customer/my-rentals"
              className="btn btn-primary btn-sm"
            >
              Back to My Rentals
            </Link>
          }
        />
      )}

      {/* Payment content */}
      {!loading && !error && rental && isOwner && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: booking summary + payment information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Booking summary */}
            <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-base-content/70">
                <Package size={16} />
                Booking Summary
              </h2>

              <p className="mb-4 text-lg font-bold text-base-content">
                {rental.equipmentName}
              </p>

              <dl className="divide-y divide-base-200 text-sm">
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-base-content/60">Booking ID</dt>
                  <dd className="font-mono text-xs text-base-content/80">
                    {rental._id}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-base-content/60">Rental Period</dt>
                  <dd className="flex items-center gap-2 font-medium text-base-content">
                    <CalendarDays size={14} className="text-base-content/40" />
                    {formatDate(rental.startDate)} — {formatDate(rental.endDate)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-base-content/60">Rental Days</dt>
                  <dd className="font-medium text-base-content">
                    {rental.days} day{rental.days !== 1 ? "s" : ""}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-base-content/60">Quantity</dt>
                  <dd className="font-medium text-base-content">
                    {rental.quantity} unit{rental.quantity !== 1 ? "s" : ""}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-base-content/60">Booked On</dt>
                  <dd className="font-medium text-base-content">
                    {formatDate(rental.bookingDate)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-base-content/60">Booking Status</dt>
                  <dd>
                    <Badge
                      className={
                        rental.bookingStatus === "Confirmed"
                          ? "badge-success"
                          : rental.bookingStatus === "Cancelled"
                            ? "badge-error"
                            : "badge-warning"
                      }
                    >
                      {rental.bookingStatus}
                    </Badge>
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm font-semibold text-base-content">
                    Total Amount
                  </dt>
                  <dd className="text-xl font-bold text-base-content">
                    ৳{amount.toLocaleString("en-US")}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Payment information */}
            <section className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-base-content/70">
                <ShieldCheck size={16} />
                Payment Information
              </h2>

              <div className="flex items-start gap-3 rounded-lg border border-base-300 bg-base-200/50 p-4">
                <Lock size={18} className="mt-0.5 shrink-0 text-success" />
                <div className="text-sm text-base-content/70">
                  <p className="mb-1 font-medium text-base-content">
                    Secure checkout powered by Stripe
                  </p>
                  <p>
                    When you press Pay you will be taken to Stripe&apos;s
                    hosted checkout page to enter your card details. Payment
                    information never touches our servers.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-base-content/50">
                  Accepted:
                </span>
                <Badge variant="outline">Visa</Badge>
                <Badge variant="outline">Mastercard</Badge>
                <Badge variant="outline">Amex</Badge>
                <Badge variant="outline">Apple Pay</Badge>
                <Badge variant="outline">Google Pay</Badge>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-base-200 pt-4 text-sm">
                <span className="text-base-content/60">Payment Status</span>
                <Badge className={paymentStatusVariant[rental.paymentStatus] || "badge-outline"}>
                  {rental.paymentStatus}
                </Badge>
              </div>
            </section>
          </div>

          {/* Right: amount due + pay button */}
          <aside className="lg:col-span-1">
            <div className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-base-content/70">
                Amount Due
              </h2>

              <p className="mb-1 text-4xl font-bold text-base-content">
                ৳{amount.toLocaleString("en-US")}
              </p>

              <p className="mb-5 text-xs text-base-content/50">
                {rental.days}-day rental · {rental.quantity} unit
                {rental.quantity !== 1 ? "s" : ""} · no hidden fees
              </p>

              {isPaid ? (
                <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-center">
                  <CheckCircle2
                    size={28}
                    className="mx-auto mb-2 text-success"
                  />
                  <p className="text-sm font-medium text-base-content">
                    Already paid
                  </p>
                  <p className="mt-1 text-xs text-base-content/60">
                    This booking was settled — nothing due.
                  </p>
                </div>
              ) : (
                <>
                <form action="/api/checkout-sessions" method="POST">
                  <input type="hidden" name="rentalId" value={rentalId} />
                
                  <button
                    type="submit"
                   
                    className="btn btn-primary w-full"
                  >
                    <CreditCard size={16} />
                    Pay ৳{amount.toLocaleString("en-US")}
                  </button>
                  </form>

                  <p className="mt-3 text-center text-xs text-base-content/50">
                    You will review the amount on the next step before being
                    charged.
                  </p>
                </>
              )}

              <Link
                href="/dashboard/customer/my-rentals"
                className="btn btn-ghost btn-sm mt-3 w-full"
              >
                <ArrowLeft size={14} />
                Back to My Rentals
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
