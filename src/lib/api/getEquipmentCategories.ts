
import { API_BASE_URL } from "../baseurl";

export interface EquipmentCategory {
  name: string;
  /** Total matches for the category under the active filters (excluding category itself). */
  count?: number;
}

/**
 * Distinct equipment categories with counts.
 * Returns `null` on failure so the caller can fall back
 * to the static site category list.
 */
export const GetEquipmentCategories = async (
  query = ""
): Promise<EquipmentCategory[] | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/equipment/categories?${query}`,
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Failed to fetch categories.");

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
};
