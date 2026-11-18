"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const rentals = [
  {
    id: "1",
    equipmentName: "Excavator CAT 320",
    startDate: "2026-11-20",
    endDate: "2026-11-25",
    bookingDate: "2026-11-10",
    totalAmount: "$1,250.00",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    id: "2",
    equipmentName: "DJI Mavic 3 Drone",
    startDate: "2026-11-22",
    endDate: "2026-11-23",
    bookingDate: "2026-11-15",
    totalAmount: "$180.00",
    paymentStatus: "Pending",
    bookingStatus: "Pending",
  },
  {
    id: "3",
    equipmentName: "Portable Generator 5kW",
    startDate: "2026-11-28",
    endDate: "2026-12-02",
    bookingDate: "2026-11-16",
    totalAmount: "$320.00",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    id: "4",
    equipmentName: "Scaffold Tower 6m",
    startDate: "2026-12-01",
    endDate: "2026-12-07",
    bookingDate: "2026-11-17",
    totalAmount: "$450.00",
    paymentStatus: "Failed",
    bookingStatus: "Cancelled",
  },
];

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Paid: "badge-success",
    Pending: "badge-warning",
    Failed: "badge-error",
  };
  return (
    <Badge className={variants[status] || "badge-outline"}>
      {status}
    </Badge>
  );
};

const BookingStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Confirmed: "badge-success",
    Pending: "badge-warning",
    Cancelled: "badge-error",
  };
  return (
    <Badge className={variants[status] || "badge-outline"}>
      {status}
    </Badge>
  );
};

export default function CustomerRentalsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">My Rentals</h1>
          <p className="text-sm text-base-content/60">
            Manage your equipment rental bookings
          </p>
        </div>
        <Link
          href="/dashboard/favorites"
          className="btn btn-outline btn-sm"
        >
          <span>Go to Favorites</span>
        </Link>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "C"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}

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
                <tr key={rental.id}>
                  <td className="font-medium">
                    {rental.equipmentName}
                  </td>
                  <td>
                    <Clock className="mr-2 h-4 w-4 shrink-0 text-base-content/40" />
                    {rental.startDate}
                  </td>
                  <td>
                    <Clock className="mr-2 h-4 w-4 shrink-0 text-base-content/40" />
                    {rental.endDate}
                  </td>
                  <td>{rental.bookingDate}</td>
                  <td className="font-medium">{rental.totalAmount}</td>
                  <td>
                    <PaymentStatusBadge status={rental.paymentStatus} />
                  </td>
                  <td>
                    <BookingStatusBadge status={rental.bookingStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
