
import { API_BASE_URL } from "../baseurl";
import { EquipmentItem } from "@/data/equipment";

/** Fetch one equipment item by its id. Returns null when it does not exist. */
export const GetEquipmentById = async (
  id: string
): Promise<EquipmentItem | null> => {
  const response = await fetch(`${API_BASE_URL}/equipment/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  return await response.json();
};
