
import { API_BASE_URL } from "../baseurl";
import { Rental } from "./rentals";
import { Favorite } from "./favorites";

export interface CustomerDashboardStats {
  totalBookings: number;
  completedRentals: number;
  totalSpent: number;
  favoritesCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  /** Last 6 months of spending for the chart. */
  monthlySpending: { month: string; amount: number }[];
  recentRentals: Rental[];
  favorites: Favorite[];
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

const lastSixMonths = (): string[] => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return MONTHS_SHORT[d.getMonth()];
  });
};

/** Customer dashboard aggregates — bookings, spending, favorites, and charts. */
export const GetCustomerDashboard = async (
  userId: string
): Promise<CustomerDashboardStats> => {
  const [rentalsRes, favoritesRes] = await Promise.all([
    fetch(
      `${API_BASE_URL}/rentals?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" }
    ),
    fetch(
      `${API_BASE_URL}/favorites?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" }
    ),
  ]);

  const rentalsData = rentalsRes.ok ? await rentalsRes.json() : null;
  const rentals: Rental[] = Array.isArray(rentalsData) ? rentalsData : [];

  const favoritesData = favoritesRes.ok ? await favoritesRes.json() : null;
  const favorites: Favorite[] = Array.isArray(favoritesData)
    ? favoritesData
    : [];

  const totalBookings = rentals.length;
  const completedRentals = rentals.filter(
    (r) =>
      String(r.paymentStatus).toLowerCase() === "paid" &&
      String(r.bookingStatus).toLowerCase() === "confirmed"
  ).length;
  const totalSpent = rentals
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

  // Monthly spending for the area chart (last 6 months).
  const labels = lastSixMonths();
  const amounts = labels.map(() => 0);
  rentals.forEach((r) => {
    const d = new Date(r.bookingDate);
    if (Number.isNaN(d.getTime())) return;
    const label = MONTHS_SHORT[d.getMonth()];
    const idx = labels.indexOf(label);
    if (idx !== -1 && String(r.paymentStatus).toLowerCase() === "paid") {
      amounts[idx] += Number(r.totalAmount || 0);
    }
  });

  const monthlySpending = labels.map((month, i) => ({
    month,
    amount: amounts[i],
  }));

  const recentRentals = [...rentals].sort(
    (a, b) =>
      new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
  );

  return {
    totalBookings,
    completedRentals,
    totalSpent,
    favoritesCount: favorites.length,
    pendingCount,
    confirmedCount,
    cancelledCount,
    monthlySpending,
    recentRentals,
    favorites,
  };
};
