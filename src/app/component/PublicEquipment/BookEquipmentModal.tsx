
"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApplyForRental } from "@/lib/api/rentals";

interface BookEquipmentModalProps {
  equipmentId: string;
  equipmentName: string;
  rentalPrice: number;
  rentalType?: string;
}

interface BookingForm {
  startDate: string;
  endDate: string;
  quantity: string;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
}

const initialForm: BookingForm = {
  startDate: "",
  endDate: "",
  quantity: "1",
  contactNumber: "",
  deliveryAddress: "",
  notes: "",
};

const today = new Date().toISOString().split("T")[0];


const BookEquipmentModal = ({
  equipmentId,
  equipmentName,
  rentalPrice,
  rentalType,
}: BookEquipmentModalProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleBookingNow = async (e: React.FormEvent<HTMLFormElement>) => {
    // Always stop the browser from submitting/reloading the page.
    e.preventDefault();

    // Guests book right after logging in.
    if (!user) {
      router.push(`/login?redirectTo=/all-equipment/${equipmentId}`);
      return;
    }

    // Role values are capitalized: "Customer" | "Owner" | "Admin".
    if (user.role !== "Customer") {
      toast.error(
        "Only customers can book equipment. Please log in with a customer account."
      );
      return;
    }

    const start = new Date(`${form.startDate}T00:00:00`);
    const end = new Date(`${form.endDate}T00:00:00`);

    if (end <= start) {
      toast.error("End date must be after start date.");
      return;
  }

   const quantity = Number(form.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    toast.error("Please enter a valid quantity.");
    return;
  }

    setSubmitting(true);

    try {
      const booking = await ApplyForRental({
        equipmentId,
        equipmentName,
        customerId: user.id,
        customerName: user.name,
        startDate: form.startDate,
        endDate: form.endDate,
        quantity: Number(form.quantity) || 1,
        rentalPrice,
        rentalType,
        contactNumber: form.contactNumber,
        deliveryAddress: form.deliveryAddress,
        notes: form.notes,
      });

      toast.success("Booking created! Complete your payment.");
      closeModal();
      // Straight to the payment page of the booking we just created.
      router.push(`/dashboard/customer/payment/${booking._id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to book the equipment."
      );
    } finally {
      setSubmitting(false);
    }
  };


  const calculateTotal = () => {
  if (!form.startDate || !form.endDate) return 0;

  const start = new Date(`${form.startDate}T00:00:00`);
  const end = new Date(`${form.endDate}T00:00:00`);

  const days = Math.ceil(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (days <= 0) return 0;

  let duration = days;

  if (rentalType === "weekly") {
    duration = Math.ceil(days / 7);
  } else if (rentalType === "monthly") {
    duration = Math.ceil(days / 30);
  }

  return duration * rentalPrice * Number(form.quantity || 1);
};

  const field =
    "input input-bordered w-full";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary w-full"
      >
        <CalendarDays size={16} />
        Book Now
      </button>

      {open && (
        <div className="modal modal-open" role="dialog" aria-modal="true">
          <div className="modal-box max-w-lg">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Book Equipment</h3>
                <p className="text-sm text-base-content/60">{equipmentName}</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingNow} className="space-y-4">
              <input type="hidden" name="equipmentId" value={equipmentId} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="label-text font-medium" htmlFor="startDate">
                    Rental Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    min={today}
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className={field}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label-text font-medium" htmlFor="endDate">
                    Rental End Date
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={form.startDate || today}
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className={field}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="label-text font-medium" htmlFor="quantity">
                    Required Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    className={field}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    className="label-text font-medium"
                    htmlFor="contactNumber"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={form.contactNumber}
                    onChange={handleChange}
                    required
                    placeholder="+880 1xxx-xxxxxx"
                    className={field}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="label-text font-medium"
                  htmlFor="deliveryAddress"
                >
                  Delivery Address
                </label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  required
                  placeholder="House, road, area, city"
                  className="textarea textarea-bordered h-20 w-full resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="label-text font-medium" htmlFor="notes">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Anything the owner should know"
                  className="textarea textarea-bordered h-20 w-full resize-none"
                />
              </div>

              <div className="rounded-lg bg-base-200 p-4">
  <p className="text-sm text-base-content/60">
    Estimated Rental Amount
  </p>

  <p className="text-2xl font-bold text-primary">
    ৳{calculateTotal().toLocaleString("en-BD")}
  </p>

  <p className="text-xs text-base-content/60">
    Final amount will be calculated and verified by the server.
  </p>
</div>

              {/* Footer */}
              <div className="modal-action mt-2">
                <button type="button" onClick={closeModal} className="btn">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop" onClick={closeModal} />
        </div>
      )}
    </>
  );
};

export default BookEquipmentModal;
