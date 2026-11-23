
import { API_BASE_URL } from "../baseurl";
import { EquipmentItem } from "@/data/equipment";

export const GetEquipments = async (query=""): Promise<EquipmentItem[]> => {


  const response = await fetch(`${API_BASE_URL}/equipment?${query}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch equipment.");
  }

  return await response.json();
};
