import Link from "next/link";
import { CalendarDays, PackageOpen } from "lucide-react";
import { Rental } from "@/lib/api/rentals";
import { formatDate } from "@/lib/utils";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/app/component/Dashboard/StatusBadges";

interface OwnerRentalsTableProps {
  rentals: Rental[];
}

/** Bookings made on the owner's equipment, newest booking first. */
export default function OwnerRentalsTable({ rentals }: OwnerRentalsTableProps) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-base-content/60">
              <th>Customer Information</th>
              <th>Equipment Information</th>
              <th>Rental Duration</th>
              <th>Required Quantity</th>
              <th>Booking Amount</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
            </tr>
          </thead>

          <tbody>
            {rentals.map((rental) => {
              // Older bookings may not store `days` — derive it from the dates.
              const days =
                rental.days ??
                Math.max(
                  1,
                  Math.ceil(
                    (new Date(rental.endDate).getTime() -
                      new Date(rental.startDate).getTime()) /
                      86400000
                  )
                );

              return (
                <tr key={rental._id}>
                  {/* Customer */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-200 text-sm font-semibold text-base-content">
                        {(rental.customerName || "C").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-base-content">
                          {rental.customerName || "Customer"}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {rental.contactNumber || "No contact number"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Equipment */}
                  <td className="font-medium">
                    <Link
                      href={`/all-equipment/${rental.equipmentId}`}
                      className="link link-hover"
                    >
                      {rental.equipmentName}
                    </Link>
                  </td>

                  {/* Rental Duration */}
                  <td>
                    <p className="text-sm">
                      {formatDate(rental.startDate)} →{" "}
                      {formatDate(rental.endDate)}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {days} day{days !== 1 ? "s" : ""}
                    </p>
                  </td>

                  {/* Required Quantity */}
                  <td>{rental.quantity ?? 1}</td>

                  {/* Booking Amount */}
                  <td className="font-medium">
                    ৳{Number(rental.totalAmount || 0).toLocaleString("en-US")}
                  </td>

                  {/* Payment Status */}
                  <td>
                    <PaymentStatusBadge status={rental.paymentStatus} />
                  </td>

                  {/* Booking Status */}
                  <td>
                    <BookingStatusBadge status={rental.bookingStatus} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-base-300 px-4 py-3 text-xs text-base-content/50">
        <CalendarDays className="h-3.5 w-3.5" />
        {rentals.length} booking{rentals.length !== 1 ? "s" : ""} on your
        equipment
      </div>
    </div>
  );
}

/** Empty state shown when the owner has no bookings yet. */
export function NoRentalsYet() {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-12 text-center shadow-sm">
      <PackageOpen className="mx-auto mb-4 h-12 w-12 text-base-content/20" />
      <h3 className="text-lg font-medium text-base-content">No bookings yet</h3>
      <p className="mt-1 text-sm text-base-content/60">
        Bookings on your equipment will show up here as soon as customers rent
        them.
      </p>
    </div>
  );
}
