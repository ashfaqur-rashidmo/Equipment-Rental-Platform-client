"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { AlertTriangle, Loader2, PackageOpen } from "lucide-react";
import { GetOwnerRentals, Rental } from "@/lib/api/rentals";
import DashboardHeader from "@/app/component/Dashboard/DashboardHeader";
import StateCard from "@/app/component/Dashboard/StateCard";
import OwnerRentalsTable, {
  NoRentalsYet,
} from "@/app/component/OwnerDashboard/OwnerRentalsTable";
import Pagination from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default function OwnerRentalsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const ownerId = user?.id;

  const [page, setPage] = useState(1);

  const [state, setState] = useState<{
    ownerId: string;
    rentals: Rental[];
    error?: string;
  } | null>(null);

  // Load the bookings made on this owner's equipment.
  useEffect(() => {
    if (!ownerId) return;

    let cancelled = false;

    GetOwnerRentals(ownerId, session?.session?.token)
      .then((rows) => {
        if (!cancelled) setState({ ownerId, rentals: rows });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ ownerId, rentals: [], error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  // Only trust data that belongs to the user we just asked for.
  const current = state && state.ownerId === ownerId ? state : null;
  const rentals = current?.rentals ?? [];
  const error = current?.error ?? null;
  const showLoader = isPending || (Boolean(ownerId) && !current);

  // Newest-first lists from the API — slice one page at a time.
  const totalPages = Math.max(1, Math.ceil(rentals.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageRentals = rentals.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const hasRows = !showLoader && !error && rentals.length > 0;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <DashboardHeader
        title="My Equipment Rental"
        subtitle="See every booking made on your equipment"
        user={user}
        action={
          <Link
            href="/dashboard/owner/my-equipment"
            className="btn btn-outline btn-sm"
          >
            <span>Go to My Equipment</span>
          </Link>
        }
      />

      {/* Not logged in */}
      {!isPending && !user && (
        <StateCard
          icon={PackageOpen}
          title="Please log in"
          description="You need to be logged in to see bookings on your equipment."
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
          description="Loading bookings..."
        />
      )}

      {/* Error */}
      {!showLoader && error && (
        <StateCard
          variant="error"
          icon={AlertTriangle}
          title={error}
          description="We could not load the bookings on your equipment."
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
      {!showLoader && !error && rentals.length === 0 && <NoRentalsYet />}

      {/* Bookings table */}
      {hasRows && <OwnerRentalsTable rentals={pageRentals} />}

      {hasRows && (
        <Pagination
          total={rentals.length}
          pageSize={PAGE_SIZE}
          page={safePage}
          onPageChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  );
}
