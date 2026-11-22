import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { API_BASE_URL } from "@/lib/baseurl";
import { getSession } from "@/lib/core/server";

export const dynamic = "force-dynamic";

type Status = "paid" | "unpaid" | "error";

const CONTENT: Record<
  Status,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    title: string;
    actionLabel: string;
    actionClass: string;
  }
> = {
  paid: {
    icon: CheckCircle2,
    iconClass: "text-success",
    title: "Payment successful!",
    actionLabel: "View My Rentals",
    actionClass: "btn btn-primary",
  },
  unpaid: {
    icon: Clock3,
    iconClass: "text-warning",
    title: "Payment not completed",
    actionLabel: "Back to My Rentals",
    actionClass: "btn btn-primary",
  },
  error: {
    icon: AlertTriangle,
    iconClass: "text-error",
    title: "We couldn't verify this payment",
    actionLabel: "Back to My Rentals",
    actionClass: "btn btn-outline",
  },
};

/**
 * Stripe redirects here after checkout. The session is verified server-side
 * and the booking is marked as paid — refreshing the page is safe.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let status: Status = "error";
  let amount = 0;

  if (session_id) {
    try {
      const checkout = await stripe.checkout.sessions.retrieve(session_id);
      amount = Number(checkout.amount_total ?? 0) / 100;

      if (checkout.payment_status === "paid") {
        status = "paid";

        // Mark the booking as paid (idempotent — a refresh changes nothing).
        const rentalId = String(
          checkout.client_reference_id || checkout.metadata?.rentalId || ""
        );

        if (rentalId) {
          const token = (await getSession())?.session?.token;
          const patchRes = await fetch(
            `${API_BASE_URL}/rentals/${encodeURIComponent(rentalId)}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ paymentStatus: "Paid" }),
              cache: "no-store",
            }
          );

          if (!patchRes.ok) {
            console.error(
              `Failed to mark rental ${rentalId} as paid:`,
              patchRes.status
            );
          }
        }
      } else {
        status = "unpaid";
      }
    } catch (err) {
      console.error("Payment verification failed:", err);
      status = "error";
    }
  }

  const content = CONTENT[status];

  const description =
    status === "paid"
      ? `৳${amount.toLocaleString("en-US")} received — your booking is confirmed. Track it any time from My Rentals.`
      : status === "unpaid"
        ? "You have not been charged. Your booking is still awaiting payment — you can try again from My Rentals."
        : "If you were charged, the payment will be confirmed shortly — check My Rentals for the updated status.";

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-box border border-base-300 bg-base-100 p-10 text-center shadow-sm">
        <content.icon
          className={`mx-auto mb-4 h-14 w-14 ${content.iconClass}`}
        />

        <h1 className="text-2xl font-bold text-base-content">
          {content.title}
        </h1>

        <p className="mt-2 text-sm text-base-content/60">{description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/customer/my-rentals"
            className={content.actionClass}
          >
            {content.actionLabel}
          </Link>
          <Link href="/all-equipment" className="btn btn-ghost">
            Browse Equipment
          </Link>
        </div>
      </div>
    </div>
  );
}
