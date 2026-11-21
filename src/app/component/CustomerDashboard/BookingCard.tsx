import { Badge } from '@/components/ui/badge';
import React from 'react';
import { Rental } from "@/lib/api/rentals";
import { formatPrice } from "@/data/equipment";


type BookingCardProps = {
  rental: Rental;
};



const BookingCard = ({ rental }: BookingCardProps) => {
    return (
        <div className="rounded-xl border border-base-200 bg-base-100 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-base-content truncate">
                    {rental.equipmentName}
                  </p>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    Rented by: {rental.customerName} · {formatPrice(rental.totalAmount)}
                  </p>
                </div>
                <Badge
                  variant={
                    rental.bookingStatus === "Confirmed"
                      ? "success"
                      : rental.bookingStatus === "Cancelled"
                        ? "error"
                        : "warning"
                  }
                >
                  {rental.bookingStatus}
                </Badge>
              </div>
            </div>
    );
};

export default BookingCard;