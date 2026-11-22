"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Total number of items across all pages. */
  total: number;
  /** Items per page. */
  pageSize: number;
  /** Current page, 1-based. */
  page: number;
  /** Called with the new 1-based page when the user navigates. */
  onPageChange: (page: number) => void;
  className?: string;
}

/** Compact page list: first page, a window around the current page, last page. */
function buildPageList(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [1];
  const start = Math.max(2, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  if (start > 2) pages.push(null);
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push(null);
  pages.push(totalPages);

  return pages;
}

/**
 * Page controls for list pages. Renders nothing when the list fits on a
 * single page, so callers can always include it.
 */
export default function Pagination({
  total,
  pageSize,
  page,
  onPageChange,
  className,
}: PaginationProps) {
  if (total <= pageSize) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pages = buildPageList(safePage, totalPages);
  const start = (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <span className="text-sm text-base-content/60">
        Showing {start}–{end} of {total}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn btn-sm btn-ghost gap-1"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>

        {pages.map((p, i) =>
          p === null ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-sm text-base-content/40"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={p === safePage ? "page" : undefined}
              onClick={() => onPageChange(p)}
              className={cn("btn btn-sm", p === safePage ? "btn-active" : "btn-ghost")}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="btn btn-sm btn-ghost gap-1"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
