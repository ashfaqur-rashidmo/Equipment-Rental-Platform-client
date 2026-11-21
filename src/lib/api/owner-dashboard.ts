
import { API_BASE_URL } from "../baseurl";
import { Rental } from "./rentals";
import { EquipmentItem } from "@/data/equipment";

export interface OwnerDashboardStats {
  totalBookings: number;
  totalEquipment: number;
  totalEarnings: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  /** Last 6 months of booking counts for the line chart. */
  monthlyBookings: { month: string; count: number }[];
  recentRentals: Rental[];
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Last 6 month labels, e.g. ["Jun", "Jul", "Aug", "Sep", "Oct", "nov"]. */
const lastSixMonths = (): string[] => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return MONTHS_SHORT[d.getMonth()];
  });
};

/** Owner dashboard aggregates — bookings, equipment, earnings, and charts. */
export const GetOwnerDashboard = async (
  ownerId: string
): Promise<OwnerDashboardStats> => {
  const [rentalsRes, equipmentsRes] = await Promise.all([
    fetch(
      `${API_BASE_URL}/owner/rentals?ownerId=${encodeURIComponent(ownerId)}`,
      { cache: "no-store" }
    ),
    fetch(`${API_BASE_URL}/equipment`, { cache: "no-store" }),
  ]);

  const rentalsData = rentalsRes.ok ? await rentalsRes.json() : null;
  const rentals: Rental[] = Array.isArray(rentalsData) ? rentalsData : [];

  const equipmentsData = equipmentsRes.ok ? await equipmentsRes.json() : null;
  const allEquipments: EquipmentItem[] = Array.isArray(equipmentsData)
    ? equipmentsData
    : [];

  // Only this owner's equipment.
  const ownerEquipments = allEquipments.filter(
    (item) => String(item.ownerId) === String(ownerId)
  );

  const totalBookings = rentals.length;
  const totalEquipment = ownerEquipments.length;
  const totalEarnings = rentals
    .filter((r) => String(r.paymentStatus).toLowerCase() === "paid")
    .reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);

  const pendingCount = rentals.filter(
    (r) => String(r.bookingStatus).toLowerCase() === "pending"
  ).length;
  const confirmedCount = rentals.filter(
    (r) => String(r.bookingStatus).toLowerCase() === "confirmed"
  ).length;
  const cancelledCount = rentals.filter(
    (r) => String(r.bookingStatus).toLowerCase() === "cancelled"
  ).length;

  // Monthly booking counts for the line chart (last 6 months).
  const labels = lastSixMonths();
  const counts = labels.map(() => 0);
  rentals.forEach((r) => {
    const d = new Date(r.bookingDate);
    if (Number.isNaN(d.getTime())) return;
    const label = MONTHS_SHORT[d.getMonth()];
    const idx = labels.indexOf(label);
    if (idx !== -1) counts[idx] += 1;
  });

  const monthlyBookings = labels.map((month, i) => ({ month, count: counts[i] }));

  // Newest bookings first for the recent list.
  const recentRentals = [...rentals].sort(
    (a, b) =>
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  );

  return {
    totalBookings,
    totalEquipment,
    totalEarnings,
    pendingCount,
    confirmedCount,
    cancelledCount,
    monthlyBookings,
    recentRentals,
  };
};
