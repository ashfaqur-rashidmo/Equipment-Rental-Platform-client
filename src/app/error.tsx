"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to a reporting service once one exists.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-extrabold text-primary/30">Oops!</p>
      <h1 className="text-2xl font-bold text-base-content">
        Something went wrong
      </h1>
      <p className="max-w-md text-base-content/60">
        An unexpected error occurred while loading this page. It has been
        logged — try again, and if it keeps happening, let us know.
      </p>
      <div className="mt-2 flex gap-3">
        <button type="button" onClick={reset} className="btn btn-primary">
          <RotateCcw className="h-4 w-4" aria-hidden /> Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
