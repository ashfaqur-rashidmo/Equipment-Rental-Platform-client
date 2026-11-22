
import { API_BASE_URL } from "../baseurl";

export interface FavoriteEquipment {
  _id: string;
  name: string;
  category: string;
  rentalPrice: string | number;
  rentalType?: string;
  location: string;
  image?: string;
  availableQuantity?: number;
}

export interface Favorite {
  _id: string;
  equipmentId: string;
  favoritedAt: string;
  /** Joined equipment record — null if the listing was deleted. */
  equipment?: FavoriteEquipment | null;
}

/** Every equipment a customer saved, newest first. */
export const GetMyFavorites = async (
  userId: string,
  token?: string
): Promise<Favorite[]> => {
  const response = await fetch(
    `${API_BASE_URL}/favorites?userId=${encodeURIComponent(userId)}`,
    {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch favorites.");

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

/** The saved row for one equipment (null when it is not saved). */
export const GetFavorite = async (
  userId: string,
  equipmentId: string,
  token?: string
): Promise<Favorite | null> => {
  const response = await fetch(
    `${API_BASE_URL}/favorites?userId=${encodeURIComponent(
      userId
    )}&equipmentId=${encodeURIComponent(equipmentId)}`,
    {
      cache: "no-store",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

/** Save an equipment to the customer's favorites. */
export const AddFavorite = async (
  userId: string,
  equipmentId: string,
  token?: string
): Promise<Favorite> => {
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ userId, equipmentId }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Failed to add favorite.");
  }

  return data;
};

/** Remove a saved item by its favorite id. */
export const RemoveFavorite = async (
  favoriteId: string,
  token?: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/favorites/${encodeURIComponent(favoriteId)}`,
    {
      method: "DELETE",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    }
  );

  if (!response.ok) throw new Error("Failed to remove favorite.");
};
