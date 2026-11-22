"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Heart, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Favorite,
  GetMyFavorites,
  RemoveFavorite,
} from "@/lib/api/favorites";
import DashboardHeader from "@/app/component/Dashboard/DashboardHeader";
import StateCard from "@/app/component/Dashboard/StateCard";
import FavoritesTable from "@/app/component/CustomerDashboard/FavoritesTable";
import Pagination from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default function FavoritesPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const [page, setPage] = useState(1);

  const [state, setState] = useState<{
    userId: string;
    rows: Favorite[];
    error?: string;
  } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Load the favorites of the logged-in customer.
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    GetMyFavorites(userId, session?.session?.token)
      .then((rows) => {
        if (!cancelled) setState({ userId, rows });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ userId, rows: [], error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Only trust data that belongs to the user we just asked for.
  const current = state && state.userId === userId ? state : null;
  const favorites = current?.rows ?? [];
  const error = current?.error ?? null;
  const showLoader = isPending || (Boolean(userId) && !current);

  const totalPages = Math.max(1, Math.ceil(favorites.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageFavorites = favorites.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleRemoveFavorite = async (favoriteId: string) => {
    setRemovingId(favoriteId);

    try {
      await RemoveFavorite(favoriteId, session?.session?.token);
      setState((prev) =>
        prev
          ? { ...prev, rows: prev.rows.filter((row) => row._id !== favoriteId) }
          : prev
      );
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove favorite."
      );
    } finally {
      setRemovingId(null);
    }
  };

  const hasRows = !showLoader && !error && favorites.length > 0;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <DashboardHeader
        title="Favorites"
        subtitle="Your saved equipment listings"
        user={user}
        action={
          <Link
            href="/dashboard/customer/my-rentals"
            className="btn btn-outline btn-sm"
          >
            <span>Back to My Rentals</span>
          </Link>
        }
      />

      {/* Not logged in */}
      {!isPending && !user && (
        <StateCard
          icon={Heart}
          title="Please log in"
          description="You need to be logged in to see your saved equipment."
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
          description="Loading your favorites..."
        />
      )}

      {/* Error */}
      {!showLoader && error && (
        <StateCard
          variant="error"
          icon={AlertTriangle}
          title={error}
          description="We could not load your saved equipment."
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
      {!showLoader && !error && favorites.length === 0 && (
        <StateCard
          icon={Heart}
          title="No favorites yet"
          description="Save equipment you like to find it easily later."
          action={
            <Link href="/all-equipment" className="btn btn-primary btn-sm">
              Browse Equipment
            </Link>
          }
        />
      )}

      {/* Saved equipment table */}
      {hasRows && (
        <FavoritesTable
          rows={pageFavorites}
          removingId={removingId}
          onRemove={handleRemoveFavorite}
        />
      )}

      {hasRows && (
        <Pagination
          total={favorites.length}
          pageSize={PAGE_SIZE}
          page={safePage}
          onPageChange={setPage}
          className="mt-6"
        />
      )}
    </div>
  );
}
