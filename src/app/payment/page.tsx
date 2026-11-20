import { redirect } from "next/navigation";

/**
 * The payment page needs the booking it pays for, so it lives at
 * /dashboard/customer/payment/[id] (the Pay button on My Rentals).
 * This route just sends stray visits to the right place.
 */
const PaymentPage = () => {
  redirect("/dashboard/customer/my-rentals");
};

export default PaymentPage;
