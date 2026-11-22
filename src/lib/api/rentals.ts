
import { API_BASE_URL } from "../baseurl";

export interface Rental {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  customerName?: string;
  contactNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  startDate: string;
  endDate: string;
  quantity?: number;
  days?: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  bookingDate: string;
}

/** All rentals of the logged-in customer, newest booking first. */
export const GetMyRentals = async (
  userId: string,
  token?: string
): Promise<Rental[]> => {
  const response = await fetch(
    `${API_BASE_URL}/rentals?userId=${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch rentals.");

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

/** All rentals on the logged-in owner's equipment, newest booking first. */
export const GetOwnerRentals = async (
  ownerId: string,
  token?: string
): Promise<Rental[]> => {
  const response = await fetch(
    `${API_BASE_URL}/owner/rentals?ownerId=${encodeURIComponent(ownerId)}`,
    {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch rentals.");

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

/** One booking by its id — used by the payment page. */
export const GetRentalById = async (
  id: string,
  token?: string
): Promise<Rental> => {
  const response = await fetch(
    `${API_BASE_URL}/rentals/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch the booking.");
  }

  return data;
};

export interface CreateRentalPayload {
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  customerName?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  rentalPrice: number;
  rentalType?: string;
  contactNumber?: string;
  deliveryAddress?: string;
  notes?: string;
}

/** Books an equipment for the logged-in customer. */
export const ApplyForRental = async (
  payload: CreateRentalPayload,
  token?: string
): Promise<Rental> => {
  const response = await fetch(`${API_BASE_URL}/rentals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to create rental.");
  }

  return data;
};
