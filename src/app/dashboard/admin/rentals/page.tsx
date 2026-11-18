"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Package,
  CreditCard,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import Link from "next/link";

const rentals = [
  {
    id: "1",
    customerName: "Afsara Rahman",
    customerEmail: "afsara@example.com",
    ownerName: "Rahim Khan",
    ownerEmail: "rahim@example.com",
    equipmentName: "DJI Mavic 3 Drone",
    startDate: "2026-11-22",
    endDate: "2026-11-23",
    bookingAmount: "$180.00",
    paymentStatus: "Pending",
    bookingStatus: "Pending",
  },
  {
    id: "2",
    customerName: "Sakib Hasan",
    customerEmail: "sakib@example.com",
    ownerName: "Rahim Khan",
    ownerEmail: "rahim@example.com",
    equipmentName: "Excavator CAT 320",
    startDate: "2026-11-20",
    endDate: "2026-11-25",
    bookingAmount: "$1,250.00",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
  {
    id: "3",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat@example.com",
    ownerName: "Sakib Hasan",
    ownerEmail: "sakib@example.com",
    equipmentName: "Scaffold Tower 6m",
    startDate: "2026-12-01",
    endDate: "2026-12-07",
    bookingAmount: "$450.00",
    paymentStatus: "Failed",
    bookingStatus: "Cancelled",
  },
  {
    id: "4",
    customerName: "Tanvir Ahmed",
    customerEmail: "tanvir@example.com",
    ownerName: "Nusrat Jahan",
    ownerEmail: "nusrat@example.com",
    equipmentName: "Portable Generator 5kW",
    startDate: "2026-11-28",
    endDate: "2026-12-02",
    bookingAmount: "$320.00",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
  },
];

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Paid: "badge-success",
    Pending: "badge-warning",
    Failed: "badge-error",
  };
  return <Badge className={variants[status] || "badge-outline"}>{status}</Badge>;
};

const BookingStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, string> = {
    Confirmed: "badge-success",
    Pending: "badge-warning",
    Cancelled: "badge-error",
    Completed: "badge-outline",
  };
  return <Badge className={variants[status] || "badge-outline"}>{status}</Badge>;
};

export default function AllRentalsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">All Rentals</h1>
          <p className="text-sm text-base-content/60">
            Monitor and manage all rental booking records
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="btn btn-outline btn-sm"
        >
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {user && (
        <div className="mb-4 flex items-center gap-2 text-sm text-base-content/70">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-base-200 text-base-content">
            {user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <span>Logged in as {user.name}</span>
        </div>
      )}

      <div className="rounded-box border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-base-content/60">
                <th>Customer</th>
                <th>Owner</th>
                <th>Equipment</th>
                <th>Rental Duration</th>
                <th>Booking Amount</th>
                <th>Payment Status</th>
                <th>Booking Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="flex flex-col gap-1">
                    <div className="font-medium">{rental.customerName}</div>
                    <div className="text-xs text-base-content/50">
                      {rental.customerEmail}
                    </div>
                  </td>
                  <td className="flex flex-col gap-1">
                    <div className="font-medium">{rental.ownerName}</div>
                    <div className="text-xs text-base-content/50">
                      {rental.ownerEmail}
                    </div>
                  </td>
                  <td className="font-medium">{rental.equipmentName}</td>
                  <td>
                    <Clock className="mr-2 h-4 w-4 shrink-0 text-base-content/40" />
                    {rental.startDate} to {rental.endDate}
                  </td>
                  <td className="font-medium">{rental.bookingAmount}</td>
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
