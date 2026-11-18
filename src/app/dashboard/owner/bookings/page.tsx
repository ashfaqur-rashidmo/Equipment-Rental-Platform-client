"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock } from "lucide-react";
import Link from "next/link";

const bookings = [
  {
    id: "1",
    equipmentName: "DJI Mavic 3 Drone",
    customerName: "Afsara Rahman",
    customerEmail: "afsara@example.com",
    startDate: "2026-11-22",
    endDate: "2026-11-23",
    bookingDate: "2026-11-15",
    totalAmount: "$180.00",
    status: "Pending",
  },
  {
    id: "2",
    equipmentName: "Scaffold Tower 6m",
    customerName: "Rahim Khan",
    customerEmail: "rahim@example.com",
    startDate: "2026-12-01",
    endDate: "2026-12-07",
    bookingDate: "2026-11-17",
    totalAmount: "$450.00",
    status: "Confirmed",
  },
  {
    id: "3",
    equipmentName: "Excavator CAT 320",
    customerName: "Sakib Hasan",
    customerEmail: "sakib@example.com",
    startDate: "2026-11-20",
    endDate: "2026-11-25",
    bookingDate: "2026-11-10",
    totalAmount: "$1,250.00",
    status: "Completed",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Pending: "badge-warning",
    Confirmed: "badge-success",
    Completed: "badge-outline",
    Cancelled: "badge-error",
  };
  return <Badge className={variants[status] || "badge-outline"}>{status}</Badge>;
};

export default function OwnerBookingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Rental Requests</h1>
          <p className="text-sm text-base-content/60">
            Manage booking requests for your equipment
          </p>
        </div>
        <Link
          href="/dashboard/owner"
          className="btn btn-outline btn-sm"
        >
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

      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/60">
                <th>Equipment</th>
                <th>Customer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Booking Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="font-medium">{booking.equipmentName}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-medium">{booking.customerName}</span>
                      <span className="text-xs text-base-content/50">
                        {booking.customerEmail}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Clock className="mr-2 h-4 w-4 shrink-0 text-base-content/40" />
                    {booking.startDate}
                  </td>
                  <td>
                    <Clock className="mr-2 h-4 w-4 shrink-0 text-base-content/40" />
                    {booking.endDate}
                  </td>
                  <td>{booking.bookingDate}</td>
                  <td className="font-medium">{booking.totalAmount}</td>
                  <td>
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-primary"
                      title="Approve"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-destructive"
                      title="Decline"
                    >
                      <Phone className="h-4 w-4" />
                    </button>
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
