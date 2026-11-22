import { Badge } from "@/components/ui/badge";

const paymentVariants: Record<string, string> = {
  Paid: "badge-success",
  Pending: "badge-warning",
  Failed: "badge-error",
};

const bookingVariants: Record<string, string> = {
  Confirmed: "badge-success",
  Completed: "badge-success",
  Pending: "badge-warning",
  Cancelled: "badge-error",
};

/** Paid / Pending / Failed badge. */
export const PaymentStatusBadge = ({ status }: { status: string }) => (
  <Badge className={paymentVariants[status] || "badge-outline"}>
    {status || "Unknown"}
  </Badge>
);

/** Confirmed / Completed / Pending / Cancelled badge. */
export const BookingStatusBadge = ({ status }: { status: string }) => (
  <Badge className={bookingVariants[status] || "badge-outline"}>
    {status || "Unknown"}
  </Badge>
);
