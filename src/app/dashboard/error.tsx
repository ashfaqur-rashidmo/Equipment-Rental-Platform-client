"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-box border border-base-300 bg-base-100 p-8 sm:p-12 shadow-sm max-w-md w-full text-center">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-error/10 text-error mx-auto mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-base-content">Something went wrong</h2>
        <p className="mt-2 text-sm text-base-content/60">
          We encountered an error loading the dashboard. Please try again.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="btn-primary"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link
            href="/dashboard"
            className="btn btn-ghost btn-sm"
          >
            Return to Dashboard
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 rounded-lg bg-base-200 text-xs text-base-content/60 overflow-x-auto">
            {error.message}
            {error.digest && <div className="mt-1">{error.digest}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
