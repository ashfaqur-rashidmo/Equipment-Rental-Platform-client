import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { API_BASE_URL } from "@/lib/baseurl";
import { getSession } from "@/lib/core/server";

/**
 * Creates a Stripe Checkout Session for one booking.
 * The Pay button posts `rentalId` here as form data; the amount always
 * comes from our own booking record, never from the client.
 */
export async function POST(request: Request) {
  const headersList = await headers();
  const forwardedProto = headersList.get("x-forwarded-proto") || "http";
  const origin =
    headersList.get("origin") ??
    `${forwardedProto}://${headersList.get("host") ?? "localhost:3000"}`;

  // The Pay button posts the booking id as form data.
  let rentalId = "";
  try {
    const formData = await request.formData();
    rentalId = String(formData.get("rentalId") ?? "");
  } catch {
    // no body — handled below
  }

  // On failure, send the customer back to the payment page with the reason
  // instead of showing a raw JSON error.
  const backTo = rentalId
    ? `${origin}/dashboard/customer/payment/${rentalId}`
    : `${origin}/dashboard/customer/my-rentals`;
  const fail = (message: string) =>
    NextResponse.redirect(`${backTo}?error=${encodeURIComponent(message)}`, 303);

  try {
    if (!rentalId) return fail("Missing booking id.");

    // Look up the booking so the charge matches our record exactly.
    const token = (await getSession())?.session?.token;
    const bookingResponse = await fetch(
      `${API_BASE_URL}/rentals/${encodeURIComponent(rentalId)}`,
      {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    const booking = await bookingResponse.json();

    if (!bookingResponse.ok) {
      return fail(booking?.error || "Booking not found.");
    }

    const amount = Number(booking.totalAmount) || 0;
    if (amount <= 0) return fail("This booking has no amount to pay.");

    // Stripe Checkout Session for exactly this booking.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "bdt",
            // ৳ → minor units (e.g. ৳7,500 → 750000)
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: booking.equipmentName || "Equipment rental",
              description: `${booking.startDate} → ${booking.endDate} · ${booking.days} day(s) · ${booking.quantity} unit(s)`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: rentalId,
      metadata: { rentalId },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/customer/payment/${rentalId}`,
    });

    if (!session.url) return fail("Could not start the Stripe checkout.");

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    console.error("Stripe checkout error:", error);
    return fail(error.message || "Could not start the Stripe checkout.");
  }
}
